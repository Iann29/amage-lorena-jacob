"use client";

import Image from 'next/image';
import Link from 'next/link';
import LikeButton from './LikeButton';

/**
 * Extrai o texto puro de uma string HTML e retorna um trecho com o tamanho especificado
 */
const extractTextFromHtml = (htmlContent: string, maxLength: number = 200): string => {
  // Remove todas as tags HTML deixando apenas o texto
  const plainText = htmlContent.replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  
  // Retorna um trecho do texto com o tamanho especificado
  if (plainText.length <= maxLength) return plainText;
  
  // Corta no espaço mais próximo para não quebrar palavras
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  
  return truncated.substring(0, lastSpaceIndex) + "...";
};

interface BlogPostCardProps {
  post: {
    id: string; // UUID no banco de dados
    titulo: string;
    slug: string;
    resumo: string | null; // Null permitido no banco
    conteudo?: string;
    imagem_destaque_url: string | null; // Null permitido no banco
    created_at: string;
    like_count: number;
    view_count?: number; // Campo calculado
    comment_count?: number; // Campo calculado
    author: {
      nome: string;
      sobrenome?: string;
    };
    categorias: {
      id: string; // UUID no banco de dados
      nome: string;
      slug?: string; // Gerado pelo código
    }[];
  };
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  // const [likes, setLikes] = useState(post.like_count);

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-5">
          {post.imagem_destaque_url ? (
            <Image 
              src={post.imagem_destaque_url} 
              alt={post.titulo} 
              fill
              style={{ objectFit: 'cover' }}
              className="bg-gray-100"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="w-full h-full bg-gray-300"></div>
            </div>
          )}
        </div>
      </Link>
      
      <div>
        <h2 className="text-2xl font-bold mb-3 text-[#6397C3]" style={{ fontFamily: 'var(--font-museo-sans)' }}>
          <Link href={`/blog/${post.slug}`} className="hover:opacity-80 transition">
            {post.titulo}
          </Link>
        </h2>
        
        <p className="text-gray-700 mb-6 text-base leading-relaxed">
          {post.conteudo 
            ? extractTextFromHtml(post.conteudo, 180) 
            : post.resumo || ""}
        </p>
        
        <div className="flex justify-between items-center pt-4 border-t-4 border-gray-200">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              {post.view_count || 0} {post.view_count === 1 ? 'visualização' : 'visualizações'}
            </span>
            <span>
              {post.comment_count || 0} {post.comment_count === 1 ? 'comentário' : 'comentários'}
            </span>
          </div>
          
          <LikeButton 
            itemId={post.id} 
            itemType="post" 
            initialLikeCount={post.like_count} 
          />
        </div>
      </div>
    </article>
  );
}