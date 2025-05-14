// src/hooks/useUser.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client'; // Cliente do browser
import type { User, AuthChangeEvent, Session, SupabaseClient } from '@supabase/supabase-js';

export interface UserProfile {
    id: string; // user_id
    nome: string;
    sobrenome: string;
    avatar_url?: string | null;
    iniciais?: string;
    role?: string; // Para verificar se é admin
}

interface UseUserReturn {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean; // Combina loading do usuário e do perfil
  error: Error | null;
}

// Para evitar múltiplas verificações iniciais de sessão entre instâncias do hook
let initialAuthCheckCompleted = false;
let globalUserCache: User | null = null;
let globalProfileCache: UserProfile | null = null;

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(globalUserCache);
  const [profile, setProfile] = useState<UserProfile | null>(globalProfileCache);
  const [isLoading, setIsLoading] = useState(!initialAuthCheckCompleted);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const fetchUserProfile = useCallback(async (userId: string, userEmail?: string | null) => {
    if (!userId) {
        setProfile(null);
        globalProfileCache = null;
        return;
    }
    // Não precisa de setIsLoadingProfile separado, o isLoading geral cobre isso.
    try {
        const { data, error: profileError } = await supabase
            .from('user_profiles')
            .select('user_id, nome, sobrenome, avatar_url, role')
            .eq('user_id', userId)
            .single();

        if (profileError) {
            // Se o perfil não existe (PGRST116), não é um erro fatal, apenas não há perfil.
            if (profileError.code === 'PGRST116') {
                console.warn(`useUser: Perfil não encontrado para user ${userId}. Criando perfil básico.`);
                const nomeFallback = userEmail?.split('@')[0] || 'Usuário';
                const iniciaisFallback = (nomeFallback.charAt(0) || 'U').toUpperCase();
                const basicProfile: UserProfile = { id: userId, nome: nomeFallback, sobrenome: '', iniciais: iniciaisFallback, role: 'user' };
                setProfile(basicProfile);
                globalProfileCache = basicProfile;
                return;
            }
            throw profileError;
        }

        if (data) {
            const nome = data.nome || '';
            const sobrenome = data.sobrenome || '';
            const emailInicial = userEmail?.charAt(0).toUpperCase();
            const baseIniciais = (nome.charAt(0) + (sobrenome ? sobrenome.charAt(0) : '')).toUpperCase();
            const iniciais = baseIniciais.trim() ? baseIniciais : (emailInicial || 'U');
            
            const userProfileData: UserProfile = {
                id: data.user_id,
                nome: data.nome,
                sobrenome: data.sobrenome,
                avatar_url: data.avatar_url,
                iniciais,
                role: data.role,
            };
            setProfile(userProfileData);
            globalProfileCache = userProfileData;
        } else {
            setProfile(null);
            globalProfileCache = null;
        }
    } catch (profileError) {
        console.error("useUser: Erro ao buscar perfil do usuário:", profileError);
        setError(profileError instanceof Error ? profileError : new Error(String(profileError)));
        setProfile(null);
        globalProfileCache = null;
    }
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    const processSession = async (session: Session | null) => {
        if (!isMounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);
        globalUserCache = currentUser;
        setError(null);

        if (currentUser) {
            await fetchUserProfile(currentUser.id, currentUser.email);
        } else {
            setProfile(null);
            globalProfileCache = null;
        }
        setIsLoading(false);
        initialAuthCheckCompleted = true;
    };

    // Se a verificação inicial ainda não foi feita, faz agora.
    if (!initialAuthCheckCompleted) {
        setIsLoading(true);
        supabase.auth.getSession()
            .then((response: { data: { session: Session | null }, error: Error | null }) => {
                const { data: { session }, error: sessionError } = response; 
                if (sessionError) {
                    console.error("useUser: Erro ao obter sessão inicial:", sessionError);
                    setError(sessionError);
                }
                processSession(session);
            })
            .catch((err: unknown) => { // Tipado err como unknown
                 if (!isMounted) return;
                console.error("useUser: Catch - Erro ao obter sessão inicial:", err);
                // Verifica se é uma instância de Error antes de acessar message
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError(err instanceof Error ? err : new Error(errorMessage));
                processSession(null);
            });
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
        console.log(`useUser: Auth event - ${event}, User ID: ${session?.user?.id}`);
        processSession(session);
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile]);

  return { user, profile, isLoading, error };
}