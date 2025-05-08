"use client";

import { useState, useEffect, useRef, useCallback } from 'react'; // Adicionado useCallback
import Image from 'next/image';
// import Link from 'next/link'; // Removido - Link não utilizado
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogFilter from '@/components/blog/BlogFilter';
import styles from './blog.module.css';
// Importar funções da nova API
import { getPublishedBlogPosts, getPublicBlogCategories, type BlogPostPublic, type BlogCategoryPublic } from '@/lib/blog-api'; // Removido getPopularBlogPosts se não usar

export default function BlogPage() {
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Armazena IDs das categorias selecionadas
  const [selectedTemas, setSelectedTemas] = useState<string[]>([]); // Mantido para o filtro de temas (UI)

  const [posts, setPosts] = useState<BlogPostPublic[]>([]);
  const [categorias, setCategorias] = useState<BlogCategoryPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9; // 9 posts por página (3 colunas x 3 linhas)

  const isMounted = useRef(true); // Para evitar updates de estado em componente desmontado

  // Função centralizada para buscar dados (posts e categorias)
  // Usamos useCallback para memoizar e evitar recriações desnecessárias
  const fetchData = useCallback(async (page: number, categoryId?: string, append = false) => {
    if (!append) setIsLoading(true);
    else setIsLoadingMore(true);
    setError(null);

    try {
      // Busca categorias apenas na primeira carga ou se ainda não tiver
      if (categorias.length === 0) {
        const fetchedCategories = await getPublicBlogCategories();
        // Verifica se o componente ainda está montado antes de atualizar o estado
        if (isMounted.current) setCategorias(fetchedCategories);
      }

      // Busca posts passando a página e o ID da categoria (se houver)
      const response = await getPublishedBlogPosts(page, pageSize, categoryId);

      // Verifica se o componente ainda está montado
      if (isMounted.current) {
        if (append) {
          // Adiciona os novos posts aos existentes
          setPosts(prevPosts => [...prevPosts, ...response.posts]);
        } else {
          // Substitui os posts (quando muda filtro ou volta pra pág 1)
          setPosts(response.posts);
        }
        // Atualiza o total de páginas vindo da API
        setTotalPages(response.pagination.totalPages);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do blog:", err);
      if (isMounted.current) setError("Não foi possível carregar o conteúdo. Tente novamente.");
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }
  // Dependências: pageSize e o array de categorias (para garantir que buscou uma vez)
  }, [pageSize, categorias.length]);

  // Efeito para buscar dados iniciais e quando a página ou categoria selecionada muda
  useEffect(() => {
    isMounted.current = true; // Define como montado ao iniciar o efeito
    // Determina se é para anexar (append) - só anexa se não for a primeira página
    const shouldAppend = currentPage > 1;
    // Pega o primeiro ID de categoria selecionado (API atual só suporta um)
    const categoryToFilter = selectedCategories[0]; // Undefined se nenhum selecionado
    // Chama a função fetchData
    fetchData(currentPage, categoryToFilter, shouldAppend);

    // Função de limpeza que será executada quando o componente desmontar
    // ou antes de o efeito rodar novamente
    return () => {
      isMounted.current = false; // Define como desmontado
    };
  // Dispara o efeito quando currentPage ou selectedCategories mudar
  }, [currentPage, selectedCategories, fetchData]);

  // Handler para mudança de categoria no filtro
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      // Se já está selecionado, deseleciona (limpa o filtro)
      if (prev.includes(categoryId)) {
        return [];
      } else {
        // Senão, seleciona *apenas* este (sobrescreve seleção anterior)
        return [categoryId];
      }
    });
    // <<== IMPORTANTE: Reseta para a página 1 ao mudar o filtro
    setCurrentPage(1);
  };

  // Handler para mudança de tema (UI apenas por enquanto)
  const handleTemaChange = (tema: string) => {
    setSelectedTemas(prev =>
      prev.includes(tema)
        ? prev.filter(t => t !== tema)
        : [...prev, tema]
    );
  };

  // Handler para o botão "Ver Mais"
  const handleLoadMore = () => {
    // Só carrega mais se não estiver já carregando e se houver mais páginas
    if (!isLoadingMore && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1); // Incrementa a página, o useEffect cuidará da busca
    }
  };

  // Abre/fecha o painel de filtro
  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
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
              // Adicionar value e onChange se for implementar busca
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
              onClick={() => fetchData(1, selectedCategories[0])} // Tenta recarregar a primeira página
              className="ml-2 underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Grid principal */}
        <div className={styles.mainGrid}>
          {/* Painel de Filtros */}
          <BlogFilter
            isOpen={filterPanelOpen}
            categorias={categorias} // Passa as categorias carregadas
            selectedCategories={selectedCategories} // Passa os IDs selecionados
            onCategoryChange={handleCategoryChange} // Passa o handler
            selectedTemas={selectedTemas}
            onTemaChange={handleTemaChange}
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
                {/* Renderiza os posts do estado atual */}
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
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
            {/* Mostra se não estiver carregando, e se a página atual for menor que o total de páginas */}
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