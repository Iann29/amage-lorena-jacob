"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
// import Link from 'next/link'; // Removido - Link não utilizado
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogFilter from '@/components/blog/BlogFilter';
import styles from './blog.module.css';
// Importar funções da nova API
import { getPublishedBlogPosts, getPublicBlogCategories, type BlogPostPublic, type BlogCategoryPublic } from '@/lib/blog-api'; // Removido getPopularBlogPosts se não usar
// Importar função para buscar status de likes em lote
import { getBatchPostLikeStatus } from '../likes/batchActions';

export default function BlogPage() {
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTemas, setSelectedTemas] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [posts, setPosts] = useState<BlogPostPublic[]>([]);
  const [categorias, setCategorias] = useState<BlogCategoryPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para armazenar informações de likes em lote
  const [likesInfo, setLikesInfo] = useState<{[postId: string]: {isLiked: boolean, likeCount: number}}>({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  const isMounted = useRef(true);
  
  // Ref para controlar quais requisições estão em andamento e evitar duplicações
  const fetchingRef = useRef({
    posts: false,
    categories: false,
    likes: false
  });

  // Função separada para buscar categorias apenas uma vez
  const fetchCategories = useCallback(async () => {
    // Verifica se existe alguma categoria em andamento ou já carregada
    if (categorias.length > 0 || fetchingRef.current.categories) return;
    
    // Marca que está buscando categorias para evitar chamadas duplicadas
    fetchingRef.current.categories = true;
    
    try {
      const fetchedCategories = await getPublicBlogCategories();
      if (isMounted.current) setCategorias(fetchedCategories);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    } finally {
      // Marca que terminou de buscar categorias
      fetchingRef.current.categories = false;
    }
  }, [categorias.length]);

  // Função otimizada para buscar posts e seus status de likes em lote
  const fetchPosts = useCallback(async (page: number, categoryId?: string, currentSearchTerm?: string, append = false) => {
    // Evitar requisições duplicadas para a mesma página e filtro
    if (fetchingRef.current.posts) return;
    fetchingRef.current.posts = true;
    
    if (!append) setIsLoading(true);
    else setIsLoadingMore(true);
    setError(null);

    try {
      const response = await getPublishedBlogPosts(page, pageSize, categoryId, currentSearchTerm);
      let newPosts = response.posts;
      
      // Buscar status de likes em lote para todos os posts
      if (newPosts.length > 0 && !fetchingRef.current.likes) {
        // Evitar requisições duplicadas de likes
        fetchingRef.current.likes = true;
        
        const postIds = newPosts.map(post => post.id);
        const likesResponse = await getBatchPostLikeStatus(postIds);
        fetchingRef.current.likes = false;
        
        if (likesResponse.success && likesResponse.items) {
          // Converter o array de itens em um objeto para acesso mais rápido
          const likesInfoMap = likesResponse.items.reduce((acc, item) => {
            acc[item.postId] = { isLiked: item.isLiked, likeCount: item.likeCount };
            return acc;
          }, {} as {[postId: string]: {isLiked: boolean, likeCount: number}});
          
          // Atualizar o estado de likes
          if (append) {
            setLikesInfo(prev => ({ ...prev, ...likesInfoMap }));
          } else {
            setLikesInfo(likesInfoMap);
          }
          
          // Atualizar as contagens de likes nos posts caso necessário
          newPosts = newPosts.map(post => ({
            ...post,
            like_count: likesInfoMap[post.id]?.likeCount ?? post.like_count
          }));
        }
      }

      if (isMounted.current) {
        if (append) {
          setPosts(prevPosts => [...prevPosts, ...newPosts]);
        } else {
          setPosts(newPosts);
        }
        setTotalPages(response.pagination.totalPages);
      }
    } catch (err) {
      console.error("Erro ao carregar posts do blog:", err);
      if (isMounted.current) setError("Não foi possível carregar o conteúdo. Tente novamente.");
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsLoadingMore(false);
        fetchingRef.current.posts = false;
      }
    }
  }, [pageSize]);

  // Efeito para carregar categorias uma única vez na montagem do componente
  useEffect(() => {
    isMounted.current = true;
    fetchCategories();
    setDebouncedSearchTerm(searchTerm);
    
    // Adiciona classe ao body para prevenir scroll horizontal
    document.body.style.overflowX = 'hidden';
    
    return () => {
      isMounted.current = false;
      // Remove a classe ao desmontar
      document.body.style.overflowX = '';
    };
  }, [fetchCategories, searchTerm]);

  // Efeito para aplicar debounce ao searchTerm
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Atraso de 500ms

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Efeito separado para carregar posts quando página, filtros ou debouncedSearchTerm mudam
  useEffect(() => {
    const shouldAppend = currentPage > 1 && !debouncedSearchTerm;
    const categoryToFilter = selectedCategories[0];
    
    fetchPosts(currentPage, categoryToFilter, debouncedSearchTerm, shouldAppend);
  }, [currentPage, selectedCategories, debouncedSearchTerm, fetchPosts]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return [];
      } else {
        return [categoryId];
      }
    });
    setCurrentPage(1);
  };

  const handleTemaChange = (tema: string) => {
    setSelectedTemas(prev =>
      prev.includes(tema)
        ? prev.filter(t => t !== tema)
        : [...prev, tema]
    );
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    // Reseta para página 1 e chama o useEffect naturalmente
    setSearchTerm('');
    setCurrentPage(1);
  };

  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };

  // Manipulador para o input de pesquisa
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  return (
    <main
      className="min-h-screen relative"
      style={{
        background: `url('https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//backgroundBlog.webp') no-repeat center top / cover, #FFFFF9`,
        backgroundBlendMode: 'multiply'
      }}
    >
      <div className="container mx-auto px-4 pt-36 pb-12">
        <h1 className={styles.blogTitle}>Blog</h1>

        {/* Barra de pesquisa e filtros */}
        <div className="max-w-2xl mx-auto mb-4 mt-10">
          <div className={styles.searchBar}>
            {/* Ícone de busca */}
            <div className={styles.searchIcon}>
              <Image src="/assets/searchIcon.png" alt="Buscar" width={20} height={20} />
            </div>
            {/* Input de busca */}
            <input
              type="text"
              placeholder="Pesquisar por palavra ou tema"
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            {/* Ícone de filtro */}
            <div
              className={styles.filterIcon}
              onClick={toggleFilterPanel}
              role="button"
              aria-label="Abrir filtros"
            >
              <Image src="/assets/configIcon.png" alt="Filtrar" width={24} height={24} />
            </div>
          </div>

          {/* Contador de posts (opcional, pode mostrar total da API) */}
          <div className="flex justify-center mt-12 mb-16 text-[#A6A6A6] font-medium">
            {/* Exemplo: Mostrando {posts.length} de {totalItems || 0} */}
            {posts.length > 0 ? `${posts.length} POSTS EXIBIDOS` : ''}
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="text-center my-8 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
            <button
              onClick={handleRetry}
              className="ml-2 underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Grid principal */}
        <div className={styles.mainGrid}>
          {/* Overlay escuro para mobile */}
          <div 
            className={`${styles.filterOverlay} ${filterPanelOpen ? styles.filterOverlayActive : ''}`}
            onClick={toggleFilterPanel}
          />
          
          {/* Painel de Filtros */}
          <BlogFilter
            isOpen={filterPanelOpen}
            categorias={categorias}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            selectedTemas={selectedTemas}
            onTemaChange={handleTemaChange}
            onClose={toggleFilterPanel}
          />

          {/* Container de Posts */}
          <div className={styles.postsContainer}>
            {/* Loading Inicial */}
            {isLoading && currentPage === 1 ? (
               <div className="text-center py-16">
                 <div className="inline-block w-8 h-8 border-4 border-[#6FB1CE] border-t-transparent rounded-full animate-spin"></div>
                 <p className="mt-4 text-[#6FB1CE]">Carregando posts...</p>
               </div>
            ) : posts.length === 0 && !isLoading ? (
              // Mensagem se não houver posts (com ou sem filtro)
              <div className="text-center my-12">
                <p className="text-xl text-gray-600">Nenhum post encontrado.</p>
                {/* Botão para limpar filtro só aparece se houver filtro aplicado */}
                {selectedCategories.length > 0 && (
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="mt-4 px-4 py-2 bg-[#FFA458] text-white rounded-md hover:bg-[#FF9240] transition-colors"
                  >
                    Mostrar todos os posts
                  </button>
                )}
              </div>
            ) : (
              // Grid de Posts
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mx-auto">
                {posts.map((post) => (
                  <BlogPostCard 
                    key={post.id} 
                    post={post} 
                    initialLikeInfo={likesInfo[post.id] || { isLiked: false, likeCount: post.like_count }}
                  />
                ))}
              </div>
            )}

            {/* Indicador de Loading "Ver Mais" */}
            {isLoadingMore && (
                 <div className="text-center py-8">
                    <div className="inline-block w-6 h-6 border-4 border-[#6FB1CE] border-t-transparent rounded-full animate-spin"></div>
                 </div>
             )}

            {/* Botão Ver Mais */}
            {!isLoading && !isLoadingMore && currentPage < totalPages && (
              <button
                onClick={handleLoadMore}
                className={styles.verMaisButton}
              >
                <span>VER MAIS</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}