// supabase/functions/blog-popular/index.ts
import { serve } from 'https://deno.land/std@0.220.1/http/server.ts';
import { createAnonClient } from '../_shared/supabase.ts';
import { jsonResponse, handleError, getQueryParam, isValidNumber, formatPostForResponse } from '../_shared/utils.ts';
import { isPreflightRequest, handleCors, getCorsHeaders } from '../_shared/cors.ts';

// Tipo para representar um post de blog público
interface BlogPostPublic {
  id: string; 
  titulo: string;
  slug: string;
  resumo: string | null;
  imagem_destaque_url: string | null;
  published_at: string;
  created_at: string;
  like_count: number;
  view_count?: number;
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
    
    // Extrair quantidade máxima da query (opcional, padrão = 3)
    const limitParam = getQueryParam(url, 'limit');
    
    // Validar limite com a nova função utilitária
    if (!isValidNumber(limitParam, 1, 10)) {
      return jsonResponse(
        null,
        false,
        400,
        { code: 'invalid_param', message: 'Parâmetro limit deve estar entre 1 e 10' }
      );
    }
    
    const limit = limitParam ? parseInt(limitParam) : 3;

    // Inicializar cliente Supabase (usando chave anon para conteúdo público)
    const supabase = createAnonClient();
    
    // Buscar posts populares com uma estratégia de scoring ponderada
    const { data: posts, error } = await supabase
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
      // Função RPC personalizada para calcular popularidade (deve ser criada no banco)
      // Se essa função não existir, use as ordens abaixo como fallback
      .order('like_count', { ascending: false })
      .order('view_count', { ascending: false })
      .limit(limit);

    // Verificar erro
    if (error) {
      console.error('Erro ao buscar posts populares:', error.message);
      return jsonResponse(
        null,
        false,
        500,
        { code: 'database_error', message: 'Erro ao buscar posts populares do blog' }
      );
    }

    // Se não encontrou posts ou lista vazia
    if (!posts || posts.length === 0) {
      return jsonResponse([]);
    }
    
    // Formatar posts para resposta usando a função utilitária
    const formattedPosts: BlogPostPublic[] = posts.map(post => formatPostForResponse(post));

    // Calcular o timestamp para expiração de cache (10 minutos)
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000).toUTCString();
    
    // Retornar resposta formatada com cache otimizado para posts populares
    // Cache mais longo pois esses dados mudam com menos frequência
    const headers = {
      ...getCorsHeaders(req),
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=600, s-maxage=1800, stale-while-revalidate=300',
      'Expires': expiresIn
    };
    
    return new Response(
      JSON.stringify({ success: true, data: formattedPosts }),
      { headers }
    );
    
  } catch (error) {
    return handleError(error);
  }
});
