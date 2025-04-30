"use client";

import React, { useState } from 'react';
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
  testimonialsPerPage?: number;
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
  testimonialsPerPage = 3
}) => {
  // Estado para controlar qual página de depoimentos está sendo exibida
  const [currentPage, setCurrentPage] = useState(0);
  
  // Calculando o número total de páginas
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
  
  // Depoimentos a serem exibidos na página atual
  const currentTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage, 
    (currentPage * testimonialsPerPage) + testimonialsPerPage
  );

  // Direção da animação (1 = direita, -1 = esquerda)
  const [direction, setDirection] = useState(0);

  // Funções para controlar a navegação com direção
  const handleNext = () => {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  // Variantes para animação de deslize simples e rápida
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

      {/* Container do carrossel com altura fixa para evitar saltos */}
      <div className="relative py-8 md:py-10" style={{ minHeight: '320px' }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div 
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.25,
              ease: "easeInOut"
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mx-auto justify-items-center"
          >
            {currentTestimonials.map((testimonial) => (
              <TestimonialCard 
                key={testimonial.id}
                quote={testimonial.quote}
                name={testimonial.name}
                avatarSrc={testimonial.avatarSrc}
              />
            ))}
          </motion.div>
        </AnimatePresence>
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

      {/* Indicadores de página */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentPage ? 1 : -1);
                setCurrentPage(i);
              }}
              className={`h-3 rounded-full transition-all ${
                i === currentPage ? 'bg-white w-6' : 'bg-white bg-opacity-50 w-3'
              }`}
              aria-label={`Ir para página ${i + 1} de depoimentos`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialsCarousel;
