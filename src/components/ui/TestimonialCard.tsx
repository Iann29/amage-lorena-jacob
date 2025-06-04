"use client";

import React from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  avatarSrc?: string;
  isCompact?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  avatarSrc = "/assets/avatar-placeholder.png",
  isCompact = false
}) => {
  // Versão unificada sem fotos
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center justify-center mx-auto relative w-full" style={{ width: '100%', maxWidth: '320px', minHeight: isCompact ? '120px' : '150px' }}>
      {/* Citação */}
      <p className="text-center text-[#555555] italic text-xs md:text-sm leading-relaxed mb-3">
        &quot;{quote}&quot;
      </p>
      
      {/* Nome com símbolo */}
      <p className="text-sm md:text-base font-bold text-[#333333]" style={{ fontFamily: 'var(--font-museo-sans)' }}>
        ~ {name}
      </p>
    </div>
  );
};

export default TestimonialCard;
