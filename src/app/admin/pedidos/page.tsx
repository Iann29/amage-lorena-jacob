"use client";

import { useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  user_id: string;
  status: 'pendente' | 'processando' | 'pago' | 'enviado' | 'entregue' | 'cancelado';
  valor_total: number;
  metodo_pagamento: 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto' | null;
  payment_id: string | null;
  external_reference: string | null;
  payment_details: any | null;
  desconto_aplicado: number | null;
  discount_id: string | null;
  shipping_address_id: string | null;
  endereco_entrega_snapshot: {
    nome_destinatario: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    telefone_contato?: string;
  };
  created_at: string;
  updated_at: string;
  user_profile?: {
    nome: string;
    sobrenome: string;
    email: string;
  };
  items?: Array<{
    id: string;
    quantidade: number;
    preco_unitario: number;
    preco_total: number;
    product: {
      nome: string;
    };
  }>;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="flex justify-center mt-6">
      <ul className="flex items-center space-x-1">
        {currentPage > 1 && (
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100"
            >
              Anterior
            </button>
          </li>
        )}
        {pages.map(page => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page ? 'bg-purple-600 text-white border-purple-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          </li>
        ))}
        {currentPage < totalPages && (
          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100"
            >
              Próxima
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default function AdminPedidosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  // Mock data
  const mockOrders: Order[] = [
    {
      id: '1',
      user_id: 'user-1',
      status: 'entregue',
      valor_total: 67.00,
      metodo_pagamento: 'cartao_credito',
      payment_id: 'pay_1234',
      external_reference: '2024001',
      payment_details: null,
      desconto_aplicado: null,
      discount_id: null,
      shipping_address_id: 'addr-1',
      endereco_entrega_snapshot: {
        nome_destinatario: 'Maria Silva',
        rua: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01001-000'
      },
      created_at: '2024-01-25T10:30:00Z',
      updated_at: '2024-01-25T10:30:00Z',
      user_profile: {
        nome: 'Maria',
        sobrenome: 'Silva',
        email: 'maria.silva@email.com'
      },
      items: [
        {
          id: 'item-1',
          quantidade: 1,
          preco_unitario: 67.00,
          preco_total: 67.00,
          product: {
            nome: 'E-book Transformação Pessoal'
          }
        }
      ]
    },
    {
      id: '2',
      user_id: 'user-2',
      status: 'processando',
      valor_total: 497.00,
      metodo_pagamento: 'pix',
      payment_id: 'pay_5678',
      external_reference: '2024002',
      payment_details: null,
      desconto_aplicado: null,
      discount_id: null,
      shipping_address_id: 'addr-2',
      endereco_entrega_snapshot: {
        nome_destinatario: 'João Santos',
        rua: 'Av. Paulista',
        numero: '1000',
        complemento: 'Apto 502',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100'
      },
      created_at: '2024-01-25T14:20:00Z',
      updated_at: '2024-01-25T14:20:00Z',
      user_profile: {
        nome: 'João',
        sobrenome: 'Santos',
        email: 'joao.santos@email.com'
      },
      items: [
        {
          id: 'item-2',
          quantidade: 1,
          preco_unitario: 497.00,
          preco_total: 497.00,
          product: {
            nome: 'Curso Online: Autoconhecimento'
          }
        }
      ]
    },
    {
      id: '3',
      user_id: 'user-3',
      status: 'pendente',
      valor_total: 2997.00,
      metodo_pagamento: 'boleto',
      payment_id: null,
      external_reference: '2024003',
      payment_details: null,
      desconto_aplicado: null,
      discount_id: null,
      shipping_address_id: 'addr-3',
      endereco_entrega_snapshot: {
        nome_destinatario: 'Ana Costa',
        rua: 'Rua da Assembleia',
        numero: '10',
        bairro: 'Centro',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '20040-020'
      },
      created_at: '2024-01-26T09:15:00Z',
      updated_at: '2024-01-26T09:15:00Z',
      user_profile: {
        nome: 'Ana',
        sobrenome: 'Costa',
        email: 'ana.costa@email.com'
      },
      items: [
        {
          id: 'item-3',
          quantidade: 1,
          preco_unitario: 2997.00,
          preco_total: 2997.00,
          product: {
            nome: 'Mentoria Individual - 3 meses'
          }
        }
      ]
    },
    {
      id: '4',
      user_id: 'user-4',
      status: 'cancelado',
      valor_total: 47.00,
      metodo_pagamento: 'cartao_credito',
      payment_id: 'pay_9012',
      external_reference: '2024004',
      payment_details: null,
      desconto_aplicado: null,
      discount_id: null,
      shipping_address_id: 'addr-4',
      endereco_entrega_snapshot: {
        nome_destinatario: 'Pedro Oliveira',
        rua: 'Rua das Laranjeiras',
        numero: '456',
        bairro: 'Laranjeiras',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '22240-003'
      },
      created_at: '2024-01-26T16:45:00Z',
      updated_at: '2024-01-26T16:45:00Z',
      user_profile: {
        nome: 'Pedro',
        sobrenome: 'Oliveira',
        email: 'pedro.oliveira@email.com'
      },
      items: [
        {
          id: 'item-4',
          quantidade: 1,
          preco_unitario: 47.00,
          preco_total: 47.00,
          product: {
            nome: 'Kit de Meditações Guiadas'
          }
        }
      ]
    }
  ];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockOrders.length / itemsPerPage);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-800',
      processando: 'bg-blue-100 text-blue-800',
      pago: 'bg-green-100 text-green-800',
      enviado: 'bg-purple-100 text-purple-800',
      entregue: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodLabel = (method: Order['metodo_pagamento']) => {
    const labels = {
      cartao_credito: 'Cartão de Crédito',
      cartao_debito: 'Cartão de Débito',
      pix: 'PIX',
      boleto: 'Boleto'
    };
    return method ? labels[method] : 'Não informado';
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pendente: 'Pendente',
      processando: 'Processando',
      pago: 'Pago',
      enviado: 'Enviado',
      entregue: 'Entregue',
      cancelado: 'Cancelado'
    };
    return labels[status] || status;
  };

  const getOrderNumber = (order: Order) => {
    return `#${order.external_reference || order.id.slice(0, 8)}`;
  };

  // Estatísticas
  const stats = {
    total: mockOrders.length,
    pendentes: mockOrders.filter(o => o.status === 'pendente').length,
    processando: mockOrders.filter(o => o.status === 'processando').length,
    totalVendas: mockOrders.filter(o => ['pago', 'entregue'].includes(o.status)).reduce((sum, o) => sum + o.valor_total, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300">
          Gerenciamento de Pedidos
        </h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Visualização em lista"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded ${viewMode === 'cards' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Visualização em cards"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-md">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pedidos Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-md">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Em Processamento</p>
              <p className="text-2xl font-bold text-blue-600">{stats.processando}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total em Vendas</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalVendas)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md border border-gray-300 p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar pedido, cliente..."
              className="pl-10 pr-4 py-2 border border-gray-400 rounded-md w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="processando">Processando</option>
              <option value="pago">Pago</option>
              <option value="enviado">Enviado</option>
              <option value="entregue">Entregue</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <select
              className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
              <option value="">Método pagamento</option>
              <option value="cartao_credito">Cartão de Crédito</option>
              <option value="cartao_debito">Cartão de Débito</option>
              <option value="pix">PIX</option>
              <option value="boleto">Boleto</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <input
              type="date"
              className="flex-1 border border-gray-400 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <input
              type="date"
              className="flex-1 border border-gray-400 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>
      </div>
      
      {/* Lista de Pedidos */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{getOrderNumber(order)}</div>
                      <div className="text-sm text-gray-500">{order.items?.length || 0} item(ns)</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.user_profile?.nome} {order.user_profile?.sobrenome}</div>
                      <div className="text-sm text-gray-500">{order.user_profile?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {getPaymentMethodLabel(order.metodo_pagamento)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.valor_total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/admin/pedidos/${order.id}`}
                          className="text-purple-600 hover:text-purple-900" 
                          title="Ver detalhes"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button className="text-gray-600 hover:text-gray-900" title="Imprimir">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md border border-gray-300 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{getOrderNumber(order)}</h3>
                  <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Cliente</p>
                  <p className="text-sm text-gray-900">{order.user_profile?.nome} {order.user_profile?.sobrenome}</p>
                  <p className="text-xs text-gray-500">{order.user_profile?.email}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Pagamento</p>
                  <span className="text-sm text-gray-900">
                    {getPaymentMethodLabel(order.metodo_pagamento)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{order.items?.length || 0} item(ns)</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(order.valor_total)}</p>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    href={`/admin/pedidos/${order.id}`}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded" 
                    title="Ver detalhes"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Link>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded" title="Imprimir">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}