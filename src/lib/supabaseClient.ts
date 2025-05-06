// src/lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Supabase URL is missing. Check NEXT_PUBLIC_SUPABASE_URL in your .env.local file.");
}
if (!supabaseAnonKey) {
  throw new Error("Supabase Anon Key is missing. Check NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.");
}

// Tipo explícito para o cliente Supabase, embora createClient infira bem
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);