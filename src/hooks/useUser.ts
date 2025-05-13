"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

/**
 * Hook para gerenciar o estado de autenticação do usuário
 * Retorna o usuário atual, status de carregamento e erro se houver
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Buscar o usuário atual
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          setError(error instanceof Error ? error : new Error(String(error)));
          setUser(null);
        } else {
          setUser(user);
          setError(null);
        }
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Buscar o usuário atual ao montar o componente
    fetchUser();

    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Limpar listener ao desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading, error };
}
