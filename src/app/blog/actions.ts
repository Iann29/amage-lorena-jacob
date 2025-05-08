"use server";

/**
 * DEPRECATED: Este arquivo está sendo gradualmente substituído por Edge Functions do Supabase.
 * As funções deste arquivo estão sendo migradas para src/lib/blog-api.ts que usa
 * as Edge Functions hospedadas no Supabase.
 * 
 * Mantenha este arquivo até que todas as referências sejam atualizadas para usar a nova API.
 */

import { createClient } from '@/utils/supabase/server';

// Tipos para os posts e categorias retornados do Supabase
export interface BlogPostPublic {
  id: string; // UUID
  titulo: string;
  slug: string;
  resumo: string | null;
  conteudo?: string;
  imagem_destaque_url: string | null;
  author_id: string | null; // UUID
  author_nome?: string; // Nome do autor (novo campo desnormalizado)
  author_sobrenome?: string; // Sobrenome do autor (novo campo desnormalizado)
  published_at: string;
  created_at: string;
  like_count: number;
  view_count?: number; // Campo calculado
  comment_count?: number; // Campo calculado
  // Campos formatados para o componente BlogPostCard
  author: {
    nome: string;
    sobrenome: string;
  };
  categorias: {
    id: string; // UUID
    nome: string;
    slug?: string; // Gerado pelo código
  }[];
}

export interface BlogCategoryPublic {
  id: string;
  nome: string;
  slug?: string;
  quantidade?: number;
}

// Buscar posts publicados para a página pública do blog
export async function getPublishedBlogPosts(): Promise<BlogPostPublic[]> {
  const supabase = await createClient();
  try {
    // 1. Buscar apenas posts publicados com todos os dados necessários em uma única consulta eficiente
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        titulo,
        slug,
        resumo,
        conteudo,
        imagem_destaque_url,
        author_id,
        author_nome,
        author_sobrenome,
        created_at,
        published_at,
        like_count,
        view_count,
        blog_post_categories (
          blog_categories ( id, nome )
        )
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar posts publicados:", error.message);
      return [];
    }

    if (!posts || posts.length === 0) {
      return [];
    }
    
    // 2. Coletar todos os IDs de posts para buscar contagens de comentários em lote
    const postIds = posts.map(post => post.id);
    
    // 4. Buscar contagens de comentários para todos os posts em uma única consulta
    const commentCountMap: Map<string, number> = new Map();
    
    // Buscar contagens apenas se houver posts
    if (postIds.length > 0) {
      const { data: commentCounts, error: countError } = await supabase
        .from('blog_comments')
        .select('post_id, id')
        .in('post_id', postIds)
        .eq('is_approved', true);
      
      if (!countError && commentCounts) {
        // Contar comentários por post_id
        commentCounts.forEach(comment => {
          if (comment.post_id) {
            const currentCount = commentCountMap.get(comment.post_id) || 0;
            commentCountMap.set(comment.post_id, currentCount + 1);
          }
        });
      } else if (countError) {
        console.error(`Erro ao contar comentários para os posts:`, countError.message);
      }
    }
    
    // 5. Processar todos os posts sem consultas adicionais ao banco de dados
    const formattedPosts: BlogPostPublic[] = posts.map(post => {
      // Extrair categorias com segurança de tipos
      const categorias: Array<{id: string; nome: string; slug: string}> = [];
      if (post.blog_post_categories && Array.isArray(post.blog_post_categories)) {
        for (const categoryRelation of post.blog_post_categories) {
          // Usar any temporariamente para resolver problemas de tipagem
          const catInfo: any = categoryRelation;
          if (catInfo.blog_categories && typeof catInfo.blog_categories === 'object') {
            categorias.push({
              id: catInfo.blog_categories.id,
              nome: catInfo.blog_categories.nome,
              slug: catInfo.blog_categories.nome.toLowerCase().replace(/\s+/g, '-')
            });
          }
        }
      }
      
      // Usar os campos author_nome e author_sobrenome diretamente da tabela blog_posts
      const author = {
        nome: (post as any).author_nome || 'Lorena',
        sobrenome: (post as any).author_sobrenome || 'Jacob'
      };
      
      // Obter a contagem de comentários do mapa preenchido anteriormente
      const comment_count = commentCountMap.get(post.id) || 0;

      return {
        ...post,
        author,
        categorias,
        comment_count
      } as BlogPostPublic;
    });

    return formattedPosts;
  } catch (error: any) {
    console.error("Exceção ao buscar posts publicados:", error.message);
    return [];
  }
}

