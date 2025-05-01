import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const EbookBanner: React.FC = () => {
  return (
    <section className="w-full relative overflow-hidden">
      {/* Banner completo usando a imagem anuncio1.jpg */}
      <div className="relative w-full">
        <Link href="/loja/ebook-rotina-diaria">
          <div className="relative w-full" style={{ height: 'auto' }}>
            <Image 
              src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/anuncios/anuncio1.webp"
              alt="E-book Rotina Diária - Clique para comprar"
              width={1920}
              height={500}
              className="w-full h-auto object-contain"
              priority
              quality={90}
              sizes="100vw"
              style={{ maxWidth: '100%' }}
            />
          </div>
        </Link>
      </div>
    </section>
  );
};

export default EbookBanner;
