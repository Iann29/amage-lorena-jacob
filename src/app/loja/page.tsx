'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { lojaApi, type Product, type Category } from '@/lib/loja-api';
import { ProductCard } from '@/components/loja/ProductCard';

// Dados mockados temporários para o banner
const mockBanners = [
  {
    id: '1',
    image_url: 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/banner-loja/banner1.png',
    alt: 'Promoção de Brinquedos Educativos',
    link: '/loja/brinquedos-sensoriais'
  }
];

// Mapeamento fixo das imagens das categorias
const categoryImages: Record<string, string> = {
  'Brinquedos Sensoriais': 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/brinquedoSensoriais.png',
  'PECS': 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/pecs.png',
  'Material Pedagógico': 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/materialPedagogico.png',
  'E-books': 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/ebook.png',
};

// Ordem específica das categorias principais
const mainCategoriesOrder = ['Brinquedos Sensoriais', 'PECS', 'Material Pedagógico', 'E-books'];

export default function LojaPage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [ageRange, setAgeRange] = useState({ min: 0, max: 12 });
  
  // Estados para dados do Supabase
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Carregar categorias
        const { categories: categoriesData } = await lojaApi.getCategories();
        setCategories(categoriesData);
        
        // Carregar produtos
        const response = await lojaApi.getProducts({
          page: 1,
          limit: 12,
        });
        
        setProducts(response.products);
        setTotalPages(response.totalPages);
        setTotalProducts(response.total);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

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
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {mainCategoriesOrder
                .map(categoryName => {
                  // Procura a categoria no banco
                  const category = categories.find(cat => cat.nome === categoryName);
                  // Se não encontrar, cria uma categoria temporária
                  if (!category) {
                    return {
                      id: categoryName,
                      nome: categoryName,
                      slug: categoryName.toLowerCase().replace(/\s+/g, '-').replace('ó', 'o'),
                      imagem_url: categoryImages[categoryName],
                      is_active: true,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    };
                  }
                  return category;
                })
                .slice(0, 4)
                .map((category) => (
                <Link
                  key={category.id}
                  href={`/loja/${category.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <Image
                      src={categoryImages[category.nome] || category.imagem_url || '/assets/category-placeholder.jpg'}
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
          )}
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
              TODOS ({totalProducts})
            </span>
          </div>

          {/* Grid com filtro e produtos */}
          <div className="flex gap-8">
            {/* Filtro Lateral */}
            <aside className="w-64 flex-shrink-0 hidden lg:block">
              <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                  <h4 className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                    Filtrar por
                  </h4>
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#000', fontFamily: 'var(--font-museo-sans)' }}>
                    Categorias
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link 
                        href="/loja"
                        className="block py-1 text-sm text-black hover:text-[#5179C8] transition-colors"
                        style={{ fontFamily: 'var(--font-museo-sans)' }}
                      >
                        Todos
                      </Link>
                    </li>
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link 
                          href={`/loja/${category.slug}`}
                          className="block py-1 text-sm text-black hover:text-[#5179C8] transition-colors"
                          style={{ fontFamily: 'var(--font-museo-sans)', whiteSpace: 'nowrap' }}
                        >
                          {category.nome}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Filtro de Preço */}
                <div className="border-t border-gray-400 pt-6">
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#000', fontFamily: 'var(--font-museo-sans)' }}>
                    Preço
                  </h3>
                  <div className="space-y-4">
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #5179C8 0%, #5179C8 ${(priceRange.max / 500) * 100}%, #e5e7eb ${(priceRange.max / 500) * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-museo-sans)' }}>R$ 0</span>
                        <span className="text-sm font-bold text-[#5179C8]" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                          Até R$ {priceRange.max}
                        </span>
                        <span className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-museo-sans)' }}>R$ 500</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Filtro de Idade */}
                <div className="border-t border-gray-400 pt-6">
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#000', fontFamily: 'var(--font-museo-sans)' }}>
                    Idade
                  </h3>
                  <div className="space-y-4">
                    <div className="px-2">
                      <div className="space-y-4">
                        {/* Idade Mínima */}
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block" style={{ fontFamily: 'var(--font-museo-sans)' }}>Idade Mínima: {ageRange.min} anos</label>
                          <input
                            type="range"
                            min="0"
                            max="12"
                            value={ageRange.min}
                            onChange={(e) => {
                              const newMin = Number(e.target.value);
                              if (newMin <= ageRange.max) {
                                setAgeRange({ ...ageRange, min: newMin });
                              }
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, #5179C8 0%, #5179C8 ${(ageRange.min / 12) * 100}%, #e5e7eb ${(ageRange.min / 12) * 100}%, #e5e7eb 100%)`
                            }}
                          />
                        </div>
                        
                        {/* Idade Máxima */}
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block" style={{ fontFamily: 'var(--font-museo-sans)' }}>Idade Máxima: {ageRange.max} anos</label>
                          <input
                            type="range"
                            min="0"
                            max="12"
                            value={ageRange.max}
                            onChange={(e) => {
                              const newMax = Number(e.target.value);
                              if (newMax >= ageRange.min) {
                                setAgeRange({ ...ageRange, max: newMax });
                              }
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, #5179C8 0%, #5179C8 ${(ageRange.max / 12) * 100}%, #e5e7eb ${(ageRange.max / 12) * 100}%, #e5e7eb 100%)`
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="text-center mt-3">
                        <span className="text-sm font-bold text-[#5179C8]" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                          {ageRange.min} - {ageRange.max} anos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
            
            {/* Grid de produtos */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
                  <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros ou realizar uma nova busca.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-4 mb-8">
                    {products.map((product) => (
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
                  {currentPage < totalPages && (
                    <div className="text-center">
                      <button
                        onClick={handleLoadMore}
                        className="px-8 py-3 rounded-full text-white font-medium transition-colors hover:opacity-90"
                        style={{ 
                          backgroundColor: '#0048C5',
                          fontFamily: 'var(--font-museo-sans)'
                        }}
                      >
                        VER MAIS
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}