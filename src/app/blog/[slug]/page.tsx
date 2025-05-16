// src/app/blog/[slug]/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
// Importar as funções da nova API
import { getBlogPostBySlug, getPopularBlogPosts, getPublishedBlogPosts } from '@/lib/blog-api'; // Remova getPopularBlogPosts se não usar
import LikeButton from '@/components/blog/LikeButton';
import styles from './post.module.css';
// import PostViewTracker from '@/components/blog/PostViewTracker'; // <<< LINHA REMOVIDA

// Novos imports
import CommentSection from '@/components/blog/CommentSection';
import type { CommentData, CommentUser } from '@/components/blog/CommentSection';
import { getCommentsTreeByPostId } from '@/app/comments/actions';
import { createClient } from '@/utils/supabase/server';
import ShareButton from '@/components/blog/ShareButton';

export const revalidate = 3600;

interface PostPageProps {
  // Tipando params como Promise para tentar satisfazer a restrição do Vercel
  params: Promise<{ slug: string }>; 
  // searchParams: { [key: string]: string | string[] | undefined }; // Adicionar se usar searchParams
}

// Metadados dinâmicos
export async function generateMetadata(props: PostPageProps) {
  // Como props.params agora é tipado como Promise, podemos usar await diretamente.
  // No entanto, Next.js provavelmente ainda passa um objeto. O `await` aqui se torna
  // uma forma de resolver o tipo para o TypeScript e satisfazer a exigência de runtime do Next.js.
  const paramsObject = await props.params; 
  const slug = paramsObject.slug;
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
  try {
    const [popularPostsResult, recentPostsResponse] = await Promise.all([
       getPopularBlogPosts(5),
       getPublishedBlogPosts(1, 10)
    ]);
    const popularPosts = Array.isArray(popularPostsResult) ? popularPostsResult : [];
    const recentPosts = Array.isArray(recentPostsResponse?.posts) ? recentPostsResponse.posts : [];
    const slugs = new Set<string>();
    popularPosts.forEach(post => { if (post?.slug) slugs.add(post.slug); });
    recentPosts.forEach(post => { if (post?.slug) slugs.add(post.slug); });
    const validSlugs = Array.from(slugs);
    return validSlugs.map(slug => ({ slug }));
  } catch (error) {
      console.error("Erro CRÍTICO durante generateStaticParams:", error);
      return [];
  }
}

// Componente de loading
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

// Componente para o conteúdo do post
async function PostContent({ slug }: { slug: string }) {
  const post = await getBlogPostBySlug(slug);
  if (!post) { return <div className="text-center py-4"><p className="text-gray-600">Conteúdo não disponível.</p></div>; }
  
  // Construir a URL completa sem usar window
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lorenajacob.com.br';
  const postUrl = `${baseUrl}/blog/${slug}`;
  
  return (
    <>
      <div className={styles.authorLine}><span>por {post.author.nome} {post.author.sobrenome}</span></div>
      <div className={styles.postContent}>
        {post.conteudo ? <div dangerouslySetInnerHTML={{ __html: post.conteudo }} /> : <p className="text-gray-600">Conteúdo não disponível.</p>}
      </div>
      <div className={styles.footerActions}>
        <div className={styles.stats}>{post.view_count || 0} visualizações • {new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR')}</div>
        <div className={styles.actionButtons}>
          <div className={styles.stats}>{post.comment_count || 0} comentários</div>
          <ShareButton 
            title={post.titulo} 
            url={postUrl} 
          />
          <LikeButton itemId={post.id} itemType="post" initialLikeCount={post.like_count} />
        </div>
      </div>
    </>
  );
}

// Componente Principal da Página
export default async function PostPage(props: PostPageProps) {
  // Similar a generateMetadata, tratamos props.params como uma Promise devido à tipagem.
  const paramsObject = await props.params;
  const slug = paramsObject.slug;

  // 1. Buscar dados do post
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.id) {
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

  // 2. Buscar dados do usuário logado (currentUser)
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  let currentUserData: CommentUser | null = null;

  if (authUser) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('user_id, nome, sobrenome, avatar_url')
      .eq('user_id', authUser.id)
      .single();
    if (profile) {
      currentUserData = {
        id: profile.user_id,
        nome: profile.nome,
        avatar_url: profile.avatar_url
      };
    }
  }

  // 3. Buscar comentários para o post
  let commentsData: CommentData[] = [];
  const commentsResult = await getCommentsTreeByPostId(post.id);
  if (commentsResult.success && commentsResult.data) {
    commentsData = commentsResult.data;
  } else {
    console.error("Erro ao buscar comentários para o post:", commentsResult.message);
  }

  return (
    <main className="min-h-screen bg-[#FFFFFF] relative">

      {/* Header do Post */}
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

      {/* Conteúdo do Post (dentro do container de papel) */}
      <div className={styles.paperContainer}>
        <div className={styles.contentWrapper}>
          <Suspense fallback={<PostContentSkeleton />}>
            <PostContent slug={slug} />
          </Suspense>
        </div>
      </div>

      {/* NOVA SEÇÃO "QUER COMENTAR?" (se não logado) - Fora do paperContainer, largura total */}
      {!currentUserData && (
        <div 
          className="py-12 sm:py-16 text-center w-full mt-32" 
          style={{ backgroundColor: '#6FB1CE' }} 
        >
          <div className="container mx-auto px-4"> 
            <div className="flex items-center justify-center gap-4 mb-5">
              <Image src="/assets/quercomentar.png" alt="Ícone de comentário" width={68} height={68} />
              <h3 className="text-6xl font-bold text-white" style={{ fontFamily: 'var(--font-museo-sans)' }}>Quer comentar?</h3>
            </div>
            <p className="text-lg text-white mb-12 text-center" style={{ fontFamily: 'var(--font-museo-sans)' }}>
              Entre com sua conta Google ou Conecte-se
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4 max-w-xl mx-auto">
              <button 
                type="button"
                className="bg-white text-gray-800 px-8 py-4 rounded-lg border border-gray-300 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors w-full sm:min-w-[300px] shadow-md text-lg font-medium"
              >
                <Image src="/assets/google.svg" alt="Google" width={26} height={26} />
                <span className="whitespace-nowrap">Entrar com a Conta Google</span>
              </button>
              <Link 
                href="/login" 
                className="px-8 py-4 rounded-lg flex items-center justify-center gap-3 hover:opacity-90 transition-opacity w-full sm:min-w-[300px] shadow-md text-xl font-medium"
                style={{ backgroundColor: '#FFFEEC', color: '#378DB2', fontFamily: 'var(--font-museo-sans)' }}
              >
                <Image src="/assets/perfilIcon.png" alt="Perfil" width={32} height={32} />
                <span className="whitespace-nowrap">Já tenho conta</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Seção de Comentários (formulário se logado + lista) - DENTRO do container de largura normal */}
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-2xl font-semibold text-[#715B3F] mb-6">Comentários</h2> {/* Título movido para cá */}
        <CommentSection 
          postId={post.id} 
          comments={commentsData} 
          currentUser={currentUserData} 
        />
      </div>

      {/* Componente para rastrear visualizações foi removido daqui */}
      {/* <PostViewTracker postId={post.id} slug={slug} /> */}
    </main>
  );
}