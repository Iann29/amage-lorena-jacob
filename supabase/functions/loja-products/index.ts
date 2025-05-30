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
    
    // Se veio um slug no body, é busca por produto específico
    if (body?.slug) {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('slug', body.slug)
        .eq('is_active', true)
        .single()

      if (error) throw error

      if (!product) {
        return new Response(
          JSON.stringify({ error: 'Produto não encontrado' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Buscar produtos relacionados (mesma categoria)
      const { data: relatedProducts } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .eq('is_active', true)
        .limit(4)

      // Processar produtos relacionados
      const processedRelated = relatedProducts?.map(p => {
        const primaryImage = p.images?.find((img: any) => img.is_primary) || p.images?.[0]
        return {
          ...p,
          imagem_principal: primaryImage?.image_url || null
        }
      }) || []

      return new Response(
        JSON.stringify({
          product,
          relatedProducts: processedRelated
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Caso contrário, é listagem de produtos
    const queryString = body?.queryParams || ''
    const searchParams = new URLSearchParams(queryString)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const categorySlug = searchParams.get('category') || ''
    const minPrice = parseFloat(searchParams.get('min_price') || '0')
    const maxPrice = parseFloat(searchParams.get('max_price') || '999999')
    const minAge = parseInt(searchParams.get('min_age') || '0')
    const maxAge = parseInt(searchParams.get('max_age') || '12')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'
    const offset = (page - 1) * limit

      // Query base - apenas produtos ativos
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories!inner(*),
          images:product_images(*)
        `, { count: 'exact' })
        .eq('is_active', true)
        .eq('categories.is_active', true)

      // Filtros
      if (search) {
        query = query.or(`nome.ilike.%${search}%,descricao.ilike.%${search}%`)
      }

      if (categorySlug) {
        query = query.eq('category.slug', categorySlug)
      }

      // Filtro de preço (considera preço promocional se existir)
      query = query.or(`preco_promocional.is.null,preco_promocional.gte.${minPrice}`)
                   .or(`preco_promocional.is.null,preco_promocional.lte.${maxPrice}`)
                   .gte('preco', minPrice)
                   .lte('preco', maxPrice)

      // Filtro de idade
      query = query.lte('idade_min', maxAge)
                   .gte('idade_max', minAge)

      // Ordenação
      const validSortColumns = ['created_at', 'preco', 'nome', 'updated_at']
      const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at'
      const ascending = sortOrder === 'asc'
      
      query = query.order(sortColumn, { ascending })
                   .range(offset, offset + limit - 1)

      const { data: products, error, count } = await query

      if (error) throw error

      // Processar produtos para incluir imagem principal
      const processedProducts = products?.map(product => {
        const primaryImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0]
        return {
          ...product,
          imagem_principal: primaryImage?.image_url || null
        }
      }) || []

      return new Response(
        JSON.stringify({
          products: processedProducts,
          total: count,
          page,
          totalPages: Math.ceil((count || 0) / limit)
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