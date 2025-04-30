'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { usePathname } from 'next/navigation';

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Páginas que não devem exibir Header e Footer
  const authPages = ['/login', '/cadastro', '/esqueci-minha-senha'];
  const isAuthPage = authPages.some(page => pathname === page);
  
  if (isAuthPage) {
    // Para páginas de autenticação, retornamos apenas o conteúdo
    return <>{children}</>;
  }
  
  // Para outras páginas, incluímos o Header e Footer
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
