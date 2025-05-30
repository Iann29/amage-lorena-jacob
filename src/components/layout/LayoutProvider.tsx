"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ModalProvider } from '@/contexts/ModalContext';
import PageTransition from '@/components/layout/PageTransition';
import { useRoutePreload } from '@/hooks/useRoutePreload';

// Componente responsável por decidir quais elementos de layout mostrar
export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Preload de recursos para melhorar performance
  useRoutePreload();
  
  // Páginas que não devem exibir Header e Footer
  const authPages = [
    '/login',
    '/cadastro',
    '/esqueci-minha-senha',
    '/autenticacao',
    '/recuperar-senha',
    '/recuperar-senha/codigo-verificacao'
  ];
  
  // Verificar se é uma página de autenticação ou painel de administração
  const isAuthPage = authPages.some(page => pathname === page);
  const isAdminPage = pathname.startsWith('/admin');
  
  return (
    <ModalProvider>
      <PageTransition>
        {/* Renderização condicional do Header, mas mantendo o mesmo no DOM */}
        {!isAuthPage && !isAdminPage && <Header />}
        
        {/* Conteúdo principal */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Renderização condicional do Footer, mas mantendo o mesmo no DOM */}
        {!isAuthPage && !isAdminPage && <Footer />}
      </PageTransition>
    </ModalProvider>
  );
}
