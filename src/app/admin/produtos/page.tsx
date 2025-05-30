"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { adminApi, AdminProduct } from '@/lib/admin-api';
import { createClient } from '@/utils/supabase/client';

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
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; nome: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Carregar produtos
  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, selectedCategory, selectedStatus]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getProducts({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        category_id: selectedCategory,
        is_active: selectedStatus === 'active' ? true : selectedStatus === 'inactive' ? false : undefined
      });
      
      setProducts(data.products);
      setCategories(data.categories);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const itemsPerPage = 10;

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
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
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
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
                    checked={products.length > 0 && selectedProducts.length === products.length}
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="ml-2 text-gray-600">Carregando produtos...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Nenhum produto encontrado
                  </td>
                </tr>
              ) : products.map((product) => (
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
                      <button 
                        onClick={async () => {
                          if (confirm('Tem certeza que deseja excluir este produto?')) {
                            try {
                              // Buscar imagens do produto
                              const productDetails = await adminApi.getProduct(product.id);
                              
                              // Deletar imagens do bucket
                              if (productDetails.images && productDetails.images.length > 0) {
                                const imagePaths = productDetails.images.map((img: any) => {
                                  const url = img.image_url;
                                  const path = url.split('/lorena-images-db/')[1];
                                  return path;
                                }).filter(Boolean);
                                
                                if (imagePaths.length > 0) {
                                  const supabase = createClient();
                                  await supabase.storage.from('lorena-images-db').remove(imagePaths);
                                }
                              }
                              
                              await adminApi.deleteProduct(product.id);
                              alert('Produto excluído com sucesso!');
                              loadProducts();
                            } catch (error) {
                              console.error('Erro ao excluir produto:', error);
                              alert('Erro ao excluir produto');
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
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
                Mostrando <span className="font-medium">{products.length}</span> de <span className="font-medium">{total}</span> resultados
              </p>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}