// src/components/admin/AuthCheck.tsx
"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js'; // Para tipagem do usuário

interface AuthCheckProps {
  children: ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true; // Para evitar atualizações de estado em componente desmontado

    const checkSessionAndRedirect = (sessionUser: User | null) => {
      if (!isMounted) return;

      const isLoginPage = pathname === '/admin/login';

      if (!sessionUser && !isLoginPage) {
        router.push('/admin/login');
      } else if (sessionUser && isLoginPage) {
        router.push('/admin');
      }
      setIsLoading(false);
    };

    // Verifica a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        checkSessionAndRedirect(currentUser);
      }
    }).catch(error => {
        if(isMounted) {
            console.error("AuthCheck: Erro ao obter sessão inicial", error);
            setIsLoading(false);
            if (pathname !== '/admin/login') router.push('/admin/login');
        }
    });

    // Ouve mudanças no estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          // Não precisa chamar checkSessionAndRedirect aqui sempre,
          // pois o router.push no login/logout já fará o trabalho.
          // Mas, se quiser forçar um recheck, poderia.
          // A verificação de rota dentro do listener é mais precisa para eventos específicos:
          if (_event === 'SIGNED_IN' && pathname === '/admin/login') {
              router.push('/admin');
          }
          if (_event === 'SIGNED_OUT' && pathname !== '/admin/login') {
              router.push('/admin/login');
          }
        }
      }
    );
    
    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Permite renderizar a página de login OU se o usuário estiver autenticado para outras páginas admin
  if (pathname === '/admin/login' || user) {
    return <>{children}</>;
  }

  // Se não estiver carregando, não for página de login e não houver usuário,
  // o redirecionamento já deve ter ocorrido. Retornar null ou um loader aqui é uma segurança.
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  ); // Ou simplesmente null se o redirecionamento for confiável
}