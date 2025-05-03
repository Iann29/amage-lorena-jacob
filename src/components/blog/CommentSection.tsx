"use client";

import { useState } from 'react';
import CommentItem from './CommentItem';
import Image from 'next/image';

interface CommentSectionProps {
  postId: number;
  comments: {
    id: number;
    conteudo: string;
    created_at: string;
    like_count: number;
    user: {
      id: number;
      nome: string;
      avatar_url?: string;
    };
  }[];
}

export default function CommentSection({ postId, comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mockado, no futuro virá do contexto de auth

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    // Aqui eventualmente irá a lógica para salvar o comentário no backend
    // Por enquanto apenas mockado
    console.log('Novo comentário:', newComment, 'para o post:', postId);
    
    // Limpa o campo após envio
    setNewComment('');
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold text-[#715B3F] mb-6">Comentários</h2>
      
      {/* Formulário de comentário */}
      <div className="mb-8 bg-blue-50 p-6 rounded-xl">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2">
            <Image 
              src="/assets/configIcon.png" 
              alt="Comentar" 
              width={24} 
              height={24} 
            />
            <h3 className="text-xl font-medium">Quer comentar?</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Entre com sua conta Google ou Conecte-se
          </p>
        </div>
        
        <div className="flex justify-center gap-4 mb-4">
          <button 
            className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2 hover:bg-gray-50"
            onClick={() => setIsLoggedIn(true)}
          >
            <Image 
              src="/logos/google-logo.png" 
              alt="Google" 
              width={20} 
              height={20} 
            />
            Entrar com a Conta Google
          </button>
          
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => setIsLoggedIn(true)}
          >
            Já tenho conta
          </button>
        </div>
        
        {isLoggedIn && (
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva seu comentário..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
              required
            />
            <div className="flex justify-end mt-2">
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Enviar Comentário
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* Lista de comentários */}
      <div>
        {comments.length > 0 ? (
          <div>
            <h3 className="text-xl font-medium text-[#715B3F] mb-4">Comentários</h3>
            <div className="space-y-1">
              {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Seja o primeiro a deixar um comentário!
          </p>
        )}
      </div>
    </section>
  );
}
