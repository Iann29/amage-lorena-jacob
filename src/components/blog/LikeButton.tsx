"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  togglePostLike,
  getPostLikeStatus,
  toggleCommentLike,
  getCommentLikeStatus
} from '@/app/likes/actions';
import { useUser } from '../../hooks/useUser';

interface LikeButtonProps {
  itemId: string; // UUID no banco de dados
  itemType: 'post' | 'comment';
  initialLikeCount: number;
  initialLikeState?: boolean; // Estado inicial de like (vindo da consulta em lote)
  // Adicionar uma prop para o slug do post pode ser útil para revalidação se necessário no futuro
  // postSlug?: string; 
}

export default function LikeButton({ itemId, itemType, initialLikeCount, initialLikeState }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialLikeState || false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialStateLoaded, setInitialStateLoaded] = useState(!!initialLikeState);
  
  // Verificar se o usuário está autenticado
  const { user, isLoading: authLoading } = useUser();

  useEffect(() => {
    let isMounted = true;

    // Se já temos o estado inicial de like através da prop, não precisamos fazer a requisição
    if (initialLikeState !== undefined) {
      return;
    }
    
    const fetchInitialStatus = async () => {
      // Não fazer requisição se ainda estiver carregando o estado de autenticação
      if (authLoading) return;
      
      // Se não há usuário autenticado, não precisamos fazer a requisição
      if (!user) {
        if (isMounted) {
          setIsLiked(false);
          setLikes(initialLikeCount);
          setInitialStateLoaded(true);
          setIsLoading(false);
        }
        return;
      }
      
      setIsLoading(true);
      try {
        let response;
        if (itemType === 'post') {
          response = await getPostLikeStatus(itemId);
        } else if (itemType === 'comment') {
          response = await getCommentLikeStatus(itemId);
        } else {
          if (isMounted) setInitialStateLoaded(true);
          return; // Tipo de item não suportado
        }

        if (isMounted && response.success) {
          setIsLiked(response.isLiked ?? false);
          setLikes(response.likeCount ?? initialLikeCount);
        } else if (isMounted && !response.success) {
          console.warn(`Falha ao buscar estado inicial do like para ${itemType} ${itemId}:`, response.message);
          setIsLiked(false);
          setLikes(initialLikeCount);
        }
      } catch (error) {
        if (isMounted) {
          console.error(`Erro ao buscar estado inicial do like para ${itemType} ${itemId}:`, error);
          setIsLiked(false);
          setLikes(initialLikeCount);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setInitialStateLoaded(true);
        }
      }
    };

    fetchInitialStatus();

    return () => {
      isMounted = false;
    };
  }, [itemId, itemType, initialLikeCount, initialLikeState, user, authLoading]);

  const handleLike = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading || !initialStateLoaded || !user) {
      if (!user) {
        // Poderia redirecionar para login ou mostrar um aviso
        console.log('Usuário precisa estar logado para curtir');
      }
      return;
    }

    setIsLoading(true);

    const previousIsLiked = isLiked;
    const previousLikes = likes;
    setIsLiked(!isLiked);
    setLikes(prevLikes => isLiked ? Math.max(0, prevLikes - 1) : prevLikes + 1); // Garante que não seja < 0

    try {
      let response;
      if (itemType === 'post') {
        response = await togglePostLike(itemId);
      } else if (itemType === 'comment') {
        response = await toggleCommentLike(itemId);
      } else {
        throw new Error("Tipo de item não suportado para like.");
      }

      if (response.success) {
        setIsLiked(response.liked ?? previousIsLiked);
        setLikes(response.likeCount ?? previousLikes);
      } else {
        console.error(`Falha ao curtir/descurtir ${itemType}:`, response.message);
        setIsLiked(previousIsLiked);
        setLikes(previousLikes);
      }
    } catch (error: unknown) {
      let errorMessage = `Erro ao curtir/descurtir ${itemType}.`;
      if (error instanceof Error) {
        errorMessage = `Erro ao curtir/descurtir ${itemType}: ${error.message}`;
      }
      console.error(errorMessage, error);
      setIsLiked(previousIsLiked);
      setLikes(previousLikes);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, initialStateLoaded, itemType, itemId, isLiked, likes]);

  if (!initialStateLoaded) {
    return (
      <div
        className="flex items-center justify-center gap-1 p-1.5 opacity-50"
        aria-label="Carregando status do like..."
      >
        <Image
          src={"/assets/likeVazio.png"}
          alt={"Carregando"}
          width={26}
          height={26}
        />
        <span className="text-sm font-medium text-black">{initialLikeCount}</span>
      </div>
    );
  }
  
  // Se o itemType não for 'post' ou 'comment', não renderiza nada.
  // Isso pode ser ajustado se outros tipos forem suportados no futuro.
  if (itemType !== 'post' && itemType !== 'comment') {
      return null;
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading || !initialStateLoaded}
      className="flex items-center justify-center gap-1 transition-all hover:scale-110 p-1.5"
      aria-label={isLiked ? (itemType === 'post' ? "Remover curtida do post" : "Remover curtida do comentário") 
                          : (itemType === 'post' ? "Curtir post" : "Curtir comentário")}
    >
      <Image
        src={isLiked ? "/assets/like.png" : "/assets/likeVazio.png"}
        alt={isLiked ? "Curtido" : "Curtir"}
        width={26}
        height={26}
        className="transition-all"
      />
      <span className="text-sm font-medium">{likes}</span>
    </button>
  );
}