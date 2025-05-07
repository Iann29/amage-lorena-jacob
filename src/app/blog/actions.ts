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
    // Buscar apenas posts publicados com view_count
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

    // Obter IDs de todos os autores para buscar seus perfis em uma única consulta
    const authorIds = [...new Set(posts.map(p => p.author_id).filter(id => id !== null))] as string[];
    
    // Mapa para armazenar informações dos autores
    let userProfilesMap: Map<string, {nome: string; sobrenome: string}> = new Map();
    
    // Buscar perfis de usuários se houver IDs de autores
    if (authorIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, nome, sobrenome')
        .in('user_id', authorIds);
      
      if (profilesError) {
        console.error("Erro ao buscar perfis de usuários:", profilesError.message);
      } else if (profilesData) {
        profilesData.forEach(profile => {
          if (profile.user_id) {
            userProfilesMap.set(profile.user_id, { 
              nome: profile.nome, 
              sobrenome: profile.sobrenome || ''
            });
          }
        });
      }
    }
    
    // Formatar os dados e obter contagens de comentários
    const formattedPosts = await Promise.all(posts.map(async (post) => {
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
      
      // Obter informações do autor do mapa ou usar valor padrão
      const author = post.author_id && userProfilesMap.has(post.author_id)
        ? userProfilesMap.get(post.author_id)!
        : { nome: 'Lorena', sobrenome: 'Jacob' };
      
      // Obter contagem de comentários para este post
      const { count: comment_count, error: countError } = await supabase
        .from('blog_comments')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', post.id)
        .eq('is_approved', true);
      
      if (countError) {
        console.error(`Erro ao contar comentários para o post ${post.id}:`, countError.message);
      }

      return {
        ...post,
        author,
        categorias,
        comment_count: comment_count || 0
      } as BlogPostPublic;
    }));

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
    
    // Buscar informações do autor na tabela user_profiles
    let author = { nome: 'Lorena', sobrenome: 'Jacob' }; // Valor padrão
    
    if (post.author_id) {
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('nome, sobrenome')
        .eq('user_id', post.author_id)
        .single();
      
      if (!profileError && userProfile) {
        author = {
          nome: userProfile.nome,
          sobrenome: userProfile.sobrenome || ''
        };
      } else if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 = not found, outros erros são reportados
        console.error(`Erro ao buscar perfil do autor ${post.author_id}:`, profileError.message);
      }
    }
    
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
