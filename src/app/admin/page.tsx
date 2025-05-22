"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Remover import de mockData se não for mais usado para posts ou estatísticas principais
// import { blogPosts, blogComments, blogCategorias } from '@/lib/mockData';
// import { blogComments } from '@/lib/mockData'; // Removido - Não mais necessário

// Importar as actions
import { getDashboardBlogStats, getRecentPostsForDashboard } from './blog/actions';
import { listCommentsForAdmin } from '@/app/comments/actions'; // Action para buscar comentários
import type { AdminCommentInfo } from '@/app/comments/actions'; // Tipo para comentários do admin

// Definir tipos para os dados que virão das actions
interface DashboardStats {
  totalPosts: number;
  totalVisualizacoes: number;
  totalLikes: number;
  // totalComentarios?: number; // Adicionar se for implementado
}

interface RecentPost {
  id: string; // ou number, dependendo do seu schema
  titulo: string;
  created_at: string;
  view_count: number; // Corresponde a visualizacoes no mock, mas vem como view_count da action
}

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para dados reais
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalVisualizacoes: 0,
    totalLikes: 0,
    // totalComentarios: 0,
  });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  
  // Variáveis mockadas removidas - dados agora vêm da API ou não são usados
  // const totalComentariosMock = blogComments.length;
  // const comentariosRecentesMock = blogComments.slice(0, 5); // Removido - não utilizado
  // const totalCategorias = blogCategorias.length; // Remover se não for mais usado

  // Estados para dados reais dos Comentários
  const [pendingCommentsCount, setPendingCommentsCount] = useState(0);
  const [recentPendingComments, setRecentPendingComments] = useState<AdminCommentInfo[]>([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      // Remover logs de teste
      // console.log("*** TESTE: FetchData iniciado, mas buscando APENAS categorias (se necessário) ***");
      try {
        // --- DESCOMENTAR BLOCO PARA BUSCAR DADOS REAIS ---
        
        // Buscar dados do Blog e Comentários em paralelo
        const [statsResult, recentPostsResult, commentsResult] = await Promise.all([
          getDashboardBlogStats(),
          getRecentPostsForDashboard(5),
          listCommentsForAdmin({ status: 'pending', limit: 5 }) // Buscar 5 pendentes
        ]);

        // Processar dados do Blog
        if (statsResult.success && statsResult.data) {
          setDashboardStats(statsResult.data);
        } else {
          console.error("Erro ao buscar estatísticas do dashboard:", statsResult.message);
          setError(prev => (prev ? prev + "; " : "") + (statsResult.message || "Falha: Estatísticas Blog"));
        }
        if (recentPostsResult.success && recentPostsResult.data) {
          setRecentPosts(recentPostsResult.data as RecentPost[]);
        } else {
          console.error("Erro ao buscar posts recentes:", recentPostsResult.message);
          setError(prev => (prev ? prev + "; " : "") + (recentPostsResult.message || "Falha: Posts Recentes"));
        }

        // Processar dados dos Comentários
        if (commentsResult.success && commentsResult.data) {
          setRecentPendingComments(commentsResult.data);
          setPendingCommentsCount(commentsResult.totalCount || 0); 
        } else {
          console.error("Erro ao buscar comentários pendentes:", commentsResult.message);
          setError(prev => (prev ? prev + "; " : "") + (commentsResult.message || "Falha: Comentários Pendentes"));
        }
        
        // --- FIM DO BLOCO DESCOMENTADO ---

        // Remover log de teste
        // console.log("*** TESTE: Busca de dados principais comentada ***");

      } catch (e: unknown) {
        console.error("Erro geral no useEffect do AdminDashboardPage:", e);
        setError((e instanceof Error ? e.message : String(e)) || "Ocorreu um erro inesperado ao carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  // Usar array vazio de dependências para buscar dados apenas uma vez no mount
  }, []); 

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-3 text-purple-600">Carregando dados do Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 p-4">
        <h2 className="text-xl font-semibold text-red-700 mb-3">Erro ao Carregar Dados</h2>
        <p className="text-red-600 text-center mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Última atualização: {new Date().toLocaleString('pt-BR')}</p>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Posts</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalPosts}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-md">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <Link href="/admin/blog" className="text-sm font-medium text-purple-600 hover:text-purple-800">
              Ver todos
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Visualizações</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalVisualizacoes}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">Total acumulado</span> {/* Alterado de "Últimos 30 dias" para refletir os dados reais */}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Curtidas</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalLikes}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-md">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">Total acumulado</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Comentários Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCommentsCount}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-md">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <Link href="/admin/comentarios" className="text-sm font-medium text-purple-600 hover:text-purple-800">
              Gerenciar
            </Link>
          </div>
        </div>
      </div>
      
      {/* Posts recentes e comentários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts recentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-medium text-gray-900">Posts Recentes</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentPosts.length > 0 ? recentPosts.map((post) => (
              <div key={post.id} className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{post.titulo}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')} • {post.view_count} visualizações
                    </p>
                  </div>
                  <Link href={`/admin/blog/editar/${post.id}`} className="text-sm font-medium text-purple-600 hover:text-purple-800">
                    Editar
                  </Link>
                </div>
              </div>
            )) : (
              <p className="p-6 text-gray-500">Nenhum post recente encontrado.</p>
            )}
          </div>
          <div className="border-t border-gray-200 px-6 py-4">
            <Link href="/admin/blog" className="text-sm font-medium text-purple-600 hover:text-purple-800">
              Ver todos os posts →
            </Link>
          </div>
        </div>
        
        {/* Comentários Pendentes Recentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-medium text-gray-900">Comentários Pendentes Recentes</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <p className="p-6 text-gray-500"></p>
            ) : recentPendingComments.length > 0 ? (
              recentPendingComments.map((comment) => (
                <div key={comment.id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-900 line-clamp-2"><strong className="font-medium">{comment.author.nome} {comment.author.sobrenome}</strong> comentou em <Link href={`/blog/${comment.post.slug}`} target="_blank" className="text-blue-600 hover:underline">{comment.post.titulo}</Link></p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{comment.conteudo}</p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <Link href="/admin/comentarios" className="text-xs font-medium text-purple-600 hover:text-purple-800">
                         Revisar
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-6 text-gray-500">Nenhum comentário pendente.</p>
            )}
          </div>
          <div className="border-t border-gray-200 px-6 py-4">
            <Link href="/admin/comentarios" className="text-sm font-medium text-purple-600 hover:text-purple-800">
              Gerenciar todos os comentários →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
