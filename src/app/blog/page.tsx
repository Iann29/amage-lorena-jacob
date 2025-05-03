import Image from 'next/image';
import { blogPosts, blogCategorias, getPopularPosts } from '@/lib/mockData';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import Pagination from '@/components/blog/Pagination';
import styles from './blog.module.css';

export const metadata = {
  title: 'Blog | Lorena Jacob',
  description: 'Artigos, dicas e informações sobre desenvolvimento infantil, autismo, TDAH e educação especial de Lorena Jacob - Terapeuta Infantil.'
};

export default function BlogPage() {
  // Em uma implementação real, esses dados viriam do Supabase
  const posts = blogPosts;
  const categorias = blogCategorias;
  const postsPopulares = getPopularPosts(3);
  
  // Dados de paginação
  const currentPage = 1;
  const totalPages = 3; // Mockado, seria calculado com base no total de posts

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
          </div>
        </div>
        
        {/* Contador de posts */}
        <div className="text-center mb-8 text-gray-500">
          TODOS ({posts.length})
        </div>
        
        {/* Grid principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar (apenas em desktop) */}
          <div className="hidden lg:block lg:w-1/4">
            <BlogSidebar 
              categorias={categorias} 
              postsPopulares={postsPopulares} 
            />
          </div>
          
          {/* Lista de Posts */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
