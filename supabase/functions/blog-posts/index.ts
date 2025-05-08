// supabase/functions/blog-posts/index.ts
import { serve } from 'https://deno.land/std@0.220.1/http/server.ts';
import { createAnonClient } from '../_shared/supabase.ts';
import {
  jsonResponse,
  handleError,
  getQueryParam,
  isValidNumber,
  isValidString,
  isValidUuid, // <<== Importado para validar o ID da categoria
  formatPostForResponse
} from '../_shared/utils.ts';
import { isPreflightRequest, handleCors, getCorsHeaders } from '../_shared/cors.ts';

// Tipo para representar um post de blog público (mantenha como está)
interface BlogPostPublic {
  id: string;
  titulo: string;
  slug: string;
  resumo: string | null;
  conteudo?: string;
  imagem_destaque_url: string | null;
  author_id: string | null;
  author_nome?: string;
  author_sobrenome?: string;
  published_at: string;
  created_at: string;
  like_count: number;
  view_count?: number;
  comment_count?: number;
  author: {
    nome: string;
    sobrenome: string;
  };
  categorias: {
    id: string;
    nome: string;
    slug?: string;
  }[];
}

serve(async (req) => {
  // Tratamento de preflight requests para CORS
  if (isPreflightRequest(req)) {
    return handleCors(req);
  }

  try {
    const url = new URL(req.url);

    // Extrair parâmetros da query
    const limitParam = getQueryParam(url, 'limit');
    const pageParam = getQueryParam(url, 'page');
    const categoryId = getQueryParam(url, 'categoria'); // <<== Obtém o ID da categoria
    const searchTerm = getQueryParam(url, 'busca');

    // Validar parâmetros (limite, página)
    if (limitParam && !isValidNumber(limitParam, 1, 50)) {
      return jsonResponse(null, false, 400, { code: 'invalid_param', message: 'Parâmetro limit deve estar entre 1 e 50' });
    }
    if (pageParam && !isValidNumber(pageParam, 1)) {
      return jsonResponse(null, false, 400, { code: 'invalid_param', message: 'Parâmetro page deve ser maior que 0' });
    }
    // <<== Validar o categoryId (UUID) se ele foi fornecido
    if (categoryId && !isValidUuid(categoryId)) {
       return jsonResponse(null, false, 400, { code: 'invalid_param', message: 'ID de categoria inválido' });
    }

    const limit = limitParam ? parseInt(limitParam) : 10; // Pode ajustar o padrão se quiser
    const page = pageParam ? parseInt(pageParam) : 1;

    // Inicializar cliente Supabase anônimo
    const supabase = createAnonClient();

    // Construir a query base
    // Usamos 'exact' na contagem para ter o total correto após filtros
    let query = supabase
      .from('blog_posts')
      .select(`
        id, titulo, slug, resumo, imagem_destaque_url, author_id, author_nome, author_sobrenome,
        created_at, published_at, like_count, view_count,
        blog_post_categories!inner( category_id, blog_categories(id, nome) )
      `, { count: 'exact' }) // <<== Contagem exata
      .eq('is_published', true);

    // <<== Aplicar filtro de categoria DIRETAMENTE na query do banco
    if (categoryId) {
      // Filtra posts onde a tabela 'blog_post_categories' tem uma linha com o 'category_id'
      query = query.eq('blog_post_categories.category_id', categoryId);
    }

    // Aplicar filtro de busca (se houver)
    if (searchTerm && isValidString(searchTerm)) {
       const searchTermSanitized = searchTerm.replace(/[%_]/g, '\\$&');
       // Busca simples no título ou resumo
       query = query.or(`titulo.ilike.%${searchTermSanitized}%,resumo.ilike.%${searchTermSanitized}%`);
       // Para busca mais avançada no conteúdo, considere full-text search no Supabase
    }

    // Aplicar ordenação (posts mais recentes primeiro)
    query = query.order('published_at', { ascending: false });

    // Aplicar paginação *depois* dos filtros
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Executar a consulta
    const { data: postsData, error, count: totalCount } = await query;

    // Verificar erro do banco
    if (error) {
      console.error('Erro ao buscar posts do Supabase:', error.message);
      return jsonResponse(null, false, 500, { code: 'database_error', message: 'Erro ao buscar posts do blog' });
    }

    // Buscar contagens de comentários para os posts retornados (otimizado)
    const postIds = postsData?.map(post => post.id) ?? [];
    const commentCountMap = new Map<string, number>();
    if (postIds.length > 0) {
        const { data: commentCounts, error: countError } = await supabase
          .from('blog_comments')
          .select('post_id, id', { count: 'exact', head: true }) // Otimização: só precisamos da contagem
          .in('post_id', postIds)
          .eq('is_approved', true)
          .then(response => ({ ...response, data: null, count: response.count })); // Ajuste para usar apenas o count

        if (!countError && typeof commentCounts === 'number') { // Verifica se a contagem foi retornada
           // Aqui precisamos buscar os comentários individualmente ou adaptar a lógica
           // A otimização acima com head:true só retorna a contagem total, não por post.
           // Vamos reverter para buscar os IDs e contar no código por enquanto:
           const { data: commentsData, error: commentsError } = await supabase
              .from('blog_comments')
              .select('post_id') // Seleciona apenas o post_id
              .in('post_id', postIds)
              .eq('is_approved', true);

           if (!commentsError && commentsData) {
                commentsData.forEach(comment => {
                    if (comment.post_id) {
                        const currentCount = commentCountMap.get(comment.post_id) || 0;
                        commentCountMap.set(comment.post_id, currentCount + 1);
                    }
                });
           } else if (commentsError) {
               console.error("Erro ao buscar comentários para contagem:", commentsError.message);
           }
        } else if (countError) {
            console.error("Erro ao obter contagem de comentários:", countError.message);
        }
    }

    // Formatar os posts para a resposta
    const formattedPosts: BlogPostPublic[] = postsData?.map(post =>
      formatPostForResponse(post, commentCountMap) // Passa o mapa de contagens
    ) ?? [];

    // Calcular total de páginas baseado na contagem *exata*
    const totalItems = totalCount || 0; // Usa a contagem retornada pela query principal
    const totalPages = Math.ceil(totalItems / limit);

    // Configurar headers de cache
    const expiresIn = new Date(Date.now() + 5 * 60 * 1000).toUTCString(); // 5 min cache
    const headers = {
      ...getCorsHeaders(req),
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=60',
      'Expires': expiresIn
    };

    // Retornar resposta com posts e paginação
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          posts: formattedPosts,
          pagination: { page, limit, total: totalItems, totalPages }
        }
      }),
      { headers }
    );

  } catch (error) {
    // Tratar erros gerais da função
    return handleError(error);
  }
});