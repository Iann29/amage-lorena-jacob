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

export const lojaApiDirect = {
  // Buscar produtos diretamente do Supabase
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
    try {
      const page = params?.page || 1;
      const limit = params?.limit || 12;
      const offset = (page - 1) * limit;

      // Query base
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories!inner(*),
          images:product_images(*)
        `, { count: 'exact' })
        .eq('is_active', true)
        .eq('categories.is_active', true);

      // Filtros
      if (params?.search) {
        query = query.or(`nome.ilike.%${params.search}%,descricao.ilike.%${params.search}%`);
      }

      if (params?.category) {
        query = query.eq('category.slug', params.category);
      }

      // Ordenação
      const sortBy = params?.sortBy || 'created_at';
      const ascending = params?.sortOrder === 'asc';
      query = query.order(sortBy, { ascending });

      // Paginação
      query = query.range(offset, offset + limit - 1);

      const { data: products, error, count } = await query;

      if (error) throw error;

      // Processar produtos para incluir imagem principal
      const processedProducts = products?.map(product => {
        const primaryImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0];
        return {
          ...product,
          imagem_principal: primaryImage?.image_url || null
        };
      }) || [];

      return {
        products: processedProducts,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  // Buscar detalhes de um produto
  async getProductBySlug(slug: string): Promise<ProductDetailsResponse> {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (!product) {
        throw new Error('Produto não encontrado');
      }

      // Buscar produtos relacionados
      const { data: relatedProducts } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .eq('is_active', true)
        .limit(4);

      // Processar produtos relacionados
      const processedRelated = relatedProducts?.map(p => {
        const primaryImage = p.images?.find((img: any) => img.is_primary) || p.images?.[0];
        return {
          ...p,
          imagem_principal: primaryImage?.image_url || null
        };
      }) || [];

      return {
        product,
        relatedProducts: processedRelated
      };
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw error;
    }
  },

  // Buscar categorias
  async getCategories(): Promise<{ categories: Category[] }> {
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('nome');

      if (error) throw error;

      // Buscar contagem de produtos para cada categoria
      const categoriesWithCount = await Promise.all(
        (categories || []).map(async (category) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('is_active', true);

          return {
            ...category,
            produtos_count: count || 0
          };
        })
      );

      return {
        categories: categoriesWithCount
      };
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  },

  // Buscar detalhes de uma categoria
  async getCategoryBySlug(slug: string): Promise<{ category: Category }> {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (!category) {
        throw new Error('Categoria não encontrada');
      }

      // Buscar contagem de produtos
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_active', true);

      return {
        category: {
          ...category,
          produtos_count: count || 0
        }
      };
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      throw error;
    }
  },
};