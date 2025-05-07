"use server";

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
    // Buscar apenas posts publicados
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
        created_at,
        published_at,
        like_count,
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
      
      // Formatar nome do autor com valor padrão
      const author = { nome: 'Lorena', sobrenome: 'Jacob' };

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
