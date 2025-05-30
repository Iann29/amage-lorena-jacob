import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

// Helper para fazer chamadas às Edge Functions
async function callEdgeFunction(
  path: string,
  options: {
    method?: string;
    body?: any;
    searchParams?: URLSearchParams;
  } = {}
) {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session) throw new Error('Not authenticated');

  const url = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/${path}`);
  if (options.searchParams) {
    url.search = options.searchParams.toString();
  }

  const response = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${session.session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to ${options.method || 'GET'} ${path}`);
  }

  return await response.json();
}

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
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.role) searchParams.append('role', params.role);

    return await callEdgeFunction('admin-customers', { searchParams }) as {
      customers: AdminCustomer[];
      total: number;
      page: number;
      totalPages: number;
    };
  },

  async getCustomer(id: string) {
    return await callEdgeFunction(`admin-customers/${id}`) as AdminCustomer;
  },

  async updateCustomer(id: string, updates: Partial<AdminCustomer>) {
    return await callEdgeFunction(`admin-customers/${id}`, {
      method: 'PUT',
      body: updates
    }) as AdminCustomer;
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
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.payment_method) searchParams.append('payment_method', params.payment_method);
    if (params?.start_date) searchParams.append('start_date', params.start_date);
    if (params?.end_date) searchParams.append('end_date', params.end_date);

    return await callEdgeFunction('admin-orders', { searchParams }) as {
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
    return await callEdgeFunction(`admin-orders/${id}`) as AdminOrder;
  },

  async updateOrderStatus(id: string, status: AdminOrder['status']) {
    return await callEdgeFunction(`admin-orders/${id}`, {
      method: 'PUT',
      body: { status }
    }) as AdminOrder;
  },

  // Products
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    is_active?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category_id) searchParams.append('category_id', params.category_id);
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

    return await callEdgeFunction('admin-products', { searchParams }) as {
      products: AdminProduct[];
      categories: Array<{ id: string; nome: string }>;
      total: number;
      page: number;
      totalPages: number;
    };
  },

  async getProduct(id: string) {
    return await callEdgeFunction(`admin-products/${id}`) as AdminProduct;
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
    return await callEdgeFunction('admin-products', {
      method: 'POST',
      body: product
    }) as AdminProduct;
  },

  async updateProduct(id: string, updates: Partial<AdminProduct> & {
    images?: Array<{ url?: string; image_url?: string; is_primary?: boolean }>;
  }) {
    return await callEdgeFunction(`admin-products/${id}`, {
      method: 'PUT',
      body: updates
    }) as AdminProduct;
  },

  async deleteProduct(id: string) {
    return await callEdgeFunction(`admin-products/${id}`, {
      method: 'DELETE'
    }) as AdminProduct;
  }
};