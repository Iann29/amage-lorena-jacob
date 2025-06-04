"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TestimonialCard from './TestimonialCard';

// Interface para os dados de depoimento
interface Testimonial {
  id: number;
  quote: string;
  name: string;
  avatarSrc?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
}) => {
  // Referência para saber se o componente foi montado
  const isMounted = useRef(false);
  
  // Estado para controlar o índice inicial dos depoimentos visíveis
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Estado para controlar se o cliente já foi hidratado
  const [isClient, setIsClient] = useState(false);
  
  // Estado para rastrear o tamanho da tela e itens visíveis
  const [displayConfig, setDisplayConfig] = useState({
    width: 0,
    itemsToShow: 3 // Começar com valor para desktop
  });
  
  // Marcar quando o componente estiver montado no cliente
  useEffect(() => {
    setIsClient(true);
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Determinar número de itens a exibir com base no tamanho da tela
  useEffect(() => {
    // Garantir que estamos executando apenas no cliente
    if (typeof window !== 'undefined' && isClient) {
      // Função para calcular e atualizar a configuração de exibição
      const updateDisplayConfig = () => {
        const width = window.innerWidth;
        let itemsToShow = 1; // Padrão para mobile
        
        if (width >= 1024) {
          itemsToShow = 3; // Desktop
        } else if (width >= 640) {
          itemsToShow = 2; // Tablet
        }
        
        setDisplayConfig({ width, itemsToShow });
      };
      
      // Atualizar imediatamente
      updateDisplayConfig();
      
      // Adicionar listener para resize
      window.addEventListener('resize', updateDisplayConfig);
      return () => window.removeEventListener('resize', updateDisplayConfig);
    }
  }, [isClient]);
  
  // Criar um array circular para facilitar a rotação dos itens
  // Usando useCallback para memoizar a função e evitar recriações desnecessárias
  const getCircularItems = useCallback(() => {
    const items = [...testimonials];
    const itemsToShow = isClient ? displayConfig.itemsToShow : 3; // Usar 3 por padrão até que o cliente seja hidratado
    
    // Garantir que temos itens suficientes para preencher a visualização
    if (items.length < itemsToShow) {
      return items;
    }
    
    // Criar uma visualização circular dos itens
    const visibleItems: Testimonial[] = [];
    
    for (let i = 0; i < itemsToShow; i++) {
      const index = (activeIndex + i) % testimonials.length;
      visibleItems.push(items[index]);
    }
    
    return visibleItems;
  }, [activeIndex, displayConfig.itemsToShow, testimonials, isClient]); // Adicionado isClient como dependência
  
  // Atualizar os itens visíveis quando o índice ativo muda ou quando a configuração de exibição muda
  const [visibleTestimonials, setVisibleTestimonials] = useState<Testimonial[]>([]);
  
  useEffect(() => {
    if (isClient) {
      setVisibleTestimonials(getCircularItems());
    }
  }, [activeIndex, displayConfig.itemsToShow, getCircularItems, isClient]);

  // Direção da animação (1 = direita, -1 = esquerda)
  const [direction, setDirection] = useState(0);

  // Funções para controlar a navegação
  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Variantes para animação de deslize fluida
  const slideVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };
  
  // Transição suave para o slide
  const swipeTransition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-12 overflow-hidden" style={{ minHeight: isClient && displayConfig.width < 640 ? '300px' : '420px' }}>
      {/* Seta esquerda em formato circular */}
      <div className={`absolute left-2 md:left-4 z-50 ${isClient && displayConfig.width < 640 ? 'top-[100px]' : 'top-[175px]'}`}>
        <button 
          className="bg-[#F5F5E7] hover:bg-[#e9e9cc] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 focus:outline-none"
          onClick={handlePrev}
          aria-label="Ver depoimentos anteriores"
        >
          <svg width="14" height="24" viewBox="0 0 24 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L2 22.5L22 43" stroke="#806D52" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Container do carrossel com deslizamento individual */}
      <div className="relative py-6 sm:py-8 md:py-10 flex flex-col items-center overflow-hidden" style={{ height: isClient && displayConfig.width < 640 ? '200px' : '350px' }}>
        {!isClient ? (
          // Mostrar placeholder ou esqueleto durante SSR
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 justify-items-center w-full h-full">
            {[...Array(3)].map((_, idx) => (
              <div key={`skeleton-${idx}`} className="w-full h-64 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <AnimatePresence initial={false} custom={direction}>
          <motion.div 
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={swipeTransition}
            className={`grid grid-cols-1 ${displayConfig.itemsToShow > 1 ? 'sm:grid-cols-2' : ''} ${displayConfig.itemsToShow > 2 ? 'lg:grid-cols-3' : ''} gap-3 sm:gap-4 lg:gap-6 justify-items-center w-full h-full absolute inset-0`}
          >
          {visibleTestimonials.map((testimonial, idx) => (
            <div
              key={`${testimonial.id}-${idx}`}
              className="w-full flex items-center justify-center"
            >
              <TestimonialCard 
                quote={testimonial.quote}
                name={testimonial.name}
                avatarSrc={testimonial.avatarSrc}
                isCompact={isClient && displayConfig.width < 640} // Passar flag para modo compacto
              />
            </div>
          ))}
        </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Seta direita em formato circular */}
      <div className={`absolute right-2 md:right-4 z-50 ${isClient && displayConfig.width < 640 ? 'top-[100px]' : 'top-[175px]'}`}>
        <button 
          className="bg-[#F5F5E7] hover:bg-[#e9e9cc] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 focus:outline-none"
          onClick={handleNext}
          aria-label="Ver próximos depoimentos"
        >
          <svg width="14" height="24" viewBox="0 0 24 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L22 22.5L2 43" stroke="#806D52" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Indicadores de posição */}
      {isClient && (
        <div className={`flex justify-center ${isClient && displayConfig.width < 640 ? 'mt-8' : 'mt-12 sm:mt-16 md:mt-20'} space-x-2 sm:space-x-3`}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > activeIndex ? 1 : -1);
              setActiveIndex(i);
            }}
            className={`h-2 sm:h-3 rounded-full transition-all ${
              // Verificar se este índice está dentro dos itens visíveis atuais
              Array.from({ length: displayConfig.itemsToShow }).some((_, offset) => 
                i === (activeIndex + offset) % testimonials.length
              )
              ? 'bg-white w-5 sm:w-6' : 'bg-white bg-opacity-50 w-2 sm:w-3'
            }`}
            aria-label={`Ir para depoimento ${i + 1}`}
          />
        ))}
      </div>
      )}
    </div>
  );
};

export default TestimonialsCarousel;
