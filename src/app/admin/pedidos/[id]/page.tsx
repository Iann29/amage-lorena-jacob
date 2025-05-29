"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OrderDetail {
  id: string;
  numero_pedido: string;
  data_pedido: string;
  status: 'pendente' | 'processando' | 'pago' | 'enviado' | 'entregue' | 'cancelado';
  status_pagamento: 'pendente' | 'pago' | 'falhou' | 'reembolsado';
  metodo_pagamento: string;
  subtotal: number;
  desconto: number;
  frete: number;
  total: number;
  observacoes?: string;
  codigo_rastreamento?: string;
  cliente: {
    id: string;
    nome: string;
    sobrenome: string;
    email: string;
    telefone?: string;
    cpf?: string;
  };
  endereco_entrega: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  endereco_cobranca?: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  itens: {
    id: string;
    produto: {
      id: string;
      nome: string;
      imagem?: string;
    };
    quantidade: number;
    preco_unitario: number;
    preco_total: number;
  }[];
  historico: {
    id: string;
    data: string;
    status: string;
    descricao: string;
    usuario?: string;
  }[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PedidoDetalhesPage({ params }: PageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>('');
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderDetail['status']>('pendente');
  const [statusNotes, setStatusNotes] = useState('');

  useEffect(() => {
    async function loadOrder() {
      const resolvedParams = await params;
      setOrderId(resolvedParams.id);
      
      // Simular carregamento do pedido
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockOrder: OrderDetail = {
        id: resolvedParams.id,
        numero_pedido: '#2024001',
        data_pedido: '2024-01-25T10:30:00Z',
        status: 'processando',
        status_pagamento: 'pago',
        metodo_pagamento: 'Cartão de Crédito (Visa ****1234)',
        subtotal: 67.00,
        desconto: 0,
        frete: 0,
        total: 67.00,
        observacoes: 'Cliente solicitou envio urgente',
        cliente: {
          id: '1',
          nome: 'Maria',
          sobrenome: 'Silva',
          email: 'maria.silva@email.com',
          telefone: '(11) 98765-4321',
          cpf: '123.456.789-00'
        },
        endereco_entrega: {
          logradouro: 'Av. Paulista',
          numero: '1000',
          complemento: 'Apto 502',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01310-100'
        },
        itens: [
          {
            id: '1',
            produto: {
              id: '1',
              nome: 'E-book: Transformação Pessoal',
              imagem: '/assets/ebook-transformacao.jpg'
            },
            quantidade: 1,
            preco_unitario: 67.00,
            preco_total: 67.00
          }
        ],
        historico: [
          {
            id: '1',
            data: '2024-01-25T10:30:00Z',
            status: 'Pedido criado',
            descricao: 'Pedido realizado pelo cliente',
            usuario: 'Sistema'
          },
          {
            id: '2',
            data: '2024-01-25T10:31:00Z',
            status: 'Pagamento confirmado',
            descricao: 'Pagamento aprovado via cartão de crédito',
            usuario: 'Sistema'
          },
          {
            id: '3',
            data: '2024-01-25T11:00:00Z',
            status: 'Em processamento',
            descricao: 'Pedido está sendo preparado',
            usuario: 'Admin'
          }
        ]
      };
      
      setOrder(mockOrder);
      setNewStatus(mockOrder.status);
      setIsLoading(false);
    }
    
    loadOrder();
  }, [params]);

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

  const getStatusColor = (status: OrderDetail['status']) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      processando: 'bg-blue-100 text-blue-800 border-blue-300',
      pago: 'bg-green-100 text-green-800 border-green-300',
      enviado: 'bg-purple-100 text-purple-800 border-purple-300',
      entregue: 'bg-green-100 text-green-800 border-green-300',
      cancelado: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getPaymentStatusColor = (status: OrderDetail['status_pagamento']) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      pago: 'bg-green-100 text-green-800 border-green-300',
      falhou: 'bg-red-100 text-red-800 border-red-300',
      reembolsado: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusLabel = (status: OrderDetail['status']) => {
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

  const getPaymentStatusLabel = (status: OrderDetail['status_pagamento']) => {
    const labels = {
      pendente: 'Pendente',
      pago: 'Pago',
      falhou: 'Falhou',
      reembolsado: 'Reembolsado'
    };
    return labels[status] || status;
  };

  const handleStatusUpdate = () => {
    // Aqui seria a lógica para atualizar o status
    alert(`Status atualizado para: ${getStatusLabel(newStatus)}`);
    setShowStatusModal(false);
    if (order) {
      setOrder({ ...order, status: newStatus });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-3 text-purple-700">Carregando pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Pedido não encontrado</p>
        <Link href="/admin/pedidos" className="text-purple-600 hover:text-purple-800 mt-4 inline-block">
          ← Voltar para pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/pedidos"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Voltar
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Pedido {order.numero_pedido}
            </h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir
            </button>
            <button
              onClick={() => setShowStatusModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Atualizar Status
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Itens do Pedido */}
          <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Itens do Pedido</h2>
            <div className="space-y-4">
              {order.itens.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-0">
                  <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.produto.nome}</h3>
                    <p className="text-sm text-gray-600">Quantidade: {item.quantidade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Unitário: {formatCurrency(item.preco_unitario)}</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(item.preco_total)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Resumo de Valores */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.desconto > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Desconto:</span>
                  <span className="text-red-600">-{formatCurrency(order.desconto)}</span>
                </div>
              )}
              {order.frete > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete:</span>
                  <span className="text-gray-900">{formatCurrency(order.frete)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Endereços */}
          <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Endereços</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Endereço de Entrega</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>{order.endereco_entrega.logradouro}, {order.endereco_entrega.numero}</p>
                  {order.endereco_entrega.complemento && <p>{order.endereco_entrega.complemento}</p>}
                  <p>{order.endereco_entrega.bairro}</p>
                  <p>{order.endereco_entrega.cidade} - {order.endereco_entrega.estado}</p>
                  <p>CEP: {order.endereco_entrega.cep}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Endereço de Cobrança</h3>
                {order.endereco_cobranca ? (
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>{order.endereco_cobranca.logradouro}, {order.endereco_cobranca.numero}</p>
                    {order.endereco_cobranca.complemento && <p>{order.endereco_cobranca.complemento}</p>}
                    <p>{order.endereco_cobranca.bairro}</p>
                    <p>{order.endereco_cobranca.cidade} - {order.endereco_cobranca.estado}</p>
                    <p>CEP: {order.endereco_cobranca.cep}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 italic">Mesmo endereço de entrega</p>
                )}
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Histórico do Pedido</h2>
            <div className="space-y-4">
              {order.historico.map((evento) => (
                <div key={evento.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{evento.status}</h4>
                      <span className="text-sm text-gray-500">{formatDate(evento.data)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{evento.descricao}</p>
                    {evento.usuario && (
                      <p className="text-xs text-gray-500 mt-1">Por: {evento.usuario}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Informações do Cliente */}
          <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Cliente</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-medium text-gray-900">{order.cliente.nome} {order.cliente.sobrenome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900">{order.cliente.email}</p>
              </div>
              {order.cliente.telefone && (
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="text-gray-900">{order.cliente.telefone}</p>
                </div>
              )}
              {order.cliente.cpf && (
                <div>
                  <p className="text-sm text-gray-600">CPF</p>
                  <p className="text-gray-900">{order.cliente.cpf}</p>
                </div>
              )}
              <div className="pt-3">
                <Link
                  href={`/admin/clientes/${order.cliente.id}`}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  Ver perfil completo →
                </Link>
              </div>
            </div>
          </div>

          {/* Informações de Pagamento */}
          <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pagamento</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPaymentStatusColor(order.status_pagamento)}`}>
                  {getPaymentStatusLabel(order.status_pagamento)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Método</p>
                <p className="text-gray-900">{order.metodo_pagamento}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data do Pedido</p>
                <p className="text-gray-900">{formatDate(order.data_pedido)}</p>
              </div>
            </div>
          </div>

          {/* Informações de Envio */}
          {order.codigo_rastreamento && (
            <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Envio</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Código de Rastreamento</p>
                  <p className="font-mono text-gray-900">{order.codigo_rastreamento}</p>
                </div>
                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  Rastrear envio →
                </button>
              </div>
            </div>
          )}

          {/* Observações */}
          {order.observacoes && (
            <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Observações</h2>
              <p className="text-sm text-gray-700">{order.observacoes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Atualização de Status */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Atualizar Status do Pedido
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Novo Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderDetail['status'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pendente">Pendente</option>
                  <option value="processando">Processando</option>
                  <option value="pago">Pago</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Adicione observações sobre a mudança de status..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Atualizar Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}