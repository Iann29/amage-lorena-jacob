// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Cria uma resposta ANTES de inicializar o cliente Supabase
  // Isso permite que o manipulador de cookies modifique os cookies da resposta.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Log temporário - REMOVER APÓS DEPURAÇÃO
  console.log("[Middleware] SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Carregada" : "NÃO CARREGADA");
  console.log("[Middleware] SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Carregada" : "NÃO CARREGADA");
  // Fim do log temporário

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // O manipulador `set` é chamado pelo Supabase SSR
          // quando um novo cookie de sessão precisa ser definido na resposta.
          // Atualizamos os cookies da requisição e da resposta.
          request.cookies.set({ name, value, ...options }) // Atualiza para o contexto da requisição atual
          response.cookies.set({ name, value, ...options }) // Define na resposta para o navegador
        },
        remove(name: string, options: CookieOptions) {
          // O manipulador `remove` é chamado pelo Supabase SSR
          // quando um cookie de sessão precisa ser removido da resposta.
          // Removemos dos cookies da requisição e da resposta.
          request.cookies.set({ name, value: '', ...options }) // Atualiza para o contexto da requisição atual
          response.cookies.set({ name, value: '', ...options }) // Define na resposta para o navegador
        },
      },
    }
  )

  // É CRUCIAL chamar supabase.auth.getUser() aqui.
  // Isso atualiza o cookie de sessão se ele tiver expirado ou se um novo
  // usuário acabou de fazer login. Se a sessão for atualizada, os manipuladores
  // `set` ou `remove` acima serão chamados para atualizar os cookies da resposta.
  const { data: { user: middlewareUser }, error: middlewareAuthError } = await supabase.auth.getUser();

  // Log para depuração
  console.log("[Middleware] Path:", request.nextUrl.pathname);
  if (middlewareAuthError) {
    console.error("[Middleware] Auth Error:", middlewareAuthError.message);
  } else if (middlewareUser) {
    console.log("[Middleware] User ID:", middlewareUser.id);
  } else {
    console.log("[Middleware] No user session found.");
  }
  // Fim do log para depuração

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}