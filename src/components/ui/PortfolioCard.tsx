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
      {/* Imagem de fundo com efeito parallax */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full transform transition-all duration-1000 ease-out group-hover:scale-105">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
      
      {/* Overlay com efeito de onda */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 transition-all duration-700"></div>
      
      {/* Efeito de brilho que percorre o card */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      </div>
      
      {/* Círculos decorativos que aparecem no hover */}
      <div className={`absolute top-4 right-4 w-20 h-20 rounded-full border border-white/20 transition-all duration-700 ${
        isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}></div>
      <div className={`absolute bottom-4 left-4 w-16 h-16 rounded-full border border-white/20 transition-all duration-700 delay-100 ${
        isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}></div>
      
      {/* Conteúdo com animação suave */}
      <div className="relative z-10 h-full flex flex-col justify-end items-center text-center px-6 pt-6 pb-8">
        {/* Ícone WhatsApp que aparece no hover */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl">
            <svg 
              className="w-8 h-8 text-green-600" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
        </div>
        
        {/* Textos com efeito de blur e movimento */}
        {subtitle && (
          <h3 className={`text-white text-xl md:text-2xl font-normal mb-1 transition-all duration-700 ${
            isHovered ? 'opacity-100 translate-y-0 blur-0' : 'opacity-80 translate-y-4 blur-[1px]'
          }`} style={{ fontFamily: '"Poppins", sans-serif' }}>
            {subtitle}
          </h3>
        )}
        <h2 className={`text-white text-2xl md:text-3xl font-bold transition-all duration-700 ${
          isHovered ? 'opacity-100 translate-y-0 blur-0' : 'opacity-90 translate-y-4 blur-[1px]'
        }`} style={{ fontFamily: '"Poppins", sans-serif' }}>
          {title}
        </h2>
        
        {/* Call to action que aparece no hover */}
        <p className={`text-white/90 text-sm mt-3 transition-all duration-500 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Clique para conversar no WhatsApp
        </p>
      </div>
    </div>
  );
};

export default PortfolioCard;