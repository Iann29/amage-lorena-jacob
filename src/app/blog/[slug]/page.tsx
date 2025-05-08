import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
// Importar as funções da nova API em vez das Server Actions
import { getBlogPostBySlug, getPopularBlogPosts, getPublishedBlogPosts } from '@/lib/blog-api';
import type { BlogPostPublic } from '@/lib/blog-api'; 
import LikeButton from '@/components/blog/LikeButton';
import styles from './post.module.css';
import PostViewTracker from '@/components/blog/PostViewTracker';

// Configuração para ISR - revalidação a cada 1 hora (3600 segundos)
export const revalidate = 3600;

// Gerar metadados dinâmicos baseados no slug
export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Usar destructuring com await para evitar o erro
  const { slug } = await Promise.resolve(params);
  
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post não encontrado | Lorena Jacob',
      description: 'O post que você procura não foi encontrado.'
    };
  }
  
  return {
    title: `${post.titulo} | Lorena Jacob`,
    description: post.resumo,
    openGraph: {
      title: `${post.titulo} | Lorena Jacob`,
      description: post.resumo || 'Blog de Lorena Jacob',
      images: post.imagem_destaque_url ? [post.imagem_destaque_url] : [],
      type: 'article',
    }
  };
}

// Gerar rotas estáticas para posts populares (ISR)
export async function generateStaticParams() {
  // Buscar posts populares e recentes para pré-renderizar
  const [popularPosts, recentPosts] = await Promise.all([
    getPopularBlogPosts(5),
    getPublishedBlogPosts(1, 10)
  ]);
  
  // Combinar posts populares e recentes, removendo duplicatas
  const slugs = new Set([
    ...popularPosts.map(post => post.slug),
    ...recentPosts.map(post => post.slug)
  ]);
  
  // Retornar parâmetros para geração estática
  return Array.from(slugs).map(slug => ({
    slug
  }));
}

// Componente de loading para Suspense
function PostContentSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
      <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
    </div>
  );
}

// Componente para o conteúdo do post (permite Suspense)
async function PostContent({ slug }: { slug: string }) {
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Conteúdo não disponível.</p>
      </div>
    );
  }
  
  return (
    <>
      {/* Identificação do Autor */}
      <div className={styles.authorLine}>
        <span>por {post.author.nome} {post.author.sobrenome}</span>
      </div>
      
      {/* Conteúdo do Post com estilos aplicados pelo CSS Module */}
      <div className={styles.postContent}>
        {post.conteudo ? (
          <div dangerouslySetInnerHTML={{ __html: post.conteudo }} />
        ) : (
          <p className="text-gray-600">Conteúdo não disponível.</p>
        )}
      </div>
      
      {/* Seção de Rodapé */}
      <div className={styles.footerActions}>
        <div className={styles.stats}>
          {post.view_count || 0} visualizações • {new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR')}
        </div>
        
        <div className={styles.actionButtons}>
          <div className={styles.stats}>{post.comment_count || 0} comentários</div>
          
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
    </>
  );
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  // Usar destructuring com await para evitar o erro
  const { slug } = await Promise.resolve(params);
  
  // Buscar o post pelo slug usando a Edge Function (para header e verificação)
  // Única chamada necessária para verificação e dados iniciais
  const post = await getBlogPostBySlug(slug);
  
  // Define comentários como array vazio temporariamente, até implementação futura
  const comments: any[] = [];

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

  return (
    <main className="min-h-screen bg-[#FFFFFF] relative">
      
      {/* Header do Post - carregar logo */}
      <header className="w-full relative">
        <h1 className={styles.blogHeaderTitle}>Blog</h1>
        <div className="relative h-[60vh] w-full max-h-[500px]">
          {post.imagem_destaque_url ? (
            <Image 
              src={post.imagem_destaque_url} 
              alt={post.titulo} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
              style={{ objectFit: 'cover' }}
              className="brightness-90 blur-sm"
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcvmrVfwAG8gLMxzEr0AAAAABJRU5ErkJggg=="
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
            </div>
          </div>
        </div>
      </header>
      
      <div className={styles.paperContainer}>
        <div className={styles.contentWrapper}>
          {/* Usar Suspense para o conteúdo do post - permite streaming */}
          <Suspense fallback={<PostContentSkeleton />}>
            <PostContent slug={slug} />
          </Suspense>
        </div>
      </div>

      {/* Seção de Comentários */}
      <div className={styles.commentsSection}>
        <div className={styles.commentHeader}>
          <div className={styles.commentTitle}>
            <Image 
              src="/assets/quercomentar.png"
              alt="Ícone de comentário"
              width={54}
              height={54}
              className="mr-2"
            />
            Quer comentar?
          </div>
          <div className={styles.commentSubtitle}>
            Entre com sua conta Google ou Conecte-se
          </div>
          <div className={styles.commentButtons}>
            <button className={styles.googleButton}>
              <Image 
                src="/assets/google.svg"
                alt="Google"
                width={24}
                height={24}
                className="mr-2"
              />
              Entrar com a Conta Google
            </button>
            <button className={styles.accountButton}>
              <Image 
                src="/assets/perfilIcon.png"
                alt="Perfil"
                width={32}
                height={32}
                className="mr-3"
              />
              Já tenho conta
            </button>
          </div>
        </div>

        <div className={styles.commentsList}>
          <h3 className="text-2xl font-bold text-[#9772FB] mb-6">Comentários</h3>
          
          {/* Lista de comentários - Será implementada no futuro */}
          {comments.length > 0 ? (
            comments.map((comment: any) => (
              <div key={comment.id} className={styles.commentItem}>
                <div className={styles.avatarContainer}>
                  <Image 
                    src={comment.user?.avatar_url || '/assets/avatar-default.png'}
                    alt={comment.user?.nome || 'Usuário'}
                    width={60}
                    height={60}
                    className={styles.commentAvatar}
                  />
                </div>
                <div className={styles.commentContent}>
                  <div className={styles.commentAuthor}>{comment.user?.nome || 'Usuário'}</div>
                  <div className={styles.commentDate}>
                    Comentado em: {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className={styles.commentText}>{comment.conteudo}</div>
                  <div className={styles.commentActions}>
                    <button className={styles.respondButton}>Responder</button>
                    <LikeButton 
                      itemId={comment.id}
                      itemType="comment"
                      initialLikeCount={comment.like_count || 0}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 mb-8">Seja o primeiro a comentar neste post!</p>
          )}
        </div>
      </div>
      
      {/* Componente para rastrear visualizações de forma assíncrona */}
      <PostViewTracker postId={post.id} slug={slug} />
    </main>
  );
}
