"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

// Esquema de validação para múltiplos IDs de posts
const MultiplePostIdsSchema = z.array(z.string().uuid({ message: "ID de post inválido." }));

interface BatchLikeStatusItem {
  postId: string;
  isLiked: boolean;
  likeCount: number;
}

interface BatchLikeStatusResponse {
  success: boolean;
  message?: string;
  items?: BatchLikeStatusItem[];
}

/**
 * Busca o status de like para múltiplos posts em uma única requisição.
 * Isso é mais eficiente do que fazer várias requisições individuais.
 *
 * @param postIds Array com os IDs dos posts
 * @returns Um objeto com o status da operação e um array com o status de like para cada post
 */
export async function getBatchPostLikeStatus(
  postIds: string[]
): Promise<BatchLikeStatusResponse> {
  // Se não houver IDs, retornar sucesso com array vazio
  if (!postIds || postIds.length === 0) {
    return { success: true, items: [] };
  }

  const validation = MultiplePostIdsSchema.safeParse(postIds);
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
      console.log("Usuário não autenticado ao verificar status do batch de likes:", authError.message);
    }
    if (user) {
      userId = user.id;
    }

    // Se não houver usuário logado, retornar apenas as contagens de likes
    if (!userId) {
      // Buscar contagens de likes para todos os posts
      const { data: postsData, error: postsError } = await supabase
        .from("blog_posts")
        .select("id, like_count")
        .in("id", postIds);

      if (postsError) {
        console.error(
          `Erro ao buscar contagem de likes para posts em batch:`,
          postsError.message
        );
        return { success: false, message: "Falha ao buscar dados dos posts." };
      }

      const items: BatchLikeStatusItem[] = postsData.map(post => ({
        postId: post.id,
        isLiked: false, // Usuário não está logado, então não curtiu
        likeCount: post.like_count || 0
      }));

      return { success: true, items };
    }

    // Buscar todas as curtidas do usuário para os posts especificados
    const { data: likesData, error: likesError } = await supabase
      .from("blog_post_likes")
      .select("post_id")
      .eq("user_id", userId)
      .in("post_id", postIds);

    if (likesError) {
      console.error(
        `Erro ao verificar likes do usuário ${userId} para posts em batch:`,
        likesError.message
      );
      return { success: false, message: "Falha ao verificar status de likes." };
    }

    // Criar um conjunto de IDs de posts curtidos pelo usuário para busca rápida
    const likedPostIds = new Set(likesData.map(like => like.post_id));

    // Buscar contagens de likes para todos os posts
    const { data: postsData, error: postsError } = await supabase
      .from("blog_posts")
      .select("id, like_count")
      .in("id", postIds);

    if (postsError) {
      console.error(
        `Erro ao buscar contagem de likes para posts em batch:`,
        postsError.message
      );
      return { success: false, message: "Falha ao buscar dados dos posts." };
    }

    // Montar o resultado combinando as informações
    const items: BatchLikeStatusItem[] = postsData.map(post => ({
      postId: post.id,
      isLiked: likedPostIds.has(post.id),
      likeCount: post.like_count || 0
    }));

    return { success: true, items };
  } catch (error: unknown) {
    console.error(
      "Erro inesperado ao buscar status de likes em batch:", 
      (error instanceof Error ? error.message : String(error))
    );
    return {
      success: false,
      message: "Ocorreu um erro inesperado. Por favor, tente mais tarde.",
    };
  }
}
