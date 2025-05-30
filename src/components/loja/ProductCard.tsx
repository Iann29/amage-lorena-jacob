'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/lib/mockDataLoja';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const price = product.preco_promocional || product.preco;
  const hasDiscount = !!product.preco_promocional;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-black/60 w-[280px] h-[400px] mx-auto flex flex-col">
      <div className="relative p-4 flex-shrink-0">
        <Link href={`/loja/produto/${product.slug}`}>
          <div className="relative h-48 overflow-hidden rounded-lg">
            <Image
              src={!imageError ? (product.imagens[0]?.image_url || '/placeholder.jpg') : '/placeholder.jpg'}
              alt={product.nome}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          </div>
        </Link>
        
        {/* Botão de like */}
        <button 
          onClick={handleLikeClick}
          className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 flex items-center justify-center"
          aria-label={isLiked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Image
            src={isLiked ? "/assets/like.png" : "/assets/likeVazio.png"}
            alt="Favoritar"
            width={20}
            height={20}
          />
        </button>
      </div>

      <div className="px-4 pb-4 flex-1 flex flex-col">
        <Link href={`/loja/produto/${product.slug}`}>
          <h3 
            className="text-center font-bold text-base mb-2 line-clamp-2 hover:text-[#5179C8] transition-colors h-[48px] flex items-center justify-center"
            style={{ color: '#5179C8', fontFamily: 'var(--font-museo-sans)' }}
          >
            {product.nome}
          </h3>
        </Link>
        
        <div className="mt-auto">
        <div className="text-center mb-3">
          {hasDiscount && (
            <span className="text-gray-400 line-through text-sm mr-2">
              R$ {product.preco.toFixed(2).replace('.', ',')}
            </span>
          )}
          <div className="font-bold text-xl" style={{ fontFamily: 'var(--font-museo-sans)' }}>
            R$ {price.toFixed(2).replace('.', ',')}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/loja/produto/${product.slug}`}
            className="flex-1 text-center py-2 px-3 rounded-md text-white text-sm font-medium transition-all hover:opacity-90 hover:scale-105"
            style={{ 
              backgroundColor: '#5179C8',
              fontFamily: 'var(--font-museo-sans)'
            }}
          >
            Ver Mais
          </Link>
          <button
            onClick={handleAddToCart}
            className="px-3 py-2 rounded-md text-white transition-all hover:opacity-90 hover:scale-105 flex items-center justify-center"
            style={{ backgroundColor: '#4CAF50' }}
            aria-label="Adicionar ao carrinho"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="white"/>
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="white"/>
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}