"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthCheckProps {
  children: React.ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar se a rota atual é a de login do admin
    const isLoginPage = pathname === '/admin/login';
    
    // Mock de verificação de autenticação
    // Em produção, usaríamos o Supabase Auth para verificar a sessão
    const checkAuth = async () => {
      try {
        // Simular um delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock: verificar se existe um item no localStorage
        const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
        
        // Se não estiver autenticado e não estiver na página de login, redirecionar
        if (!isAuthenticated && !isLoginPage) {
          router.push('/admin/login');
        }
        
        // Se estiver autenticado e estiver na página de login, redirecionar para o dashboard
        if (isAuthenticated && isLoginPage) {
          router.push('/admin');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Em caso de erro, redirecionar para o login como medida de segurança
        if (!isLoginPage) {
          router.push('/admin/login');
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Mostrar um loader enquanto verifica a autenticação
  if (isChecking) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
