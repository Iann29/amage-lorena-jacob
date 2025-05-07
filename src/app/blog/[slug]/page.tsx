import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostBySlug, getPopularBlogPosts } from '../actions';
import type { BlogPostPublic } from '../actions'; 
import LikeButton from '@/components/blog/LikeButton';
import styles from './post.module.css';

// Metadados dinâmicos baseados no slug
export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Garantir que params seja aguardado antes de acessar suas propriedades
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
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
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  // Garantir que params seja aguardado antes de acessar suas propriedades
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  // Buscar o post pelo slug usando o Supabase
  const post = await getBlogPostBySlug(slug);
  // Buscar posts populares para exibir como sugestões
  const postsPopulares = await getPopularBlogPosts(3);
  
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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

          {/* Tags/Categorias do Post */}
          {post.categorias && post.categorias.length > 0 && (
            <div className="mt-8">
              <h4 className="font-semibold text-lg text-[#715B3F] mb-2">Categorias:</h4>
              <div className="flex flex-wrap gap-2">
                {post.categorias.map(categoria => (
                  <Link 
                    href={`/blog/categoria/${categoria.slug || categoria.nome.toLowerCase().replace(/\s+/g, '-')}`} 
                    key={categoria.id}
                    className={styles.tagLink}
                  >
                    {categoria.nome}
                  </Link>
                ))}
              </div>
            </div>
          )}
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
    </main>
  );
}
