import Image from 'next/image';
import React, { useEffect, useState } from 'react';

// Interface para dados estáticos do post (vindo do Supabase no futuro)
interface BlogPostData {
  id?: string | number; // id será importante para buscar dados específicos do post
  title: string;
  summary: string;
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

// Tipos para futura integração com Supabase
interface PostStats {
  views: number;
  comments: number;
}

/**
 * Componente de cartão de post do blog
 * No futuro, pode buscar automaticamente estatísticas de visualizações e comentários do Supabase
 */
const BlogPostCard: React.FC<BlogPostCardProps> = ({
  id,
  title,
  summary,
  imageUrl,
  postUrl,
  viewCount: initialViewCount,
  commentCount: initialCommentCount,
  slug
}) => {
  // Estados para armazenar as contagens (permitirá atualização dinâmica futura)
  const [viewCount, setViewCount] = useState<number>(initialViewCount || 0);
  const [commentCount, setCommentCount] = useState<number>(initialCommentCount || 0);
  
  // Exemplo de função para buscar estatísticas do post no futuro
  // No futuro, isso chamará o Supabase
  const fetchPostStats = async (postId: string | number | undefined, postSlug: string | undefined): Promise<PostStats> => {
    // Função mockada - no futuro, será substituída por uma chamada real ao Supabase
    // Exemplo de como será a consulta no futuro:
    // const { data, error } = await supabase
    //   .from('post_stats')
    //   .select('views, comments')
    //   .eq('post_id', postId || postSlug)
    //   .single()
    
    // Simula uma chamada assíncrona
    return new Promise((resolve) => {
      setTimeout(() => {
        // Retorna os valores iniciais por enquanto
        resolve({
          views: initialViewCount || 0,
          comments: initialCommentCount || 0
        });
      }, 100);
    });
  };

  // Efeito para buscar estatísticas quando o componente montar
  // Isso será útil quando integrarmos com o Supabase
  useEffect(() => {
    // Só tentaria buscar se tivermos um ID ou slug e não tivermos valores iniciais
    if ((id || slug) && (!initialViewCount || !initialCommentCount)) {
      const loadStats = async () => {
        try {
          const stats = await fetchPostStats(id, slug);
          setViewCount(stats.views);
          setCommentCount(stats.comments);
        } catch (error) {
          console.error('Erro ao carregar estatísticas do post:', error);
          // Mantém os valores iniciais em caso de erro
        }
      };
      
      // Comentado para não executar agora, será habilitado quando conectar ao Supabase
      // loadStats();
    }
  }, [id, slug, initialViewCount, initialCommentCount]);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col m-3" style={{ maxWidth: '380px', height: '450px' }}>
      <div className="h-64 overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={title} 
          width={400} 
          height={300}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-[#52A4DB] mb-2">{title}</h3>
        <p className="text-sm text-[#555555] mb-5 leading-tight">{summary}</p>
        <div className="mt-auto">
          <a 
            href={postUrl} 
            className="bg-[#0B5394] text-white text-center py-3 px-4 rounded-md inline-block w-full font-bold text-lg hover:bg-opacity-90 transition-all"
          >
            SAIBA MAIS
          </a>
          <div className="flex justify-between items-center mt-4 text-xs text-gray-500 pt-3 border-t border-gray-200">
            <span>{viewCount} visualizações</span>
            <span>{commentCount} comentários</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;

// Exportamos também a interface para uso em outros componentes
export type { BlogPostData };
