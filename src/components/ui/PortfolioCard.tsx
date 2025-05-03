"use client";

import Image from "next/image";
import { useState } from "react";

interface PortfolioCardProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  className?: string;
}

const PortfolioCard = ({
  imageUrl,
  title,
  subtitle,
  className = "",
}: PortfolioCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden rounded-3xl h-full w-full group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagem de fundo com zoom */}
      <div className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-110">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      
      {/* Overlay gradiente sutil */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-70'
      }`}></div>
      
      {/* Frame decorativo que aparece no hover */}
      <div className={`absolute inset-3 border-2 border-white/30 rounded-2xl transition-all duration-500 ${
        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}></div>
      
      {/* Conteúdo com animação */}
      <div className={`relative z-10 h-full flex flex-col justify-end items-center text-center px-6 pt-6 pb-8 transition-transform duration-500 ${
        isHovered ? '-translate-y-3' : 'translate-y-0'
      }`}>
        {subtitle && (
          <h3 className={`text-white text-xl md:text-2xl font-normal mb-1 transition-all duration-500 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-2'
          }`} style={{ fontFamily: '"Poppins", sans-serif' }}>
            {subtitle}
          </h3>
        )}
        <h2 className={`text-white text-2xl md:text-3xl font-bold transition-all duration-500 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-95 translate-y-2'
        }`} style={{ fontFamily: '"Poppins", sans-serif' }}>
          {title}
        </h2>
        
        {/* Linha decorativa que aparece no hover */}
        <div className={`w-16 h-0.5 bg-white mt-4 transition-all duration-500 ${
          isHovered ? 'opacity-100 w-24' : 'opacity-0 w-0'
        }`}></div>
        
        {/* Indicador de "Ver mais" que aparece no hover */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}>
          <div className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;