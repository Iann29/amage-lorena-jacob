"use client";

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

interface ServiceCardProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  backgroundImage?: string;
  linkHref?: string;
  target?: string;
  rel?: string;
  onButtonClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  subtitle = '',
  buttonText, 
  backgroundImage,
  linkHref,
  target = '_self',
  rel = '',
  onButtonClick
}) => {

  // Dividir o título em duas partes se não houver subtítulo fornecido
  const [firstPart, secondPart] = subtitle ? [title, subtitle] : title.includes(' ') ? 
    [title.split(' ').slice(0, 1).join(' '), title.split(' ').slice(1).join(' ')] : 
    [title, ''];
    
  return (
    <div className="relative mx-auto" style={{ width: '212px', height: '480px' }}>
      {/* Container separado para a sombra - fora do card com efeito */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-0 w-[313px]">
        <Image 
          src="/assets/sombra.png" 
          alt="Sombra" 
          width={313} 
          height={58}
          priority
          className="w-full"
        />
      </div>
      
      {/* Card principal com efeito de elevação no hover */}
      <div
        className="relative z-10 transition-transform duration-300 hover:-translate-y-1"
        style={{
          width: '212px', 
          height: '418px'
        }}
      >
        {/* Card principal */}
        <div className="w-full h-full relative overflow-hidden group transition-all duration-300 mt-0">
          {/* Card base com borda */}
          <div className="w-full h-full absolute bg-[#FAFFE7] rounded-2xl border border-[#27769B]"></div>
          
          {/* Imagem de fundo personalizada, se fornecida */}
          {backgroundImage && (
            <div className="w-full h-full absolute overflow-hidden rounded-2xl">
              <Image 
                src={backgroundImage} 
                alt={title} 
                fill
                sizes="(max-width: 768px) 100vw, 212px"
                priority
                className="absolute w-full h-full object-cover opacity-60 mix-blend-multiply"
              />
            </div>
          )}
          
          {/* Máscara de imagem - sempre exibida por cima */}
          <div className="w-full h-full absolute overflow-hidden rounded-2xl">
            <Image 
              src="/assets/cardmask1.png" 
              alt="Card Background" 
              width={800} 
              height={600}
              priority
              className="absolute w-full h-full object-cover opacity-40 transform scale-105"
            />
          </div>

          {/* Textos do título */}
          <div className="absolute top-16 left-0 w-full flex flex-col items-center z-10 px-4 space-y-0">
            <div className="text-[#025074] text-base font-bold leading-none mb-0 text-center" style={{ fontFamily: 'var(--font-museo-sans)' }}>
              {firstPart}
            </div>
            {secondPart && (
              <div className="text-[#27769B] text-xl font-bold leading-none mt-0 text-center" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                {secondPart}
              </div>
            )}
          </div>
          
          {/* Botão SAIBA MAIS */}
          <div className="absolute top-[127px] left-0 w-full flex justify-center z-10">
            {onButtonClick ? (
              <button 
                type="button"
                onClick={onButtonClick}
                className="flex items-center justify-center bg-[#27769B] hover:bg-[#1d5a77] text-white text-lg font-bold w-[160px] h-[40px] rounded-lg transform transition-all duration-300 hover:scale-105" 
                style={{ fontFamily: 'var(--font-museo-sans)' }}
              >
                {buttonText}
              </button>
            ) : linkHref ? (
              <Link 
                href={linkHref} 
                target={target}
                rel={rel}
                className="flex items-center justify-center bg-[#27769B] hover:bg-[#1d5a77] text-white text-lg font-bold w-[160px] h-[40px] rounded-lg transform transition-all duration-300 hover:scale-105"
              >
                {buttonText}
              </Link>
            ) : (
              <div className="flex items-center justify-center bg-gray-400 text-white text-lg font-bold w-[160px] h-[40px] rounded-lg cursor-not-allowed" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                {buttonText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
