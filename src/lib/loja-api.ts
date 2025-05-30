import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

// Tipos
export interface Product {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  quantidade_estoque: number;
  category_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  slug?: string;
  category?: {
    id: string;
    nome: string;
  };
  images?: Array<{
    id: string;
    image_url: string;
    is_primary: boolean;
    ordem_exibicao: number;
  }>;
}

export interface Category {
  id: string;
  nome: string;
  descricao: string | null;
  is_active: boolean;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comentario: string | null;
  is_approved: boolean;
  created_at: string;
  user?: {
    nome: string;
    sobrenome: string;
    avatar_url?: string;
  };
}

// Funções da API
export const lojaApi = {
  // Buscar produtos com filtros
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'name';
  }) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories!inner(*),
          images:product_images(*)
        `, { count: 'exact' })
        .eq('is_active', true)
        .gt('quantidade_estoque', 0);

      // Filtros
      if (params?.search) {
        query = query.or(`nome.ilike.%${params.search}%,descricao.ilike.%${params.search}%`);
      }
      
      if (params?.category_id) {
        query = query.eq('category_id', params.category_id);
      }
      
      if (params?.min_price) {
        query = query.gte('preco', params.min_price);
      }
      
      if (params?.max_price) {
        query = query.lte('preco', params.max_price);
      }

      // Ordenação
      switch (params?.sort_by) {
        case 'price_asc':
          query = query.order('preco', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('preco', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'name':
          query = query.order('nome', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Paginação
      const page = params?.page || 1;
      const limit = params?.limit || 12;
      const offset = (page - 1) * limit;
      
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        products: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return {
        products: [],
        total: 0,
        page: 1,
        totalPages: 0
      };
    }
  },

  // Buscar produto por slug
  async getProductBySlug(slug: string) {
    try {
      // Primeiro, precisamos adicionar um campo slug na tabela products
      // Por enquanto, vamos buscar por nome transformado em slug
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }
  },

  // Buscar produto por ID
  async getProductById(id: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }
  },

  // Buscar categorias ativas
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('nome');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  },

  // Buscar produtos relacionados
  async getRelatedProducts(productId: string, categoryId: string, limit: number = 4) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('category_id', categoryId)
        .neq('id', productId)
        .eq('is_active', true)
        .gt('quantidade_estoque', 0)
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar produtos relacionados:', error);
      return [];
    }
  },

  // Buscar avaliações do produto
  async getProductReviews(productId: string) {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          user:user_profiles(nome, sobrenome, avatar_url)
        `)
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      return [];
    }
  },

  // Calcular média de avaliações
  async getProductRating(productId: string) {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('rating')
        .eq('product_id', productId)
        .eq('is_approved', true);

      if (error) throw error;

      if (!data || data.length === 0) {
        return { average: 0, count: 0 };
      }

      const sum = data.reduce((acc, review) => acc + review.rating, 0);
      const average = sum / data.length;

      return {
        average: Math.round(average * 10) / 10,
        count: data.length
      };
    } catch (error) {
      console.error('Erro ao calcular avaliação:', error);
      return { average: 0, count: 0 };
    }
  },

  // Buscar carrinho do usuário
  async getUserCart(userId: string) {
    try {
      // Primeiro busca ou cria o carrinho
      let { data: cart, error: cartError } = await supabase
        .from('shopping_carts')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (cartError || !cart) {
        // Criar novo carrinho
        const { data: newCart, error: createError } = await supabase
          .from('shopping_carts')
          .insert({ user_id: userId })
          .select()
          .single();

        if (createError) throw createError;
        cart = newCart;
      }

      // Buscar itens do carrinho
      const { data: items, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(
            *,
            images:product_images(*)
          )
        `)
        .eq('cart_id', cart.id);

      if (itemsError) throw itemsError;

      return {
        cart_id: cart.id,
        items: items || []
      };
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
      return {
        cart_id: null,
        items: []
      };
    }
  },

  // Adicionar item ao carrinho
  async addToCart(userId: string, productId: string, quantidade: number = 1) {
    try {
      // Buscar ou criar carrinho
      const { cart_id } = await this.getUserCart(userId);
      if (!cart_id) throw new Error('Erro ao acessar carrinho');

      // Verificar se o produto já está no carrinho
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantidade')
        .eq('cart_id', cart_id)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Atualizar quantidade
        const { error } = await supabase
          .from('cart_items')
          .update({ quantidade: existingItem.quantidade + quantidade })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Adicionar novo item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            cart_id,
            product_id: productId,
            quantidade
          });

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      return { success: false, error };
    }
  },

  // Remover item do carrinho
  async removeFromCart(cartItemId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      return { success: false, error };
    }
  },

  // Atualizar quantidade do item no carrinho
  async updateCartItemQuantity(cartItemId: string, quantidade: number) {
    try {
      if (quantidade <= 0) {
        return this.removeFromCart(cartItemId);
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantidade })
        .eq('id', cartItemId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      return { success: false, error };
    }
  }
};