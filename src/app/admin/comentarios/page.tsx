"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  listCommentsForAdmin, 
  approveComment, 
  unapproveComment, 
  deleteComment, 
  type AdminCommentInfo 
} from '@/app/comments/actions';

// Componente simples para paginação
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
              className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-purple-600 text-white border-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}
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

// Componente Principal da Página de Moderação
export default function AdminCommentsPage() {
  const [comments, setComments] = useState<AdminCommentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'pending' | 'approved' | 'all'>('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(15); // Quantos comentários por página
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Função para buscar comentários
  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setActionFeedback(null); // Limpa feedback ao recarregar
    try {
      const options = {
        status: filterStatus === 'all' ? undefined : filterStatus,
        page: currentPage,
        limit: itemsPerPage
      };
      const response = await listCommentsForAdmin(options);
      if (response.success && response.data) {
        setComments(response.data);
        setTotalCount(response.totalCount || 0);
      } else {
        setError(response.message || "Falha ao carregar comentários.");
        setComments([]);
        setTotalCount(0);
      }
    } catch (e: any) {
      setError(e.message || "Erro inesperado ao buscar comentários.");
      setComments([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, currentPage, itemsPerPage]);

  // Buscar comentários ao carregar ou quando filtros/página mudarem
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Funções para executar actions de moderação
  const handleAction = async (action: Function, commentId: string, successMessage: string) => {
     if (!confirm("Tem certeza que deseja executar esta ação?")) return;
     setActionFeedback(null); // Limpa feedback anterior
     try {
       const result = await action(commentId);
       if (result.success) {
         setActionFeedback({ type: 'success', message: result.message || successMessage });
         fetchComments(); // Recarrega a lista após a ação
       } else {
         setActionFeedback({ type: 'error', message: result.message || 'Falha ao executar ação.' });
       }
     } catch (e:any) {
       setActionFeedback({ type: 'error', message: e.message || 'Erro inesperado.' });
     }
   };

   const handleApprove = (commentId: string) => handleAction(approveComment, commentId, 'Comentário aprovado!');
   const handleUnapprove = (commentId: string) => handleAction(unapproveComment, commentId, 'Comentário desaprovado.');
   const handleDelete = (commentId: string) => handleAction(deleteComment, commentId, 'Comentário deletado.');

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Comentários</h1>
        {/* Filtros */}
        <div className="flex items-center space-x-2">
          <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">Filtrar por:</label>
          <select 
            id="status-filter"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as 'pending' | 'approved' | 'all');
              setCurrentPage(1); // Resetar para página 1 ao mudar filtro
            }}
            className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="pending">Pendentes</option>
            <option value="approved">Aprovados</option>
            <option value="all">Todos</option>
          </select>
        </div>
      </div>

      {actionFeedback && (
        <div className={`p-3 rounded-md text-sm ${actionFeedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {actionFeedback.message}
        </div>
      )}

      {/* Tabela de Comentários */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentário</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respondendo a</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-500">Carregando comentários...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="text-center py-10 text-red-600">{error}</td></tr>
            ) : comments.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-500">Nenhum comentário encontrado para este filtro.</td></tr>
            ) : (
              comments.map(comment => (
                <tr key={comment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {comment.author.avatar_url ? (
                          <Image src={comment.author.avatar_url} alt={comment.author.nome} width={40} height={40} className="rounded-full object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 uppercase">{comment.author.nome?.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{comment.author.nome} {comment.author.sobrenome}</div>
                        <div className="text-xs text-gray-500">ID: {comment.author.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-sm truncate" title={comment.conteudo}>{comment.conteudo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comment.parent_comment_id ? `${comment.parent_comment_id.substring(0, 8)}...` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <Link href={`/blog/${comment.post.slug}`} target="_blank" className="text-sm text-blue-600 hover:text-blue-800 hover:underline" title={comment.post.titulo}>
                       {comment.post.titulo.substring(0, 30)}{comment.post.titulo.length > 30 ? '...' : ''}
                     </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(comment.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {comment.is_approved ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Aprovado</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                    {comment.is_approved ? (
                      <button onClick={() => handleUnapprove(comment.id)} className="text-yellow-600 hover:text-yellow-900" title="Desaprovar">Desaprovar</button>
                    ) : (
                      <button onClick={() => handleApprove(comment.id)} className="text-green-600 hover:text-green-900" title="Aprovar">Aprovar</button>
                    )}
                    <button onClick={() => handleDelete(comment.id)} className="text-red-600 hover:text-red-900" title="Deletar">Deletar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={(page) => setCurrentPage(page)} 
      />

    </div>
  );
} 