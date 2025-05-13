// src/app/admin/blog/actions.ts
"use server";

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import jsdom from 'jsdom';
import DOMPurifyServer from 'dompurify';

const { window } = new jsdom.JSDOM('');
const purify = DOMPurifyServer(window);

interface PostFormData {
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  categorias: string[];
  imagem_destaque_url?: string;
  is_published: boolean;
}

export interface UserProfileInfo {
  nome: string;
  sobrenome: string;
}

export interface BlogPostFromDB {
  id: string;
  titulo: string;
  slug: string;
  resumo: string | null;
  conteudo: string;
  imagem_destaque_url: string | null;
  author_id: string | null;
  author_nome?: string | null;
  author_sobrenome?: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
  user_profiles?: UserProfileInfo | null;
  like_count: number;
  view_count: number;
  categorias: string[];
  categoriasInfo?: { id: string; nome: string; }[];
}

export interface BlogCategoryFromDB {
  id: string;
  nome: string;
}

// Função auxiliar para extrair o path do objeto da URL pública do Supabase Storage
function getStoragePathFromUrl(url: string | null | undefined, bucketName: string): string | null {
  if (!url) {
    return null;
  }
  try {
    const urlObject = new URL(url);
    // Ex: /storage/v1/object/public/BUCKET_NAME/pasta/arquivo.jpg
    const pathParts = urlObject.pathname.split('/');
    const bucketIndex = pathParts.indexOf(bucketName);

    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      // Pega todas as partes DEPOIS do nome do bucket e junta com '/'
      return pathParts.slice(bucketIndex + 1).join('/');
    }
    console.warn(`Não foi possível encontrar o bucket '${bucketName}' no pathname: ${urlObject.pathname}`);
    return null; // Bucket não encontrado no path da URL
  } catch (e) {
    console.error("Erro ao parsear a URL do storage:", url, e);
    return null; // URL inválida
  }
}

export async function getAuthenticatedAdminId() {
  // console.log("[Server Action Called] getAuthenticatedAdminId"); // Log opcional se precisar depurar esta especificamente
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Usuário não autenticado.");

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles').select('role').eq('user_id', user.id).single();
  if (profileError) throw new Error("Não foi possível verificar permissões.");
  if (!profile || profile.role !== 'admin') throw new Error("Acesso não autorizado (admin requerido).");
  return user.id;
}

export async function createPost(formData: PostFormData) {
  console.log("[Server Action Called] createPost");
  const supabase = await createClient();
  try {
    const author_id = await getAuthenticatedAdminId();
    let author_nome = "Lorena"; let author_sobrenome = "Jacob";

    const { data: authorProfile } = await supabase
      .from('user_profiles').select('nome, sobrenome')
      .eq('user_id', author_id).maybeSingle();
    if (authorProfile) {
      author_nome = authorProfile.nome || author_nome;
      author_sobrenome = authorProfile.sobrenome || author_sobrenome;
    }

    const sanitizedContent = purify.sanitize(formData.conteudo, { USE_PROFILES: { html: true } });

    const { data: postData, error: postError } = await supabase
      .from('blog_posts')
      .insert([{
        titulo: formData.titulo, slug: formData.slug, resumo: formData.resumo,
        conteudo: sanitizedContent, imagem_destaque_url: formData.imagem_destaque_url || null,
        author_id: author_id, author_nome: author_nome, author_sobrenome: author_sobrenome,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
        view_count: 0, like_count: 0,
      }])
      .select('id, slug').single();

    if (postError) throw postError;
    if (!postData) throw new Error("Falha ao criar post (sem retorno).");

    if (formData.categorias && formData.categorias.length > 0) {
      const postCategories = formData.categorias.map(catId => ({ post_id: postData.id, category_id: catId }));
      await supabase.from('blog_post_categories').insert(postCategories);
    }

    revalidatePath('/admin/blog');
    if (formData.is_published) {
      revalidatePath('/blog'); revalidatePath(`/blog/${postData.slug}`);
    }
    return { success: true, message: "Post criado!", postId: postData.id };
  } catch (error: unknown) {
    console.error("Erro completo ao criar post:", error);
    return { success: false, message: (error instanceof Error ? error.message : String(error)) || "Falha ao criar post." };
  }
}

