"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogPosts, blogComments, blogCategorias } from '@/lib/mockData';

export default function AdminDashboardPage() {
  // Dados mockados para o dashboard
  const totalPosts = blogPosts.length;
  const totalComentarios = blogComments.length;
  const totalCategorias = blogCategorias.length;
  const postsRecentes = blogPosts.slice(0, 5);
  const comentariosRecentes = blogComments.slice(0, 5);
  
  // Estatísticas mockadas
  const [estatisticas, setEstatisticas] = useState({
    visualizacoesTotal: 0,
    likesTotal: 0,
    mediaComentariosPorPost: 0
  });
  
  useEffect(() => {
    // Cálculo das estatísticas com base nos dados mockados
    const visualizacoesTotal = blogPosts.reduce((sum, post) => sum + (post.visualizacoes || 0), 0);
    const likesTotal = blogPosts.reduce((sum, post) => sum + (post.like_count || 0), 0);
    const mediaComentariosPorPost = totalPosts > 0 ? (totalComentarios / totalPosts).toFixed(1) : 0;
    
    setEstatisticas({
      visualizacoesTotal,
      likesTotal,
      mediaComentariosPorPost: Number(mediaComentariosPorPost)
    });
  }, [totalPosts, totalComentarios]);

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
              <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
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
              <p className="text-2xl font-bold text-gray-900">{estatisticas.visualizacoesTotal}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">Últimos 30 dias</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Curtidas</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.likesTotal}</p>
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
              <p className="text-sm font-medium text-gray-500">Comentários</p>
              <p className="text-2xl font-bold text-gray-900">{totalComentarios}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">{estatisticas.mediaComentariosPorPost} por post</span>
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
            {postsRecentes.map((post) => (
              <div key={post.id} className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{post.titulo}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')} • {post.visualizacoes} visualizações
                    </p>
                  </div>
                  <Link href={`/admin/blog/editar/${post.id}`} className="text-sm font-medium text-purple-600 hover:text-purple-800">
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 px-6 py-4">
            <Link href="/admin/blog" className="text-sm font-medium text-purple-600 hover:text-purple-800">
              Ver todos os posts →
            </Link>
          </div>
        </div>
        
        {/* Comentários recentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-medium text-gray-900">Comentários Recentes</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {comentariosRecentes.map((comment) => (
              <div key={comment.id} className="px-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-900 line-clamp-1">{comment.texto}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-xs font-medium text-gray-900">{comment.autor_nome}</p>
                      <span className="mx-1 text-xs text-gray-500">•</span>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-xs font-medium text-green-600 hover:text-green-800">
                      Aprovar
                    </button>
                    <button className="text-xs font-medium text-red-600 hover:text-red-800">
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 px-6 py-4">
            <Link href="/admin/comentarios" className="text-sm font-medium text-purple-600 hover:text-purple-800">
              Gerenciar comentários →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Atividades recentes (mockadas) */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-medium text-gray-900">Atividades Recentes</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4 flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-900">
                Novo post <span className="font-medium">A importância de dizer não</span> foi publicado
              </p>
              <p className="text-xs text-gray-500 mt-1">há 2 dias atrás</p>
            </div>
          </div>
          
          <div className="px-6 py-4 flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-900">
                5 novos comentários foram aprovados
              </p>
              <p className="text-xs text-gray-500 mt-1">há 3 dias atrás</p>
            </div>
          </div>
          
          <div className="px-6 py-4 flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-900">
                O post <span className="font-medium">Estratégias para lidar com hiperatividade em casa</span> foi atualizado
              </p>
              <p className="text-xs text-gray-500 mt-1">há 5 dias atrás</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
