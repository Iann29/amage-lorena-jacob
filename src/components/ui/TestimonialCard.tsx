"use client";

import Image from 'next/image';
import React from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  avatarSrc?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  avatarSrc = "/assets/avatar-placeholder.png"
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 flex flex-col items-center mx-auto h-full relative w-full" style={{ minHeight: '200px' }}>
      {/* Citação */}
      <p className="text-center text-[#555555] mb-4 sm:mb-6 italic text-xs sm:text-sm leading-relaxed">
        "{quote}"
      </p>
      
      {/* Avatar - Aumentado e permitindo ultrapassar o círculo */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gray-200 mb-2 sm:mb-4 mt-auto relative">
        
        {/* Imagem que pode ultrapassar o círculo */}
        {avatarSrc ? (
          <div className="absolute inset-0 overflow-visible">
            <Image
              src={avatarSrc}
              alt={`Avatar de ${name}`}
              width={130}
              height={130}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[5%] w-[130%] h-auto scale-110"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-300 rounded-full" />
        )}
      </div>
      
      {/* Nome */}
      <h4 className="text-lg sm:text-xl font-bold text-[#333333] font-['Museo_Sans_Rounded'] mt-1 sm:mt-2">{name}</h4>
    </div>
  );
};

export default TestimonialCard;
