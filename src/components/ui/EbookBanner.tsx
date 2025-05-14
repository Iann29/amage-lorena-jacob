import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

interface SlideData {
  src: string;
  alt: string;
  href: string;
}

// Lista completa de slides
const allSlidesData: SlideData[] = [
  {
    src: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/anuncios/anuncio1.webp",
    alt: "E-book Rotina Diária - Clique para comprar",
    href: "#", // Link alterado
  },
  {
    src: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/anuncios/anuncio2.webp",
    alt: "sistema-de-comunicacao-por-troca-de-imagens",
    href: "#", // Link alterado
  },
];

// Filtra os slides para não mostrar os que são da loja se a loja não estiver ativa
// Mude a condição ou remova o filtro quando a loja estiver pronta.
// const slidesData = allSlidesData.filter(slide => !slide.href.startsWith('/loja'));
const slidesData = allSlidesData; // Filtro removido para mostrar todos os slides

const EbookBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Só inicia o autoplay se houver mais de um slide visível
    if (slidesData.length > 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
      }, 5000); // Muda a cada 5 segundos
      return () => clearTimeout(timer);
    }
  }, [currentIndex, slidesData.length]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  // Se não houver slides (após o filtro, por exemplo), não renderiza nada
  if (slidesData.length === 0) {
    return null;
  }

  const activeSlide = slidesData[currentIndex];

  return (
    <section className="w-full relative overflow-hidden group">
      <div className="relative w-full h-auto">
        <Link href={activeSlide.href} passHref>
          {/* Usar um aspect ratio para o contêiner da imagem ajuda a evitar "layout shift" */}
          <div className="relative w-full" style={{ aspectRatio: '1920/500' }}> 
            {slidesData.map((slide, index) => (
              <div
                key={slide.src} 
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <Image 
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  className="object-cover" // Usa object-cover para preencher o espaço
                  priority={index === 0} 
                  quality={90}
                />
              </div>
            ))}
          </div>
        </Link>
      </div>

      {/* Bolinhas de Navegação (só mostram se houver mais de um slide) */}
      {slidesData.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slidesData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out 
                          ${currentIndex === index ? 'bg-white scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default EbookBanner;
