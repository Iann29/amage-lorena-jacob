// src/components/admin/AuthCheck.tsx
"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

interface AuthCheckProps {
  children: ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); // Estado para o usuário

  useEffect(() => {
    let isMounted = true;

    // Função para lidar com a sessão e redirecionamentos
    const handleAuthSession = (session: Session | null) => {
      if (!isMounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsLoading(false); // Importante: definir isLoading como false após obter a sessão

      const isLoginPage = pathname === '/admin/login';

      if (!currentUser && !isLoginPage) {
        router.push('/admin/login');
      } else if (currentUser && isLoginPage) {
        router.push('/admin');
      }
    };

    // Verifica a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthSession(session);
    }).catch(error => {
      if (isMounted) {
        console.error("AuthCheck: Erro ao obter sessão inicial", error);
        setIsLoading(false);
        if (pathname !== '/admin/login') router.push('/admin/login');
      }
    });

    // Ouve mudanças no estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) {
          // Atualiza o usuário e lida com redirecionamentos baseado no novo estado da sessão
          handleAuthSession(session);
        }
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [pathname, router]); // pathname e router como dependências

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Se não está carregando e o usuário está definido (logado), OU se estamos na página de login, renderiza children
  if (user || pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // Se chegou aqui, significa que não está carregando, não tem usuário e não é a página de login.
  // O useEffect já deveria ter redirecionado. Retornar o loader é uma segurança para evitar flash de conteúdo.
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}