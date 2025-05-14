// src/components/admin/AuthCheck.tsx
"use client";

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser'; // Importar o hook centralizado

interface AuthCheckProps {
  children: ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, profile } = useUser(); // Usar o hook

  useEffect(() => {
    if (isLoading) {
      return; // Aguarda o hook useUser terminar de carregar
    }

    const isLoginPage = pathname === '/admin/login';
    const isAdminUser = profile?.role === 'admin';

    if (!user && !isLoginPage) {
      // console.log("AuthCheck: Não há usuário e não é login page. Redirecionando para /admin/login");
      router.push('/admin/login');
    } else if (user && isLoginPage) {
      // Se o usuário está logado E é admin, redireciona para /admin
      // Se não for admin, o AdminLayout cuidará de redirecionar para home
      if (isAdminUser) {
        // console.log("AuthCheck: Usuário logado na página de login. Redirecionando para /admin");
        router.push('/admin');
      } else {
        // Se logado mas não admin, e está na página de login do admin,
        // idealmente o AdminLayout o redirecionaria para '/', mas
        // como estamos no AuthCheck da página de login, é melhor redirecionar para home.
        // console.log("AuthCheck: Usuário logado (não admin) na página de login. Redirecionando para /");
        router.push('/');
      }
    }
    // A lógica de verificação de role 'admin' para acesso às páginas de admin
    // será primariamente responsabilidade do AdminLayout.tsx
  }, [user, isLoading, profile, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Se não está carregando E (tem usuário OU está na página de login), renderiza children
  // A verificação de 'admin' role para proteger rotas internas do admin será feita no AdminLayout
  if (user || pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // Fallback, mas o useEffect deve ter redirecionado.
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}