export async function updatePost(
    postId: string,
    formData: PostFormData,
    oldImageUrlFromClient?: string | null
) {
  console.log("[Server Action Called] updatePost");
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId();
    const newImageUrl = formData.imagem_destaque_url || null;

    if (newImageUrl !== oldImageUrlFromClient && oldImageUrlFromClient) {
      const oldPath = getStoragePathFromUrl(oldImageUrlFromClient, 'lorena-images-db'); // <<< SEU BUCKET
      if (oldPath) {
        try {
          console.log("[updatePost Action] Removendo imagem antiga:", oldPath);
          await supabase.storage.from('lorena-images-db').remove([oldPath]); // <<< SEU BUCKET
        } catch (e: unknown) { console.error("Erro não fatal ao remover img antiga:", (e instanceof Error ? e.message : String(e))); }
      }
    }

    const sanitizedContent = purify.sanitize(formData.conteudo, { USE_PROFILES: { html: true } });
    const { data: existingPostData } = await supabase
       .from('blog_posts').select('published_at, is_published, slug').eq('id', postId).single();
    if (!existingPostData) throw new Error("Post não encontrado.");

    const { data, error: postError } = await supabase
      .from('blog_posts')
      .update({
        titulo: formData.titulo, slug: formData.slug, resumo: formData.resumo,
        conteudo: sanitizedContent, imagem_destaque_url: newImageUrl,
        updated_at: new Date().toISOString(), is_published: formData.is_published,
        published_at: (formData.is_published && !existingPostData.published_at) ? new Date().toISOString()
                      : (!formData.is_published && existingPostData.published_at) ? null
                      : existingPostData.published_at,
      })
      .eq('id', postId).select('id, slug').single();

    if (postError) throw postError;
    if (!data) throw new Error("Falha ao atualizar post.");

    await supabase.from('blog_post_categories').delete().eq('post_id', postId);
    if (formData.categorias && formData.categorias.length > 0) {
      const postCategories = formData.categorias.map(catId => ({ post_id: postId, category_id: catId }));
      await supabase.from('blog_post_categories').insert(postCategories);
    }

    revalidatePath('/admin/blog');
    if (existingPostData.slug !== data.slug && existingPostData.is_published) revalidatePath(`/blog/${existingPostData.slug}`);
    if (formData.is_published) { revalidatePath('/blog'); revalidatePath(`/blog/${data.slug}`); }
    else if (existingPostData.is_published) { revalidatePath('/blog'); revalidatePath(`/blog/${existingPostData.slug}`); }
    revalidatePath(`/admin/blog/editar/${postId}`);

    return { success: true, message: "Post atualizado!", post: data };
  } catch (error: unknown) {
    console.error("Erro completo ao atualizar post:", error);
    return { success: false, message: (error instanceof Error ? error.message : String(error)) || "Falha ao atualizar." };
  }
}

