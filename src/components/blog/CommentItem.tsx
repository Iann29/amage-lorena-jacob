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
    <div className="border-b border-gray-100 py-4 last:border-b-0">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {comment.user.avatar_url ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image 
                src={comment.user.avatar_url} 
                alt={comment.user.nome} 
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm">
              <span className="text-gray-500 uppercase">
                {comment.user.nome?.charAt(0) || 'U'}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-semibold text-[#715B3F]">{comment.user.nome || 'Usuário Anônimo'}</h4>
            <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
          </div>
          
          <p className="text-gray-700 mb-2 whitespace-pre-wrap">
            {comment.conteudo}
          </p>
          
          <div className="flex items-center justify-end gap-3 mt-2">
            {canReply && (
              <button 
                onClick={() => onSetReplyTo(comment.id, comment.user.nome)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium py-1 px-2 rounded hover:bg-blue-50 transition-colors"
              >
                Responder
              </button>
            )}
            <LikeButton 
              itemId={comment.id}
              itemType="comment" 
              initialLikeCount={comment.like_count} 
            />
          </div>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-3 pl-4 border-l-2 border-gray-200">
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
