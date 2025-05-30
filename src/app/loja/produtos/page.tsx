'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { mockProducts, mockCategories, filterProducts } from '@/lib/mockDataLoja';
import { ProductCard } from '@/components/loja/ProductCard';

export default function ProdutosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [ageRange, setAgeRange] = useState({ min: 0, max: 12 });
  const [showFilters, setShowFilters] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

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

    // Filtro de idade
    filtered = filtered.filter(p => {
      if (!p.idade_min && !p.idade_max) return true;
      if (p.idade_min && p.idade_min > ageRange.max) return false;
      if (p.idade_max && p.idade_max < ageRange.min) return false;
      return true;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategories, priceRange, ageRange]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 200 });
    setAgeRange({ min: 0, max: 12 });
    setSearchQuery('');
  };

  // Contar produtos por categoria
  const getCategoryCount = (categoryId: string) => {
    return mockProducts.filter(p => p.category_id === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Título */}
        <h1 
          className="text-4xl font-bold text-center mb-8" 
          style={{ color: '#2A289B', fontFamily: 'var(--font-museo-sans)' }}
        >
          PRODUTOS
        </h1>

        {/* Barra de pesquisa */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar por palavra ou tema"
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

        {/* Contador */}
        <div className="text-center mb-6">
          <span className="text-gray-600" style={{ fontFamily: 'var(--font-museo-sans)' }}>
            TODOS ({filteredProducts.length})
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <aside className={`lg:w-64 ${showFilters ? '' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1 text-gray-500 text-sm">Filtrar por</h3>
                <h2 className="text-2xl font-bold mb-4">Categorias</h2>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategories([])}
                    className={`block w-full text-left py-1 ${
                      selectedCategories.length === 0 ? 'text-[#5179C8] font-bold' : 'text-gray-700'
                    }`}
                  >
                    Todos
                  </button>
                  
                  {mockCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`block w-full text-left py-1 ${
                        selectedCategories.includes(category.id) 
                          ? 'text-[#5179C8] font-bold' 
                          : 'text-gray-700'
                      }`}
                    >
                      • {category.nome} ({getCategoryCount(category.id)})
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro de Preço */}
              <div className="mb-6 pt-6 border-t">
                <h2 className="text-2xl font-bold mb-4">Preço</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>De<br/>R$ {priceRange.min.toFixed(2)}</span>
                    <span>Até<br/>R$ {priceRange.max.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPriceRange({ min: 0, max: 200 })}
                      className="flex-1 py-2 border border-gray-300 rounded text-sm font-medium"
                    >
                      LIMPAR
                    </button>
                    <button
                      className="flex-1 py-2 bg-black text-white rounded text-sm font-medium"
                    >
                      APLICAR
                    </button>
                  </div>
                </div>
              </div>

              {/* Filtro de Idade */}
              <div className="pt-6 border-t">
                <h2 className="text-2xl font-bold mb-4">Idade</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>De<br/>{ageRange.min} anos</span>
                    <span>Até<br/>{ageRange.max} anos</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={ageRange.max}
                    onChange={(e) => setAgeRange({ ...ageRange, max: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAgeRange({ min: 0, max: 12 })}
                      className="flex-1 py-2 border border-gray-300 rounded text-sm font-medium"
                    >
                      LIMPAR
                    </button>
                    <button
                      className="flex-1 py-2 bg-black text-white rounded text-sm font-medium"
                    >
                      APLICAR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de Produtos */}
          <div className="flex-1">
            {/* Botão de toggle filtros no mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-4 text-[#5179C8] font-medium"
            >
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredProducts.map((product) => (
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
                <div className="text-center">
                  <button
                    className="px-8 py-3 rounded-full text-white font-medium transition-colors"
                    style={{ 
                      backgroundColor: '#5179C8',
                      fontFamily: 'var(--font-museo-sans)'
                    }}
                  >
                    VER MAIS
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}