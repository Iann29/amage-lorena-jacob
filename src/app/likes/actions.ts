"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Esquema de validação para o ID do post
const PostIdSchema = z.string().uuid({ message: "ID do post inválido." });

interface LikeActionResponse {
  success: boolean;
  message?: string;
  liked?: boolean; // true se o post está curtido pelo usuário, false caso contrário
  likeCount?: number; // Nova contagem total de likes do post
}

// Adicionando tipo para o retorno da RPC toggle_post_like
interface TogglePostLikeRpcResponse {
  liked: boolean;
  new_like_count: number;
}

/**
 * Alterna o estado de "like" de um post para o usuário autenticado.
 * Se o usuário já curtiu o post, o like é removido. Caso contrário, o like é adicionado.
 *
 * @param postId O ID do post a ser curtido/descurtido.
 * @returns Um objeto com o status da operação, o novo estado do like e a contagem de likes.
 */
export async function togglePostLike(
  postId: string
): Promise<LikeActionResponse> {
  const validation = PostIdSchema.safeParse(postId);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Erro de autenticação ao tentar curtir post:", authError?.message);
      return { success: false, message: "Usuário não autenticado." };
    }

    // Modificando a forma da chamada RPC e tratamento de tipo
    const rpcResponse = await supabase
      .rpc("toggle_post_like", { p_post_id: postId });

    if (rpcResponse.error) {
      console.error("Erro RPC ao alternar like:", rpcResponse.error.message);
      let userMessage = "Falha ao processar sua curtida. Tente novamente.";
      if (rpcResponse.error.message.includes("Usuário não autenticado")) {
        userMessage = "Você precisa estar logado para curtir um post.";
      } else if (rpcResponse.error.message.includes("não encontrado")) {
        userMessage = "O post que você tentou curtir não foi encontrado.";
      } else if (rpcResponse.error.message.includes("violates row-level security policy")) {
        userMessage = "Você não tem permissão para realizar esta ação.";
      }
      return { success: false, message: userMessage };
    }

    // A RPC toggle_post_like retorna um array com um objeto (ou deveria)
    // quando chamada com .rpc() sem .single() ou .maybeSingle()
    // Se a RPC é definida para retornar TABLE(...), o `data` será um array.
    const resultData = rpcResponse.data as TogglePostLikeRpcResponse[] | null;

    if (!resultData || resultData.length === 0) {
        console.error("Nenhum dado retornado ou array vazio pela RPC toggle_post_like para o post:", postId, "Raw response data:", rpcResponse.data);
        return { success: false, message: "Ocorreu um erro inesperado ao processar sua curtida (RPC não retornou dados válidos)." };
    }
    
    // Pegamos o primeiro (e único) elemento do array
    const likeInfo = resultData[0];

    // Buscar o slug do post para revalidação
    // É importante revalidar o path correto para o Next.js atualizar o cache da página.
    const { data: postSlugData, error: slugError } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("id", postId)
      .single();

    if (slugError || !postSlugData?.slug) {
      console.warn(
        `Não foi possível obter o slug para o post ID ${postId} para revalidação. Erro: ${slugError?.message}`
      );
      // Continuar mesmo se a revalidação do path específico falhar, mas logar o aviso.
      // Uma revalidação mais genérica ou nenhuma revalidação pode ocorrer.
    } else {
      revalidatePath(`/blog/${postSlugData.slug}`);
      // Considere revalidar outras páginas onde a contagem de likes possa aparecer,
      // como a página principal do blog, se aplicável.
      // revalidatePath("/blog");
    }

    return {
      success: true,
      liked: likeInfo.liked,
      likeCount: likeInfo.new_like_count,
      message: likeInfo.liked ? "Post curtido!" : "Like removido.",
    };
  } catch (error: unknown) {
    console.error("Erro inesperado em togglePostLike:", (error instanceof Error ? error.message : String(error)));
    return {
      success: false,
      message: "Ocorreu um erro inesperado. Por favor, tente mais tarde.",
    };
  }
}

interface GetLikeStatusResponse {
  success: boolean;
  message?: string;
  isLiked?: boolean; // true se o usuário autenticado curtiu o post
  likeCount?: number; // Contagem total de likes (opcional, mas pode ser útil)
}

/**
 * Verifica se o usuário autenticado atualmente curtiu um post específico
 * e retorna a contagem total de likes do post.
 *
 * @param postId O ID do post.
 * @returns Um objeto com o status da operação, se está curtido, e a contagem de likes.
 */
export async function getPostLikeStatus(
  postId: string
): Promise<GetLikeStatusResponse> {
  const validation = PostIdSchema.safeParse(postId);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const supabase = await createClient();
  let userId: string | null = null;

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      // Não é necessariamente um erro se o usuário não estiver logado,
      // apenas significa que ele não pode ter curtido o post.
      console.log("Usuário não autenticado ao verificar status do like:", authError.message);
    }
    if (user) {
      userId = user.id;
    }

    // Buscar a contagem de likes do post diretamente da tabela blog_posts
    const { data: postData, error: postError } = await supabase
      .from("blog_posts")
      .select("like_count")
      .eq("id", postId)
      .single();

    if (postError || !postData) {
      console.error(
        `Erro ao buscar contagem de likes para post ${postId}:`,
        postError?.message
      );
      return { success: false, message: "Falha ao buscar dados do post." };
    }

    const currentLikeCount = postData.like_count || 0;

    // Se não houver usuário logado, ele não pode ter curtido o post.
    if (!userId) {
      return { success: true, isLiked: false, likeCount: currentLikeCount };
    }

    // Verificar se existe um like do usuário para este post
    const { data: likeData, error: likeError } = await supabase
      .from("blog_post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle(); // Use maybeSingle para não dar erro se não encontrar

    if (likeError) {
      console.error(
        `Erro ao verificar like do usuário ${userId} para post ${postId}:`,
        likeError.message
      );
      return {
        success: false,
        message: "Falha ao verificar seu status de like.",
      };
    }

    return {
      success: true,
      isLiked: !!likeData, // true se likeData não for null (ou seja, o like existe)
      likeCount: currentLikeCount,
    };
  } catch (error: unknown) {
    console.error("Erro inesperado em getPostLikeStatus:", (error instanceof Error ? error.message : String(error)));
    return {
      success: false,
      message: "Ocorreu um erro inesperado. Por favor, tente mais tarde.",
    };
  }
}

