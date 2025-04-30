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
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 flex flex-col items-center mx-auto relative w-full min-h-[280px] sm:min-h-[320px] md:min-h-[340px]" style={{ width: '100%', maxWidth: '320px' }}>
      {/* Citação */}
      <p className="text-center text-[#555555] italic text-xs sm:text-sm leading-relaxed flex-1">
        "{quote}"
      </p>
      
      {/* Área do Avatar */}
      <div className="flex flex-col items-center mt-auto">
        {/* Avatar */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gray-200 overflow-hidden relative">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={`Avatar de ${name}`}
              fill
              sizes="(max-width: 640px) 6rem, (max-width: 768px) 7rem, 8rem"
              className="object-cover"
              priority
              unoptimized
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-full" />
          )}
        </div>
        
        {/* Nome */}
        <h4 className="text-lg sm:text-xl font-bold text-[#333333] font-['Museo_Sans_Rounded'] mt-3">{name}</h4>
      </div>
    </div>
  );
};

export default TestimonialCard;
