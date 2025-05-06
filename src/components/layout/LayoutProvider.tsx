"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ModalProvider } from '@/contexts/ModalContext';

// Componente responsável por decidir quais elementos de layout mostrar
export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
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
      {/* Renderização condicional do Header, mas mantendo o mesmo no DOM */}
      {!isAuthPage && !isAdminPage && <Header />}
      
      {/* Conteúdo principal */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Renderização condicional do Footer, mas mantendo o mesmo no DOM */}
      {!isAuthPage && !isAdminPage && <Footer />}
    </ModalProvider>
  );
}
