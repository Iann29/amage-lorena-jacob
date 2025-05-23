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

  // A chamada abaixo é importante para atualizar a sessão e os cookies.
  await supabase.auth.getUser();

  // Logs de depuração removidos daqui

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}