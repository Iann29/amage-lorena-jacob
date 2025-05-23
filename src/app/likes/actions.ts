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
      return { success: false, message: "Usuário não autenticado." };
    }

    const rpcResponse = await supabase
      .rpc("toggle_post_like", { p_post_id: postId });

    if (rpcResponse.error) {
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

    const resultData = rpcResponse.data as TogglePostLikeRpcResponse[] | null;

    if (!resultData || resultData.length === 0) {
      return { success: false, message: "Ocorreu um erro inesperado ao processar sua curtida (RPC não retornou dados válidos)." };
    }
    
    const likeInfo = resultData[0];

    const { data: postSlugData, error: slugError } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("id", postId)
      .single();

    if (slugError || !postSlugData?.slug) {
      console.warn(
        `Não foi possível obter o slug para o post ID ${postId} para revalidação. Erro: ${slugError?.message}`
      );
    } else {
      revalidatePath(`/blog/${postSlugData.slug}`);
    }

    return {
      success: true,
      liked: likeInfo.liked,
      likeCount: likeInfo.new_like_count,
      message: likeInfo.liked ? "Post curtido!" : "Like removido.",
    };
  } catch (error: unknown) {
    console.error("[ACTION ERROR] togglePostLike:", (error instanceof Error ? error.message : String(error)));
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
    }
    if (user) {
      userId = user.id;
    }

    const { data: postData, error: postError } = await supabase
      .from("blog_posts")
      .select("like_count")
      .eq("id", postId)
      .single();

    if (postError || !postData) {
      console.error(
        `[ACTION ERROR] getPostLikeStatus - Erro ao buscar contagem de likes para post ${postId}:`,
        postError?.message
      );
      return { success: false, message: "Falha ao buscar dados do post." };
    }

    const currentLikeCount = postData.like_count || 0;

    if (!userId) {
      return { success: true, isLiked: false, likeCount: currentLikeCount };
    }

    const { data: likeData, error: likeError } = await supabase
      .from("blog_post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    if (likeError) {
      console.error(
        `[ACTION ERROR] getPostLikeStatus - Erro ao verificar like do usuário ${userId} para post ${postId}:`,
        likeError.message
      );
      return {
        success: false,
        message: "Falha ao verificar seu status de like.",
      };
    }

    return {
      success: true,
      isLiked: !!likeData,
      likeCount: currentLikeCount,
    };
  } catch (error: unknown) {
    console.error("[ACTION ERROR] getPostLikeStatus:", (error instanceof Error ? error.message : String(error)));
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
      return { success: false, message: "Usuário não autenticado." };
    }

    const rpcResponse = await supabase
      .rpc("toggle_comment_like", { p_comment_id: commentId });

    if (rpcResponse.error) {
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

    const resultData = rpcResponse.data as TogglePostLikeRpcResponse[] | null;

    if (!resultData || resultData.length === 0) {
      return { success: false, message: "Ocorreu um erro inesperado ao processar sua curtida no comentário (RPC não retornou dados válidos)." };
    }
    
    const likeInfo = resultData[0];

    return {
      success: true,
      liked: likeInfo.liked,
      likeCount: likeInfo.new_like_count,
      message: likeInfo.liked ? "Comentário curtido!" : "Like do comentário removido.",
    };
  } catch (error: unknown) {
    console.error("[ACTION ERROR] toggleCommentLike:", (error instanceof Error ? error.message : String(error)));
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
    }
    if (user) {
      userId = user.id;
    }

    const { data: commentData, error: commentError } = await supabase
      .from("blog_comments")
      .select("like_count")
      .eq("id", commentId)
      .eq("is_approved", true)
      .single();

    if (commentError || !commentData) {
      console.error(
        `[ACTION ERROR] getCommentLikeStatus - Erro ao buscar contagem de likes para comentário ${commentId}:`,
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
        `[ACTION ERROR] getCommentLikeStatus - Erro ao verificar like do usuário ${userId} para comentário ${commentId}:`,
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
    console.error("[ACTION ERROR] getCommentLikeStatus:", (error instanceof Error ? error.message : String(error)));
    return {
      success: false,
      message: "Ocorreu um erro inesperado. Por favor, tente mais tarde.",
    };
  }
} 