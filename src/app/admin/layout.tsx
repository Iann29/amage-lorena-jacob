// src/app/admin/layout.tsx
"use client";

import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import AuthCheck from '@/components/admin/AuthCheck'; // Importante: AuthCheck ainda é necessário
import { createClient } from '@/utils/supabase/client';

interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const supabase = createClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userInfo, setUserInfo] = useState<{
    id: string; 
    nome: string; 
    sobrenome: string; 
    iniciais: string; 
    role: string;
  } | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true); // Estado de loading para dados do user
  const [showTokenExpiredMessage, setShowTokenExpiredMessage] = useState(false); // <<< NOVO ESTADO
  const [isAuthorized, setIsAuthorized] = useState(false); // Novo estado para controle de autorização de role

  const isLoginPage = pathname === '/admin/login';

  // Função para lidar com o logout e redirecionamento para login
  const handleRelogin = async () => {
    setShowTokenExpiredMessage(false); // Esconde a mensagem
    await supabase.auth.signOut(); // Faz logout para limpar tokens inválidos
    router.push('/admin/login'); // Redireciona para a página de login
    router.refresh(); // Força um refresh para garantir estado limpo (opcional, mas bom)
  };

  // Efeito para buscar informações do usuário logado OU detectar token expirado
  useEffect(() => {
    // Não executa na página de login
    if (isLoginPage) {
        setIsLoadingUserInfo(false); // Marca como não carregando se for login page
        setIsAuthorized(true); // Permite renderizar a página de login
        return;
    }

    let isMounted = true;
    setIsLoadingUserInfo(true); // Inicia o loading dos dados do usuário
    setIsAuthorized(false); // Começa como não autorizado até a verificação
    setShowTokenExpiredMessage(false); // Garante que a mensagem não está visível inicialmente

    const fetchUserDataAndAuthorize = async () => {
      try {
        // Tenta buscar o usuário atual
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        // SE HOUVER ERRO AO BUSCAR USUÁRIO
        if (userError) {
          console.error("Erro ao buscar usuário em AdminLayout:", userError.message);
          // <<< VERIFICA SE O ERRO É DE TOKEN EXPIRADO/INVÁLIDO >>>
          if (userError.message.includes("token is expired") || userError.message.includes("invalid JWT")) {
            if (isMounted) setShowTokenExpiredMessage(true); // Mostra a mensagem de erro amigável
          } else {
            // Para outros erros de autenticação, redireciona para login
             if (isMounted && !isLoginPage) router.push('/admin/login');
          }
          if (isMounted) setUserInfo(null); // Limpa info do usuário
          setIsLoadingUserInfo(false);
          return; // Interrompe a execução aqui se houve erro no getUser
        }

        // SE NÃO HOUVE ERRO, MAS NÃO HÁ USUÁRIO (e não é login page)
        if (!user && !isLoginPage) {
            console.log("Nenhum usuário encontrado, redirecionando para login.");
            if (isMounted) router.push('/admin/login');
            if (isMounted) setUserInfo(null);
            setIsLoadingUserInfo(false);
            return; // Interrompe
        }

        // SE HÁ USUÁRIO, BUSCA O PERFIL
        if (user) {
          // Modificado para incluir 'role' na query
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles').select('nome, sobrenome, role')
            .eq('user_id', user.id).single();

          if (profileError) {
            console.error("Erro ao buscar perfil em AdminLayout:", profileError.message);
            // Se não encontrar perfil, ou erro, considerar não autorizado para /admin
            router.push('/'); // Redireciona para home em caso de erro de perfil
            setUserInfo(null);
            setIsLoadingUserInfo(false);
            return;
          }

          if (profileData && isMounted) {
            if (profileData.role === 'admin') {
              const nome = profileData.nome || '';
              const sobrenome = profileData.sobrenome || '';
              const iniciais = (nome.charAt(0) + (sobrenome ? sobrenome.charAt(0) : '')).toUpperCase() || 'A';
              setUserInfo({ id: user.id, nome, sobrenome, iniciais, role: profileData.role });
              setIsAuthorized(true);
            } else {
              // Usuário não é admin, redirecionar para a página inicial
              console.log("Usuário não é admin. Redirecionando para home.");
              router.push('/');
              setUserInfo(null); // Limpar info, pois não é admin
            }
          } else if (isMounted) {
            // Perfil não encontrado, considerar não autorizado para /admin
            console.log("Perfil não encontrado para usuário admin. Redirecionando para home.");
            router.push('/'); 
            setUserInfo(null);
          }
        } else {
            if(isMounted) setUserInfo(null); // Garante que é nulo se user for null
        }

      } catch (error) {
        console.error("Erro geral ao carregar dados do usuário em AdminLayout:", error);
        if (isMounted) {
            setUserInfo(null);
            // Mostra a mensagem de expirado como fallback genérico para erros inesperados aqui? Opcional.
            setShowTokenExpiredMessage(true);
            // if (!isLoginPage) router.push('/admin/login'); // Ou redireciona
        }
      } finally {
         if (isMounted) setIsLoadingUserInfo(false); // Finaliza o loading dos dados do usuário
      }
    };

    fetchUserDataAndAuthorize();

     // Listener para deslogar automaticamente se a sessão for invalidada em outra aba
     const { data: authListener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
        if (isMounted && !isLoginPage) {
          if (event === 'SIGNED_OUT') {
            console.log(`Auth state changed to ${event} in AdminLayout, redirecting.`);
            setShowTokenExpiredMessage(true);
            setUserInfo(null);
            setIsAuthorized(false);
            // router.push('/admin/login'); // A mensagem de token expirado vai lidar com o religon
          } else if (event === 'SIGNED_IN' && session?.user) {
            // Se logar em outra aba, re-executar a lógica de autorização
            fetchUserDataAndAuthorize();
          }
        }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [isLoginPage, supabase, router, pathname]); // Adicionado pathname

  // Efeito para fechar dropdown (sem mudanças)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    if (isUserDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [isUserDropdownOpen]);

  // ----- Renderização Condicional -----

  // 1. Se for a página de login, renderiza apenas o conteúdo dela dentro do AuthCheck
  if (isLoginPage) {
    // O AuthCheck vai lidar com o redirecionamento se já estiver logado
    return <AuthCheck>{children}</AuthCheck>;
  }

  // 2. Se o token expirou, mostra a mensagem customizada
  if (showTokenExpiredMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-8 text-center">
        {/* Use a logo correta do seu projeto */}
        <Image src="/logos/logo1.webp" alt="Logo Lorena Jacob" width={200} height={50} className="mb-8 h-auto" priority />
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Sua sessão expirou!</h2>
        <p className="text-gray-700 mb-6 max-w-md">
          Por motivos de segurança, sua sessão de acesso ao painel administrativo foi encerrada.
          Por favor, faça login novamente para continuar.
        </p>
        <button
          onClick={handleRelogin} // Chama a função para logout e redirect
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Fazer Login Novamente
        </button>
      </div>
    );
  }

  // 3. Se estiver carregando informações do usuário (APÓS o AuthCheck inicial já ter passado)
  // Isso cobre o tempo entre o AuthCheck liberar e o useEffect buscar os dados do perfil
  if (isLoadingUserInfo) {
      return (
           <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="ml-3 text-purple-600">Verificando autorização...</p>
           </div>
      );
  }

  // 4. Se passou por tudo, renderiza o layout normal do admin dentro do AuthCheck
  // O AuthCheck cuida do loading inicial e redirecionamento primário se não houver user
  if (!isLoadingUserInfo && isAuthorized) {
    return (
      <AuthCheck>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <aside className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
            <div className="p-4 flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-center mb-8">
                <Link href="/admin">
                   {/* Use a logo correta do seu projeto */}
                  <Image src="/logos/logo1.webp" alt="Lorena Jacob" width={isSidebarOpen ? 150 : 40} height={isSidebarOpen ? 37 : 40} className="transition-all duration-300 h-auto"/>
                </Link>
              </div>
              {/* Navegação */}
              <nav className="flex-1">
                  <ul className="space-y-2">
                      <li> <Link href="/admin" className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all ${pathname === '/admin' ? 'bg-purple-100 text-purple-800' : ''}`}> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> {isSidebarOpen && <span className="ml-3">Dashboard</span>} </Link> </li>
                      <li> <Link href="/admin/blog" className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all ${pathname.startsWith('/admin/blog') ? 'bg-purple-100 text-purple-800' : ''}`}> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> {isSidebarOpen && <span className="ml-3">Blog</span>} </Link> </li>
                      <li> <Link href="/admin/comentarios" className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all ${pathname.startsWith('/admin/comentarios') ? 'bg-purple-100 text-purple-800' : ''}`}> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> {isSidebarOpen && <span className="ml-3">Comentários</span>} </Link> </li>
                  </ul>
              </nav>
              {/* Botão Toggle */}
              <div className="mt-auto"> <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center justify-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700"> <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg> {isSidebarOpen && <span className="ml-3">Recolher</span>} </button> </div>
            </div>
          </aside>

          {/* Conteúdo Principal */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-20 flex-shrink-0">
               <div className="flex justify-between items-center p-4">
                 <h1 className="text-2xl font-semibold text-gray-800">Painel Administrativo</h1>
                 {userInfo && (
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center space-x-2 text-gray-700 hover:text-purple-700">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">{userInfo.iniciais || '??'}</div>
                        <span>{`${userInfo.nome} ${userInfo.sobrenome}`}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {isUserDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-30 py-1">
                            {/* <Link href="/admin/perfil" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700">Meu Perfil</Link> */}
                            <button onClick={handleRelogin} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700">Sair</button>
                        </div>
                        )}
                    </div>
                 )}
               </div>
            </header>
            {/* Conteúdo da Página */}
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </AuthCheck>
    );
  }
  
  // Se não estiver carregando e não estiver autorizado (ou seja, foi redirecionado ou está prestes a ser)
  // Retornar um loader ou null é apropriado aqui para evitar flash de conteúdo não autorizado.
  return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-3 text-purple-600">Redirecionando...</p>
      </div>
  ); 
}