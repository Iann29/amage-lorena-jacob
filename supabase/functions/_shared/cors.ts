// supabase/functions/_shared/cors.ts
// Configurações para habilitar CORS nas requisições para a Edge Function

// Obter domínios permitidos (padrão ou ambiente)
const getAllowedOrigins = (): string[] => {
  // Domínios padrão permitidos
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:4000',
    'https://amage-lorena-jacob.vercel.app',
    'https://www.lorenajacob.com.br',
    'https://lorenajacob.com.br',
    'http://192.168.18.114:3000'
  ];

  // Verificar se há domínio configurado no ambiente
  const siteUrl = Deno.env.get('SITE_URL');
  if (siteUrl) {
    defaultOrigins.push(siteUrl);
  }

  return defaultOrigins;
};

// Verifica se a origem é permitida
export const isOriginAllowed = (origin: string | null): boolean => {
  if (!origin) return false;
  
  const allowedOrigins = getAllowedOrigins();
  
  // Em ambiente de desenvolvimento, aceitar qualquer origem
  if (Deno.env.get('ENVIRONMENT') === 'development') {
    return true;
  }
  
  return allowedOrigins.includes(origin);
};

// Opções de CORS dinâmicas baseadas na origem da requisição
export const getCorsHeaders = (request: Request): Record<string, string> => {
  const origin = request.headers.get('Origin');
  
  return {
    'Access-Control-Allow-Origin': isOriginAllowed(origin) ? origin || '*' : getAllowedOrigins()[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, apikey',
    'Access-Control-Max-Age': '86400', // 24 horas em segundos
  };
};

// Versão simplificada para quando não temos a request (cabeçalhos padrão)
export const corsHeaders = getCorsHeaders(new Request('https://example.com'));

// Função para verificar se a requisição é uma OPTIONS (preflight)
export function isPreflightRequest(request: Request): boolean {
  return request.method === 'OPTIONS';
}

// Função para responder a requisições preflight
export function handleCors(request?: Request): Response {
  const headers = request ? getCorsHeaders(request) : corsHeaders;
  
  return new Response(null, {
    status: 204, // No content
    headers,
  });
}
