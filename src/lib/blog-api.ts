// Funções para acessar as Edge Functions do blog
// Este arquivo centraliza as chamadas às APIs do blog

// URL base para as funções edge do Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const API_BASE_URL = `${SUPABASE_URL}/functions/v1`;

// Tipos exportados do antigo actions.ts para manter compatibilidade
export interface BlogPostPublic {
  id: string;
  titulo: string;
  slug: string;
  resumo: string | null;
  conteudo?: string;
  imagem_destaque_url: string | null;
  author_id: string | null;
  author_nome?: string;
  author_sobrenome?: string;
  published_at: string;
  created_at: string;
  like_count: number;
  view_count?: number;
  comment_count?: number;
  author: {
    nome: string;
    sobrenome: string;
  };
  categorias: {
    id: string;
    nome: string;
    slug?: string;
  }[];
}

export interface BlogCategoryPublic {
  id: string;
  nome: string;
  slug: string;
  quantidade: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

interface PostsResponse {
  posts: BlogPostPublic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Função para buscar posts publicados
export async function getPublishedBlogPosts(
  page: number = 1,
  limit: number = 10,
  categoria?: string
): Promise<BlogPostPublic[]> {
  try {
    // Construir a URL com os parâmetros
    let url = `${API_BASE_URL}/blog-posts?page=${page}&limit=${limit}`;
    if (categoria) {
      url += `&categoria=${categoria}`;
    }

    // Fazer requisição à Edge Function
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache de 60 segundos
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar posts: ${response.status}`);
    }

    const { success, data, error } = await response.json() as ApiResponse<PostsResponse>;

    if (!success || error) {
      console.error("Erro retornado pela API:", error);
      return [];
    }

    return data.posts;
  } catch (error) {
    console.error("Falha ao buscar posts do blog:", error);
    return [];
  }
}

// Função para buscar categorias do blog
export async function getPublicBlogCategories(): Promise<BlogCategoryPublic[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/blog-categories`, {
      next: { revalidate: 300 }, // Cache de 5 minutos
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar categorias: ${response.status}`);
    }

    const { success, data, error } = await response.json() as ApiResponse<BlogCategoryPublic[]>;

    if (!success || error) {
      console.error("Erro retornado pela API:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Falha ao buscar categorias do blog:", error);
    return [];
  }
}

// Função para buscar um post específico pelo slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPostPublic | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/blog-post?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 }, // Cache de 60 segundos
    });

    if (!response.ok) {
      // Se o post não for encontrado
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erro ao buscar post: ${response.status}`);
    }

    const { success, data, error } = await response.json() as ApiResponse<BlogPostPublic>;

    if (!success || error) {
      console.error("Erro retornado pela API:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Falha ao buscar post com slug "${slug}":`, error);
    return null;
  }
}

// Função para buscar posts populares
export async function getPopularBlogPosts(limit: number = 3): Promise<BlogPostPublic[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/blog-popular?limit=${limit}`, {
      next: { revalidate: 300 }, // Cache de 5 minutos
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar posts populares: ${response.status}`);
    }

    const { success, data, error } = await response.json() as ApiResponse<BlogPostPublic[]>;

    if (!success || error) {
      console.error("Erro retornado pela API:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Falha ao buscar posts populares do blog:", error);
    return [];
  }
} 