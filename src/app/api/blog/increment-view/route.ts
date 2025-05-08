import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Função para incrementar visualizações de posts de forma assíncrona
export async function POST(request: NextRequest) {
  try {
    // Obter dados da requisição
    const { postId, slug } = await request.json();
    
    // Validar entrada
    if (!postId || !slug) {
      return NextResponse.json(
        { error: 'postId e slug são obrigatórios' }, 
        { status: 400 }
      );
    }
    
    // Inicializar cliente Supabase
    const supabase = await createClient();
    
    // 1. Verificar se o post existe
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('id, view_count')
      .eq('id', postId)
      .eq('is_published', true)
      .single();
    
    if (postError || !post) {
      console.error('Erro ao buscar post para incrementar views:', postError?.message);
      return NextResponse.json(
        { error: 'Post não encontrado' }, 
        { status: 404 }
      );
    }
    
    // 2. Incrementar view_count no post
    const newViewCount = (post.view_count || 0) + 1;
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ view_count: newViewCount })
      .eq('id', postId);
    
    if (updateError) {
      console.error('Erro ao incrementar view_count:', updateError.message);
      return NextResponse.json(
        { error: 'Falha ao incrementar visualização' }, 
        { status: 500 }
      );
    }
    
    // 3. Registrar visualização na tabela de analytics (opcional, se existir)
    try {
      await supabase
        .from('blog_post_views')
        .insert({
          post_id: postId,
          viewed_at: new Date().toISOString(),
          user_agent: request.headers.get('user-agent') || null,
          referrer: request.headers.get('referer') || null,
        });
    } catch (analyticsError) {
      // Erro na tabela de analytics não deve impedir o sucesso da operação principal
      console.warn('Erro ao registrar analytics de visualização:', analyticsError);
    }
    
    // Retornar sucesso
    return NextResponse.json({ 
      success: true, 
      view_count: newViewCount 
    });
  } catch (error) {
    console.error('Erro ao processar incremento de visualização:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
} 