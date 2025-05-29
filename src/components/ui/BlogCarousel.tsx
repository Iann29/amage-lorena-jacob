"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogPostCard from './BlogPostCard';

// Interface para os dados do post do blog
interface BlogPost {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  postUrl: string;
  viewCount: number;
  commentCount: number;
}

interface BlogCarouselProps {
  posts: BlogPost[];
  postsPerPage?: number;
}

const BlogCarousel: React.FC<BlogCarouselProps> = ({
  posts,
  postsPerPage = 3
}) => {
  // Estado para controlar qual página de posts está sendo exibida
  const [currentPage, setCurrentPage] = useState(0);
  
  // Calculando o número total de páginas
  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  // Posts a serem exibidos na página atual
  const currentPosts = posts.slice(
    currentPage * postsPerPage, 
    (currentPage * postsPerPage) + postsPerPage
  );

  // Função para ir para a próxima página
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  // Função para ir para a página anterior
  const prevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  // Variantes para animação de deslize
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  // Direção da animação (1 = direita, -1 = esquerda)
  const [direction, setDirection] = useState(0);

  // Funções para controlar a navegação com direção
  const handleNext = () => {
    setDirection(1);
    nextPage();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevPage();
  };

  // Determinar classes dinâmicas para o layout do grid
  const numCurrentPosts = currentPosts.length;
  let motionDivClassName = "grid grid-cols-1 gap-8 mx-auto h-full"; // Base para mobile e outras props

  if (numCurrentPosts === 1) {
    motionDivClassName += " md:grid-cols-1 md:justify-items-center";
  } else if (numCurrentPosts === 2) {
    motionDivClassName += " md:grid-cols-2";
  } else { // Default para 3 posts (considerando postsPerPage = 3)
    motionDivClassName += " md:grid-cols-3";
  }

  return (
    <div className="relative max-w-6xl mx-auto px-12 overflow-visible">
      {/* Seta esquerda em formato circular */}
      <div className="absolute left-2 top-[185px] md:top-1/2 transform md:-translate-y-1/2 -translate-y-[50%] z-50">
        <button 
          className="bg-[#F5F5E7] hover:bg-[#e9e9cc] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 focus:outline-none"
          onClick={handlePrev}
          aria-label="Ver posts anteriores"
        >
          <svg width="14" height="24" viewBox="0 0 24 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L2 22.5L22 43" stroke="#806D52" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Container do carrossel com altura fixa para evitar saltos */}
      <div className="relative pb-12 md:pb-6 pt-6 px-4 h-[380px] md:h-[520px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div 
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className={motionDivClassName}
          >
            {currentPosts.map((post) => (
              <BlogPostCard 
                key={post.id}
                title={post.title}
                summary={post.summary}
                imageUrl={post.imageUrl}
                postUrl={post.postUrl}
                viewCount={post.viewCount}
                commentCount={post.commentCount}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Seta direita em formato circular */}
      <div className="absolute right-2 top-[185px] md:top-1/2 transform md:-translate-y-1/2 -translate-y-[50%] z-50">
        <button 
          className="bg-[#F5F5E7] hover:bg-[#e9e9cc] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 focus:outline-none"
          onClick={handleNext}
          aria-label="Ver próximos posts"
        >
          <svg width="14" height="24" viewBox="0 0 24 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L22 22.5L2 43" stroke="#806D52" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Indicadores de página (opcional) */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentPage ? 1 : -1);
                setCurrentPage(i);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentPage ? 'bg-[#806D52] w-4' : 'bg-gray-300'
              }`}
              aria-label={`Ir para página ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogCarousel;
