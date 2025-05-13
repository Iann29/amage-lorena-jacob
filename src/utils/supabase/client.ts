// src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Criar uma única instância do cliente Supabase para garantir consistência de sessão
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Se já existe um cliente, use-o para manter a sessão consistente
  if (supabaseClient) return supabaseClient;
  
  // Caso contrário, crie um novo cliente.
  // O @supabase/ssr gerenciará a persistência da sessão (incluindo localStorage)
  // e a configuração dos cookies HTTP Only necessários para o servidor.
  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // Remova a configuração explícita de 'auth.storage' e 'auth.storageKey'
    // para permitir que @supabase/ssr use seus padrões, que incluem o gerenciamento
    // de cookies HTTP Only para o servidor.
    {
      auth: {
        persistSession: true, // Isso é bom manter
        // autoRefreshToken: true, // Já é padrão e gerenciado
      }
    }
  );
  
  return supabaseClient;
}