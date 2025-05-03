"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { blogPosts, blogCategorias, getPopularPosts } from '@/lib/mockData';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogFilter from '@/components/blog/BlogFilter';
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
      
      <div className="container mx-auto px-4 pt-36 pb-12">
        {/* Cabeçalho do Blog */}
        <h1 className={styles.blogTitle}>Blog</h1>
        
        {/* Barra de pesquisa */}
        <div className="max-w-2xl mx-auto mb-4 mt-10">
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
          
          {/* Contador de posts e total */}
          <div className="flex justify-center mt-12 mb-16 text-[#A6A6A6] font-medium">
            TODOS ({posts.length})
          </div>
        </div>
        

        
        {/* Grid principal com filtro e posts */}
        <div className={styles.mainGrid}>
          {/* Painel de Filtros */}
          <BlogFilter 
            isOpen={filterPanelOpen}
            categorias={categorias}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            selectedTemas={selectedTemas}
            onTemaChange={handleTemaChange}
          />
          
          {/* Lista de Posts */}
          <div className={styles.postsContainer}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mx-auto">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
            
            {/* Botão Ver Mais */}
            <button 
              onClick={() => {
                // Aqui viria a lógica para carregar mais posts
                console.log('Carregar mais posts');
              }} 
              className={styles.verMaisButton}
            >
              <span>VER MAIS</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
