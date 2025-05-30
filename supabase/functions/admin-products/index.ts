import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verificar se é admin
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      throw new Error('Forbidden: Admin access required')
    }

    const { pathname, searchParams } = new URL(req.url)
    const method = req.method

    // GET /admin-products - Listar produtos
    if (method === 'GET' && pathname === '/admin-products') {
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const search = searchParams.get('search') || ''
      const categoryId = searchParams.get('category_id') || ''
      const isActive = searchParams.get('is_active') || ''
      const offset = (page - 1) * limit

      // Query base
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          variants:product_variants(count)
        `, { count: 'exact' })

      // Filtros
      if (search) {
        query = query.or(`nome.ilike.%${search}%,descricao.ilike.%${search}%`)
      }
      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }
      if (isActive !== '') {
        query = query.eq('is_active', isActive === 'true')
      }

      // Ordenação e paginação
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      const { data: products, error, count } = await query

      if (error) throw error

      // Buscar categorias para o filtro
      const { data: categories } = await supabase
        .from('categories')
        .select('id, nome')
        .eq('is_active', true)
        .order('nome')

      return new Response(
        JSON.stringify({
          products,
          categories,
          total: count,
          page,
          totalPages: Math.ceil((count || 0) / limit)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /admin-products/:id - Detalhes do produto
    if (method === 'GET' && pathname.startsWith('/admin-products/')) {
      const productId = pathname.split('/')[2]
      
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('id', productId)
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify(product),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /admin-products - Criar produto
    if (method === 'POST' && pathname === '/admin-products') {
      const body = await req.json()

      // Iniciar transação
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          nome: body.nome,
          descricao: body.descricao,
          preco: body.preco,
          preco_promocional: body.preco_promocional || null,
          quantidade_estoque: body.quantidade_estoque,
          category_id: body.category_id,
          idade_min: body.idade_min || 0,
          idade_max: body.idade_max || 12,
          tags: body.tags || [],
          is_active: body.is_active ?? true,
          created_by: user.id
        })
        .select()
        .single()

      if (productError) throw productError

      // Adicionar imagens se fornecidas
      if (body.images && body.images.length > 0) {
        const imagesData = body.images.map((img: any, index: number) => ({
          product_id: product.id,
          image_url: img.url,
          is_primary: img.is_primary ?? index === 0,
          ordem_exibicao: index
        }))

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imagesData)

        if (imagesError) throw imagesError
      }

      // Adicionar variantes se fornecidas
      if (body.variants && body.variants.length > 0) {
        const variantsData = body.variants.map((variant: any) => ({
          product_id: product.id,
          nome_variante: variant.nome,
          preco_adicional: variant.preco_adicional || 0,
          quantidade_estoque: variant.quantidade_estoque || 0
        }))

        const { error: variantsError } = await supabase
          .from('product_variants')
          .insert(variantsData)

        if (variantsError) throw variantsError
      }

      return new Response(
        JSON.stringify(product),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // PUT /admin-products/:id - Atualizar produto
    if (method === 'PUT' && pathname.startsWith('/admin-products/')) {
      const productId = pathname.split('/')[2]
      const body = await req.json()

      // Verificar se o preço mudou para criar histórico
      const { data: oldProduct } = await supabase
        .from('products')
        .select('preco')
        .eq('id', productId)
        .single()

      const { data: product, error } = await supabase
        .from('products')
        .update({
          nome: body.nome,
          descricao: body.descricao,
          preco: body.preco,
          preco_promocional: body.preco_promocional || null,
          quantidade_estoque: body.quantidade_estoque,
          category_id: body.category_id,
          idade_min: body.idade_min || 0,
          idade_max: body.idade_max || 12,
          tags: body.tags || [],
          is_active: body.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single()

      if (error) throw error

      // Atualizar imagens se fornecidas
      if (body.images !== undefined) {
        // Remover imagens antigas
        await supabase
          .from('product_images')
          .delete()
          .eq('product_id', productId)

        // Adicionar novas imagens
        if (body.images.length > 0) {
          const imagesData = body.images.map((img: any, index: number) => ({
            product_id: productId,
            image_url: img.url || img.image_url,
            is_primary: img.is_primary ?? index === 0,
            ordem_exibicao: index
          }))

          await supabase
            .from('product_images')
            .insert(imagesData)
        }
      }

      return new Response(
        JSON.stringify(product),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // DELETE /admin-products/:id - Deletar produto
    if (method === 'DELETE' && pathname.startsWith('/admin-products/')) {
      const productId = pathname.split('/')[2]

      // Primeiro buscar o produto para obter as imagens
      const { data: product } = await supabase
        .from('products')
        .select('*, images:product_images(*)')
        .eq('id', productId)
        .single()

      // Deletar o produto (as imagens serão deletadas em cascata devido à foreign key)
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, deletedProduct: product }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: error.message === 'Unauthorized' ? 401 : 
                error.message.startsWith('Forbidden') ? 403 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})