// Buscar categorias para a página pública do blog
export async function getPublicBlogCategories(): Promise<BlogCategoryPublic[]> {
  const supabase = await createClient();
  try {
    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select('id, nome');

    if (error) {
      console.error("Erro ao buscar categorias para o blog público:", error.message);
      return [];
    }

    // Formatar os dados para o formato esperado pelo componente
    const formattedCategories = categories.map(cat => ({
      id: cat.id,
      nome: cat.nome,
      slug: cat.nome.toLowerCase().replace(/\s+/g, '-'), // Criar slug a partir do nome
      quantidade: 0 // Valor padrão, pode ser atualizado depois se necessário
    }));

    return formattedCategories as BlogCategoryPublic[];
  } catch (error: any) {
    console.error("Exceção ao buscar categorias para o blog público:", error.message);
    return [];
  }
}

// Buscar um post específico pelo slug para a página pública
export async function getBlogPostBySlug(slug: string): Promise<BlogPostPublic | null> {
  const supabase = await createClient();
  try {
    // Buscar o post com view_count incluído
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        titulo,
        slug,
        resumo,
        conteudo,
        imagem_destaque_url,
        author_id,
        author_nome,
        author_sobrenome,
        created_at,
        published_at,
        like_count,
        view_count,
        blog_post_categories (
          blog_categories ( id, nome )
        )
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // PostgREST code for 'No rows found'
        console.warn(`Post com slug "${slug}" não encontrado ou não publicado.`);
        return null;
      }
      console.error(`Erro ao buscar post com slug "${slug}":`, error.message);
      return null;
    }

    if (!post) {
      return null;
    }

    // Formatar os dados para o formato esperado
    const categorias = post.blog_post_categories
      ? post.blog_post_categories
          .flatMap(cat => cat.blog_categories || [])
          .map(cat => ({
            id: cat.id,
            nome: cat.nome,
            slug: cat.nome.toLowerCase().replace(/\s+/g, '-')
          }))
      : [];
    
    // Usar os dados de autor desnormalizados diretamente da tabela blog_posts
    const author = {
      nome: (post as any).author_nome || 'Lorena', 
      sobrenome: (post as any).author_sobrenome || 'Jacob'
    };
    
    // Contar os comentários associados ao post
    const { count: comment_count, error: countError } = await supabase
      .from('blog_comments')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', post.id)
      .eq('is_approved', true);
    
    if (countError) {
      console.error(`Erro ao contar comentários para o post ${post.id}:`, countError.message);
    }
    
    // Incrementar contador de visualizações a cada acesso
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', post.id);
    
    if (updateError) {
      console.error(`Erro ao incrementar view_count para o post ${post.id}:`, updateError.message);
    }
    
    return {
      ...post,
      author,
      categorias,
      comment_count: comment_count || 0
    } as BlogPostPublic;

  } catch (error: any) {
    console.error(`Exceção ao buscar post com slug "${slug}":`, error.message);
    return null;
  }
}

// Buscar posts populares (com mais likes)
export async function getPopularBlogPosts(limit: number = 3): Promise<BlogPostPublic[]> {
  const supabase = await createClient();
  try {
    // Buscar apenas posts publicados
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        titulo,
        slug,
        resumo,
        imagem_destaque_url,
        author_id,
        created_at,
        published_at,
        like_count,
        blog_post_categories (
          blog_categories ( id, nome )
        )
      `)
      .eq('is_published', true)
      .order('like_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Erro ao buscar posts populares:", error.message);
      return [];
    }

    // Formatar os dados para o formato esperado pelo componente BlogPostCard
    const formattedPosts = posts.map(post => {
      // Extrair as categorias para o formato esperado pelo componente
      const categorias = post.blog_post_categories
        ? post.blog_post_categories
            .flatMap(cat => cat.blog_categories || [])
            .map(cat => ({
              id: cat.id,
              nome: cat.nome,
              slug: cat.nome.toLowerCase().replace(/\s+/g, '-')
            }))
        : [];
      
      // Formatar nome do autor
      const author = { nome: 'Lorena', sobrenome: 'Jacob' }; // Nome padrão

      return {
        ...post,
        author,
        categorias,
        view_count: 0, // Valor padrão
        comment_count: 0 // Valor padrão
      } as BlogPostPublic;
    });

    return formattedPosts;
  } catch (error: any) {
    console.error("Exceção ao buscar posts populares:", error.message);
    return [];
  }
}
