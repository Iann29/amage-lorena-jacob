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

    // GET /admin-customers - Listar clientes com estatísticas
    if (method === 'GET' && pathname === '/admin-customers') {
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const search = searchParams.get('search') || ''
      const role = searchParams.get('role') || ''
      const offset = (page - 1) * limit

      // Query base de clientes
      let query = supabase
        .from('user_profiles')
        .select(`
          *,
          orders:orders(count),
          last_order:orders(created_at),
          total_spent:orders(valor_total.sum()),
          shipping_addresses(*)
        `, { count: 'exact' })

      // Filtros
      if (search) {
        query = query.or(`nome.ilike.%${search}%,sobrenome.ilike.%${search}%,email.ilike.%${search}%`)
      }
      if (role) {
        query = query.eq('role', role)
      }

      // Paginação
      query = query.range(offset, offset + limit - 1)
        .order('created_at', { ascending: false })

      const { data: customers, error, count } = await query

      if (error) throw error

      // Processar dados para incluir estatísticas
      const processedCustomers = customers?.map(customer => ({
        ...customer,
        total_pedidos: customer.orders?.[0]?.count || 0,
        ultimo_pedido: customer.last_order?.[0]?.created_at || null,
        total_gasto: customer.total_spent?.[0]?.sum || 0
      }))

      return new Response(
        JSON.stringify({
          customers: processedCustomers,
          total: count,
          page,
          totalPages: Math.ceil((count || 0) / limit)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /admin-customers/:id - Detalhes do cliente
    if (method === 'GET' && pathname.startsWith('/admin-customers/')) {
      const customerId = pathname.split('/')[2]
      
      const { data: customer, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          shipping_addresses(*),
          orders(
            *,
            order_items(
              *,
              product:products(nome, descricao)
            )
          )
        `)
        .eq('id', customerId)
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify(customer),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // PUT /admin-customers/:id - Atualizar cliente
    if (method === 'PUT' && pathname.startsWith('/admin-customers/')) {
      const customerId = pathname.split('/')[2]
      const body = await req.json()

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          nome: body.nome,
          sobrenome: body.sobrenome,
          telefone: body.telefone,
          role: body.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId)
        .select()
        .single()

      if (error) throw error

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