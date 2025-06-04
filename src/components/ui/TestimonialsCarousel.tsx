"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsToShow = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, testimonials.length - itemsToShow);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => {
      const next = prev + 1;
      return next > maxIndex ? 0 : next;
    });
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => {
      const next = prev - 1;
      return next < 0 ? maxIndex : next;
    });
  }, [maxIndex]);

  // Obter os depoimentos visíveis baseado no índice atual
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  if (!isClient) {
    return (
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-12" style={{ minHeight: '420px' }}>
        <div className="flex justify-center items-center h-[350px]">
          <div className="text-white">Carregando depoimentos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-12" style={{ minHeight: isMobile ? '200px' : '280px' }}>
      {/* Seta esquerda */}
      <button 
        className={`absolute left-2 md:left-4 z-50 bg-[#F5F5E7] hover:bg-[#e9e9cc] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 focus:outline-none`}
        style={{ 
          top: isMobile ? '40%' : '35%',
          transform: 'translateY(-50%)'
        }}
        onClick={prevSlide}
        aria-label="Ver depoimentos anteriores"
      >
        <svg width="14" height="24" viewBox="0 0 24 45" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L2 22.5L22 43" stroke="#806D52" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Container do carrossel */}
      <div className="overflow-hidden py-3 sm:py-4 md:py-6 relative">
        <motion.div 
          className="flex"
          animate={{ x: `${-currentIndex * (100 / itemsToShow)}%` }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }}
        >
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial.id}
              className={`${isMobile ? 'w-full' : 'w-1/3'} px-3 flex-shrink-0`}
            >
              <TestimonialCard 
                quote={testimonial.quote}
                name={testimonial.name}
                avatarSrc={testimonial.avatarSrc}
                isCompact={isMobile}
              />
            </div>
          ))}
          {/* Duplicar os primeiros itens para criar loop infinito visual */}
          {!isMobile && itemsToShow > 1 && testimonials.slice(0, itemsToShow).map((testimonial, idx) => (
            <div
              key={`duplicate-${testimonial.id}`}
              className="w-1/3 px-3 flex-shrink-0"
            >
              <TestimonialCard 
                quote={testimonial.quote}
                name={testimonial.name}
                avatarSrc={testimonial.avatarSrc}
                isCompact={false}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Seta direita */}
      <button 
        className={`absolute right-2 md:right-4 z-50 bg-[#F5F5E7] hover:bg-[#e9e9cc] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 focus:outline-none`}
        style={{ 
          top: isMobile ? '40%' : '35%',
          transform: 'translateY(-50%)'
        }}
        onClick={nextSlide}
        aria-label="Ver próximos depoimentos"
      >
        <svg width="14" height="24" viewBox="0 0 24 45" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2L22 22.5L2 43" stroke="#806D52" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Indicadores de posição */}
      <div className={`flex justify-center ${isMobile ? 'mt-4' : 'mt-6 sm:mt-8 md:mt-10'} space-x-2 sm:space-x-3`}>
        {Array.from({ length: Math.ceil(testimonials.length / itemsToShow) }).map((_, pageIndex) => {
          const isActive = isMobile 
            ? currentIndex === pageIndex
            : Math.floor(currentIndex / itemsToShow) === pageIndex;
          
          return (
            <button
              key={pageIndex}
              onClick={() => setCurrentIndex(pageIndex * itemsToShow)}
              className={`h-2 sm:h-3 rounded-full transition-all ${
                isActive 
                  ? 'bg-white w-5 sm:w-6' 
                  : 'bg-white bg-opacity-50 w-2 sm:w-3'
              }`}
              aria-label={`Ir para página ${pageIndex + 1} de depoimentos`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;