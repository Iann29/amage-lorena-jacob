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
  const postsPopulares = getPopularPosts();
  
  // Obter as cores definidas para o post ou usar cores padrão
  const coresPost = post?.cores || {
    textoPadrao: '#715B3F',   // Cor padrão para texto
    tituloPrincipal: '#715B3F', // Cor para o título principal
    titulosH2: ['#715B3F', '#715B3F', '#715B3F'] // Cores padrão para os títulos H2
  };
  
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
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-center items-center">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className={styles.postTitle}>
                {post.titulo}
              </h2>
              
              {post.resumo && (
                <p className={styles.postSubtitle}>
                  {post.resumo}
                </p>
              )}
              
              {/* Espaço reservado para futuros elementos */}
            </div>
          </div>
        </div>
      </header>
      
      <div className={styles.paperContainer}>
        <div className={styles.contentWrapper}>
          {/* Identificação do Autor */}
          <div className={styles.authorLine}>
            <span>por {post.author.nome}</span>
          </div>
          
          {/* Título Principal do Post com cor personalizada */}
          <h1 
            className={styles.contentTitle}
            style={{ color: coresPost.tituloPrincipal }}
          >
            {post.titulo}
          </h1>
          
          {/* Conteúdo do Post com estilos aplicados pelo CSS Module e cores personalizadas */}
          <div 
            className={styles.postContent}
            style={{ 
              '--texto-cor': coresPost.textoPadrao,
              '--titulo1-cor': coresPost.titulosH2[0] || coresPost.textoPadrao,
              '--titulo2-cor': coresPost.titulosH2[1] || coresPost.textoPadrao,
              '--titulo3-cor': coresPost.titulosH2[2] || coresPost.textoPadrao,
            } as React.CSSProperties}
          >
            <div dangerouslySetInnerHTML={{ __html: post.conteudo }} />
          </div>
          
          {/* Seção de Rodapé */}
          <div className={styles.footerActions}>
            <div className={styles.stats}>
              {post.visualizacoes} visualizações • {new Date(post.created_at).toLocaleDateString('pt-BR')}
            </div>
            
            <div className={styles.actionButtons}>
              <div className={styles.stats}>{comments.length} comentários</div>
              
              <button className="flex items-center justify-center hover:opacity-80 transition">
                <Image 
                  src="/assets/compartilharIcon.svg" 
                  alt="Compartilhar" 
                  width={22} 
                  height={22}
                />
              </button>
              
              <LikeButton 
                itemId={post.id} 
                itemType="post" 
                initialLikeCount={post.like_count} 
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
