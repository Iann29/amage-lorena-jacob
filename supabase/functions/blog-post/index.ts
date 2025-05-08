import { serve } from 'https://deno.land/std@0.220.1/http/server.ts';
import { createAnonClient } from '../_shared/supabase.ts';
import { jsonResponse, handleError, isValidString, formatPostForResponse, generateSlug } from '../_shared/utils.ts';
import { isPreflightRequest, handleCors, getCorsHeaders } from '../_shared/cors.ts';

// Tipo para representar um post de blog para visualização pública
interface BlogPostPublic {
  id: string; 
  titulo: string;
  slug: string;
  resumo: string | null;
  conteudo: string;
  imagem_destaque_url: string | null;
  author_id: string | null;
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
    
    // Extrair o slug da URL (agora usando o parâmetro da query)
    // Exemplo: /functions/v1/blog-post?slug=meu-artigo
    const slug = getQueryParam(url, 'slug');
    
    // Verificar se o slug foi fornecido
    if (!isValidString(slug)) {
      return jsonResponse(
        null,
        false,
        400,
        { code: 'invalid_param', message: 'Parâmetro slug é obrigatório' }
      );
    }

    // Inicializar cliente Supabase (usando chave anon para conteúdo público)
    const supabase = createAnonClient();
    
    // Verificar se já temos esse post em cache para otimizar incremento de views
    // (Evitar contabilizar visualizações repetidas no mesmo navegador)
    let shouldIncrementView = true;
    const cacheKey = `post_view_${slug}`;
    
    try {
      // Use cookie ou localStorage no cliente para guardar posts vistos
      const viewCookie = req.headers.get('Cookie')?.match(new RegExp(`${cacheKey}=([^;]+)`));
      if (viewCookie && viewCookie[1]) {
        shouldIncrementView = false;
      }
    } catch (cookieError) {
      console.warn('Erro ao verificar cookie de visualização:', cookieError);
    }
    
    // Incrementar contador de visualizações em uma transação separada
    // (permite visualizações mesmo se o usuário sair da página antes de ler)
    if (shouldIncrementView) {
      try {
        await supabase.rpc('increment_post_view_count', { post_slug: slug });
      } catch (viewError) {
        console.warn('Erro ao incrementar visualizações:', viewError);
        // Continua mesmo com erro no contador de views
      }
    }
    
    // Buscar o post pelo slug
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        titulo,
        slug,
        resumo,
        conteudo,
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
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    // Verificar erro
    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 = not found para single()
        return jsonResponse(
          null,
          false,
          404,
          { code: 'post_not_found', message: 'Post não encontrado' }
        );
      }
      
      console.error('Erro ao buscar post:', error.message);
      return jsonResponse(
        null,
        false,
        500,
        { code: 'database_error', message: 'Erro ao buscar post do blog' }
      );
    }

    // Se não encontrou o post
    if (!post) {
      return jsonResponse(
        null,
        false,
        404,
        { code: 'post_not_found', message: 'Post não encontrado' }
      );
    }
    
    // Buscar quantidade de comentários
    const { count: commentCount, error: commentError } = await supabase
      .from('blog_comments')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', post.id)
      .eq('is_approved', true);
    
    const comment_count = commentError ? 0 : (commentCount || 0);
    
    // Extrair e formatar categorias
    const categorias = [];
    
    if (post.blog_post_categories && Array.isArray(post.blog_post_categories)) {
      for (const categoryRelation of post.blog_post_categories) {
        const catInfo: any = categoryRelation;
        if (catInfo.blog_categories && typeof catInfo.blog_categories === 'object') {
          categorias.push({
            id: catInfo.blog_categories.id,
            nome: catInfo.blog_categories.nome,
            slug: generateSlug(catInfo.blog_categories.nome)
          });
        }
      }
    }
    
    // Formatar dados do autor
    const author = {
      nome: (post as any).author_nome || 'Lorena',
      sobrenome: (post as any).author_sobrenome || 'Jacob'
    };

    // Montar o objeto final do post
    const formattedPost: BlogPostPublic = {
      ...post,
      author,
      categorias,
      comment_count
    };

    // Definir política de cache para posts
    // Vamos usar um cache mais longo pois posts publicados raramente mudam
    const cacheTime = 1800; // 30 minutos
    const expiresIn = new Date(Date.now() + cacheTime * 1000).toUTCString();
    
    // Definir cookie de visualização para não contar views repetidas
    const viewCookieExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    
    const headers = {
      ...getCorsHeaders(req),
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${cacheTime}, s-maxage=${cacheTime * 2}, stale-while-revalidate=300`,
      'Expires': expiresIn,
      ...(shouldIncrementView ? {
        'Set-Cookie': `${cacheKey}=true; Expires=${viewCookieExpires}; Path=/; SameSite=Lax`
      } : {})
    };
    
    // Retornar o post formatado com cache otimizado
    return new Response(
      JSON.stringify({ success: true, data: formattedPost }),
      { headers }
    );
    
  } catch (error) {
    return handleError(error);
  }
});

// Função auxiliar para obter parâmetros da URL (adicionado aqui para ter todas as dependências)
function getQueryParam(url: URL, param: string): string | null {
  return url.searchParams.get(param);
} 