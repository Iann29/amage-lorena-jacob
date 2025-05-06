"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import AuthCheck from '@/components/admin/AuthCheck';

interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  
  // Verificar se o usuário está na página de login
  const isLoginPage = pathname === '/admin/login';

  // Se for a página de login, renderizar apenas o conteúdo sem o layout administrativo
  if (isLoginPage) {
    return <AuthCheck>{children}</AuthCheck>;
  }

  return (
    <AuthCheck>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside 
          className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
        >
        <div className="p-4 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Link href="/admin">
              <div className="flex items-center">
                <Image 
                  src="/assets/logo-lorena.png" 
                  alt="Lorena Jacob" 
                  width={isSidebarOpen ? 150 : 40} 
                  height={40} 
                  className="transition-all duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Links da navegação */}
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/admin" 
                  className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all ${pathname === '/admin' ? 'bg-purple-100 text-purple-800' : ''}`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                    />
                  </svg>
                  {isSidebarOpen && <span className="ml-3">Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/blog" 
                  className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all ${pathname.includes('/admin/blog') ? 'bg-purple-100 text-purple-800' : ''}`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
                    />
                  </svg>
                  {isSidebarOpen && <span className="ml-3">Blog</span>}
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/usuarios" 
                  className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all ${pathname.includes('/admin/usuarios') ? 'bg-purple-100 text-purple-800' : ''}`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
                    />
                  </svg>
                  {isSidebarOpen && <span className="ml-3">Usuários</span>}
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/configuracoes" 
                  className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all ${pathname.includes('/admin/configuracoes') ? 'bg-purple-100 text-purple-800' : ''}`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                  {isSidebarOpen && <span className="ml-3">Configurações</span>}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Botão de toggle para o sidebar */}
          <div className="mt-auto">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center justify-center p-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transform transition-transform ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
              {isSidebarOpen && <span className="ml-3">Recolher menu</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Painel Administrativo
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-700 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                    LJ
                  </div>
                  <span>Lorena Jacob</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  </AuthCheck>
  );
}
