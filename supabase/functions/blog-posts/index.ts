// supabase/functions/blog-posts/index.ts
import { serve } from 'https://deno.land/std@0.220.1/http/server.ts';
import { createAnonClient } from '../_shared/supabase.ts';
import { 
  jsonResponse, 
  handleError, 
  getQueryParam, 
  isValidNumber, 
  isValidString,
  isValidUuid,
  formatPostForResponse
} from '../_shared/utils.ts';
import { isPreflightRequest, handleCors, getCorsHeaders } from '../_shared/cors.ts';

// Tipo para representar um post de blog público
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
    
    // Extrair parâmetros da query (opcionais)
    const limitParam = getQueryParam(url, 'limit');
    const pageParam = getQueryParam(url, 'page');
    const categoryId = getQueryParam(url, 'categoria');
    const searchTerm = getQueryParam(url, 'busca');
    
    // Validar todos os parâmetros usando as novas funções utilitárias
    if (limitParam && !isValidNumber(limitParam, 1, 50)) {
      return jsonResponse(
        null,
        false,
        400,
        { code: 'invalid_param', message: 'Parâmetro limit deve estar entre 1 e 50' }
      );
    }
    
    if (pageParam && !isValidNumber(pageParam, 1)) {
      return jsonResponse(
        null,
        false,
        400,
        { code: 'invalid_param', message: 'Parâmetro page deve ser maior que 0' }
      );
    }
    
    if (categoryId && !isValidUuid(categoryId)) {
      return jsonResponse(
        null,
        false,
        400,
        { code: 'invalid_param', message: 'ID de categoria inválido' }
      );
    }
    
    // Convertendo valores validados
    const limit = limitParam ? parseInt(limitParam) : 10;
    const page = pageParam ? parseInt(pageParam) : 1;

    // Inicializar cliente Supabase (usando anonymous key para conteúdo público)
    const supabase = createAnonClient();
    
    // Construir query
    let query = supabase
      .from('blog_posts')
      .select(`
        id,
        titulo,
        slug,
        resumo,
        imagem_destaque_url,
        author_id,
        author_nome,
        author_sobrenome,
        created_at,
        published_at,
        like_count,
        view_count,
        blog_post_categories (
          blog_categories ( id, nome )
        )
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    // Aplicar filtros opcionais
    if (searchTerm && isValidString(searchTerm)) {
      const searchTermSanitized = searchTerm.replace(/[%_]/g, '\\$&');
      query = query.or(`titulo.ilike.%${searchTermSanitized}%,resumo.ilike.%${searchTermSanitized}%`);
    }
    
    // Aplicar paginação
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    // Executar a consulta
    const { data: posts, error, count: totalCount } = await query.select('*', { count: 'estimated' });
    
    // Verificar erro
    if (error) {
      console.error('Erro ao buscar posts:', error.message);
      return jsonResponse(
        null,
        false,
        500,
        { code: 'database_error', message: 'Erro ao buscar posts do blog' }
      );
    }

    // Processar resultados
    if (!posts || posts.length === 0) {
      return jsonResponse({
        posts: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      });
    }
    
    // Extrair IDs dos posts para buscar contagens de comentários
    const postIds = posts.map(post => post.id);
    
    // Buscar contagens de comentários
    const { data: commentCounts, error: countError } = await supabase
      .from('blog_comments')
      .select('post_id, id')
      .in('post_id', postIds)
      .eq('is_approved', true);
      
    // Mapa para contagem de comentários
    const commentCountMap = new Map<string, number>();
    
    if (!countError && commentCounts) {
      commentCounts.forEach(comment => {
        if (comment.post_id) {
          const currentCount = commentCountMap.get(comment.post_id) || 0;
          commentCountMap.set(comment.post_id, currentCount + 1);
        }
      });
    }
    
    // Formatar posts para resposta usando a função utilitária
    let formattedPosts: BlogPostPublic[] = posts.map(post => 
      formatPostForResponse(post, commentCountMap)
    );
    
    // Filtrar por categoria (se especificada)
    if (categoryId) {
      formattedPosts = formattedPosts.filter(post => 
        post.categorias.some(cat => cat.id === categoryId)
      );
    }
    
    // Calcular total de páginas 
    const totalItems = totalCount || formattedPosts.length;
    const totalPages = Math.ceil(totalItems / limit);
    
    // Calcular o timestamp para expiração de cache (5 minutos)
    const expiresIn = new Date(Date.now() + 5 * 60 * 1000).toUTCString();
    
    // Headers otimizados (cache mais curto para lista de posts que muda mais frequentemente)
    const headers = {
      ...getCorsHeaders(req),
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=60',
      'Expires': expiresIn
    };
    
    // Retornar resposta formatada com informações de paginação
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          posts: formattedPosts,
          pagination: {
            page,
            limit,
            total: totalItems,
            totalPages
          }
        }
      }),
      { headers }
    );
    
  } catch (error) {
    return handleError(error);
  }
});
