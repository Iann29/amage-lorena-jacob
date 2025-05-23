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
  sobrenome?: string | null;
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
    <div className="space-y-6">
      {/* Formulário de comentário */}
      {currentUser && (
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#8A6642] mb-4">{replyingToCommentId ? 'Responder comentário' : 'Deixe seu comentário'}</h3>
          
          {replyingToCommentId && (
            <div className="mb-3 text-sm bg-[#F8F5F0] text-[#8A6642] p-2 rounded-md inline-flex items-center">
              <span>Respondendo a <strong>{replyingToUserName || 'Comentário'}</strong></span>
              <button 
                type="button" 
                onClick={cancelReply} 
                className="ml-2 text-[#8A6642] hover:text-[#5a4a32] text-xs font-medium"
              >
                (Cancelar)
              </button>
            </div>
          )}
          
          <form onSubmit={handleCommentSubmit}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {currentUser.avatar_url ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-purple-300">
                    <Image 
                      src={currentUser.avatar_url} 
                      alt={currentUser.nome} 
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-lg font-medium border border-purple-300">
                    <span className="text-purple-700 uppercase">
                      {/* Usando a mesma lógica de iniciais do hook useUser */}
                      {(() => {
                        const nome = currentUser.nome || '';
                        const sobrenome = currentUser.sobrenome || '';
                        
                        // Lógica idêntica ao hook useUser
                        const baseIniciais = (nome.charAt(0) + (sobrenome ? sobrenome.charAt(0) : '')).toUpperCase();
                        return baseIniciais.trim() ? baseIniciais : 'U';
                      })()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-grow space-y-3">
                <div className="relative">
                  <textarea
                    id="comment-textarea"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={replyingToCommentId ? 'Escreva sua resposta...' : 'Digite sua mensagem'}
                    className="w-full p-4 border border-[#D0D0D0] rounded-lg min-h-[120px] resize-none placeholder:text-gray-600 text-gray-800"
                    required
                    disabled={isSubmitting}
                    rows={3}
                    style={{
                      boxShadow: 'none',
                      outline: 'none',
                      transition: 'all 0.2s ease-in-out',
                      color: '#333333',
                      fontWeight: '400'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#79B9DC';
                      e.target.style.borderWidth = '2px';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#D0D0D0';
                      e.target.style.borderWidth = '1px';
                    }}
                  />
                </div>
            
                <div className="flex items-center justify-end">
                  {formMessage && (
                    <div className={`text-sm mr-3 ${formMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {formMessage.text}
                    </div>
                  )}
                  <button 
                    type="submit"
                    className="bg-[#61ADDB] hover:bg-[#4A95C5] text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap flex items-center"
                    style={{
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                    disabled={isSubmitting || !newComment.trim()}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      <>
                        <span>Enviar</span>
                        <svg className="ml-1.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Lista de comentários */}
      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          <>
            <h3 className="text-xl font-bold text-[#2C3E50] mb-2">
              {comments.length} {comments.length === 1 ? 'Comentário' : 'Comentários'}
            </h3>
            <div className="space-y-4">
              {comments.map(comment => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  onSetReplyTo={handleSetReplyTo} 
                  currentUserId={currentUser?.id || null}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum comentário ainda</h3>
            <p className="mt-1 text-gray-500">
              {currentUser 
                ? 'Seja o primeiro a deixar um comentário!' 
                : 'Faça login para deixar um comentário.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
