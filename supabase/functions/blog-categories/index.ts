// supabase/functions/blog-categories/index.ts
import { serve } from 'https://deno.land/std@0.220.1/http/server.ts';
import { createAnonClient } from '../_shared/supabase.ts';
import { jsonResponse, handleError, generateSlug } from '../_shared/utils.ts';
import { isPreflightRequest, handleCors, getCorsHeaders } from '../_shared/cors.ts';

// Tipo para representar uma categoria pública de blog
interface BlogCategoryPublic {
  id: string;
  nome: string;
  slug: string;
  quantidade: number;
}

serve(async (req) => {
  // Tratamento de preflight requests para CORS
  if (isPreflightRequest(req)) {
    return handleCors(req);
  }

  try {
    // Inicializar cliente Supabase (usando chave anon para conteúdo público)
    const supabase = createAnonClient();
    
    // Buscar todas as categorias
    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select('id, nome');

    // Verificar erro
    if (error) {
      console.error('Erro ao buscar categorias:', error.message);
      return jsonResponse(
        null,
        false,
        500,
        { code: 'database_error', message: 'Erro ao buscar categorias do blog' }
      );
    }

    // Se não encontrou categorias ou lista vazia
    if (!categories || categories.length === 0) {
      return jsonResponse([]);
    }
    
    // Buscar contagens de posts por categoria de forma mais otimizada
    // usando contagem agrupada em uma única consulta
    const { data: categoryCounts, error: countError } = await supabase
      .rpc('get_category_post_counts');
    
    // Mapa para armazenar contagens
    const categoryCountMap = new Map<string, number>();
    
    // Se a função RPC não estiver disponível, usar o método alternativo
    if (countError || !categoryCounts) {
      console.warn('Função RPC get_category_post_counts não disponível, usando método alternativo');
      
      // Buscar relacionamentos muitos-para-muitos para cálculo de quantidades
      const { data: relationships, error: relError } = await supabase
        .from('blog_post_categories')
        .select(`
          category_id,
          post_id,
          blog_posts!inner(is_published)
        `)
        .in('category_id', categories.map(cat => cat.id))
        .eq('blog_posts.is_published', true);
        
      if (!relError && relationships && relationships.length > 0) {
        // Calcular contagens
        relationships.forEach(rel => {
          if (rel.category_id) {
            const current = categoryCountMap.get(rel.category_id) || 0;
            categoryCountMap.set(rel.category_id, current + 1);
          }
        });
      }
    } else {
      // Usar os resultados da função RPC se estiver disponível
      categoryCounts.forEach((count: { category_id: string; count: number }) => {
        categoryCountMap.set(count.category_id, count.count);
      });
    }
    
    // Formatar categorias para resposta usando a função utilitária de slug
    const formattedCategories: BlogCategoryPublic[] = categories.map(cat => ({
      id: cat.id,
      nome: cat.nome,
      slug: generateSlug(cat.nome),
      quantidade: categoryCountMap.get(cat.id) || 0
    }));

    // Calcular o timestamp para expiração de cache (30 minutos)
    const expiresIn = new Date(Date.now() + 30 * 60 * 1000).toUTCString();
    
    // Retornar resposta formatada com cache otimizado para categorias
    // Cache mais longo pois categorias mudam com menos frequência
    const headers = {
      ...getCorsHeaders(req),
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=600',
      'Expires': expiresIn
    };
    
    // Retornar categorias ordenadas por quantidade (mais populares primeiro)
    return new Response(
      JSON.stringify({
        success: true,
        data: formattedCategories.sort((a, b) => b.quantidade - a.quantidade)
      }),
      { headers }
    );
  } catch (error) {
    return handleError(error);
  }
});