export async function getPostForEdit(id: string): Promise<(Omit<BlogPostFromDB, 'user_profiles' | 'blog_post_categories'> & { user_profiles: UserProfileInfo | null; categorias: string[] }) | null> {
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId();
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        id, titulo, slug, resumo, conteudo, imagem_destaque_url, author_id, author_nome, author_sobrenome,
        is_published, published_at, created_at, updated_at, like_count, view_count,
        blog_post_categories( category_id, blog_categories(id, nome) )
      `).eq('id', id).single();

    if (error) { if (error.code === 'PGRST116') return null; throw error; }
    if (!post) return null;

    const userProfileData: UserProfileInfo | null = { nome: post.author_nome || 'Autor', sobrenome: post.author_sobrenome || '' };
    const categoryIds: string[] = post.blog_post_categories?.map(pc => pc.blog_categories?.[0]?.id ?? pc.category_id).filter(Boolean) as string[] || [];
    const { ...restOfPost } = post;

    return {
      ...restOfPost,
      like_count: post.like_count ?? 0, view_count: post.view_count ?? 0,
      user_profiles: userProfileData, categorias: categoryIds
    };
  } catch (error: unknown) {
    console.error(`Erro GERAL buscar post ${id} edit:`, (error instanceof Error ? error.message : String(error))); return null;
  }
}

export async function getBlogCategories(): Promise<BlogCategoryFromDB[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('blog_categories').select('id, nome').order('nome', { ascending: true });
    if (error) { console.error("Erro buscar categorias:", (error instanceof Error ? error.message : String(error))); return []; }
    return data || [];
  } catch (error: unknown) { console.error("Exceção buscar categorias:", (error instanceof Error ? error.message : String(error))); return []; }
}

// Interface para resposta da action com paginação
interface GetAdminBlogPostsResponse {
  success: boolean;
  data?: BlogPostFromDB[];
  totalCount?: number;
  message?: string;
}

// Modificada para paginação e filtros
export async function getAdminBlogPosts(
  page: number = 1,
  limit: number = 15,
  searchTerm?: string,
  categoryId?: string
): Promise<GetAdminBlogPostsResponse> { 
  console.log(`[Server Action Called] getAdminBlogPosts - Page: ${page}, Limit: ${limit}, Search: ${searchTerm}, Category: ${categoryId}`);
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId();
        
    // Construir a query base
    let query = supabase
        .from('blog_posts')
        .select(`
            id, titulo, slug, resumo, conteudo, imagem_destaque_url,
            author_id, author_nome, author_sobrenome,
            is_published, published_at, created_at, updated_at, like_count, view_count,
            blog_post_categories!inner ( category_id, blog_categories!inner ( id, nome ) )
        `, { count: 'exact' }); // Adicionado count

    // Aplicar filtro de categoria SE fornecido
    // Nota: Isso requer que a relação blog_post_categories -> blog_categories esteja definida
    // e que o Supabase consiga fazer o join implícito corretamente aqui.
    // Se falhar, precisaremos de uma abordagem diferente para filtro de categoria.
    if (categoryId) {
       query = query.eq('blog_post_categories.category_id', categoryId);
    }

    // Aplicar filtro de busca SE fornecido
    if (searchTerm) {
        const searchTermSanitized = searchTerm.replace(/[%_]/g, '\\$&'); // Escapar caracteres especiais
        // Buscar no título, resumo ou nome/sobrenome do autor desnormalizado
        query = query.or(`titulo.ilike.%${searchTermSanitized}%,resumo.ilike.%${searchTermSanitized}%,author_nome.ilike.%${searchTermSanitized}%,author_sobrenome.ilike.%${searchTermSanitized}%`);
    }

    // Aplicar ordenação
    query = query.order('created_at', { ascending: false });

    // Aplicar paginação
    const rangeFrom = (page - 1) * limit;
    const rangeTo = rangeFrom + limit - 1;
    query = query.range(rangeFrom, rangeTo);

    // Executar a query
    const { data: postsData, error: postsError, count } = await query;

    if (postsError) { 
      console.error("Erro buscar posts admin (paginado/filtrado):", postsError.message);
      // Se o erro for relação não encontrada no filtro de categoria, logar aviso
      if (postsError.message.includes('relationship') && postsError.message.includes('blog_post_categories')) {
          console.warn("Não foi possível filtrar por categoria via join implícito.");
      }
      return { success: false, message: postsError.message }; 
    }
    if (!postsData) {
        return { success: true, data: [], totalCount: 0 };
    }

    // Mapear os dados
    const formattedPosts: BlogPostFromDB[] = postsData.map(post => {
         const categoryIds: string[] = [];
         const categoriesInfo: { id: string; nome: string; }[] = [];

         if (post.blog_post_categories && Array.isArray(post.blog_post_categories)) {
            for (const pc of post.blog_post_categories) {
                 const category = pc.blog_categories?.[0]; 
                 if (category?.id && category?.nome) {
                    categoryIds.push(category.id);
                    categoriesInfo.push({ id: category.id, nome: category.nome });
                }
            }
         }
         // Removendo explicitamente blog_post_categories do objeto post retornado
         // para evitar confusão e usar apenas categoriasInfo para o display.
         const { blog_post_categories, ...restOfPost } = post;

         return {
             ...restOfPost,
             conteudo: restOfPost.conteudo || '', 
             like_count: restOfPost.like_count ?? 0, 
             view_count: restOfPost.view_count ?? 0,
             user_profiles: { nome: restOfPost.author_nome || 'Autor', sobrenome: restOfPost.author_sobrenome || '' },
             categorias: categoryIds, 
             categoriasInfo: categoriesInfo
         } as BlogPostFromDB;
    });
    
    return { success: true, data: formattedPosts, totalCount: count || 0 };

  } catch (error: unknown) { 
      console.error("Exceção buscar posts admin (paginado/filtrado):", (error instanceof Error ? error.message : String(error)));
      // Se for erro de autenticação, a mensagem já estará no erro
      return { success: false, message: (error instanceof Error ? error.message : String(error)) || "Erro inesperado." }; 
  }
}

// Interface para o retorno da RPC get_blog_stats
interface BlogStatsRPCResponse {
  total_posts: number;
  total_views: number;
  total_likes: number;
}

// Nova função para estatísticas do Dashboard - Otimizada com RPC
export async function getDashboardBlogStats() {
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId();

    // Chamar a função RPC criada no Supabase
    const { data: statsData, error: rpcError } = await supabase
      .rpc('get_blog_stats')
      .single<BlogStatsRPCResponse>(); // <-- Adicionado tipo genérico

    if (rpcError) {
      console.error("Erro ao chamar RPC get_blog_stats:", rpcError.message);
      throw rpcError;
    }

    if (!statsData) {
      console.error("RPC get_blog_stats não retornou dados.");
      throw new Error("Falha ao buscar estatísticas do dashboard.");
    }

    // A função RPC retorna total_posts, total_views, total_likes
    return {
      success: true,
      data: {
        totalPosts: statsData.total_posts || 0,
        totalVisualizacoes: statsData.total_views || 0,
        totalLikes: statsData.total_likes || 0,
      }
    };
    
  } catch (error: unknown) {
    console.error("Erro geral ao buscar estatísticas do dashboard (RPC):", (error instanceof Error ? error.message : String(error)));
    // Retorna o erro original se disponível, ou uma mensagem genérica
    return { success: false, message: (error instanceof Error ? error.message : String(error)) || "Falha ao buscar estatísticas.", data: null };
  }
}

// Função para buscar posts recentes para o Dashboard
export async function getRecentPostsForDashboard(limit: number = 5) {
  const supabase = await createClient();
  try {
    // Não é necessário getAuthenticatedAdminId() aqui se os posts recentes não forem sensíveis
    // ou se a página do dashboard já for protegida.
    // Se precisar de proteção, descomente a linha abaixo:
    // await getAuthenticatedAdminId();

    const { data: recentPosts, error } = await supabase
      .from('blog_posts')
      .select('id, titulo, created_at, view_count')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Erro ao buscar posts recentes para o dashboard:", error.message);
      throw error;
    }
    return { success: true, data: recentPosts || [] };
  } catch (error: unknown) {
    console.error("Erro geral ao buscar posts recentes para o dashboard:", (error instanceof Error ? error.message : String(error)));
    return { success: false, message: (error instanceof Error ? error.message : String(error)), data: [] };
  }
}

// === deletePost AGORA TENTA DELETAR A IMAGEM ===
export async function deletePost(postId: string): Promise<{ success: boolean, message: string }> {
  const supabase = await createClient();
  let imageUrlToDelete: string | null = null; // Variável para guardar a URL

  try {
    await getAuthenticatedAdminId();

    // 1. Buscar a URL da imagem ANTES de deletar o post
    const { data: postData, error: fetchError } = await supabase
        .from('blog_posts').select('imagem_destaque_url').eq('id', postId).maybeSingle();

    // Se deu erro na busca (e não foi 'não encontrado'), joga o erro
    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`Erro ao buscar post ${postId} para exclusão:`, fetchError.message);
        throw new Error("Falha ao buscar dados do post para exclusão.");
    }
    imageUrlToDelete = postData?.imagem_destaque_url || null; // Guarda a URL

    // 2. Deletar o post do banco (CASCADE deve cuidar das categorias, etc.)
    const { error: postError } = await supabase.from('blog_posts').delete().eq('id', postId);
    if (postError) {
        console.error(`Erro ao deletar post ${postId} do banco:`, postError.message);
        throw postError; // Se não deletou o post, não adianta deletar imagem
    }
    console.log(`Post ${postId} deletado do banco.`);

    // 3. Tentar deletar a imagem do Storage (SE existir URL)
    if (imageUrlToDelete) {
        const pathToDelete = getStoragePathFromUrl(imageUrlToDelete, 'lorena-images-db'); // <<< SEU BUCKET
        console.log(`[deletePost Action] Tentando remover imagem do storage. Path: ${pathToDelete}`);

        if (pathToDelete) {
            try {
                const { error: deleteImgError } = await supabase.storage
                     .from('lorena-images-db') // <<< SEU BUCKET
                     .remove([pathToDelete]);

                if (deleteImgError) {
                    // Loga o erro mas NÃO lança exceção, pois o post já foi deletado.
                    console.error(`[deletePost Action] Erro NÃO FATAL ao remover imagem '${pathToDelete}':`, deleteImgError);
                } else {
                    console.log(`[deletePost Action] Imagem '${pathToDelete}' removida do storage.`);
                }
            } catch (e:unknown) {
                console.error(`[deletePost Action] Exceção ao tentar remover imagem '${pathToDelete}':`, (e instanceof Error ? e.message : String(e)));
            }
        } else {
            console.warn(`[deletePost Action] Não foi possível extrair path válido da URL para deletar: ${imageUrlToDelete}`);
        }
    } else {
        console.log(`[deletePost Action] Post ${postId} não possuía imagem para remover.`);
    }

    // Revalidação
    revalidatePath('/admin/blog');
    revalidatePath('/blog'); // Revalidar blog público também

    return { success: true, message: "Post excluído com sucesso." };

  } catch (error: unknown) {
    // Captura erros da busca inicial ou da deleção do post no DB
    console.error("Erro GERAL ao excluir post:", error);
    return { success: false, message: (error instanceof Error ? error.message : String(error)) || "Falha ao excluir post." };
  }
}