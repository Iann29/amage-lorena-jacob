'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/loja-api';
import { useUser } from '@/hooks/useUser';
import { lojaApi } from '@/lib/loja-api';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    // TODO: Implementar salvamento de favoritos no banco
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Você precisa fazer login para adicionar produtos ao carrinho');
      router.push('/login');
      return;
    }

    setIsAddingToCart(true);
    try {
      // TODO: Implementar quando tivermos a função addToCart
      if (onAddToCart) {
        onAddToCart(product);
      }
      alert('Produto adicionado ao carrinho!');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Erro ao adicionar produto ao carrinho');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const hasDiscount = product.preco_promocional && product.preco_promocional < product.preco;
  const currentPrice = product.preco_promocional || product.preco;
  const primaryImage = product.imagem_principal || 
                      product.images?.find(img => img.is_primary)?.image_url || 
                      product.images?.[0]?.image_url || 
                      '/placeholder.jpg';

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-black/60 w-[280px] h-[400px] flex flex-col">
      <div className="relative p-4 pb-0 flex-shrink-0">
        <Link href={`/loja/produto/${product.slug}`}>
          <div className="relative h-48 overflow-hidden rounded-lg">
            <Image
              src={!imageError ? primaryImage : '/placeholder.jpg'}
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
      
      {/* Linha divisória */}
      <div className="border-b border-black/60"></div>

      <div className="px-4 pb-4 flex-1 flex flex-col">
        <Link href={`/loja/produto/${product.slug}`}>
          <h3 
            className="text-center font-bold text-base mb-2 line-clamp-2 hover:text-[#5179C8] transition-colors h-[48px] flex items-center justify-center"
            style={{ color: '#5179C8', fontFamily: 'var(--font-museo-sans)' }}
          >
            {product.nome}
          </h3>
        </Link>
        
        <div className="text-center mt-2 mb-auto">
          {hasDiscount && (
            <div className="text-sm text-gray-500 line-through" style={{ fontFamily: 'var(--font-museo-sans)' }}>
              R$ {product.preco.toFixed(2).replace('.', ',')}
            </div>
          )}
          <div className="font-bold text-xl text-black" style={{ fontFamily: 'var(--font-museo-sans)' }}>
            R$ {currentPrice.toFixed(2).replace('.', ',')}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {product.quantidade_estoque > 0 ? (
              product.quantidade_estoque <= 5 ? (
                <span className="text-orange-500">Últimas {product.quantidade_estoque} unidades!</span>
              ) : (
                'Em estoque'
              )
            ) : (
              <span className="text-red-500">Produto esgotado</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/loja/produto/${product.slug}`}
            className="flex-1 text-center py-2 px-3 rounded-md text-white text-sm font-medium transition-all hover:opacity-90 hover:scale-105"
            style={{ 
              backgroundColor: '#0048C5',
              fontFamily: 'var(--font-museo-sans)'
            }}
          >
            Ver Mais
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={product.quantidade_estoque === 0 || isAddingToCart}
            className={`px-3 py-2 rounded-md text-white transition-all hover:opacity-90 hover:scale-105 flex items-center justify-center ${
              product.quantidade_estoque === 0 || isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: product.quantidade_estoque === 0 ? '#ccc' : '#4CAF50' }}
            aria-label="Adicionar ao carrinho"
          >
            {isAddingToCart ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="white"/>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="white"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}