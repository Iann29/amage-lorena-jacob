// supabase/functions/_shared/utils.ts
import { serve } from 'https://deno.land/std@0.220.1/http/server.ts';
import { corsHeaders } from './cors.ts';

// Tipo padrão para resposta de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Função para criar uma resposta padronizada JSON
export const jsonResponse = <T>(
  data: T | null = null, 
  success = true, 
  status = 200, 
  error?: { code: string; message: string }
): Response => {
  const body: ApiResponse<T> = {
    success,
    ...(data !== null ? { data } : {}),
    ...(error ? { error } : {}),
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      // Configurações de cache para conteúdo público
      ...(success && status === 200 
          ? { 'Cache-Control': 'public, max-age=60, s-maxage=600, stale-while-revalidate=300' } 
          : {})
    }
  });
};

// Função para tratar erros de forma padronizada
export const handleError = (error: unknown): Response => {
  console.error('Erro na Edge Function:', error);
  
  if (error instanceof Error) {
    return jsonResponse(
      null,
      false,
      500,
      { code: 'server_error', message: 'Erro interno do servidor' }
    );
  }
  
  return jsonResponse(
    null,
    false,
    500,
    { code: 'unknown_error', message: 'Erro desconhecido' }
  );
};

// Função para obter parâmetros da URL
export const getQueryParam = (url: URL, param: string): string | null => {
  return url.searchParams.get(param);
};

// Função para validar que uma string não está vazia
export const isValidString = (value: string | null | undefined): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};

// Função para validar número
export const isValidNumber = (value: string | null | undefined, min?: number, max?: number): boolean => {
  if (!value || isNaN(Number(value))) return false;
  
  const num = Number(value);
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  
  return true;
};

// Função para validar UUID (para IDs do Supabase)
export const isValidUuid = (value: string | null | undefined): boolean => {
  if (!isValidString(value)) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value as string);
};

// Função para gerar slug consistente a partir de texto
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '')        // Remove caracteres especiais
    .replace(/\s+/g, '-')            // Substitui espaços por hífens
    .replace(/--+/g, '-')            // Remove hífens duplicados
    .trim();
};

// Função para limitar uma string a um tamanho específico sem cortar palavras
export const truncateString = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
};

// Função para formatar um post para a resposta da API
export const formatPostForResponse = (post: any, commentCountMap = new Map<string, number>()): any => {
  // Extrair categorias
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
    nome: post.author_nome || 'Lorena',
    sobrenome: post.author_sobrenome || 'Jacob'
  };
  
  // Obter contagem de comentários
  const comment_count = commentCountMap.get(post.id) || 0;

  return {
    id: post.id,
    titulo: post.titulo,
    slug: post.slug,
    resumo: post.resumo,
    ...(post.conteudo ? { conteudo: post.conteudo } : {}),
    imagem_destaque_url: post.imagem_destaque_url,
    published_at: post.published_at,
    created_at: post.created_at,
    like_count: post.like_count,
    view_count: post.view_count,
    author,
    categorias,
    comment_count
  };
};
