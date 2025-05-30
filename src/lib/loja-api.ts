import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export interface Category {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  imagem_url?: string;
  produtos_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  ordem_exibicao: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  nome_variante: string;
  preco_adicional: number;
  quantidade_estoque: number;
}

export interface Product {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  preco: number;
  preco_promocional?: number;
  quantidade_estoque: number;
  category_id?: string;
  category?: Category;
  images?: ProductImage[];
  imagem_principal?: string;
  variants?: ProductVariant[];
  idade_min?: number;
  idade_max?: number;
  tags?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductDetailsResponse {
  product: Product;
  relatedProducts: Product[];
}

export const lojaApi = {
  // Buscar produtos
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minAge?: number;
    maxAge?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.minPrice !== undefined) queryParams.append('min_price', params.minPrice.toString());
    if (params?.maxPrice !== undefined) queryParams.append('max_price', params.maxPrice.toString());
    if (params?.minAge !== undefined) queryParams.append('min_age', params.minAge.toString());
    if (params?.maxAge !== undefined) queryParams.append('max_age', params.maxAge.toString());
    if (params?.sortBy) queryParams.append('sort_by', params.sortBy);
    if (params?.sortOrder) queryParams.append('sort_order', params.sortOrder);

    const url = queryParams.toString() ? `loja-products?${queryParams.toString()}` : 'loja-products';
    
    const { data, error } = await supabase.functions.invoke('loja-products', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: { queryParams: queryParams.toString() },
    });

    if (error) throw error;
    return data;
  },

  // Buscar detalhes de um produto
  async getProductBySlug(slug: string): Promise<ProductDetailsResponse> {
    const { data, error } = await supabase.functions.invoke('loja-products', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: { slug },
    });

    if (error) throw error;
    return data;
  },

  // Buscar categorias
  async getCategories(): Promise<{ categories: Category[] }> {
    const { data, error } = await supabase.functions.invoke('loja-categories', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (error) throw error;
    return data;
  },

  // Buscar detalhes de uma categoria
  async getCategoryBySlug(slug: string): Promise<{ category: Category }> {
    console.log('=== DEBUG getCategoryBySlug ===');
    console.log('Slug recebido na função:', slug);
    console.log('Body que será enviado:', { slug });
    
    const { data, error } = await supabase.functions.invoke('loja-categories', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: { slug },
    });

    console.log('Resposta do Supabase:', { data, error });
    
    if (error) {
      console.error('Erro do Supabase:', error);
      throw error;
    }
    return data;
  },
};