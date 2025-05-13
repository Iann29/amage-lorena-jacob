// src/lib/blog-api.ts

// URL base para as funções edge do Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const API_BASE_URL = `${SUPABASE_URL}/functions/v1`;

// Interfaces (mantenha como estão)
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
  slug: string; // Slug agora é gerado na Edge Function
  quantidade: number; // Quantidade agora é calculada na Edge Function
}

// <<== Interface para a resposta completa da API de posts
interface PostsApiResponse {
  posts: BlogPostPublic[];
  pagination: {
    page: number;
    limit: number;
    total: number; // Total de itens *filtrados*
    totalPages: number; // Total de páginas *filtradas*
  };
}

// <<== Interface genérica para a estrutura da resposta da API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

// Função para buscar posts publicados (ATUALIZADA)
export async function getPublishedBlogPosts(
  page: number = 1,
  limit: number = 10,
  categoria?: string // <<== Aceita ID da categoria como string opcional
): Promise<PostsApiResponse> { // <<== Retorna a estrutura completa com paginação
  try {
    // Constrói a URL base com paginação
    let url = `${API_BASE_URL}/blog-posts?page=${page}&limit=${limit}`;

    // <<== Adiciona o parâmetro de categoria à URL se fornecido
    if (categoria) {
      url += `&categoria=${encodeURIComponent(categoria)}`;
    }

    // Faz a requisição para a Edge Function
    const response = await fetch(url, {
      cache: 'no-store', // <<== DADOS SEMPRE FRESCOS
    });

    // Verifica se a requisição foi bem-sucedida
    if (!response.ok) {
      // Tenta ler a mensagem de erro da API, se houver
      const errorBody = await response.text();
      console.error(`Erro ${response.status} ao buscar posts: ${errorBody}`);
      throw new Error(`Erro ao buscar posts: ${response.status}`);
    }

    // Lê o JSON da resposta
    // <<== Espera a estrutura { success, data: { posts, pagination }, error }
    const apiResponse = await response.json() as ApiResponse<PostsApiResponse>;

    // Verifica se a API retornou sucesso
    if (!apiResponse.success || apiResponse.error) {
      console.error("Erro retornado pela API de posts:", apiResponse.error);
      // Retorna estrutura vazia em caso de erro da API
      return { posts: [], pagination: { page: 1, limit, total: 0, totalPages: 0 } };
    }

    // <<== Retorna os dados { posts, pagination }
    return apiResponse.data;

  } catch (error) {
    console.error("Falha na requisição para buscar posts do blog:", error);
    // Retorna estrutura vazia em caso de falha na requisição
    return { posts: [], pagination: { page: 1, limit, total: 0, totalPages: 0 } };
  }
}

// Função para buscar categorias do blog (ATUALIZADA para nova estrutura de resposta)
export async function getPublicBlogCategories(): Promise<BlogCategoryPublic[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/blog-categories`, {
      cache: 'no-store', // <<== DADOS SEMPRE FRESCOS
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar categorias: ${response.status}`);
    }

    // <<== Espera a estrutura { success, data: Categoria[], error }
    const apiResponse = await response.json() as ApiResponse<BlogCategoryPublic[]>;

    if (!apiResponse.success || apiResponse.error) {
      console.error("Erro retornado pela API de categorias:", apiResponse.error);
      return [];
    }

    return apiResponse.data; // Retorna o array de categorias
  } catch (error) {
    console.error("Falha na requisição para buscar categorias do blog:", error);
    return [];
  }
}

// Função para buscar um post específico pelo slug (ATUALIZADA para nova estrutura de resposta)
export async function getBlogPostBySlug(slug: string): Promise<BlogPostPublic | null> {
  try {
    // Requisição para a Edge Function
    const response = await fetch(`${API_BASE_URL}/blog-post?slug=${encodeURIComponent(slug)}`, {
      // Mantendo revalidate para posts individuais, pois podem ser atualizados com menos frequência
      // e a revalidação por tag é uma boa prática aqui.
      next: {
        revalidate: 60, 
        tags: [`blog-post-${slug}`]
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Post não encontrado
      }
      throw new Error(`Erro ao buscar post: ${response.status}`);
    }

    // <<== Espera a estrutura { success, data: Post, error }
    const apiResponse = await response.json() as ApiResponse<BlogPostPublic>;

    if (!apiResponse.success || apiResponse.error) {
      console.error("Erro retornado pela API de post:", apiResponse.error);
      return null;
    }

    return apiResponse.data; // Retorna o objeto do post
  } catch (error) {
    console.error(`Falha na requisição para buscar post com slug "${slug}":`, error);
    return null;
  }
}

// Função para buscar posts populares (ATUALIZADA para nova estrutura de resposta)
export async function getPopularBlogPosts(limit: number = 3): Promise<BlogPostPublic[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/blog-popular?limit=${limit}`, {
      cache: 'no-store', // <<== DADOS SEMPRE FRESCOS PARA POSTS POPULARES TAMBÉM
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar posts populares: ${response.status}`);
    }

    // <<== Espera a estrutura { success, data: Post[], error }
    const apiResponse = await response.json() as ApiResponse<BlogPostPublic[]>;

    if (!apiResponse.success || apiResponse.error) {
      console.error("Erro retornado pela API de posts populares:", apiResponse.error);
      return [];
    }

    return apiResponse.data; // Retorna o array de posts populares
  } catch (error) {
    console.error("Falha na requisição para buscar posts populares do blog:", error);
    return [];
  }
}