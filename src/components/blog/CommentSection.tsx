"use client";

import { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import Image from 'next/image';
import { submitNewComment } from '@/app/comments/actions';

// Interface para os dados de um usuário de comentário (simplificada)
// No futuro, isso pode vir do seu contexto de autenticação ou de uma query de usuário
export interface CommentUser {
  id: string; // ou number, dependendo do schema original do mock, mas user.id do Supabase é UUID (string)
  nome: string;
  avatar_url?: string | null;
}

// Interface para um comentário, ajustada para IDs string e parentId opcional
export interface CommentData {
  id: string; // UUID
  conteudo: string;
  created_at: string;
  like_count: number;
  user: CommentUser; // Usando a interface acima
  post_id: string; // Adicionado, para consistência
  parent_comment_id?: string | null;
  replies?: CommentData[]; // Para comentários aninhados
}

interface CommentSectionProps {
  postId: string; // Alterado para string (UUID)
  comments: CommentData[]; // Usando a nova interface CommentData
  currentUser: CommentUser | null; // Adicionar prop para usuário logado
}

export default function CommentSection({ postId, comments, currentUser }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyingToUserName, setReplyingToUserName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Efeito para limpar a mensagem do formulário após um tempo
  useEffect(() => {
    if (formMessage) {
      const timer = setTimeout(() => {
        setFormMessage(null);
      }, 5000); // Limpa após 5 segundos
      return () => clearTimeout(timer);
    }
  }, [formMessage]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setIsSubmitting(true);
    setFormMessage(null);

    const response = await submitNewComment(postId, newComment, replyingToCommentId);

    setIsSubmitting(false);

    if (response.success) {
      setFormMessage({ type: 'success', text: response.message || 'Comentário enviado! Aguardando aprovação.' });
      setNewComment('');
      setReplyingToCommentId(null);
      setReplyingToUserName(null);
      // Aqui você pode querer adicionar o novo comentário à lista localmente (com status pendente)
      // ou revalidar/refetch os comentários. Por enquanto, apenas limpamos o formulário.
    } else {
      setFormMessage({ type: 'error', text: response.message || 'Falha ao enviar comentário.' });
    }
  };

  const handleSetReplyTo = (commentId: string, userName: string) => {
    setReplyingToCommentId(commentId);
    setReplyingToUserName(userName);
    // Opcional: focar no textarea
    document.getElementById('comment-textarea')?.focus();
  };

  const cancelReply = () => {
    setReplyingToCommentId(null);
    setReplyingToUserName(null);
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold text-[#715B3F] mb-6">Comentários</h2>
      
      {currentUser ? (
        <form onSubmit={handleCommentSubmit} className="mb-8 p-6 bg-stone-50 rounded-xl shadow">
          {replyingToCommentId && (
            <div className="mb-3 text-sm text-gray-600">
              Respondendo a <strong className="text-gray-800">{replyingToUserName || 'Comentário'}</strong>
              <button type="button" onClick={cancelReply} className="ml-2 text-blue-500 hover:text-blue-700 text-xs">
                (Cancelar)
              </button>
            </div>
          )}
          <textarea
            id="comment-textarea"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyingToCommentId ? 'Escreva sua resposta...' : 'Escreva seu comentário...'}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px] disabled:bg-gray-100"
            required
            disabled={isSubmitting}
          />
          <div className="flex justify-end items-center mt-3">
            {formMessage && (
              <span className={`text-sm mr-4 ${formMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {formMessage.text}
              </span>
            )}
            <button 
              type="submit"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-150"
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? 'Enviando...' : (replyingToCommentId ? 'Enviar Resposta' : 'Enviar Comentário')}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 bg-blue-50 p-6 rounded-xl text-center shadow">
          <div className="flex items-center justify-center gap-2">
            <Image src="/assets/configIcon.png" alt="Comentar" width={24} height={24} />
            <h3 className="text-xl font-medium text-gray-800">Quer comentar?</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1 mb-4">
            Você precisa estar logado para deixar um comentário.
          </p>
          {/* Aqui você colocaria seus botões de login reais */}
          {/* Exemplo:
          <button 
            className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2 hover:bg-gray-50 mx-auto"
            // onClick={handleLoginMock} // Substituir por sua lógica de login real
          >
            <Image src="/logos/google-logo.png" alt="Google" width={20} height={20} />
            Entrar com a Conta Google
          </button> */}
           <p className="text-xs text-gray-500">(Botões de login seriam colocados aqui)</p>
        </div>
      )}
      
      <div>
        {comments && comments.length > 0 ? (
          <div>
            {/* <h3 className="text-xl font-medium text-[#715B3F] mb-4">Comentários</h3> */}
            <div className="space-y-1">
              {comments.map(comment => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  onSetReplyTo={handleSetReplyTo} 
                  currentUserId={currentUser?.id || null}
                />
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
