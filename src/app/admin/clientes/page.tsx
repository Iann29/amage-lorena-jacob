"use client";

import { useState } from 'react';
import Link from 'next/link';

interface Customer {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  data_nascimento?: string;
  data_cadastro: string;
  total_pedidos: number;
  total_gasto: number;
  status: 'ativo' | 'inativo' | 'bloqueado';
  ultimo_pedido?: string;
  enderecos: {
    id: string;
    tipo: 'entrega' | 'cobranca';
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    padrao: boolean;
  }[];
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

export default function AdminClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  // Mock data
  const mockCustomers: Customer[] = [
    {
      id: '1',
      nome: 'Maria',
      sobrenome: 'Silva',
      email: 'maria.silva@email.com',
      telefone: '(11) 98765-4321',
      cpf: '123.456.789-00',
      data_nascimento: '1985-05-15',
      data_cadastro: '2023-06-10T10:00:00Z',
      total_pedidos: 5,
      total_gasto: 1245.50,
      status: 'ativo',
      ultimo_pedido: '2024-01-25T10:30:00Z',
      enderecos: [
        {
          id: '1',
          tipo: 'entrega',
          cep: '01310-100',
          logradouro: 'Av. Paulista',
          numero: '1000',
          complemento: 'Apto 502',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP',
          padrao: true
        }
      ]
    },
    {
      id: '2',
      nome: 'João',
      sobrenome: 'Santos',
      email: 'joao.santos@email.com',
      telefone: '(21) 99876-5432',
      data_cadastro: '2023-08-20T14:00:00Z',
      total_pedidos: 2,
      total_gasto: 497.00,
      status: 'ativo',
      ultimo_pedido: '2024-01-20T14:20:00Z',
      enderecos: [
        {
          id: '2',
          tipo: 'entrega',
          cep: '20040-020',
          logradouro: 'Rua da Assembleia',
          numero: '10',
          bairro: 'Centro',
          cidade: 'Rio de Janeiro',
          estado: 'RJ',
          padrao: true
        }
      ]
    },
    {
      id: '3',
      nome: 'Ana',
      sobrenome: 'Costa',
      email: 'ana.costa@email.com',
      data_cadastro: '2024-01-05T09:00:00Z',
      total_pedidos: 1,
      total_gasto: 2997.00,
      status: 'ativo',
      ultimo_pedido: '2024-01-26T09:15:00Z',
      enderecos: []
    },
    {
      id: '4',
      nome: 'Pedro',
      sobrenome: 'Oliveira',
      email: 'pedro.oliveira@email.com',
      telefone: '(31) 98765-1234',
      data_cadastro: '2023-03-15T16:00:00Z',
      total_pedidos: 0,
      total_gasto: 0,
      status: 'inativo',
      enderecos: []
    }
  ];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockCustomers.length / itemsPerPage);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: Customer['status']) => {
    const colors = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800',
      bloqueado: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: Customer['status']) => {
    const labels = {
      ativo: 'Ativo',
      inativo: 'Inativo',
      bloqueado: 'Bloqueado'
    };
    return labels[status] || status;
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  // Estatísticas
  const stats = {
    total: mockCustomers.length,
    ativos: mockCustomers.filter(c => c.status === 'ativo').length,
    novos: mockCustomers.filter(c => {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - 30);
      return new Date(c.data_cadastro) > dataLimite;
    }).length,
    totalGasto: mockCustomers.reduce((sum, c) => sum + c.total_gasto, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300">
          Gerenciamento de Clientes
        </h1>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          Exportar Lista
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-md">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Clientes Ativos</p>
              <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Novos (30 dias)</p>
              <p className="text-2xl font-bold text-blue-600">{stats.novos}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalGasto)}</p>
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, email, CPF..."
              className="pl-10 pr-4 py-2 border border-gray-400 rounded-md w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="sm:w-48">
            <select
              className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
              <option value="bloqueado">Bloqueados</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Lista de Clientes */}
      <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Contato
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Data Cadastro
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Pedidos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Total Gasto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                          {customer.nome.charAt(0)}{customer.sobrenome.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.nome} {customer.sobrenome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.cpf || 'CPF não informado'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.telefone || 'Sem telefone'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(customer.data_cadastro)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.total_pedidos} pedido(s)</div>
                    {customer.ultimo_pedido && (
                      <div className="text-sm text-gray-500">
                        Último: {formatDate(customer.ultimo_pedido)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(customer.total_gasto)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                      {getStatusLabel(customer.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleViewCustomer(customer)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Ver detalhes"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-gray-600 hover:text-gray-900" title="Editar">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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

      {/* Modal de Detalhes do Cliente */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalhes do Cliente
              </h3>
              <button
                onClick={() => setShowCustomerDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Informações Pessoais */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Informações Pessoais</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nome:</span> <span className="text-gray-900 font-medium">{selectedCustomer.nome} {selectedCustomer.sobrenome}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span> <span className="text-gray-900">{selectedCustomer.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Telefone:</span> <span className="text-gray-900">{selectedCustomer.telefone || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">CPF:</span> <span className="text-gray-900">{selectedCustomer.cpf || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Data de Nascimento:</span> <span className="text-gray-900">{selectedCustomer.data_nascimento ? formatDate(selectedCustomer.data_nascimento) : 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Cliente desde:</span> <span className="text-gray-900">{formatDate(selectedCustomer.data_cadastro)}</span>
                  </div>
                </div>
              </div>

              {/* Endereços */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Endereços</h4>
                {selectedCustomer.enderecos.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCustomer.enderecos.map((endereco) => (
                      <div key={endereco.id} className="bg-white border border-gray-200 p-3 rounded text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">{endereco.tipo === 'entrega' ? 'Endereço de Entrega' : 'Endereço de Cobrança'}</p>
                            <p className="text-gray-800">{endereco.logradouro}, {endereco.numero} {endereco.complemento && `- ${endereco.complemento}`}</p>
                            <p className="text-gray-800">{endereco.bairro} - {endereco.cidade}/{endereco.estado}</p>
                            <p className="text-gray-800">CEP: {endereco.cep}</p>
                          </div>
                          {endereco.padrao && (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-medium">Padrão</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 italic">Nenhum endereço cadastrado</p>
                )}
              </div>

              {/* Estatísticas */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Estatísticas</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{selectedCustomer.total_pedidos}</p>
                    <p className="text-sm text-gray-700 font-medium">Pedidos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedCustomer.total_gasto)}</p>
                    <p className="text-sm text-gray-700 font-medium">Total Gasto</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedCustomer.total_pedidos > 0 ? formatCurrency(selectedCustomer.total_gasto / selectedCustomer.total_pedidos) : 'R$ 0,00'}
                    </p>
                    <p className="text-sm text-gray-700 font-medium">Ticket Médio</p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => setShowCustomerDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Fechar
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Ver Pedidos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}