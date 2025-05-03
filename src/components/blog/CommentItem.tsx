"use client";

import Image from 'next/image';
import { useState } from 'react';
import LikeButton from './LikeButton';

interface CommentItemProps {
  comment: {
    id: number;
    conteudo: string;
    created_at: string;
    like_count: number;
    user: {
      id: number;
      nome: string;
      avatar_url?: string;
    };
  }
}

export default function CommentItem({ comment }: CommentItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="border-b border-gray-100 py-4">
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
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 uppercase">
                {comment.user.nome.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-[#715B3F]">{comment.user.nome}</h4>
            <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
          </div>
          
          <p className="text-gray-700 mb-2">
            {comment.conteudo}
          </p>
          
          <div className="flex justify-end">
            <LikeButton itemId={comment.id} itemType="comment" initialLikeCount={comment.like_count} />
          </div>
        </div>
      </div>
    </div>
  );
}
