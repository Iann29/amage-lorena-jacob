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

    // GET /admin-orders - Listar pedidos
    if (method === 'GET' && pathname === '/admin-orders') {
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const search = searchParams.get('search') || ''
      const status = searchParams.get('status') || ''
      const paymentMethod = searchParams.get('payment_method') || ''
      const startDate = searchParams.get('start_date') || ''
      const endDate = searchParams.get('end_date') || ''
      const offset = (page - 1) * limit

      // Query base
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items(
            id,
            quantidade,
            preco_unitario,
            preco_total,
            product:products(nome)
          )
        `, { count: 'exact' })

      // Filtros
      if (search) {
        query = query.or(`external_reference.ilike.%${search}%,payment_id.ilike.%${search}%`)
      }
      if (status) {
        query = query.eq('status', status)
      }
      if (paymentMethod) {
        query = query.eq('metodo_pagamento', paymentMethod)
      }
      if (startDate) {
        query = query.gte('created_at', startDate)
      }
      if (endDate) {
        query = query.lte('created_at', endDate)
      }

      // Ordenação e paginação
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      const { data: orders, error, count } = await query

      if (error) throw error

      // Buscar dados dos usuários separadamente
      if (orders && orders.length > 0) {
        const userIds = [...new Set(orders.map(o => o.user_id))]
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('user_id, nome, sobrenome, email')
          .in('user_id', userIds)

        // Mapear perfis aos pedidos
        const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || [])
        orders.forEach(order => {
          order.user_profile = profileMap.get(order.user_id) || null
        })
      }

      // Estatísticas
      const { data: stats } = await supabase
        .from('orders')
        .select('status, valor_total')

      const statistics = {
        total: stats?.length || 0,
        pendentes: stats?.filter(o => o.status === 'pendente').length || 0,
        processando: stats?.filter(o => o.status === 'processando').length || 0,
        totalVendas: stats?.filter(o => ['pago', 'entregue'].includes(o.status))
          .reduce((sum, o) => sum + (o.valor_total || 0), 0) || 0
      }

      return new Response(
        JSON.stringify({
          orders,
          total: count,
          page,
          totalPages: Math.ceil((count || 0) / limit),
          statistics
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /admin-orders/:id - Detalhes do pedido
    if (method === 'GET' && pathname.startsWith('/admin-orders/')) {
      const orderId = pathname.split('/')[2]
      
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(
              *,
              images:product_images(*)
            )
          ),
          discount:discounts(*)
        `)
        .eq('id', orderId)
        .single()

      if (error) throw error

      // Buscar dados do usuário separadamente
      if (order) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', order.user_id)
          .single()

        order.user_profile = profile || null
      }

      return new Response(
        JSON.stringify(order),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // PUT /admin-orders/:id - Atualizar status do pedido
    if (method === 'PUT' && pathname.startsWith('/admin-orders/')) {
      const orderId = pathname.split('/')[2]
      const body = await req.json()

      // Validar mudança de status
      const validTransitions = {
        'pendente': ['processando', 'cancelado'],
        'processando': ['pago', 'cancelado'],
        'pago': ['enviado', 'cancelado'],
        'enviado': ['entregue'],
        'entregue': [],
        'cancelado': []
      }

      const { data: currentOrder } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single()

      if (!validTransitions[currentOrder?.status]?.includes(body.status)) {
        throw new Error(`Invalid status transition from ${currentOrder?.status} to ${body.status}`)
      }

      const { data, error } = await supabase
        .from('orders')
        .update({
          status: body.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error

      // Se cancelado, devolver estoque
      if (body.status === 'cancelado') {
        const { data: items } = await supabase
          .from('order_items')
          .select('product_id, quantidade')
          .eq('order_id', orderId)

        for (const item of items || []) {
          await supabase.rpc('increment_stock', {
            p_product_id: item.product_id,
            p_quantity: item.quantidade
          })
        }
      }

      return new Response(
        JSON.stringify(data),
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