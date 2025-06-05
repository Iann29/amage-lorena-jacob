import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { getCorsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) })
  }

  console.log('=== INICIO DA EDGE FUNCTION ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);

  try {
    // Use service role key to bypass RLS if needed
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse body
    let body = {};
    try {
      const text = await req.text();
      console.log('Texto do body:', text);
      if (text && text.trim() !== '') {
        body = JSON.parse(text);
      }
    } catch (e) {
      console.error('Erro ao fazer parse do body:', e);
      body = {};
    }
    
    console.log('Body parseado:', body);
    console.log('Tem slug?:', 'slug' in body);
    console.log('Valor do slug:', body.slug);
    
    // Se veio um slug no body, é busca por categoria específica
    if (body.slug !== undefined && body.slug !== null && body.slug !== '') {
      console.log('ENTRANDO NO MODO BUSCA POR SLUG:', body.slug);
      const { data: category, error } = await supabase
        .from('categories')
        .select(`
          *,
          produtos_count:products(count)
        `)
        .eq('slug', body.slug)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Erro ao buscar categoria:', error);
        throw error;
      }

      if (!category) {
        return new Response(
          JSON.stringify({ error: 'Categoria não encontrada' }),
          { status: 404, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
        )
      }

      // Processar categoria
      const processedCategory = {
        ...category,
        produtos_count: category.produtos_count?.[0]?.count || 0
      }

      console.log('Categoria encontrada:', processedCategory);

      return new Response(
        JSON.stringify({
          category: processedCategory
        }),
        { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      )
    } else {
      console.log('SLUG NÃO ENCONTRADO, RETORNANDO TODAS AS CATEGORIAS');
    }
    
    // Caso contrário, é listagem de categorias
      // Buscar categorias com contagem de produtos
      const { data: categories, error } = await supabase
        .from('categories')
        .select(`
          *,
          produtos_count:products(count)
        `)
        .eq('is_active', true)
        .order('nome')

      if (error) throw error

      // Processar categorias para adicionar contagem de produtos
      const processedCategories = categories?.map(category => ({
        ...category,
        produtos_count: category.produtos_count?.[0]?.count || 0
      })) || []

      return new Response(
        JSON.stringify({
          categories: processedCategories
        }),
        { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } 
      }
    )
  }
})