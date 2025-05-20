"use client";

import Image from 'next/image';
import LikeButton from './LikeButton';
import type { CommentData } from './CommentSection';

interface CommentItemProps {
  comment: CommentData;
  onSetReplyTo: (commentId: string, userName: string) => void;
  currentUserId: string | null;
}

export default function CommentItem({ comment, onSetReplyTo, currentUserId }: CommentItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const canReply = !!currentUserId;

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {comment.user.avatar_url ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#715B3F]">
              <Image 
                src={comment.user.avatar_url} 
                alt={comment.user.nome} 
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#F5F0E6] flex items-center justify-center text-lg font-medium border-2 border-[#715B3F]">
              <span className="text-[#715B3F] uppercase">
                {comment.user.nome?.charAt(0) || 'U'}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h4 className="text-[#2C3E50] font-bold text-lg">{comment.user.nome || 'Usuário Anônimo'}</h4>
            <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
          </div>
          
          <p className="text-gray-700 mb-3 whitespace-pre-wrap leading-relaxed">
            {comment.conteudo}
          </p>
          
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div>
              {canReply && (
                <button 
                  onClick={() => onSetReplyTo(comment.id, comment.user.nome)}
                  className="text-sm text-[#715B3F] hover:text-[#5a4a32] font-medium py-1 px-3 rounded-full hover:bg-[#F5F0E6] transition-colors"
                >
                  Responder
                </button>
              )}
            </div>
            <div className="flex items-center">
              <LikeButton 
                itemId={comment.id}
                itemType="comment" 
                initialLikeCount={comment.like_count} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 ml-4 pl-4 border-l-2 border-[#F5F0E6]">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              onSetReplyTo={onSetReplyTo} 
              currentUserId={currentUserId} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
