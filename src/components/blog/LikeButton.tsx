"use client";

import Image from 'next/image';
import { useState } from 'react';

interface LikeButtonProps {
  itemId: number;
  itemType: 'post' | 'comment';
  initialLikeCount: number;
}

export default function LikeButton({ itemId, itemType, initialLikeCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLike = () => {
    // Toggle o estado de liked
    setLiked(!liked);
    
    // Atualiza a contagem de likes
    setLikeCount(prevCount => (liked ? prevCount - 1 : prevCount + 1));
    
    // Aqui eventualmente irá a lógica para salvar o like no backend
    // Por enquanto apenas mockado
    console.log(`${liked ? 'Removeu' : 'Adicionou'} like ao ${itemType} com ID: ${itemId}`);
  };

  return (
    <button 
      onClick={handleLike}
      className="flex items-center gap-1 focus:outline-none"
      aria-label={liked ? 'Remover curtida' : 'Curtir'}
    >
      <Image 
        src={liked ? '/assets/like.png' : '/assets/likeVazio.png'} 
        alt={liked ? 'Curtido' : 'Curtir'} 
        width={20} 
        height={20}
      />
      <span className="text-sm text-gray-600">{likeCount}</span>
    </button>
  );
}
