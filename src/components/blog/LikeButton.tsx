"use client";

import { useState } from 'react';
import Image from 'next/image';

interface LikeButtonProps {
  itemId: string; // UUID no banco de dados
  itemType: 'post' | 'comment';
  initialLikeCount: number;
}

export default function LikeButton({ itemId, itemType, initialLikeCount }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/likes/${itemType}/${itemId}`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likeCount);
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error('Erro ao curtir:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className="flex items-center justify-center gap-1 transition-all hover:scale-110 p-1.5"
      aria-label={isLiked ? "Remover curtida" : "Curtir"}
    >
      <Image
        src={isLiked ? "/assets/like.svg" : "/assets/likeVazio.svg"}
        alt={isLiked ? "Curtido" : "Curtir"}
        width={26}
        height={26}
        className="transition-all"
      />
    </button>
  );
}