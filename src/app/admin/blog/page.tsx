// src/app/admin/blog/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAdminBlogPosts, getBlogCategories, deletePost, type BlogPostFromDB, type BlogCategoryFromDB } from './actions';

// Reutilizar componente de paginação (ajustar import se necessário)
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  // ... (Implementação do componente Pagination como em comentarios/page.tsx) ...
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

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostFromDB[]>([]);
  const [allCategories, setAllCategories] = useState<BlogCategoryFromDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  
  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(10); // Ajuste conforme necessário
  
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Função para buscar posts paginados e filtrados
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Buscar categorias apenas uma vez (ou mover para fora do useCallback se não mudar)
      if (allCategories.length === 0) {
         const fetchedCategories = await getBlogCategories();
         setAllCategories(fetchedCategories || []);
      }
      
      // Buscar posts com paginação e filtros
      const response = await getAdminBlogPosts(currentPage, itemsPerPage, searchTerm || undefined, selectedCategoryId || undefined);
      
      if (response.success && response.data) {
        setPosts(response.data);
        setTotalCount(response.totalCount || 0);
      } else {
        setError(response.message || "Falha ao carregar posts.");
        setPosts([]);
        setTotalCount(0);
      }
    } catch (error: unknown) {
      setError((error instanceof Error ? error.message : String(error)) || "Erro inesperado ao buscar dados.");
      setPosts([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  // Dependências: página, termo de busca, categoria. itemsPerPage é constante.
  }, [currentPage, searchTerm, selectedCategoryId, itemsPerPage, allCategories.length]); 

  // Buscar dados ao montar e quando as dependências mudarem
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler para mudança de busca/filtro - reseta para página 1
  const handleFilterChange = () => {
      setCurrentPage(1);
      // fetchData será chamado pelo useEffect por causa da mudança de dependência
  };

  // Atualiza searchTerm e dispara re-fetch
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      handleFilterChange(); 
  };

  // Atualiza selectedCategoryId e dispara re-fetch
  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCategoryId(e.target.value || null);
      handleFilterChange();
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPostIds(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  // Selecionar/desselecionar todos os posts DA PÁGINA ATUAL
  const toggleSelectAll = () => {
    const currentPostIds = posts.map(post => post.id); // IDs apenas da página atual
    if (selectedPostIds.length === currentPostIds.length && currentPostIds.length > 0) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(currentPostIds);
    }
  };

  const handleDeleteSinglePost = async (postId: string, postTitle: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o post "${postTitle}"?`)) {
      const result = await deletePost(postId);
      if (result.success) {
        // Não manipula mais o estado `posts` diretamente, apenas recarrega os dados da página atual
        fetchData(); 
        alert(result.message);
      } else {
        alert(`Erro: ${result.message}`);
      }
    }
  };

  const handleDeleteSelectedPosts = async () => {
    if (selectedPostIds.length === 0) return;
    
    if (window.confirm(`Tem certeza que deseja excluir ${selectedPostIds.length} post(s)?`)) {
      setIsLoading(true); // Mostrar loading durante a exclusão em lote
      let successCount = 0;
      const errorMessages: string[] = [];
      for (const postId of selectedPostIds) {
        const result = await deletePost(postId);
        if (result.success) {
          successCount++;
        } else {
          errorMessages.push(`Erro ao excluir post ${postId}: ${result.message}`);
        }
      }
      setSelectedPostIds([]); // Limpa a seleção
      setIsBulkActionsOpen(false);
      fetchData(); // Recarrega os dados após todas as exclusões
      setIsLoading(false);
      alert(`${successCount} post(s) excluído(s) com sucesso.${errorMessages.length > 0 ? '\nErros:\n' + errorMessages.join('\n') : ''}`);
    }
  };

  if (isLoading && posts.length === 0) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="ml-3 text-purple-700">Carregando posts...</p>
        </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600 bg-red-50 rounded-md">Erro ao carregar posts: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300">Gerenciamento de Blog</h1>
        <Link 
          href="/admin/blog/novo" 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Novo Post
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
              placeholder="Buscar posts, autores..."
              className="pl-10 pr-4 py-2 border border-gray-400 rounded-md w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="sm:w-64">
            <select
              className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedCategoryId || ''}
              onChange={handleCategorySelectChange}
            >
              <option value="">Todas as categorias</option>
              {allCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {selectedPostIds.length > 0 && (
          <div className="bg-gray-100 p-3 rounded-md border border-gray-300 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-800 font-medium">
              {selectedPostIds.length} post(s) selecionado(s)
            </span>
            <div className="flex-1"></div>
            <div className="relative">
              <button
                onClick={() => setIsBulkActionsOpen(!isBulkActionsOpen)}
                className="bg-white border border-gray-400 rounded-md px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  <button
                    onClick={handleDeleteSelectedPosts}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Excluir selecionados
                  </button>
                  {/* TODO: Implementar ações de publicar/despublicar em lote */}
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedPostIds([])}
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
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      checked={selectedPostIds.length === posts.length && posts.length > 0}
                      onChange={toggleSelectAll}
                      disabled={posts.length === 0}
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Autor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Data
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
              {isLoading && posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500 mr-2"></div>
                      Carregando posts...
                    </div>
                  </td>
                </tr>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        checked={selectedPostIds.includes(post.id)}
                        onChange={() => togglePostSelection(post.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {post.imagem_destaque_url ? (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 relative">
                              <Image
                                src={post.imagem_destaque_url}
                                alt={post.titulo}
                                className="h-full w-full object-cover"
                                width={40}
                                height={40}
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                          </div>
                        ) : (
                           <div className="flex-shrink-0 h-10 w-10 mr-3 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">Sem Img</div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {post.titulo}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-1">
                            {post.resumo || 'Sem resumo'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {post.user_profiles ? `${post.user_profiles.nome} ${post.user_profiles.sobrenome}` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {post.is_published ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Publicado
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Rascunho
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/blog/editar/${post.id}`}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDeleteSinglePost(post.id, post.titulo)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-600 font-medium">
                    Nenhum post encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={(page) => setCurrentPage(page)} 
            />
        </div>

        <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-800 font-medium">
                Mostrando <span className="font-medium">{posts.length}</span> de <span className="font-medium">{totalCount}</span> resultados
              </p>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}