"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import LikeButton from './LikeButton';

interface BlogPostCardProps {
  post: {
    id: number;
    titulo: string;
    slug: string;
    resumo: string;
    imagem_destaque_url: string;
    created_at: string;
    like_count: number;
    author: {
      id: number;
      nome: string;
    };
    categorias: {
      id: number;
      nome: string;
      slug: string;
    }[];
  };
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const [likes, setLikes] = useState(post.like_count);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48 w-full">
        {post.imagem_destaque_url ? (
          <Image 
            src={post.imagem_destaque_url} 
            alt={post.titulo} 
            fill
            style={{ objectFit: 'cover' }}
            className="bg-gray-100"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Sem imagem</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          {post.categorias && post.categorias.length > 0 && (
            <span className="text-sm text-blue-600 font-medium">
              {post.categorias[0].nome}
            </span>
          )}
          <span className="text-xs text-gray-500">{formatDate(post.created_at)}</span>
        </div>
        
        <h2 className="text-xl font-semibold mb-3 text-[#715B3F]">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-700 transition">
            {post.titulo}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.resumo}
        </p>
        
        <div className="flex justify-between items-center">
          <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
            Ler mais →
          </Link>
          
          <div className="flex items-center gap-2">
            <LikeButton itemId={post.id} itemType="post" initialLikeCount={post.like_count} />
          </div>
        </div>
      </div>
    </article>
  );
}
