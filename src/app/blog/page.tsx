"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogFilter from '@/components/blog/BlogFilter';
import styles from './blog.module.css';
// Importar funções da nova API em vez das Server Actions
import { getPublishedBlogPosts, getPublicBlogCategories, getPopularBlogPosts, type BlogPostPublic, type BlogCategoryPublic } from '@/lib/blog-api';

export default function BlogPage() {
  // Estado para controlar abertura/fechamento do painel de filtros
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTemas, setSelectedTemas] = useState<string[]>([]);

  // Estados para armazenar os dados do blog
  const [posts, setPosts] = useState<BlogPostPublic[]>([]);
  const [categorias, setCategorias] = useState<BlogCategoryPublic[]>([]);
  const [postsPopulares, setPostsPopulares] = useState<BlogPostPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Lista de temas temporários (no futuro podem vir do banco)
  const temas = [
    'Rotina saudável para crianças',
    'Como lidar com birras',
    'Atraso na fala infantil',
    'A importância do brincar',
    'Terapia para dificuldades escolares'
  ];

  // Carregar dados iniciais do blog
  useEffect(() => {
    // Controle para evitar múltiplas chamadas desnecessárias
    let isMounted = true;
    let hasRun = false;

    async function fetchData() {
      // Se já executou ou o componente não está mais montado, não faz nada
      if (hasRun || !isMounted) return;
      hasRun = true;

      setIsLoading(true);
      setError(null);
      
      try {
        // Buscar posts, categorias e posts populares simultaneamente usando as novas funções
        const [fetchedPosts, fetchedCategories, fetchedPopularPosts] = await Promise.all([
          getPublishedBlogPosts(currentPage, pageSize),
          getPublicBlogCategories(),
          getPopularBlogPosts(3)
        ]);

        if (!isMounted) return;

        setPosts(fetchedPosts);
        setCategorias(fetchedCategories);
        setPostsPopulares(fetchedPopularPosts);
      } catch (err) {
        console.error("Erro ao carregar dados do blog:", err);
        if (isMounted) {
          setError("Não foi possível carregar o conteúdo do blog. Por favor, tente novamente mais tarde.");
        }
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
  }, [currentPage, pageSize]);

  // Função para carregar mais posts quando mudar a categoria ou a paginação
  useEffect(() => {
    let isMounted = true;
    
    // Se tiver categorias selecionadas, filtra localmente
    // Se não tiver, carrega novos posts da API com a paginação atualizada
    if (selectedCategories.length === 0 && currentPage > 1) {
      async function loadMorePosts() {
        setIsLoading(true);
        try {
          const morePosts = await getPublishedBlogPosts(currentPage, pageSize);
          if (isMounted) {
            setPosts(prevPosts => [...prevPosts, ...morePosts]);
          }
        } catch (error) {
          console.error("Erro ao carregar mais posts:", error);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }

      loadMorePosts();
    }
    
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, selectedCategories]);
  
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
    
    // Reseta para a primeira página quando mudar as categorias
    setCurrentPage(1);
  };
  
  // Função para lidar com a seleção de temas
  const handleTemaChange = (tema: string) => {
    setSelectedTemas(prev => 
      prev.includes(tema) 
        ? prev.filter(t => t !== tema) 
        : [...prev, tema]
    );
  };
  
  // Carregar mais posts
  const handleLoadMore = async () => {
    setCurrentPage(prev => prev + 1);
  };
  
  // Filtrar posts localmente com base nas categorias selecionadas
  const filteredPosts = posts.filter(post => {
    // Se não há categorias selecionadas, mostrar todos os posts
    if (selectedCategories.length === 0) return true;
    
    // Verificar se o post tem pelo menos uma das categorias selecionadas
    return post.categorias?.some(categoria => 
      selectedCategories.includes(categoria.id)
    );
  });

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
                FILTRADOS ({filteredPosts.length}) DE {posts.length} POSTS
              </>
            ) : (
              <>TODOS ({posts.length})</>  
            )}
          </div>
        </div>
        
        {/* Mensagem de erro, se houver */}
        {error && (
          <div className="text-center my-8 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
            <button 
              onClick={() => window.location.reload()} 
              className="ml-2 underline"
            >
              Tentar novamente
            </button>
          </div>
        )}
        
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
            {isLoading && posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-4 border-[#6FB1CE] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-[#6FB1CE]">Carregando posts...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mx-auto">
                  {filteredPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
                
                {/* Mensagem quando não houver posts correspondentes ao filtro */}
                {filteredPosts.length === 0 && (
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
              </>
            )}
            
            {/* Botão Ver Mais (mostrar apenas se não estiver carregando e houver mais páginas) */}
            {filteredPosts.length > 0 && !isLoading && (
              <button 
                onClick={handleLoadMore} 
                className={styles.verMaisButton}
                disabled={isLoading}
              >
                <span>{isLoading ? "Carregando..." : "VER MAIS"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
