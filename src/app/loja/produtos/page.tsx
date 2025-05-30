'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockProducts, mockCategories, allCategories, filterProducts } from '@/lib/mockDataLoja';
import { ProductCard } from '@/components/loja/ProductCard';

interface ProdutosPageProps {
  categoryId?: string;
  categoryName?: string;
}

export default function ProdutosPage({ categoryId, categoryName }: ProdutosPageProps = {}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryId ? [categoryId] : []);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 999 });
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [productsToShow, setProductsToShow] = useState(9);

  // Aplicar filtros
  useEffect(() => {
    let filtered = mockProducts;

    // Filtro de busca
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.descricao.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro de categorias
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category_id));
    }

    // Filtro de preço
    filtered = filtered.filter(p => {
      const price = p.preco_promocional || p.preco;
      return price >= priceRange.min && price <= priceRange.max;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategories, priceRange]);

  const handleCategoryClick = (categorySlug: string) => {
    if (categorySlug === 'todos') {
      router.push('/loja');
    } else {
      router.push(`/loja/${categorySlug}`);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 999 });
    setSearchQuery('');
  };

  // Contar produtos por categoria
  const getCategoryCount = (categoryId: string) => {
    return mockProducts.filter(p => p.category_id === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          {/* Título */}
          <h1 
            className="text-center mb-8 font-bold" 
            style={{ 
              color: '#2A289B', 
              fontFamily: 'var(--font-fredoka)',
              fontWeight: '700',
              fontSize: 'clamp(56px, 10vw, 120px)'
            }}
          >
            {categoryName ? (
              (() => {
                const name = categoryName.toUpperCase();
                // Títulos que devem ser divididos
                if (name === 'BRINQUEDOS SENSORIAIS') {
                  return (
                    <span className="flex flex-col leading-none">
                      <span>BRINQUEDOS</span>
                      <span style={{ color: '#7877D0' }}>SENSORIAIS</span>
                    </span>
                  );
                } else if (name === 'BRINQUEDOS MONTESSORIANOS') {
                  return (
                    <span className="flex flex-col leading-none">
                      <span>BRINQUEDOS</span>
                      <span style={{ color: '#7877D0' }}>MONTESSORIANOS</span>
                    </span>
                  );
                } else if (name === 'PECS E COMUNICAÇÃO ALTERNATIVA') {
                  return (
                    <span className="flex flex-col leading-none">
                      <span>PECS E COMUNICAÇÃO</span>
                      <span style={{ color: '#7877D0' }}>ALTERNATIVA</span>
                    </span>
                  );
                } else if (name === 'MATERIAL PEDAGÓGICO' || name === 'MATERIAIS PEDAGÓGICOS') {
                  return (
                    <span className="flex flex-col leading-none">
                      <span>MATERIAIS</span>
                      <span style={{ color: '#7877D0' }}>PEDAGÓGICOS</span>
                    </span>
                  );
                } else {
                  return name;
                }
              })()
            ) : 'PRODUTOS'}
          </h1>

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

          {/* Contador */}
          <div className="text-center mb-8">
            <span className="text-gray-600" style={{ fontFamily: 'var(--font-museo-sans)' }}>
              TODOS ({filteredProducts.length})
            </span>
          </div>

          <div className="flex gap-8">
          {/* Sidebar de Filtros */}
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
                    <button
                      onClick={() => handleCategoryClick('todos')}
                      className={`block py-1 text-sm ${
                        !categoryId ? 'text-[#5179C8] font-bold' : 'text-black hover:text-[#5179C8]'
                      } transition-colors`}
                      style={{ fontFamily: 'var(--font-museo-sans)' }}
                    >
                      Todos
                    </button>
                  </li>
                  
                  {allCategories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryClick(category.slug)}
                        className={`block py-1 text-sm text-left w-full ${
                          categoryId === category.id 
                            ? 'text-[#5179C8] font-bold' 
                            : 'text-black hover:text-[#5179C8]'
                        } transition-colors`}
                        style={{ fontFamily: 'var(--font-museo-sans)', whiteSpace: 'nowrap' }}
                      >
                        {category.nome}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filtro de Preço */}
              <div className="border-t border-gray-400 pt-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#000', fontFamily: 'var(--font-museo-sans)' }}>
                  Preço
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-black">Mínimo</label>
                    <input 
                      type="number" 
                      placeholder="R$ 0,00"
                      value={priceRange.min || ''}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:border-[#5179C8] placeholder-gray-700"
                      style={{ fontFamily: 'var(--font-museo-sans)' }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-black">Máximo</label>
                    <input 
                      type="number" 
                      placeholder="R$ 999,00"
                      value={priceRange.max || ''}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:border-[#5179C8] placeholder-gray-700"
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

          {/* Grid de Produtos */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-[#5179C8] underline"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-4 mb-8">
                  {filteredProducts.slice(0, productsToShow).map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      onAddToCart={(product) => {
                        console.log('Produto adicionado ao carrinho:', product);
                      }}
                    />
                  ))}
                </div>

                {/* Botão Ver Mais */}
                {productsToShow < filteredProducts.length && (
                  <div className="text-center">
                    <button
                      onClick={() => setProductsToShow(prev => Math.min(prev + 9, filteredProducts.length))}
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
      </div>
    </div>
  );
}