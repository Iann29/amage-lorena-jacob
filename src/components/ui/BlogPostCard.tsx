import Image from 'next/image';
import React, { useEffect } from 'react';

// Interface para dados estáticos do post (vindo do Supabase no futuro)
interface BlogPostData {
  id?: string | number; // id será importante para buscar dados específicos do post
  title: string;
  summary: string;
  content?: string; // Conteúdo HTML completo do post para extrair o texto inicial
  imageUrl: string;
  postUrl: string;
  viewCount?: number; // Opcional pois poderá ser buscado separadamente
  commentCount?: number; // Opcional pois poderá ser buscado separadamente
  slug?: string; // Slug para URL amigável e identificação do post
  created_at?: string; // Data de criação para ordenação/exibição
  author_id?: string; // Referência ao autor para obter dados adicionais
}

interface BlogPostCardProps extends BlogPostData {
  // Props estendidas para manter compatibilidade com uso atual
  viewCount?: number;
  commentCount?: number;
}

/**
 * Componente de cartão de post do blog
 * No futuro, pode buscar automaticamente estatísticas de visualizações e comentários do Supabase
 */
/**
 * Extrai o texto puro de uma string HTML e retorna um trecho com o tamanho especificado
 */
const extractTextFromHtml = (htmlContent: string | undefined, maxLength: number = 200): string => {
  if (!htmlContent) return "";
  
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

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  id,
  title,
  summary,
  content,
  imageUrl,
  postUrl,
  viewCount: initialViewCount,
  commentCount: initialCommentCount,
  slug
}) => {
  // Estados para armazenar as contagens (permitirá atualização dinâmica futura)
  const viewCount = initialViewCount || 0;
  const commentCount = initialCommentCount || 0;
  
  // Efeito para buscar estatísticas quando o componente montar
  // Isso será útil quando integrarmos com o Supabase
  useEffect(() => {
    // A função fetchPostStats foi removida pois não era chamada.
    // A lógica interna do if também foi removida/comentada pois dependia de fetchPostStats e dos setters.

    // Só tentaria buscar se tivermos um ID ou slug e não tivermos valores iniciais
    if ((id || slug) && (!initialViewCount || !initialCommentCount)) {
      // A função loadStats foi removida pois a chamada estava comentada e ela não era utilizada.
      // Se a lógica de carregamento for reativada, será necessário redefinir e chamar loadStats aqui.
      // Exemplo de como seria:
      // const loadAndSetStats = async () => {
      //   try {
      //     // const stats = await fetchPostStatsLocal(/*id, slug*/); // fetchPostStatsLocal precisaria ser definida
      //     // setViewCount(stats.views); // setViewCount não existe mais
      //     // setCommentCount(stats.comments); // setCommentCount não existe mais
      //   } catch (error) {
      //     console.error('Erro ao carregar estatísticas do post:', error);
      //   }
      // };
      // loadAndSetStats();
    }
  }, [id, slug, initialViewCount, initialCommentCount]);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col m-3 h-[320px] md:h-[450px]" style={{ maxWidth: '380px' }}>
      <div className="h-28 md:h-64 overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={title} 
          width={400} 
          height={300}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
      <div className="pt-1 px-3 pb-2 md:p-6 flex flex-col flex-grow">
        <h3 className="text-lg md:text-2xl font-bold text-[#6397C3] mb-1 md:mb-2 leading-tight" style={{ fontFamily: 'var(--font-museo-sans)' }}>{title}</h3>
        {/* Exibe o resumo se está disponível, ou um trecho do conteúdo se estiver disponível */}
        <p className="text-xs md:text-sm text-[#003169] mb-3 md:mb-5 leading-tight line-clamp-2 md:line-clamp-none">
          {content ? extractTextFromHtml(content, 100) : summary}
        </p>
        <div className="mt-auto">
          <a 
            href={postUrl} 
            className="bg-[#0B5394] text-white text-center py-1.5 md:py-2 px-4 rounded-md inline-block w-full font-bold text-base md:text-xl hover:bg-opacity-90 transition-all"
            style={{ fontFamily: 'var(--font-museo-sans)' }}
          >
            SAIBA MAIS
          </a>
          <div className="flex justify-between items-center mt-2 md:mt-4 text-xs text-gray-500 pt-2 md:pt-3 border-t-4 border-gray-200">
            {/* Mobile: Ícones */}
            <div className="flex items-center gap-1 md:hidden">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{viewCount}</span>
            </div>
            <div className="flex items-center gap-1 md:hidden">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{commentCount}</span>
            </div>
            
            {/* Desktop: Texto completo */}
            <div className="hidden md:flex items-center gap-3">
              <span>{viewCount} visualizações</span>
              <span>•</span>
              <span>{commentCount} comentários</span>
            </div>
            <div className="hidden md:block"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;

// Exportamos também a interface para uso em outros componentes
export type { BlogPostData };
