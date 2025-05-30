import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

// Tipos
export interface AdminCustomer {
  id: string;
  user_id: string;
  nome: string;
  sobrenome: string;
  email: string;
  telefone?: string;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  total_pedidos?: number;
  total_gasto?: number;
  ultimo_pedido?: string;
  shipping_addresses?: any[];
}

export interface AdminOrder {
  id: string;
  user_id: string;
  status: 'pendente' | 'processando' | 'pago' | 'enviado' | 'entregue' | 'cancelado';
  valor_total: number;
  metodo_pagamento: 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto' | null;
  payment_id: string | null;
  external_reference: string | null;
  created_at: string;
  updated_at: string;
  user_profile?: any;
  order_items?: any[];
}

export interface AdminProduct {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  quantidade_estoque: number;
  category_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: any;
  images?: any[];
}

// API Service
export const adminApi = {
  // Customers
  async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) throw new Error('Not authenticated');

    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.role) searchParams.append('role', params.role);

    const { data, error } = await supabase.functions.invoke('admin-customers', {
      headers: {
        Authorization: `Bearer ${session.session.access_token}`
      },
      body: {},
      method: 'GET'
    });

    if (error) throw error;
    return data as {
      customers: AdminCustomer[];
      total: number;
      page: number;
      totalPages: number;
    };
  },

  async getCustomer(id: string) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke(`admin-customers/${id}`, {
      headers: {
        Authorization: `Bearer ${session.session.access_token}`
      }
    });

    if (error) throw error;
    return data as AdminCustomer;
  },

  async updateCustomer(id: string, updates: Partial<AdminCustomer>) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke(`admin-customers/${id}`, {
      headers: {
        Authorization: `Bearer ${session.session.access_token}`
      },
      body: updates,
      method: 'PUT'
    });

    if (error) throw error;
    return data as AdminCustomer;
  },

  // Orders
  async getOrders(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    payment_method?: string;
    start_date?: string;
    end_date?: string;
  }) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) throw new Error('Not authenticated');

    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.payment_method) searchParams.append('payment_method', params.payment_method);
    if (params?.start_date) searchParams.append('start_date', params.start_date);
    if (params?.end_date) searchParams.append('end_date', params.end_date);

    const { data, error } = await supabase.functions.invoke('admin-orders', {
      headers: {
        Authorization: `Bearer ${session.session.access_token}`
      },
      body: {},
      method: 'GET'
    });

    if (error) throw error;
    return data as {
      orders: AdminOrder[];
      total: number;
      page: number;
      totalPages: number;
      statistics: {
        total: number;
        pendentes: number;
        processando: number;
        totalVendas: number;
      };
    };
  },

  async getOrder(id: string) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke(`admin-orders/${id}`, {
      headers: {
        Authorization: `Bearer ${session.session.access_token}`
      }
    });

    if (error) throw error;
    return data as AdminOrder;
  },

  async updateOrderStatus(id: string, status: AdminOrder['status']) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke(`admin-orders/${id}`, {
      headers: {
        Authorization: `Bearer ${session.session.access_token}`
      },
      body: { status },
      method: 'PUT'
    });

    if (error) throw error;
    return data as AdminOrder;
  },

  // Products
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    is_active?: boolean;
  }) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) throw new Error('Not authenticated');

    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category_id) searchParams.append('category_id', params.category_id);
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

    const { data, error } = await supabase.functions.invoke('admin-products', {
      headers: {
        Authorization: `Bearer ${session.session.access_token}`
      },
      body: {},
      method: 'GET'
    });

    if (error) throw error;
    return data as {
      products: AdminProduct[];
      categories: Array<{ id: string; nome: string }>;
      total: number;
      page: number;
      totalPages: number;
    };
  },

  async getProduct(id: string) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke(`admin-products/${id}`, {
      headers: {
        Authorization: `Bearer ${session.session.access_token}`
      }
    });

    if (error) throw error;
    return data as AdminProduct;
  },

  async createProduct(product: {
    nome: string;
    descricao?: string;
    preco: number;
    quantidade_estoque: number;
    category_id?: string;
    is_active?: boolean;
    images?: Array<{ url: string; is_primary?: boolean }>;
    variants?: Array<{
      nome: string;
      preco_adicional?: number;
      quantidade_estoque?: number;
    }>;
  }) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('admin-products', {
      headers: {
        Authorization: `Bearer ${session.session.access_token}`
      },
      body: product,
      method: 'POST'
    });

    if (error) throw error;
    return data as AdminProduct;
  },

  async updateProduct(id: string, updates: Partial<AdminProduct> & {
    images?: Array<{ url?: string; image_url?: string; is_primary?: boolean }>;
  }) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke(`admin-products/${id}`, {
      headers: {
        Authorization: `Bearer ${session.session.access_token}`
      },
      body: updates,
      method: 'PUT'
    });

    if (error) throw error;
    return data as AdminProduct;
  },

  async deleteProduct(id: string) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke(`admin-products/${id}`, {
      headers: {
        Authorization: `Bearer ${session.session.access_token}`
      },
      method: 'DELETE'
    });

    if (error) throw error;
    return data as AdminProduct;
  }
};