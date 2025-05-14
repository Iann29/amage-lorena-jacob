"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import jsdom from 'jsdom';
import DOMPurifyServer from 'dompurify';
import { getAuthenticatedAdminId } from "@/app/admin/blog/actions"; // Importar função de verificação de admin

// Configuração do DOMPurify no servidor
const { window } = new jsdom.JSDOM('');
const purify = DOMPurifyServer(window);

interface SubmitCommentResponse {
  success: boolean;
  message?: string;
  commentId?: string; // Retornar o ID do comentário pode ser útil
}

export async function submitNewComment(
  postId: string,
  content: string,
  parentCommentId?: string | null // Pode ser null ou undefined
): Promise<SubmitCommentResponse> {
  const supabaseClient = await createClient();

  try {
    // Usar o cliente resolvido
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.error("Erro de autenticação ao submeter comentário:", authError?.message);
      return { success: false, message: "Usuário não autenticado." };
    }

    if (!content.trim()) {
      return { success: false, message: "O conteúdo do comentário não pode estar vazio." };
    }

    // 1. Sanitizar o conteúdo do comentário
    const sanitizedContent = purify.sanitize(content, {
      USE_PROFILES: { html: false, mathMl: false, svg: false }, // Corrigido: mathml para mathMl
      ALLOWED_TAGS: [], // Nenhuma tag HTML permitida
      ALLOWED_ATTR: []  // Nenhum atributo HTML permitido
    });

    if (!sanitizedContent.trim()) {
      return { success: false, message: "O conteúdo do comentário é inválido após a sanitização." };
    }

    // 2. Inserir o comentário no banco de dados
    const { data: newComment, error: insertError } = await supabaseClient
      .from("blog_comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        conteudo: sanitizedContent,
        parent_comment_id: parentCommentId || null, // Garante que seja null se undefined
        is_approved: false, // Comentários começam como não aprovados
      })
      .select('id') // Selecionar o ID do comentário recém-criado
      .single(); // Esperamos um único resultado

    if (insertError) {
      console.error("Erro ao inserir comentário no banco:", insertError.message);
      return { success: false, message: "Falha ao salvar o comentário. Tente novamente." };
    }
    
    if (!newComment || !newComment.id) {
      console.error("Comentário inserido mas não retornou ID.");
      return { success: false, message: "Ocorreu um erro inesperado ao salvar o comentário." };
    }

    // 3. Revalidar o path da página do blog para que a alteração seja refletida (opcional, ou pode ser mais granular)
    // Por exemplo, se a UI mostrar comentários pendentes para o autor, ou para admin.
    // revalidatePath(`/blog/${postId}`); // Precisa do slug do post aqui, não apenas do ID.
    // Para revalidar o post específico, precisaríamos buscar o slug do post a partir do postId
    // ou passá-lo como argumento para esta action.
    // Por enquanto, podemos omitir a revalidação aqui ou revalidar de forma mais genérica se necessário.

    return {
      success: true,
      message: "Comentário enviado com sucesso! Aguardando aprovação.",
      commentId: newComment.id
    };

  } catch (error: unknown) {
    console.error("[ACTION ERROR] submitNewComment (Exception):", (error instanceof Error ? error.message : String(error)));
    return { success: false, message: "Ocorreu um erro inesperado. Por favor, tente mais tarde." };
  }
}

// Interface para o autor do comentário, conforme user_profiles
export interface CommentAuthor {
  id: string; // user_id de user_profiles
  nome: string;
  sobrenome: string;
  avatar_url?: string | null;
}

// Interface para um comentário na árvore, incluindo dados do autor e respostas
export interface CommentWithAuthorAndReplies {
  id: string; // id do comentário
  conteudo: string;
  created_at: string;
  like_count: number;
  post_id: string;
  parent_comment_id?: string | null;
  is_approved: boolean; 
  user: CommentAuthor; // Dados do autor aninhados
  replies: CommentWithAuthorAndReplies[]; // Respostas aninhadas
}

