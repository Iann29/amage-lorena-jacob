'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockProducts, mockCategories, mockBanners } from '@/lib/mockDataLoja';
import { ProductCard } from '@/components/loja/ProductCard';

export default function LojaPage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Produtos em destaque (primeiros 6)
  const featuredProducts = mockProducts.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Carrossel */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="relative w-full h-full">
          {mockBanners.map((banner, index) => (
            <Link
              key={banner.id}
              href={banner.link}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentBanner ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={banner.image_url}
                alt={banner.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </Link>
          ))}
        </div>
        
        {/* Indicadores do carrossel */}
        {mockBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {mockBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentBanner ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Ir para banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categorias */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                href={`/loja/${category.slug}`}
                className="group"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <Image
                    src={category.imagem_url}
                    alt={category.nome}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-end justify-center pb-4 md:pb-6">
                    <h3 className="text-white text-center">
                      {category.nome === 'Brinquedos Sensoriais' ? (
                        <span className="flex flex-col leading-tight">
                          <span className="text-xl md:text-2xl lg:text-3xl" style={{ fontFamily: 'var(--font-museo-sans)', fontWeight: '500' }}>Brinquedos</span>
                          <span className="text-xl md:text-2xl lg:text-3xl" style={{ fontFamily: 'var(--font-museo-sans)', fontWeight: '900' }}>Sensoriais</span>
                        </span>
                      ) : category.nome === 'Material Pedagógico' ? (
                        <span className="flex flex-col leading-tight">
                          <span className="text-xl md:text-2xl lg:text-3xl" style={{ fontFamily: 'var(--font-museo-sans)', fontWeight: '500' }}>Material</span>
                          <span className="text-xl md:text-2xl lg:text-3xl" style={{ fontFamily: 'var(--font-museo-sans)', fontWeight: '900' }}>Pedagógico</span>
                        </span>
                      ) : category.nome === 'PECS' || category.nome === 'E-books' ? (
                        <span className="text-2xl md:text-3xl lg:text-4xl" style={{ fontFamily: 'var(--font-museo-sans)', fontWeight: '900' }}>{category.nome}</span>
                      ) : (
                        category.nome
                      )}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Benefícios */}
      <section className="py-8 px-4" style={{ backgroundColor: '#5179C8' }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-3 relative">
                <Image
                  src="/assets/loja/frete-gratis.png"
                  alt="Frete Grátis"
                  fill
                  className="object-contain"
                />
              </div>
              <h4 className="font-bold mb-1" style={{ color: '#F9FFD6', fontFamily: 'var(--font-museo-sans)' }}>
                Frete Grátis
              </h4>
              <p className="text-white text-sm">acima de R$ 99,00</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-3 relative">
                <Image
                  src="/assets/loja/parcelamento.png"
                  alt="Parcelamento"
                  fill
                  className="object-contain"
                />
              </div>
              <h4 className="font-bold mb-1" style={{ color: '#F9FFD6', fontFamily: 'var(--font-museo-sans)' }}>
                Parcelamento
              </h4>
              <p className="text-white text-sm">até 3x sem juros</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-3 relative">
                <Image
                  src="/assets/loja/pagamento-a-vista.png"
                  alt="Pagamento à Vista"
                  fill
                  className="object-contain"
                />
              </div>
              <h4 className="font-bold mb-1" style={{ color: '#F9FFD6', fontFamily: 'var(--font-museo-sans)' }}>
                Pagamento à Vista
              </h4>
              <p className="text-white text-sm">3% de desconto no PIX</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-3 relative">
                <Image
                  src="/assets/loja/seguranca.png"
                  alt="Segurança"
                  fill
                  className="object-contain"
                />
              </div>
              <h4 className="font-bold mb-1" style={{ color: '#F9FFD6', fontFamily: 'var(--font-museo-sans)' }}>
                Segurança
              </h4>
              <p className="text-white text-sm">SSL de proteção</p>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 
            className="text-3xl font-bold text-center mb-8" 
            style={{ color: '#2A289B', fontFamily: 'var(--font-museo-sans)' }}
          >
            PRODUTOS
          </h2>

          {/* Barra de pesquisa */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-[#5179C8]"
                style={{ fontFamily: 'var(--font-museo-sans)' }}
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2">
                <Image
                  src="/assets/searchIcon.png"
                  alt="Pesquisar"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>

          {/* Contador e filtros */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600" style={{ fontFamily: 'var(--font-museo-sans)' }}>
              TODOS ({mockProducts.length})
            </span>
          </div>

          {/* Grid de produtos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={(product) => {
                  // TODO: Implementar lógica do carrinho
                  console.log('Produto adicionado ao carrinho:', product);
                }}
              />
            ))}
          </div>

          {/* Botão Ver Mais */}
          <div className="text-center">
            <Link
              href="/loja/produtos"
              className="inline-block px-8 py-3 rounded-full text-white font-medium transition-colors"
              style={{ 
                backgroundColor: '#5179C8',
                fontFamily: 'var(--font-museo-sans)'
              }}
            >
              VER MAIS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}