// supabase/functions/_shared/supabase.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Cria uma instância autenticada do cliente Supabase
export const createServerClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidas');
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

// Cria uma instância anônima do cliente Supabase (para requisições públicas)
export const createAnonClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variáveis de ambiente SUPABASE_URL ou SUPABASE_ANON_KEY não definidas');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};
