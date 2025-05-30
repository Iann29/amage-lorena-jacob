"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  quantidade_estoque: number;
  category_id: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
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

export default function AdminProdutosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data
  const mockProducts: Product[] = [
    {
      id: '1',
      nome: 'E-book: Transformação Pessoal',
      descricao: 'Guia completo para sua jornada de transformação',
      preco: 97.00,
      quantidade_estoque: 999,
      category_id: 'cat-1',
      is_active: true,
      created_by: null,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      category: {
        id: 'cat-1',
        nome: 'E-books'
      },
      images: [
        {
          id: 'img-1',
          image_url: '/assets/ebook-transformacao.jpg',
          is_primary: true,
          ordem_exibicao: 0
        }
      ]
    },
    {
      id: '2',
      nome: 'Curso Online: Autoconhecimento',
      descricao: 'Aprenda a se conhecer profundamente',
      preco: 497.00,
      quantidade_estoque: 100,
      category_id: 'cat-2',
      is_active: true,
      created_by: null,
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z',
      category: {
        id: 'cat-2',
        nome: 'Cursos'
      },
      images: [
        {
          id: 'img-2',
          image_url: '/assets/curso-autoconhecimento.jpg',
          is_primary: true,
          ordem_exibicao: 0
        }
      ]
    },
    {
      id: '3',
      nome: 'Mentoria Individual - 3 meses',
      descricao: 'Acompanhamento personalizado por 3 meses',
      preco: 2997.00,
      quantidade_estoque: 5,
      category_id: 'cat-3',
      is_active: true,
      created_by: null,
      created_at: '2024-01-05T10:00:00Z',
      updated_at: '2024-01-05T10:00:00Z',
      category: {
        id: 'cat-3',
        nome: 'Mentorias'
      }
    },
    {
      id: '4',
      nome: 'Kit de Meditações Guiadas',
      descricao: 'Pacote com 10 meditações exclusivas',
      preco: 47.00,
      quantidade_estoque: 50,
      category_id: 'cat-4',
      is_active: false,
      created_by: null,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z',
      category: {
        id: 'cat-4',
        nome: 'Áudios'
      }
    }
  ];

  const categories = ['E-books', 'Cursos', 'Mentorias', 'Áudios', 'Workshops'];
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === mockProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(mockProducts.map(p => p.id));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300">
          Gerenciamento de Produtos
        </h1>
        <Link 
          href="/admin/produtos/novo" 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Novo Produto
        </Link>
      </div>
      
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
              placeholder="Buscar produtos..."
              className="pl-10 pr-4 py-2 border border-gray-400 rounded-md w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="sm:w-48">
            <select
              className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="sm:w-32">
            <select
              className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
        
        {selectedProducts.length > 0 && (
          <div className="bg-gray-100 p-3 rounded-md border border-gray-300 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-800 font-medium">
              {selectedProducts.length} produto(s) selecionado(s)
            </span>
            <div className="flex-1"></div>
            <div className="relative">
              <button
                onClick={() => setIsBulkActionsOpen(!isBulkActionsOpen)}
                className="bg-white border border-gray-400 rounded-md px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                Ações em lote
                <svg
                  className={`ml-1 inline-block h-4 w-4 transition-transform ${isBulkActionsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isBulkActionsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Ativar selecionados
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Desativar selecionados
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Excluir selecionados
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedProducts([])}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Limpar seleção
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    checked={selectedProducts.length === mockProducts.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Produto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Preço
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Estoque
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
              {mockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {product.images && product.images.find(img => img.is_primary)?.image_url ? (
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <div className="h-10 w-10 rounded overflow-hidden bg-gray-100">
                            <Image
                              src={product.images.find(img => img.is_primary)!.image_url}
                              alt={product.nome}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-10 w-10 mr-3 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {product.nome}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-1">
                          {product.descricao}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category?.nome || 'Sem categoria'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <span className="text-gray-900">{formatCurrency(product.preco)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.quantidade_estoque > 10 ? (
                        product.quantidade_estoque
                      ) : (
                        <span className="text-red-600 font-medium">{product.quantidade_estoque}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {product.is_active ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/produtos/editar/${product.id}`}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Editar
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        Excluir
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

        <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-800 font-medium">
                Mostrando <span className="font-medium">{mockProducts.length}</span> de <span className="font-medium">{mockProducts.length}</span> resultados
              </p>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}