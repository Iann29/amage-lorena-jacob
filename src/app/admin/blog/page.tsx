"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts, blogCategorias } from '@/lib/mockData';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState(blogPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

  // Filtrar posts baseado no termo de busca e categoria selecionada
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.resumo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || 
      post.categorias.some(cat => cat.id === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Função para lidar com a seleção de posts para ações em lote
  const togglePostSelection = (postId: number) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(prev => prev.filter(id => id !== postId));
    } else {
      setSelectedPosts(prev => [...prev, postId]);
    }
  };

  // Função para selecionar/deselecionar todos os posts
  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post.id));
    }
  };

  // Função simulada para exclusão de posts
  const handleDeletePosts = () => {
    if (selectedPosts.length === 0) return;
    
    if (window.confirm(`Tem certeza que deseja excluir ${selectedPosts.length} post(s)?`)) {
      setPosts(prev => prev.filter(post => !selectedPosts.includes(post.id)));
      setSelectedPosts([]);
    }
  };

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
      
      {/* Filtros e busca */}
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
              placeholder="Buscar posts..."
              className="pl-10 pr-4 py-2 border border-gray-400 rounded-md w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="sm:w-64">
            <select
              className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Todas as categorias</option>
              {blogCategorias.map(category => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Ações em lote */}
        {selectedPosts.length > 0 && (
          <div className="bg-gray-100 p-3 rounded-md border border-gray-300 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-800 font-medium">
              {selectedPosts.length} post(s) selecionado(s)
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
                    onClick={handleDeletePosts}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Excluir selecionados
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Publicar selecionados
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Despublicar selecionados
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedPosts([])}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Limpar seleção
            </button>
          </div>
        )}
      </div>
      
      {/* Tabela de posts */}
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
                      checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                      onChange={toggleSelectAll}
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
                  Categorias
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Visualizações
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => togglePostSelection(post.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {post.imagem_destaque_url && (
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
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {post.titulo}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-1">
                            {post.resumo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.author?.nome || 'Sem autor'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {post.categorias.map((cat) => (
                          <span
                            key={cat.id}
                            className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800"
                          >
                            {cat.nome}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.visualizacoes || 0}
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
                          onClick={() => {
                            if (window.confirm('Tem certeza que deseja excluir este post?')) {
                              setPosts(prev => prev.filter(p => p.id !== post.id));
                            }
                          }}
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
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-600 font-medium">
                    Nenhum post encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginação mockada */}
        <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-800 font-medium">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredPosts.length}</span> de <span className="font-medium">{filteredPosts.length}</span> resultados
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <button
                  disabled
                  className="relative inline-flex items-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-500 bg-gray-100"
                >
                  Anterior
                </button>
                <button
                  disabled
                  className="relative inline-flex items-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-500 bg-gray-100"
                >
                  Próximo
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
