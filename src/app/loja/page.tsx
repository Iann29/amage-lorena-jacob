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
    <div className="min-h-screen bg-gray-50">
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
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="rounded-2xl py-8 px-4" style={{ backgroundColor: '#5179C8' }}>
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
              <h4 className="font-bold mb-1 text-lg md:text-xl" style={{ color: '#F9FFD6', fontFamily: 'var(--font-museo-sans)' }}>
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
              <h4 className="font-bold mb-1 text-lg md:text-xl" style={{ color: '#F9FFD6', fontFamily: 'var(--font-museo-sans)' }}>
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
              <h4 className="font-bold mb-1 text-lg md:text-xl" style={{ color: '#F9FFD6', fontFamily: 'var(--font-museo-sans)' }}>
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
              <h4 className="font-bold mb-1 text-lg md:text-xl" style={{ color: '#F9FFD6', fontFamily: 'var(--font-museo-sans)' }}>
                Segurança
              </h4>
              <p className="text-white text-sm">SSL de proteção</p>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section className="py-12 px-4">
        <div className="container mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <h2 
            className="text-center mb-8 font-bold" 
            style={{ 
              color: '#2A289B', 
              fontFamily: 'var(--font-fredoka)',
              fontWeight: '700',
              fontSize: 'clamp(56px, 10vw, 120px)'
            }}
          >
            PRODUTOS
          </h2>

          {/* Barra de pesquisa */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="relative">
              <button className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image
                  src="/assets/searchIcon.png"
                  alt="Pesquisar"
                  width={20}
                  height={20}
                />
              </button>
              <input
                type="text"
                placeholder="Pesquisar por palavra ou tema"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#5179C8] placeholder-[#A6A6A6] text-[#A6A6A6]"
                style={{ fontFamily: 'var(--font-museo-sans)' }}
              />
            </div>
          </div>

          {/* Contador centralizado */}
          <div className="text-center mb-8">
            <span className="text-gray-600" style={{ fontFamily: 'var(--font-museo-sans)' }}>
              TODOS ({mockProducts.length})
            </span>
          </div>

          {/* Grid com filtro e produtos */}
          <div className="flex gap-8">
            {/* Filtro Lateral */}
            <aside className="w-56 flex-shrink-0 hidden lg:block">
              <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                  <h4 className="text-sm text-gray-500 mb-4" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                    Filtrar por
                  </h4>
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#000', fontFamily: 'var(--font-museo-sans)' }}>
                    Categorias
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link 
                        href="/loja"
                        className="block py-1 text-sm hover:text-[#5179C8] transition-colors"
                        style={{ fontFamily: 'var(--font-museo-sans)' }}
                      >
                        Todos
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/loja/brinquedos-sensoriais"
                        className="block py-1 text-sm hover:text-[#5179C8] transition-colors"
                        style={{ fontFamily: 'var(--font-museo-sans)' }}
                      >
                        Brinquedos Sensoriais
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/loja/brinquedos-montessorianos"
                        className="block py-1 text-sm hover:text-[#5179C8] transition-colors"
                        style={{ fontFamily: 'var(--font-museo-sans)' }}
                      >
                        Brinquedos Montessorianos
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/loja/material-pedagogico"
                        className="block py-1 text-sm hover:text-[#5179C8] transition-colors"
                        style={{ fontFamily: 'var(--font-museo-sans)' }}
                      >
                        Materiais Pedagógicos
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/loja/jogos"
                        className="block py-1 text-sm hover:text-[#5179C8] transition-colors"
                        style={{ fontFamily: 'var(--font-museo-sans)' }}
                      >
                        Jogos
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/loja/pecs"
                        className="block py-1 text-sm hover:text-[#5179C8] transition-colors"
                        style={{ fontFamily: 'var(--font-museo-sans)' }}
                      >
                        PECS e Comunicação Alternativa
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/loja/ebooks"
                        className="block py-1 text-sm hover:text-[#5179C8] transition-colors"
                        style={{ fontFamily: 'var(--font-museo-sans)' }}
                      >
                        E-books
                      </Link>
                    </li>
                  </ul>
                </div>
                
                {/* Filtro de Preço */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#000', fontFamily: 'var(--font-museo-sans)' }}>
                    Preço
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Mínimo</label>
                      <input 
                        type="number" 
                        placeholder="R$ 0,00"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#5179C8]"
                        style={{ fontFamily: 'var(--font-museo-sans)' }}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Máximo</label>
                      <input 
                        type="number" 
                        placeholder="R$ 999,00"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#5179C8]"
                        style={{ fontFamily: 'var(--font-museo-sans)' }}
                      />
                    </div>
                    <button 
                      className="w-full py-2 rounded-lg text-white text-sm font-medium transition-colors hover:opacity-90"
                      style={{ 
                        backgroundColor: '#0048C5',
                        fontFamily: 'var(--font-museo-sans)'
                      }}
                    >
                      Aplicar Filtro
                    </button>
                  </div>
                </div>
              </div>
            </aside>
            
            {/* Grid de produtos */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-4 mb-8">
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
          </div>
        </div>
      </section>
    </div>
  );
}