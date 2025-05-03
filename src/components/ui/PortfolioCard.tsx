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
      className={`relative overflow-hidden rounded-3xl h-full w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagem de fundo */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      
      {/* Overlay escuro para melhorar leitura do texto */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isHovered ? 'opacity-40' : 'opacity-50'
        }`}
      ></div>
      
      {/* Conteúdo */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        {subtitle && (
          <h3 className="text-white text-lg md:text-xl font-normal mb-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
            {subtitle}
          </h3>
        )}
        <h2 className="text-white text-xl md:text-2xl font-bold" style={{ fontFamily: '"Poppins", sans-serif' }}>
          {title}
        </h2>
        
        {/* Elemento decorativo que aparece no hover */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-1 bg-white transform transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}
        ></div>
      </div>
    </div>
  );
};

export default PortfolioCard;
