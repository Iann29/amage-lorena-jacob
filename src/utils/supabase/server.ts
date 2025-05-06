// src/utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() { // Mantive o nome createClient para consistência
  const cookieStore = cookies() // Isso é síncrono e pega o store de cookies da requisição atual

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // A função get precisa ser definida para retornar o valor do cookie ou undefined
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // A função set precisa ser definida para definir o cookie
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Ignorar erros de 'set' que podem ocorrer durante o build
            // console.warn('Supabase server client: Error setting cookie (build-time safe to ignore)', error);
          }
        },
        // A função remove precisa ser definida para remover o cookie
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Ignorar erros de 'remove' que podem ocorrer durante o build
            // console.warn('Supabase server client: Error removing cookie (build-time safe to ignore)', error);
          }
        },
      },
    }
  )
}