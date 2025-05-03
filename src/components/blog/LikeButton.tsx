"use client";

import { useState } from 'react';
import Image from 'next/image';

interface LikeButtonProps {
  itemId: number;
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
      className="flex items-center gap-1 transition-all hover:scale-110"
    >
      <Image
        src={isLiked ? "/assets/like.png" : "/assets/likeVazio.png"}
        alt={isLiked ? "Curtido" : "Curtir"}
        width={20}
        height={20}
        className="transition-all"
      />
    </button>
  );
}