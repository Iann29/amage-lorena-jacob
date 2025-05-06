// src/utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// A função createClient agora é async
export async function createClient() {
  // Await a chamada para cookies()
  const cookieStore = await cookies(); 

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // As implementações de get, set, e remove podem usar o cookieStore resolvido
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Ignorar erros que podem ocorrer durante o build estático
            // console.warn('Supabase server client: Error setting cookie (build-time safe to ignore)', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Ignorar erros que podem ocorrer durante o build estático
            // console.warn('Supabase server client: Error removing cookie (build-time safe to ignore)', error);
          }
        },
      },
    }
  )
}