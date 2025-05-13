// src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Criar uma única instância do cliente Supabase para garantir consistência de sessão
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Se já existe um cliente, use-o para manter a sessão consistente
  if (supabaseClient) return supabaseClient;
  
  // Caso contrário, crie um novo cliente com persistência de sessão
  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Configurações para persistência de sessão
      auth: {
        persistSession: true, // Persistir sessão entre recarregamentos de página
        storageKey: 'lorena-jacob-auth-session', // Chave única para armazenamento
        storage: {
          // Usar localStorage para garantir persistência
          getItem: (key) => window.localStorage.getItem(key),
          setItem: (key, value) => window.localStorage.setItem(key, value),
          removeItem: (key) => window.localStorage.removeItem(key)
        }
      }
    }
  );
  
  return supabaseClient;
}