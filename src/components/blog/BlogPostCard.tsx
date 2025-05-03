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
    view_count?: number;
    comment_count?: number;
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

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-56 w-full">
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
              <div className="w-full h-full bg-gray-300"></div>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-3 text-[#7AC5E3]">
          <Link href={`/blog/${post.slug}`} className="hover:opacity-80 transition">
            {post.titulo}
          </Link>
        </h2>
        
        <p className="text-gray-700 mb-6 text-base leading-relaxed">
          {post.resumo}
        </p>
        
        <div className="flex justify-between items-center pt-4 border-t-4 border-gray-200">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{post.view_count || '2'} visualizações</span>
            <span>{post.comment_count || '1'} comentário</span>
          </div>
          
          <LikeButton 
            itemId={post.id} 
            itemType="post" 
            initialLikeCount={post.like_count} 
          />
        </div>
      </div>
    </article>
  );
}