"use client";

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

// Armazena o estado do usuário globalmente para evitar requisições duplicadas
let globalUser: User | null = null;
let globalUserLoading = true;
let globalUserError: Error | null = null;
const subscribers = new Set<() => void>();

// Função para notificar todos os assinantes sobre a mudança do usuário
function notifySubscribers() {
  subscribers.forEach(callback => callback());
}

/**
 * Hook para gerenciar o estado de autenticação do usuário
 * Retorna o usuário atual, status de carregamento e erro se houver
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(globalUser);
  const [isLoading, setIsLoading] = useState(globalUserLoading);
  const [error, setError] = useState<Error | null>(globalUserError);
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Adicionar assinante para atualizações
    const updateState = () => {
      setUser(globalUser);
      setIsLoading(globalUserLoading);
      setError(globalUserError);
    };

    // Adicionar como assinante
    subscribers.add(updateState);

    // Se for a primeira montagem e ainda estamos carregando globalmente, buscar o usuário
    if (isFirstMount.current && globalUserLoading) {
      isFirstMount.current = false;
      
      const supabase = createClient();
      
      // Função para buscar usuário (executada apenas uma vez globalmente)
      const fetchUser = async () => {
        try {
          globalUserLoading = true;
          notifySubscribers();
          
          const { data: { user }, error } = await supabase.auth.getUser();
          
          if (error) {
            globalUserError = error instanceof Error ? error : new Error(String(error));
            globalUser = null;
          } else {
            globalUser = user;
            globalUserError = null;
          }
        } catch (e) {
          globalUserError = e instanceof Error ? e : new Error(String(e));
          globalUser = null;
        } finally {
          globalUserLoading = false;
          notifySubscribers();
        }
      };

      fetchUser();

      // Configurar listener para mudanças na autenticação
      // Ignoramos o retorno pois o listener persiste enquanto a aplicação estiver rodando
      supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
        globalUser = session?.user ?? null;
        notifySubscribers();
      });
    }

    // Limpar assinante ao desmontar
    return () => {
      subscribers.delete(updateState);
    };
  }, []);

  return { user, isLoading, error };
}
