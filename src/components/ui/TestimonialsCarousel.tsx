"use client";

import React, { useState, useEffect } from 'react';
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
  visibleItems?: number;
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
  visibleItems = 3
}) => {
  // Estado para controlar o índice inicial dos depoimentos visíveis
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Criar um array circular para facilitar a rotação dos itens
  const getCircularItems = () => {
    const items = [...testimonials];
    // Garantir que temos itens suficientes para preencher a visualização
    if (items.length < visibleItems) {
      return items;
    }
    
    // Criar uma visualização circular dos itens
    const visibleTestimonials: Testimonial[] = [];
    
    for (let i = 0; i < visibleItems; i++) {
      const index = (activeIndex + i) % testimonials.length;
      visibleTestimonials.push(items[index]);
    }
    
    return visibleTestimonials;
  };
  
  // Obter os itens visíveis no momento
  const [visibleTestimonials, setVisibleTestimonials] = useState(getCircularItems());
  
  // Atualizar os itens visíveis quando o índice ativo muda
  useEffect(() => {
    setVisibleTestimonials(getCircularItems());
  }, [activeIndex]);

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

  // Variantes para animação de deslize suave
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: (custom: number) => ({
      x: custom > 0 ? 100 : -100,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-6 md:px-12 overflow-hidden">
      {/* Seta esquerda em formato circular */}
      <div className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-50">
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
      <div className="relative py-8 md:py-10" style={{ minHeight: '320px' }}>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`container-${activeIndex}`}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mx-auto justify-items-center"
        >
          {visibleTestimonials.map((testimonial, idx) => (
            <motion.div
              key={`${testimonial.id}-${idx}-${activeIndex}`}
              custom={direction}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="w-full"
            >
              <TestimonialCard 
                quote={testimonial.quote}
                name={testimonial.name}
                avatarSrc={testimonial.avatarSrc}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Seta direita em formato circular */}
      <div className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-50">
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
      <div className="flex justify-center mt-8 space-x-3">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > activeIndex ? 1 : -1);
              setActiveIndex(i);
            }}
            className={`h-3 rounded-full transition-all ${
              i === activeIndex || 
              i === (activeIndex + 1) % testimonials.length || 
              i === (activeIndex + 2) % testimonials.length 
              ? 'bg-white w-6' : 'bg-white bg-opacity-50 w-3'
            }`}
            aria-label={`Ir para depoimento ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