interface GetCommentsResponse {
  success: boolean;
  data?: CommentWithAuthorAndReplies[];
  message?: string;
}

export async function getCommentsTreeByPostId(postId: string): Promise<GetCommentsResponse> {
  if (!postId) {
    return { success: false, message: "ID do post não fornecido." };
  }

  const supabase = await createClient();

  try {
    // 1. Buscar todos os comentários aprovados para o post (sem join de perfil ainda)
    const { data: commentsFromDb, error: commentsError } = await supabase
      .from('blog_comments')
      .select(`
        id,
        conteudo,
        created_at,
        like_count,
        post_id,
        parent_comment_id,
        is_approved,
        user_id 
      `)
      .eq('post_id', postId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error("[ACTION ERROR] getCommentsTreeByPostId - Erro ao buscar comentários (passo 1):", commentsError.message);
      return { success: false, message: "Falha ao buscar comentários." };
    }

    if (!commentsFromDb || commentsFromDb.length === 0) {
      return { success: true, data: [] }; // Nenhum comentário encontrado
    }

    // 2. Coletar IDs de usuários únicos dos comentários buscados
    const userIds = [...new Set(commentsFromDb.map(c => c.user_id).filter(Boolean))]; // filter(Boolean) remove nulls/undefineds

    // 3. Buscar perfis de usuários correspondentes em uma segunda query
    const profilesMap: Map<string, CommentAuthor> = new Map();
    if (userIds.length > 0) {
      const { data: profilesFromDb, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, nome, sobrenome, avatar_url')
        .in('user_id', userIds);

      if (profilesError) {
        console.error("[ACTION ERROR] getCommentsTreeByPostId - Erro ao buscar perfis (passo 2):", profilesError.message);
        // Não falhar a requisição inteira, apenas os perfis podem ficar como padrão
      } else if (profilesFromDb) {
        profilesFromDb.forEach(profile => {
          profilesMap.set(profile.user_id, { 
            id: profile.user_id, 
            nome: profile.nome, 
            sobrenome: profile.sobrenome, 
            avatar_url: profile.avatar_url 
          });
        });
      }
    }

    // 4. Mapear os comentários e combinar com os perfis
    const allComments: CommentWithAuthorAndReplies[] = commentsFromDb.map(comment => {
      const author = profilesMap.get(comment.user_id) || { 
        id: comment.user_id,
        nome: 'Usuário', 
        sobrenome: 'Desconhecido', 
        avatar_url: null 
      }; // Fallback se o perfil não for encontrado
      
      return {
        id: comment.id,
        conteudo: comment.conteudo,
        created_at: comment.created_at,
        like_count: comment.like_count || 0,
        post_id: comment.post_id,
        parent_comment_id: comment.parent_comment_id,
        is_approved: comment.is_approved,
        user: author,
        replies: [],
      };
    });

    // 5. Construir a árvore de comentários (mesma lógica de antes)
    const commentsById: Record<string, CommentWithAuthorAndReplies> = {};
    allComments.forEach(comment => {
      commentsById[comment.id] = comment;
    });

    const commentTree: CommentWithAuthorAndReplies[] = [];
    allComments.forEach(comment => {
      if (comment.parent_comment_id && commentsById[comment.parent_comment_id]) {
        // Garantir que o array de replies exista antes de dar push
        if (!commentsById[comment.parent_comment_id].replies) {
           commentsById[comment.parent_comment_id].replies = [];
        }
        commentsById[comment.parent_comment_id].replies.push(comment);
      } else {
        commentTree.push(comment);
      }
    });
    
    return { success: true, data: commentTree };

  } catch (error: unknown) {
    console.error("[ACTION ERROR] getCommentsTreeByPostId (Exception):", (error instanceof Error ? error.message : String(error)));
    return { success: false, message: "Ocorreu um erro inesperado ao processar comentários." };
  }
}

// --- Actions de Moderação --- 

interface ModerateCommentResponse {
  success: boolean;
  message?: string;
}

// Aprovar um comentário
export async function approveComment(commentId: string): Promise<ModerateCommentResponse> {
  let postId: string | null = null; // Variável para guardar postId
  try {
    await getAuthenticatedAdminId();
    const supabase = await createClient();

    // Primeiro, buscar o postId associado ao comentário
    const { data: commentData, error: fetchError } = await supabase
      .from('blog_comments')
      .select('post_id')
      .eq('id', commentId)
      .single();

    if (fetchError || !commentData) {
      console.error(`[ACTION ERROR] approveComment - Erro ao buscar postId para comentário ${commentId}:`, fetchError?.message);
      return { success: false, message: "Comentário não encontrado para aprovação." };
    }
    postId = commentData.post_id;

    // Agora, aprovar o comentário
    const { error: updateError } = await supabase
      .from('blog_comments')
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq('id', commentId);

    if (updateError) {
      console.error(`[ACTION ERROR] approveComment - Erro ao aprovar comentário ${commentId}:`, updateError.message);
      return { success: false, message: "Falha ao aprovar comentário." };
    }

    // Revalidação
    revalidatePath('/admin/comentarios');
    
    // Buscar slug para revalidar página do post
    if (postId) {
      const { data: postData, error: postFetchError } = await supabase
         .from('blog_posts')
         .select('slug')
         .eq('id', postId)
         .single();
      
      if (postData?.slug && !postFetchError) {
        revalidatePath(`/blog/${postData.slug}`);
      } else {
         console.warn(`[ACTION WARN] approveComment - Não foi possível revalidar /blog/[slug] para post ${postId} após aprovar comentário ${commentId}. Erro: ${postFetchError?.message}`);
      }
    }

    return { success: true, message: "Comentário aprovado!" };

  } catch (error: unknown) {
    console.error("[ACTION ERROR] approveComment (Exception):", error);
    return { success: false, message: (error instanceof Error ? error.message : String(error)) || "Erro inesperado." };
  }
}

// Desaprovar um comentário
export async function unapproveComment(commentId: string): Promise<ModerateCommentResponse> {
  let postId: string | null = null;
  try {
    await getAuthenticatedAdminId();
    const supabase = await createClient();

    // Buscar postId
    const { data: commentData, error: fetchError } = await supabase
      .from('blog_comments')
      .select('post_id')
      .eq('id', commentId)
      .single();

    if (fetchError || !commentData) {
      console.error(`[ACTION ERROR] unapproveComment - Erro ao buscar postId para comentário ${commentId}:`, fetchError?.message);
      return { success: false, message: "Comentário não encontrado para desaprovação." };
    }
    postId = commentData.post_id;

    // Desaprovar
    const { error: updateError } = await supabase
      .from('blog_comments')
      .update({ is_approved: false, updated_at: new Date().toISOString() })
      .eq('id', commentId);

    if (updateError) {
      console.error(`[ACTION ERROR] unapproveComment - Erro ao desaprovar comentário ${commentId}:`, updateError.message);
      return { success: false, message: "Falha ao desaprovar comentário." };
    }

    // Revalidação
    revalidatePath('/admin/comentarios');
    if (postId) {
      const { data: postData, error: postFetchError } = await supabase
         .from('blog_posts')
         .select('slug')
         .eq('id', postId)
         .single();
      if (postData?.slug && !postFetchError) {
        revalidatePath(`/blog/${postData.slug}`);
      } else {
         console.warn(`[ACTION WARN] unapproveComment - Não foi possível revalidar /blog/[slug] para post ${postId} após desaprovar comentário ${commentId}. Erro: ${postFetchError?.message}`);
      }
    }

    return { success: true, message: "Comentário desaprovado." };

  } catch (error: unknown) {
    console.error("[ACTION ERROR] unapproveComment (Exception):", error);
    return { success: false, message: (error instanceof Error ? error.message : String(error)) || "Erro inesperado." };
  }
}

// Deletar um comentário
export async function deleteComment(commentId: string): Promise<ModerateCommentResponse> {
  let postId: string | null = null;
  let wasApproved: boolean = false;
  let postSlug: string | null = null;

  try {
    await getAuthenticatedAdminId(); 
    const supabase = await createClient();

    // 1. Buscar dados do comentário ANTES de deletar
    const { data: commentToDelete, error: fetchError } = await supabase
       .from('blog_comments')
       .select('post_id, is_approved')
       .eq('id', commentId)
       .single();

    if (fetchError || !commentToDelete) {
       console.error(`[ACTION ERROR] deleteComment - Erro ao buscar dados do comentário ${commentId} para deleção:`, fetchError?.message);
       return { success: false, message: "Comentário não encontrado para deleção." };
    }
    postId = commentToDelete.post_id;
    wasApproved = commentToDelete.is_approved;

    // 2. Se estava aprovado, buscar o slug do post para revalidação posterior
    if (wasApproved && postId) {
      const { data: postData, error: postFetchError } = await supabase
         .from('blog_posts')
         .select('slug')
         .eq('id', postId)
         .single();
      if (postData?.slug && !postFetchError) {
        postSlug = postData.slug;
      } else {
         console.warn(`[ACTION WARN] deleteComment - Não foi possível obter slug do post ${postId} para revalidação após deletar comentário ${commentId}. Erro: ${postFetchError?.message}`);
      }
    }

    // 3. Deletar o comentário
    const { error: deleteError } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', commentId);

    if (deleteError) {
      console.error(`[ACTION ERROR] deleteComment - Erro ao deletar comentário ${commentId}:`, deleteError.message);
      return { success: false, message: "Falha ao deletar comentário." };
    }

    // 4. Revalidação
    revalidatePath('/admin/comentarios');
    if (wasApproved && postSlug) { // Revalidar post público apenas se estava aprovado e temos o slug
      revalidatePath(`/blog/${postSlug}`);
    }

    return { success: true, message: "Comentário deletado." };

  } catch (error: unknown) {
    console.error("[ACTION ERROR] deleteComment (Exception):", error);
    return { success: false, message: (error instanceof Error ? error.message : String(error)) || "Erro inesperado." };
  }
}

// --- Action para Listar Comentários no Admin ---

export interface AdminCommentInfo {
  id: string;
  conteudo: string;
  created_at: string;
  is_approved: boolean;
  author: { // Dados do autor
    id: string; // user_id
    nome: string;
    sobrenome: string;
    avatar_url?: string | null;
  };
  post: { // Dados do post associado
    id: string;
    titulo: string;
    slug: string;
  };
  parent_comment_id: string | null; // Incluir para saber se é resposta
}

interface ListAdminCommentsOptions {
  status?: 'pending' | 'approved';
  postId?: string;
  page?: number;
  limit?: number;
}

interface ListAdminCommentsResponse {
  success: boolean;
  data?: AdminCommentInfo[];
  totalCount?: number;
  message?: string;
}

export async function listCommentsForAdmin(
  options: ListAdminCommentsOptions = {}
): Promise<ListAdminCommentsResponse> {
  const { status, postId, page = 1, limit = 20 } = options;

  try {
    await getAuthenticatedAdminId();
    const supabase = await createClient();

    // 1. Construir a query base para comentários
    let commentsQuery = supabase
      .from('blog_comments')
      .select(`
        id,
        conteudo,
        created_at,
        is_approved,
        parent_comment_id,
        user_id,
        post_id 
      `, { count: 'exact' });

    // Aplicar filtros
    if (status === 'pending') {
      commentsQuery = commentsQuery.eq('is_approved', false);
    } else if (status === 'approved') {
      commentsQuery = commentsQuery.eq('is_approved', true);
    }
    if (postId) {
      commentsQuery = commentsQuery.eq('post_id', postId);
    }

    // Aplicar ordenação e paginação
    commentsQuery = commentsQuery.order('created_at', { ascending: false });
    const rangeFrom = (page - 1) * limit;
    const rangeTo = rangeFrom + limit - 1;
    commentsQuery = commentsQuery.range(rangeFrom, rangeTo);

    // Executar query de comentários
    const { data: commentsData, error: commentsError, count } = await commentsQuery;

    if (commentsError) {
      console.error("[ACTION ERROR] listCommentsForAdmin - Erro ao listar comentários base para admin:", commentsError.message);
      return { success: false, message: "Falha ao buscar comentários." };
    }

    if (!commentsData || commentsData.length === 0) {
      return { success: true, data: [], totalCount: 0 };
    }

    // 2. Coletar IDs únicos de usuários e posts
    const userIds = [...new Set(commentsData.map(c => c.user_id).filter(Boolean))];
    const postIds = [...new Set(commentsData.map(c => c.post_id).filter(Boolean))];

    // 3. Buscar perfis e posts em paralelo
    const profilesMap: Map<string, CommentAuthor> = new Map();
    const postsMap: Map<string, { id: string; titulo: string; slug: string; }> = new Map();

    const [profilesResult, postsResult] = await Promise.all([
      userIds.length > 0 ? supabase.from('user_profiles').select('user_id, nome, sobrenome, avatar_url').in('user_id', userIds) : Promise.resolve({ data: [], error: null }),
      postIds.length > 0 ? supabase.from('blog_posts').select('id, titulo, slug').in('id', postIds) : Promise.resolve({ data: [], error: null })
    ]);

    // Processar perfis
    if (profilesResult.error) {
      console.error("[ACTION ERROR] listCommentsForAdmin - Erro ao buscar perfis para admin:", profilesResult.error.message);
      // Continuar mesmo com erro, usará fallback
    } else if (profilesResult.data) {
      profilesResult.data.forEach(profile => {
        profilesMap.set(profile.user_id, { 
          id: profile.user_id, 
          nome: profile.nome, 
          sobrenome: profile.sobrenome, 
          avatar_url: profile.avatar_url 
        });
      });
    }

    // Processar posts
    if (postsResult.error) {
      console.error("[ACTION ERROR] listCommentsForAdmin - Erro ao buscar posts para admin:", postsResult.error.message);
      // Continuar mesmo com erro, usará fallback
    } else if (postsResult.data) {
      postsResult.data.forEach(post => {
        postsMap.set(post.id, { 
          id: post.id, 
          titulo: post.titulo, 
          slug: post.slug 
        });
      });
    }

    // 4. Formatar os comentários combinando os dados
    const formattedComments: AdminCommentInfo[] = commentsData.map(comment => {
      const author = profilesMap.get(comment.user_id) || { 
        id: comment.user_id, 
        nome: 'Usuário', 
        sobrenome: 'Desconhecido', 
        avatar_url: null 
      };
      const postInfo = postsMap.get(comment.post_id) || { 
        id: comment.post_id || 'N/A', 
        titulo: 'Post não encontrado', 
        slug: '#' 
      };

      return {
        id: comment.id,
        conteudo: comment.conteudo,
        created_at: comment.created_at,
        is_approved: comment.is_approved,
        parent_comment_id: comment.parent_comment_id,
        author: author,
        post: postInfo,
      };
    });

    return { success: true, data: formattedComments, totalCount: count || 0 };

  } catch (error: unknown) {
    console.error("[ACTION ERROR] listCommentsForAdmin (Exception):", error);
    return { success: false, message: (error instanceof Error ? error.message : String(error)) || "Erro inesperado." };
  }
} 