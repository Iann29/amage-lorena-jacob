// src/app/admin/layout.tsx
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client'; // Para signOut
import { useUser, UserProfile } from '@/hooks/useUser'; // Importar hook e tipo UserProfile
import AuthCheck from '@/components/admin/AuthCheck'; // AuthCheck ainda é usado para a PÁGINA de login

interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const supabase = createClient(); // Para signOut
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, isLoading: isLoadingUserHook } = useUser(); // Usar o hook centralizado

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Este estado é para a mensagem de token expirado, que pode ser útil
  const [showTokenExpiredMessage, ] = useState(false); // Removido setShowTokenExpiredMessage
  
  const isLoginPage = pathname === '/admin/login';

  const handleRelogin = async () => {
    // setShowTokenExpiredMessage(false); // Não mais necessário controlar aqui
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh(); 
  };

  useEffect(() => {
    // Fechar dropdown ao clicar fora
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    if (isUserDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [isUserDropdownOpen]);

  useEffect(() => {
    // Se não está carregando do hook E não é a página de login
    if (!isLoadingUserHook && !isLoginPage) {
      if (!user) {
        // Se não há usuário, redireciona para login (AuthCheck também faz isso, mas é uma segurança)
        console.log("AdminLayout: Sem usuário, redirecionando para login.");
        router.push('/admin/login');
      } else if (profile && profile.role !== 'admin') {
        // Se há usuário, mas não é admin, redireciona para home
        console.log("AdminLayout: Usuário não é admin, redirecionando para home.");
        router.push('/');
      }
      // Se há usuário e é admin, ou se o perfil ainda está carregando (profile pode ser null), permite continuar.
      // O conteúdo só será renderizado se for admin.
    }
  }, [user, profile, isLoadingUserHook, isLoginPage, router]);


  // ----- Renderização Condicional -----

  // 1. Se for a página de login, o AuthCheck lida com o redirecionamento se já logado.
  if (isLoginPage) {
    return <AuthCheck>{children}</AuthCheck>;
  }

  // 2. Se o token expirou (esta lógica pode precisar ser reavaliada ou simplificada)
  // Com o novo useUser, a perda de sessão deve ser tratada pelo redirecionamento do useEffect acima.
  if (showTokenExpiredMessage) { // Mantenha se ainda for útil para erros específicos de token
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-8 text-center">
        <Image src="/logos/logo1.webp" alt="Logo Lorena Jacob" width={200} height={50} className="mb-8 h-auto" priority />
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Sua sessão expirou!</h2>
        <p className="text-gray-700 mb-6 max-w-md">
          Por motivos de segurança, sua sessão de acesso ao painel administrativo foi encerrada.
          Por favor, faça login novamente para continuar.
        </p>
        <button
          onClick={handleRelogin}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Fazer Login Novamente
        </button>
      </div>
    );
  }

  // 3. Se o hook useUser ainda está carregando os dados do usuário/perfil
  if (isLoadingUserHook) {
      return (
           <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="ml-3 text-purple-600">Carregando dados do painel...</p>
           </div>
      );
  }
  
  // 4. Se o usuário está logado, tem perfil, E é um admin, renderiza o layout do admin
  // O AuthCheck na página de login já deve ter redirecionado se logado.
  // O useEffect acima já deve ter redirecionado se não logado ou não admin.
  if (user && profile && profile.role === 'admin') {
    return (
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <aside className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-center mb-8">
                <Link href="/admin">
                  <Image src="/logos/logo1.webp" alt="Lorena Jacob" width={isSidebarOpen ? 150 : 40} height={isSidebarOpen ? 37 : 40} className="transition-all duration-300 h-auto"/>
                </Link>
              </div>
              <nav className="flex-1">
                  <ul className="space-y-2">
                      <li> <Link href="/admin" className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all ${pathname === '/admin' ? 'bg-purple-100 text-purple-800' : ''}`}> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> {isSidebarOpen && <span className="ml-3">Dashboard</span>} </Link> </li>
                      <li> <Link href="/admin/blog" className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all ${pathname.startsWith('/admin/blog') ? 'bg-purple-100 text-purple-800' : ''}`}> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> {isSidebarOpen && <span className="ml-3">Blog</span>} </Link> </li>
                      <li> <Link href="/admin/comentarios" className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all ${pathname.startsWith('/admin/comentarios') ? 'bg-purple-100 text-purple-800' : ''}`}> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> {isSidebarOpen && <span className="ml-3">Comentários</span>} </Link> </li>
                  </ul>
              </nav>
              <div className="mt-auto"> <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center justify-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700"> <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg> {isSidebarOpen && <span className="ml-3">Recolher</span>} </button> </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white shadow-sm sticky top-0 z-20 flex-shrink-0">
               <div className="flex justify-between items-center p-4">
                 <h1 className="text-2xl font-semibold text-gray-800">Painel Administrativo</h1>
                 {profile && ( // Alterado de userProfile para profile
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center space-x-2 text-gray-700 hover:text-purple-700">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">{profile.iniciais || '??'}</div> {/* Alterado para profile.iniciais */}
                        <span>{`${profile.nome} ${profile.sobrenome}`}</span> {/* Alterado para profile.nome e profile.sobrenome */}
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {isUserDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-30 py-1">
                            <button onClick={handleRelogin} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700">Sair</button>
                        </div>
                        )}
                    </div>
                 )}
               </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
    );
  }
  
  // Se não estiver carregando, mas não for admin ou não tiver usuário (o useEffect já deveria ter redirecionado)
  // Retorna um loader/mensagem para evitar flash de conteúdo ou erro.
  console.log("AdminLayout: Condição final alcançada - user:", !!user, "profile:", !!profile, "role:", profile?.role);
  return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-3 text-purple-600">Verificando acesso...</p>
      </div>
  ); 
}