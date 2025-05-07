"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogFilter from '@/components/blog/BlogFilter';
import styles from './blog.module.css';
import { getPublishedBlogPosts, getPublicBlogCategories, getPopularBlogPosts, type BlogPostPublic, type BlogCategoryPublic } from './actions';

export default function BlogPage() {
  // Estado para controlar abertura/fechamento do painel de filtros
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTemas, setSelectedTemas] = useState<string[]>([]);

  // Estados para armazenar os dados do Supabase
  const [posts, setPosts] = useState<BlogPostPublic[]>([]);
  const [categorias, setCategorias] = useState<BlogCategoryPublic[]>([]);
  const [postsPopulares, setPostsPopulares] = useState<BlogPostPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dados de paginação
  const currentPage = 1;
  const totalPages = 1; // Será calculado dinamicamente depois
  
  // Lista de temas temporários (no futuro podem vir do banco)
  const temas = [
    'Rotina saudável para crianças',
    'Como lidar com birras',
    'Atraso na fala infantil',
    'A importância do brincar',
    'Terapia para dificuldades escolares'
  ];

  // Carregar dados reais do Supabase
  useEffect(() => {
    // Controle para evitar múltiplas chamadas desnecessárias
    let isMounted = true;
    let hasRun = false;

    async function fetchData() {
      // Se já executou ou o componente não está mais montado, não faz nada
      if (hasRun || !isMounted) return;
      hasRun = true;

      setIsLoading(true);
      try {
        // Buscar posts, categorias e posts populares simultaneamente
        const [fetchedPosts, fetchedCategories, fetchedPopularPosts] = await Promise.all([
          getPublishedBlogPosts(),
          getPublicBlogCategories(),
          getPopularBlogPosts(3)
        ]);

        if (!isMounted) return;

        setPosts(fetchedPosts);
        setCategorias(fetchedCategories);
        setPostsPopulares(fetchedPopularPosts);
      } catch (error) {
        console.error("Erro ao carregar dados do blog:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    // Função de limpeza para evitar memory leaks
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Função para alternar a abertura/fechamento do painel de filtros
  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };
  
  // Função para lidar com a seleção de categorias
  const handleCategoryChange = (categoryId: string) => {
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
    <main 
      className="min-h-screen relative" 
      style={{
        background: `url('https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//backgroundBlog.webp') no-repeat center top / cover,
                    #FFFFF9`,
        backgroundBlendMode: 'multiply'
      }}
    >
      
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
            {selectedCategories.length > 0 ? (
              <>
                FILTRADOS ({posts.filter(post => 
                  post.categorias?.some(categoria => 
                    selectedCategories.includes(categoria.id)
                  )
                ).length}) DE {posts.length} POSTS
              </>
            ) : (
              <>TODOS ({posts.length})</>  
            )}
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
              {/* Filtrar os posts com base nas categorias selecionadas */}
              {posts
                .filter(post => {
                  // Se não há categorias selecionadas, mostrar todos os posts
                  if (selectedCategories.length === 0) return true;
                  
                  // Verificar se o post tem pelo menos uma das categorias selecionadas
                  return post.categorias?.some(categoria => 
                    selectedCategories.includes(categoria.id)
                  );
                })
                .map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
            </div>
            
            {/* Mensagem quando não houver posts correspondentes ao filtro */}
            {posts.filter(post => {
              if (selectedCategories.length === 0) return true;
              return post.categorias?.some(categoria => 
                selectedCategories.includes(categoria.id)
              );
            }).length === 0 && (
              <div className="text-center my-12">
                <p className="text-xl text-gray-600">Nenhum post encontrado com as categorias selecionadas.</p>
                <button 
                  onClick={() => setSelectedCategories([])} 
                  className="mt-4 px-4 py-2 bg-[#FFA458] text-white rounded-md hover:bg-[#FF9240] transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
            
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
