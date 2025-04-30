import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface EbookBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  ebookImageSrc?: string;
}

const EbookBanner: React.FC<EbookBannerProps> = ({
  title = "Compre o E-BOOK",
  subtitle = "Rotina Diária",
  buttonText = "COMPRAR",
  buttonLink = "/loja/ebook-rotina-diaria",
  ebookImageSrc = "/assets/ebook-mockup.png"
}) => {
  return (
    <section className="w-full relative overflow-hidden" style={{ backgroundColor: '#0064af' }}>
      <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between relative z-10">
        {/* Imagem do E-book (placeholder para o Kindle) */}
        <div className="md:w-1/3 mb-8 md:mb-0 flex justify-center">
          <div className="relative" style={{ width: '250px', height: '320px' }}>
            {/* 
              Aqui será inserida a imagem do ebook/kindle
              Por enquanto, usamos um espaço reservado
            */}
            {ebookImageSrc ? (
              <Image 
                src={ebookImageSrc}
                alt="E-book Rotina Diária"
                width={250}
                height={320}
                className="object-contain"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Imagem do E-book</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Conteúdo textual */}
        <div className="md:w-2/3 text-white text-center md:text-left md:pl-16 lg:pl-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Museo_Sans_Rounded']" style={{ color: '#eef494' }}>{title}</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-8 font-['Museo_Sans_Rounded']">{subtitle}</h3>
          
          <div className="md:pl-12 lg:pl-16">
            <Link 
              href={buttonLink} 
              className="bg-white text-[#0064af] font-bold py-4 px-14 rounded-xl inline-block text-2xl md:text-3xl hover:bg-opacity-90 transition-all transform hover:scale-105 active:scale-95 font-['Museo_Sans_Rounded']"
              style={{ minWidth: '190px' }}
            >
            {buttonText}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Background mask/decoration - estrutura pronta para receber a imagem no futuro */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        {/* 
          Aqui será inserida a imagem de máscara de fundo
          Por enquanto, deixamos apenas a estrutura preparada 
        */}
      </div>
    </section>
  );
};

export default EbookBanner;