// Esquema de validação para o ID do comentário
const CommentIdSchema = z.string().uuid({ message: "ID do comentário inválido." });

/**
 * Alterna o estado de "like" de um comentário para o usuário autenticado.
 */
export async function toggleCommentLike(
  commentId: string
): Promise<LikeActionResponse> {
  const validation = CommentIdSchema.safeParse(commentId);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Erro de autenticação ao tentar curtir comentário:", authError?.message);
      return { success: false, message: "Usuário não autenticado." };
    }

    const rpcResponse = await supabase
      .rpc("toggle_comment_like", { p_comment_id: commentId });

    if (rpcResponse.error) {
      console.error("Erro RPC ao alternar like do comentário:", rpcResponse.error.message);
      let userMessage = "Falha ao processar sua curtida no comentário. Tente novamente.";
      if (rpcResponse.error.message.includes("Usuário não autenticado")) {
        userMessage = "Você precisa estar logado para curtir um comentário.";
      } else if (rpcResponse.error.message.includes("não encontrado ou não aprovado")) {
        userMessage = "O comentário que você tentou curtir não foi encontrado ou não está aprovado.";
      } else if (rpcResponse.error.message.includes("violates row-level security policy")) {
        userMessage = "Você não tem permissão para realizar esta ação no comentário.";
      }
      return { success: false, message: userMessage };
    }

    const resultData = rpcResponse.data as TogglePostLikeRpcResponse[] | null; // Reutilizando a interface, pois a estrutura é a mesma

    if (!resultData || resultData.length === 0) {
        console.error("Nenhum dado retornado pela RPC toggle_comment_like para o comentário:", commentId, "Raw response data:", rpcResponse.data);
        return { success: false, message: "Ocorreu um erro inesperado ao processar sua curtida no comentário (RPC não retornou dados válidos)." };
    }
    
    const likeInfo = resultData[0];

    // Para revalidar o path do post onde o comentário está, precisamos do slug do post.
    // Isso pode exigir uma query adicional para buscar o post_id e depois o slug do post.
    // Ou, se a UI dos comentários for carregada dinamicamente sem cache pesado do Next no lado do cliente,
    // a revalidação pode não ser estritamente necessária para a contagem de likes do comentário em si,
    // mas sim para a contagem agregada no post, se houver.
    // Por simplicidade e como a contagem de likes do comentário geralmente é atualizada na UI dinamicamente,
    // não farei a revalidação de path aqui, mas pode ser considerada.
    // Ex: const { data: commentData } = await supabase.from('blog_comments').select('post_id').eq('id', commentId).single();
    // Se commentData.post_id, buscar slug e revalidar.

    return {
      success: true,
      liked: likeInfo.liked,
      likeCount: likeInfo.new_like_count,
      message: likeInfo.liked ? "Comentário curtido!" : "Like do comentário removido.",
    };
  } catch (error: unknown) {
    console.error("Erro inesperado em toggleCommentLike:", (error instanceof Error ? error.message : String(error)));
    return {
      success: false,
      message: "Ocorreu um erro inesperado. Por favor, tente mais tarde.",
    };
  }
}

/**
 * Verifica se o usuário autenticado atualmente curtiu um comentário específico
 * e retorna a contagem total de likes do comentário.
 */
export async function getCommentLikeStatus(
  commentId: string
): Promise<GetLikeStatusResponse> {
  const validation = CommentIdSchema.safeParse(commentId);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const supabase = await createClient();
  let userId: string | null = null;

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.log("Usuário não autenticado ao verificar status do like do comentário:", authError.message);
    }
    if (user) {
      userId = user.id;
    }

    const { data: commentData, error: commentError } = await supabase
      .from("blog_comments")
      .select("like_count") // Supondo que 'blog_comments' tem 'like_count'
      .eq("id", commentId)
      .eq("is_approved", true) // Apenas para comentários aprovados
      .single();

    if (commentError || !commentData) {
      console.error(
        `Erro ao buscar contagem de likes para comentário ${commentId}:`,
        commentError?.message
      );
      return { success: false, message: "Falha ao buscar dados do comentário." };
    }

    const currentLikeCount = commentData.like_count || 0;

    if (!userId) {
      return { success: true, isLiked: false, likeCount: currentLikeCount };
    }

    const { data: likeData, error: likeError } = await supabase
      .from("blog_comment_likes")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", userId)
      .maybeSingle(); 

    if (likeError) {
      console.error(
        `Erro ao verificar like do usuário ${userId} para comentário ${commentId}:`,
        likeError.message
      );
      return {
        success: false,
        message: "Falha ao verificar seu status de like no comentário.",
      };
    }

    return {
      success: true,
      isLiked: !!likeData,
      likeCount: currentLikeCount,
    };
  } catch (error: unknown) {
    console.error("Erro inesperado em getCommentLikeStatus:", (error instanceof Error ? error.message : String(error)));
    return {
      success: false,
      message: "Ocorreu um erro inesperado. Por favor, tente mais tarde.",
    };
  }
} 