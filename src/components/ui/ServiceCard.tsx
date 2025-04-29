"use client";

import Link from 'next/link';
import React from 'react';

interface ServiceCardProps {
  title: string;
  buttonText: string;
  backgroundImage?: string;
  linkHref: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  buttonText, 
  backgroundImage,
  linkHref 
}) => {
  return (
    <div 
      className="flex flex-col items-center justify-between p-6 rounded-lg"
      style={{ 
        backgroundColor: '#FAFFE7',
        border: '0.92px solid #27769B',
        minHeight: '210px',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <h3 className="text-center font-medium text-xl mb-4">{title}</h3>
      
      <Link href={linkHref}>
        <button 
          className="bg-[#27769B] text-white py-2 px-6 rounded-md font-medium hover:bg-opacity-90 transition-all"
        >
          {buttonText}
        </button>
      </Link>
    </div>
  );
};

export default ServiceCard;
