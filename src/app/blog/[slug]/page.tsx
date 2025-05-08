// src/app/blog/[slug]/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
// Importar as funções da nova API
import { getBlogPostBySlug, getPopularBlogPosts, getPublishedBlogPosts } from '@/lib/blog-api'; // Remova getPopularBlogPosts se não usar
import type { BlogPostPublic } from '@/lib/blog-api';
import LikeButton from '@/components/blog/LikeButton';
import styles from './post.module.css';
import PostViewTracker from '@/components/blog/PostViewTracker';

export const revalidate = 3600;

// Metadados dinâmicos (mantido como estava)
export async function generateMetadata({ params }: { params: { slug: string } }) {
  // ... (código existente)
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

// <<== FUNÇÃO CORRIGIDA ABAIXO ==>>
// Gerar rotas estáticas para posts populares (ISR)
export async function generateStaticParams() {
  console.log("Executando generateStaticParams..."); // Log para depuração no build
  try {
    // Buscar posts populares e a *resposta completa* de posts recentes
    // Adicionado timeout para evitar race conditions em alguns ambientes de build
    const [popularPostsResult, recentPostsResponse] = await Promise.all([
       getPopularBlogPosts(5), // Assumindo que retorna BlogPostPublic[] diretamente
       getPublishedBlogPosts(1, 10) // Retorna { posts: BlogPostPublic[], pagination: {} }
    ]);

    // Validar resultados antes de usar .map
    const popularPosts = Array.isArray(popularPostsResult) ? popularPostsResult : [];
    // >>> Acessar o array 'posts' dentro do objeto de resposta <<<
    const recentPosts = Array.isArray(recentPostsResponse?.posts) ? recentPostsResponse.posts : [];

    console.log(`generateStaticParams: Encontrados ${popularPosts.length} populares e ${recentPosts.length} recentes.`);

    // Combinar slugs, garantindo que são strings válidas e removendo duplicatas
    const slugs = new Set<string>(); // Tipar o Set explicitamente

    popularPosts.forEach(post => {
      if (post && typeof post.slug === 'string' && post.slug.trim() !== '') {
        slugs.add(post.slug);
      } else {
         console.warn("generateStaticParams: Post popular inválido ou sem slug:", post);
      }
    });

    recentPosts.forEach(post => {
      if (post && typeof post.slug === 'string' && post.slug.trim() !== '') {
        slugs.add(post.slug);
      } else {
         console.warn("generateStaticParams: Post recente inválido ou sem slug:", post);
      }
    });

    const validSlugs = Array.from(slugs);
    console.log(`generateStaticParams: Total de slugs únicos para gerar: ${validSlugs.length}`);
    // console.log("Slugs:", validSlugs); // Descomente para ver os slugs no log do build

    // Retornar parâmetros para geração estática, garantindo que slug existe
    const params = validSlugs.map(slug => ({
      slug: slug, // Garante que slug é uma string válida
    }));

    // console.log("Params gerados:", params); // Descomente para ver os parâmetros
    return params;

  } catch (error) {
      console.error("Erro CRÍTICO durante generateStaticParams:", error);
      // Retornar um array vazio em caso de erro para permitir que o build continue,
      // mas as páginas não serão geradas estaticamente.
      // Se você *precisar* que essas páginas sejam estáticas, o build deve falhar aqui.
      return [];
  }
}


// Componente de loading (mantido como estava)
function PostContentSkeleton() {
  // ... (código existente) ...
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

// Componente para o conteúdo do post (mantido como estava)
async function PostContent({ slug }: { slug: string }) {
  // ... (código existente) ...
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

// Componente principal da página (mantido como estava)
export default async function PostPage({ params }: { params: { slug: string } }) {
  // ... (código existente) ...
   const { slug } = await Promise.resolve(params);
  const post = await getBlogPostBySlug(slug);
  const comments: any[] = []; // Mock

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

      <div className={styles.paperContainer}>
        <div className={styles.contentWrapper}>
          {/* Usar Suspense para o conteúdo do post */}
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
           {comments.length > 0 ? (
             comments.map((comment: any) => (
               <div key={comment.id} className={styles.commentItem}>
                 {/* ... estrutura do comentário ... */}
               </div>
             ))
           ) : (
             <p className="text-gray-600 mb-8">Seja o primeiro a comentar neste post!</p>
           )}
        </div>
      </div>

      {/* Componente para rastrear visualizações */}
      <PostViewTracker postId={post.id} slug={slug} />
    </main>
  );
}