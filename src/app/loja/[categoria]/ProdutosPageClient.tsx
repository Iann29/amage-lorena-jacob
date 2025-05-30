'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { lojaApi, type Product, type Category } from '@/lib/loja-api';
import { ProductCard } from '@/components/loja/ProductCard';

interface ProdutosPageClientProps {
  category: Category;
  initialProducts: Product[];
  initialTotal: number;
  initialTotalPages: number;
}

export default function ProdutosPageClient({ 
  category, 
  initialProducts, 
  initialTotal, 
  initialTotalPages 
}: ProdutosPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [ageRange, setAgeRange] = useState({ min: 0, max: 12 });
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);

  // Carregar todas as categorias para o filtro
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { categories: categoriesData } = await lojaApi.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };
    loadCategories();
  }, []);

  // Carregar mais produtos quando mudar a página
  useEffect(() => {
    if (currentPage > 1) {
      loadMoreProducts();
    }
  }, [currentPage]);

  const loadMoreProducts = async () => {
    try {
      setIsLoading(true);
      const response = await lojaApi.getProducts({
        category: category.slug,
        page: currentPage,
        limit: 12,
        search: searchQuery,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        minAge: ageRange.min,
        maxAge: ageRange.max
      });
      
      setProducts([...products, ...response.products]);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error('Erro ao carregar mais produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setCurrentPage(1);
      const response = await lojaApi.getProducts({
        category: category.slug,
        page: 1,
        limit: 12,
        search: searchQuery,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        minAge: ageRange.min,
        maxAge: ageRange.max
      });
      
      setProducts(response.products);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da categoria */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Link href="/loja" className="text-white/80 hover:text-white mr-2">
              Loja
            </Link>
            <span className="text-white/60 mx-2">/</span>
            <span className="text-white">{category.nome}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{category.nome}</h1>
          {category.descricao && (
            <p className="text-lg text-white/90">{category.descricao}</p>
          )}
        </div>
      </section>

      {/* Produtos */}
      <section className="py-12 px-4">
        <div className="container mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12">
          {/* Barra de pesquisa */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="relative">
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2"
                onClick={handleSearch}
              >
                <Image
                  src="/assets/searchIcon.png"
                  alt="Pesquisar"
                  width={20}
                  height={20}
                />
              </button>
              <input
                type="text"
                placeholder="Pesquisar produtos nesta categoria"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#5179C8] placeholder-[#A6A6A6] text-[#A6A6A6]"
                style={{ fontFamily: 'var(--font-museo-sans)' }}
              />
            </div>
          </div>

          {/* Contador */}
          <div className="text-center mb-8">
            <span className="text-gray-600" style={{ fontFamily: 'var(--font-museo-sans)' }}>
              {total} {total === 1 ? 'produto encontrado' : 'produtos encontrados'}
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
                        Todas
                      </Link>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link 
                          href={`/loja/${cat.slug}`}
                          className={`block py-1 text-sm transition-colors ${
                            cat.id === category.id 
                              ? 'text-[#5179C8] font-bold' 
                              : 'text-black hover:text-[#5179C8]'
                          }`}
                          style={{ fontFamily: 'var(--font-museo-sans)', whiteSpace: 'nowrap' }}
                        >
                          {cat.nome}
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
                    <button
                      onClick={handleSearch}
                      className="w-full py-2 bg-[#5179C8] text-white rounded-lg hover:bg-[#4169B8] transition-colors"
                      style={{ fontFamily: 'var(--font-museo-sans)' }}
                    >
                      Aplicar Filtro
                    </button>
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
                          <label className="text-sm text-gray-600 mb-1 block" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                            Idade Mínima: {ageRange.min} anos
                          </label>
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
                          <label className="text-sm text-gray-600 mb-1 block" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                            Idade Máxima: {ageRange.max} anos
                          </label>
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
              {isLoading && products.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">Nenhum produto encontrado nesta categoria.</p>
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
                        disabled={isLoading}
                        className="px-8 py-3 rounded-full text-white font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                        style={{ 
                          backgroundColor: '#0048C5',
                          fontFamily: 'var(--font-museo-sans)'
                        }}
                      >
                        {isLoading ? 'Carregando...' : 'VER MAIS'}
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