import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Parse body apenas se houver conteúdo
    let body = null;
    try {
      const text = await req.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch (e) {
      // Se não conseguir fazer parse, body permanece null
    }
    
    // Se veio um slug no body, é busca por categoria específica
    if (body?.slug) {
      const { data: category, error } = await supabase
        .from('categories')
        .select(`
          *,
          produtos_count:products(count)
        `)
        .eq('slug', body.slug)
        .eq('is_active', true)
        .single()

      if (error) throw error

      if (!category) {
        return new Response(
          JSON.stringify({ error: 'Categoria não encontrada' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Processar categoria
      const processedCategory = {
        ...category,
        produtos_count: category.produtos_count?.[0]?.count || 0
      }

      return new Response(
        JSON.stringify({
          category: processedCategory
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})