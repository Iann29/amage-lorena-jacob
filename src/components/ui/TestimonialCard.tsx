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
    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center mx-auto h-full" style={{ minHeight: '240px', maxWidth: '280px' }}>
      {/* Citação */}
      <p className="text-center text-[#555555] mb-6 italic text-sm leading-relaxed">
        "{quote}"
      </p>
      
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4 mt-auto">
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt={`Avatar de ${name}`}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </div>
      
      {/* Nome */}
      <h4 className="text-xl font-bold text-[#333333] font-['Museo_Sans_Rounded'] mt-2">{name}</h4>
    </div>
  );
};

export default TestimonialCard;
