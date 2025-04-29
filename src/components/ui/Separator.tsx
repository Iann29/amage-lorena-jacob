import Image from 'next/image';
import React from 'react';

interface SeparatorProps {
  className?: string;
}

const Separator: React.FC<SeparatorProps> = ({ className = '' }) => {
  return (
    <div className={`w-full flex justify-center items-center ${className}`} style={{ padding: 0, margin: 0 }}>
      <div className="w-full" style={{ lineHeight: 0 }}>
        <Image 
          src="/assets/separador.png" 
          alt="Separador decorativo" 
          width={1200} 
          height={50} 
          priority
          unoptimized
          className="w-full h-auto"
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block', 
            border: 'none', 
            padding: 0, 
            margin: 0,
            maxWidth: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default Separator;
