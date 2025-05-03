import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getCommentsByPostId, getPopularPosts, blogCategorias } from '@/lib/mockData';
import LikeButton from '@/components/blog/LikeButton';
import CommentSection from '@/components/blog/CommentSection';
import BlogSidebar from '@/components/blog/BlogSidebar';
import styles from './post.module.css';

// Metadados dinâmicos baseados no slug
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post não encontrado | Lorena Jacob',
      description: 'O post que você procura não foi encontrado.'
    };
  }
  
  return {
    title: `${post.titulo} | Lorena Jacob`,
    description: post.resumo,
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  // Em uma implementação real, esses dados viriam do Supabase
  const post = getPostBySlug(params.slug);
  const comments = post ? getCommentsByPostId(post.id) : [];
  const postsPopulares = getPopularPosts(3);
  
  // Se o post não existir, mostrar mensagem de erro
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-[#715B3F] mb-4">Post não encontrado</h1>
        <p className="text-gray-600 mb-8">
          O post que você está procurando não existe ou foi removido.
        </p>
        <Link 
          href="/blog" 
          className="inline-block bg-[#715B3F] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition"
        >
          Voltar para o Blog
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
      
      {/* Header do Post */}
      <header className="w-full relative">
        <h1 className={styles.blogHeaderTitle}>Blog</h1>
        <div className="relative h-[60vh] w-full max-h-[500px]">
          {post.imagem_destaque_url ? (
            <Image 
              src={post.imagem_destaque_url} 
              alt={post.titulo} 
              fill
              style={{ objectFit: 'cover' }}
              className="brightness-90"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xl">Sem imagem de destaque</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
            <div className="container mx-auto max-w-4xl">
              <h1 className={styles.postTitle}>
                {post.titulo}
              </h1>
              
              {post.resumo && (
                <p className={styles.postSubtitle}>
                  {post.resumo}
                </p>
              )}
              
              <div className="flex flex-wrap items-center text-white gap-x-6 gap-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
                    {post.author.avatar_url ? (
                      <Image 
                        src={post.author.avatar_url} 
                        alt={post.author.nome} 
                        width={32} 
                        height={32} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                        {post.author.nome.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span>por {post.author.nome}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span>{formatDate(post.created_at)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span>{post.visualizacoes} visualizações</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <LikeButton 
                    itemId={post.id} 
                    itemType="post" 
                    initialLikeCount={post.like_count} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Conteúdo Principal */}
          <div className="lg:w-8/12">
            {/* Categorias */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categorias.map(cat => (
                <Link 
                  key={cat.id} 
                  href={`/blog/categoria/${cat.slug}`}
                  className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition"
                >
                  {cat.nome}
                </Link>
              ))}
            </div>
            
            {/* Conteúdo do Post */}
            <article className="prose prose-lg max-w-none prose-headings:text-[#715B3F] prose-a:text-blue-600">
              <div dangerouslySetInnerHTML={{ __html: post.conteudo }} />
            </article>
            
            {/* Seção de Compartilhamento */}
            <div className="mt-12 flex items-center justify-between border-t border-b border-gray-200 py-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Compartilhar:</span>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                    <span className="sr-only">Compartilhar no Facebook</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                    <span className="sr-only">Compartilhar no Twitter</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                    <span className="sr-only">Compartilhar no WhatsApp</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <LikeButton 
                itemId={post.id} 
                itemType="post" 
                initialLikeCount={post.like_count} 
              />
            </div>
            
            {/* Seção de Comentários */}
            <CommentSection 
              postId={post.id} 
              comments={comments} 
            />
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-4/12">
            <BlogSidebar 
              categorias={blogCategorias} 
              postsPopulares={postsPopulares} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}
