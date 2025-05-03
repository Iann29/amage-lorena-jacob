"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { blogPosts, blogCategorias, getPopularPosts } from '@/lib/mockData';
import BlogPostCard from '@/components/blog/BlogPostCard';
import Pagination from '@/components/blog/Pagination';
import styles from './blog.module.css';

export default function BlogPage() {
  // Estado para controlar abertura/fechamento do painel de filtros
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTemas, setSelectedTemas] = useState<string[]>([]);

  // Em uma implementação real, esses dados viriam do Supabase
  const posts = blogPosts;
  const categorias = blogCategorias;
  const postsPopulares = getPopularPosts(3);
  
  // Dados de paginação
  const currentPage = 1;
  const totalPages = 3; // Mockado, seria calculado com base no total de posts
  
  // Lista de temas mockados
  const temas = [
    'Rotina saudável para crianças',
    'Como lidar com birras',
    'Atraso na fala infantil',
    'A importância do brincar',
    'Terapia para dificuldades escolares'
  ];
  
  // Função para alternar a abertura/fechamento do painel de filtros
  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };
  
  // Função para lidar com a seleção de categorias
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };
  
  // Função para lidar com a seleção de temas
  const handleTemaChange = (tema: string) => {
    setSelectedTemas(prev => 
      prev.includes(tema) 
        ? prev.filter(t => t !== tema) 
        : [...prev, tema]
    );
  };

  return (
    <main className="min-h-screen bg-[#FFFFF9] bg-opacity-90 relative">
      {/* Background com mask */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <Image 
          src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//backgroundcadastro.webp"
          alt="Background" 
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Cabeçalho do Blog */}
        <h1 className={styles.blogTitle}>Blog</h1>
        
        {/* Barra de pesquisa */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className={styles.searchBar}>
            <div className={styles.searchIcon}>
              <Image 
                src="/assets/searchIcon.png" 
                alt="Buscar" 
                width={20} 
                height={20} 
              />
            </div>
            <input 
              type="text" 
              placeholder="Pesquisar por palavra ou tema" 
              className={styles.searchInput}
            />
            <div 
              className={styles.filterIcon} 
              onClick={toggleFilterPanel}
              role="button"
              aria-label="Abrir filtros"
            >
              <Image 
                src="/assets/configIcon.png" 
                alt="Filtrar" 
                width={24} 
                height={24} 
              />
            </div>
          </div>
        </div>
        
        {/* Painel de Filtros */}
        <div className={`${styles.filterOverlay} ${filterPanelOpen ? styles.filterOverlayOpen : ''}`} onClick={toggleFilterPanel}></div>
        <div className={`${styles.filterPanel} ${filterPanelOpen ? styles.filterPanelOpen : ''}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-[#715B3F]">Filtrar</h3>
            <button 
              onClick={toggleFilterPanel}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Fechar painel de filtros"
            >
              ✕
            </button>
          </div>
          
          {/* Temas */}
          <div className="mb-6">
            <h4 className="text-blue-600 font-medium mb-3">Temas</h4>
            <div className="space-y-2">
              {temas.map((tema, index) => (
                <div key={index} className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`tema-${index}`} 
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    checked={selectedTemas.includes(tema)}
                    onChange={() => handleTemaChange(tema)}
                  />
                  <label htmlFor={`tema-${index}`} className="text-sm text-gray-700">
                    {tema}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Categorias */}
          <div>
            <h4 className="text-blue-600 font-medium mb-3">Categoria</h4>
            <div className="space-y-2">
              {categorias.map((categoria) => (
                <div key={categoria.id} className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`cat-${categoria.id}`} 
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    checked={selectedCategories.includes(categoria.id)}
                    onChange={() => handleCategoryChange(categoria.id)}
                  />
                  <label htmlFor={`cat-${categoria.id}`} className="text-sm text-gray-700">
                    {categoria.nome}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Contador de posts */}
        <div className="text-center mb-8 text-gray-500">
          TODOS ({posts.length})
        </div>
        
        {/* Grid principal */}
        <div className="flex flex-col gap-8">
          {/* Lista de Posts */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
            
            {/* Paginação */}
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              baseUrl="/blog/pagina"
            />
            
            {/* Link Ver Mais */}
            <div className="text-center mt-4">
              <a href="#" className="text-[#715B3F] hover:underline font-medium">
                VER MAIS
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
