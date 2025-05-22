// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useModal } from "@/contexts/ModalContext";
import { createClient } from '@/utils/supabase/client'; // Mantido para signOut
import { useUser } from '../../hooks/useUser'; // Importar o hook centralizado

const Header = () => {
  const supabase = createClient(); // Usado apenas para signOut
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openContatoModal } = useModal();
  const { scrollY } = useScroll();

  // Usar o hook centralizado para estado de autenticação e perfil
  const { user: currentUser, profile: userProfile, isLoading: isLoadingAuth } = useUser();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  
  // Novos estados para o dropdown de idioma
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'pt' | 'en' | 'es'>('pt'); // pt, en, es
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const initialLangSyncDone = useRef(false); // Ref para controlar a sincronização inicial

  const headerHeight = useTransform(scrollY, [0, 100], ["80px", "65px"]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.98]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.72]);
  const headerShadow = useTransform(
    scrollY,
    [0, 20, 100],
    ["none", "0px 2px 8px rgba(0,0,0,0.05)", "0px 4px 12px rgba(0,0,0,0.15)"]
  );
  
  // Fechar o menu ao mudar de rota
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Fechar o menu quando o pathname mudar
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      // Adicionado para o dropdown de idioma
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    if (isUserDropdownOpen || isLangDropdownOpen) { // Modificado para incluir isLangDropdownOpen
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen, isLangDropdownOpen]);  // Efeito para fechar o menu ao redimensionar a tela ou pressionar ESC
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    // Bloquear o scroll do body quando o menu estiver aberto
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const initGoogleTranslate = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'pt',
            includedLanguages: 'en,es,pt',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }

      // Sincroniza o selectedLang com o cookie do Google na primeira carga útil
      if (!initialLangSyncDone.current) {
        const getCookieValue = (name: string) => {
          const parts = `; ${document.cookie}`.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
          return null;
        };
        const currentGoogTransCookie = getCookieValue('googtrans');
        if (currentGoogTransCookie) {
          const langInCookie = currentGoogTransCookie.split('/')[2];
          if ((langInCookie === 'en' || langInCookie === 'es' || langInCookie === 'pt') && selectedLang !== langInCookie) {
            setSelectedLang(langInCookie as 'pt' | 'en' | 'es');
          }
        }
        initialLangSyncDone.current = true;
      }
    };

    (window as any).googleTranslateElementInit = initGoogleTranslate;

    // Adiciona o script do Google Translate se ainda não existir
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (typeof (window as any).googleTranslateElementInit === 'function' && !(window as any).google?.translate?.TranslateElement) {
      // Script tag existe, mas o google object não está pronto, tenta chamar o init manualmente se o script carregou mas não executou o cb
      // Isso é uma tentativa de fallback, pode precisar de ajuste
       (window as any).googleTranslateElementInit();
    } else if ((window as any).google?.translate?.TranslateElement && !document.querySelector('#google_translate_element .goog-te-gadget')) {
      // Objeto Google existe, mas widget não foi renderizado, força inicialização
      initGoogleTranslate();
    }


  }, []); // Roda apenas uma vez na montagem


  // Efeito para mudar o idioma quando o usuário seleciona no dropdown
  useEffect(() => {
    if (!initialLangSyncDone.current) {
      // Não faz nada até que a sincronização inicial com o cookie seja feita
      return;
    }

    const getCookieValue = (name: string) => {
      const parts = `; ${document.cookie}`.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const currentGoogTrans = getCookieValue('googtrans');
    let currentLangInCookie: string | null = null;
    if (currentGoogTrans) {
      const parts = currentGoogTrans.split('/');
      if (parts.length === 3) { // Formato /auto/lang
        currentLangInCookie = parts[2];
      }
    }

    // Se o idioma que queremos (selectedLang) é diferente do idioma atual no cookie
    if (selectedLang !== currentLangInCookie) {
      if (selectedLang === 'pt') {
        // Se o cookie existe e não é 'pt' (ou seja, está traduzido), então reseta.
        if (currentGoogTrans && currentLangInCookie !== 'pt') {
          // Remove o cookie setando uma data de expiração no passado.
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname}; path=/`;
          // O Google trata a ausência do cookie como o idioma original da página.
          // Adicionalmente, podemos setar para /auto/pt para ser explícito se o widget precisar.
          document.cookie = `googtrans=/auto/pt; expires=Session; domain=${window.location.hostname}; path=/`;
          setTimeout(() => window.location.reload(), 50); // Adicionado setTimeout
        } else if (!currentGoogTrans) {
          // Se não há cookie e queremos 'pt', não faz nada, já está no original.
          // Não precisa de reload se já está em PT e sem cookie.
        }
      } else { // 'en' or 'es'
        document.cookie = `googtrans=/auto/${selectedLang}; expires=Session; domain=${window.location.hostname}; path=/`;
        setTimeout(() => window.location.reload(), 50); // Adicionado setTimeout
      }
    }
  }, [selectedLang]); // Este useEffect reage às mudanças de selectedLang

  const handleLogout = async () => {
    setIsUserDropdownOpen(false);
    await supabase.auth.signOut();
    // O hook useUser vai pegar a mudança e atualizar o estado.
    // Opcionalmente, pode redirecionar aqui ou deixar que outros componentes reajam à ausência de usuário.
    router.push('/'); 
    router.refresh(); // Força o refresh para limpar qualquer estado do servidor que dependa do user
  };

  return (
    <motion.header 
      className="w-full sticky top-0 z-50 bg-white relative"
      style={{
        boxShadow: headerShadow,
        height: headerHeight,
        opacity: headerOpacity,
      }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center h-full max-w-[1280px]">
        {/* Logo */}
        <motion.div>
          <Link href="/" className="flex items-center">
            <motion.div 
              style={{ 
                scale: logoScale,
                transformOrigin: "left center",
                width: "250px" 
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <Image 
                src="/logos/logo1.webp" 
                alt="Lorena Jacob - Terapeuta Infantil" 
                width={250} 
                height={50}
                priority
                unoptimized
                style={{ width: '100%', height: 'auto' }}
              />
            </motion.div>
          </Link>
        </motion.div>

        {/* Menu Desktop */}
        <motion.nav 
          className="hidden lg:flex items-center justify-center flex-1"
          style={{ 
            translateY: useTransform(scrollY, [0, 100], [0, -2]),
            scale: useTransform(scrollY, [0, 100], [1, 0.95]) 
          }}
        >
          {/* ... (links do menu como estavam) ... */}
           <div className="flex items-center justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/" 
                className={`text-[#6E6B46] text-base ${pathname === '/' ? 'font-bold' : 'font-normal'} hover:text-[#52A4DB] transition px-3 font-['Poppins'] relative group`}
              >
                Início
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#52A4DB] transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <div className="h-4 mx-2 w-px bg-gray-300"></div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/sobre" 
                className={`text-[#6E6B46] text-base ${pathname === '/sobre' ? 'font-bold' : 'font-normal'} hover:text-[#52A4DB] transition px-3 font-['Poppins'] relative group`}
              >
                Sobre Mim
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#52A4DB] transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <div className="h-4 mx-2 w-px bg-gray-300"></div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/blog" 
                className={`text-[#6E6B46] text-base ${pathname === '/blog' ? 'font-bold' : 'font-normal'} hover:text-[#52A4DB] transition px-3 font-['Poppins'] relative group`}
              >
                Blog
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#52A4DB] transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <div className="h-4 mx-2 w-px bg-gray-300"></div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button 
                onClick={openContatoModal}
                className={`text-[#6E6B46] text-base font-normal hover:text-[#52A4DB] transition px-3 font-['Poppins'] relative group cursor-pointer`}
              >
                Contato
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#52A4DB] transition-all duration-200 group-hover:w-full"></span>
              </button>
            </motion.div>
            
            <div className="h-4 mx-2 w-px bg-gray-300"></div>
            
            <div className="px-3">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/loja" 
                  prefetch={false}
                  className="bg-[#52A4DB] text-white text-sm font-['Poppins'] rounded-md px-4 py-1 hover:bg-[#4790c2] transition"
                >
                  Loja
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.nav>

        {/* Área Direita Desktop (Autenticação e Redes Sociais) */}
        <motion.div className="hidden lg:flex items-center justify-end gap-24">
          {isLoadingAuth ? (
            <div className="flex flex-col items-center">
               <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse mb-0.5"></div>
               <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : currentUser && userProfile ? (
            <div className="relative" ref={userDropdownRef}>
              <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex flex-col items-center focus:outline-none cursor-pointer">
                <motion.div 
                  className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium mb-0.5 border border-purple-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {userProfile.iniciais || 'U'}
                </motion.div>
                <span className="text-[#365F71] text-xs font-['Poppins'] truncate max-w-[100px]">
                  Olá, {userProfile.nome.split(' ')[0] || 'Usuário'}!
                </span>
              </button>
              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 py-1 border border-gray-200"
                  >
                    <Link 
                      href="/minha-conta" 
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-['Poppins']"
                    >
                      Minha Conta
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 font-['Poppins']"
                    >
                      Sair
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/autenticacao" className="flex flex-col items-center">
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Image 
                    src="/assets/perfilIcon.png" 
                    alt="Minha Conta" 
                    width={40} 
                    height={40}
                    className="mb-0.5"
                    unoptimized
                    style={{ width: '40px', height: '40px' }}
                  />
                </motion.div>
                <span className="text-[#365F71] text-xs font-['Poppins']">Minha Conta</span>
              </Link>
            </motion.div>
          )}
          
          {/* Redes Sociais */}
          <motion.div className="flex flex-col items-center">
             <div className="text-[10px] font-['Poppins'] mb-1 text-center">
              <span className="text-[#52A4DB] font-bold">Siga-me</span>
              <span className="text-[#52A4DB]"> nas</span><br/>
              <span className="text-[#52A4DB]">redes sociais</span>
            </div>
            <div className="flex items-center">
              <motion.a 
                href="https://www.facebook.com/profile.php?id=61573695501036"
                target="_blank" 
                rel="noopener noreferrer" 
                className="mx-1.5 relative group"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 text-[#6fb1ce] hover:text-[#1877F2] transition-colors duration-200"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </motion.a>
              <motion.a 
                href="https://instagram.com/lorenajacob.st" // Link Corrigido
                target="_blank" 
                rel="noopener noreferrer" 
                className="mx-1.5"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-[#6fb1ce] hover:text-[#C13584] transition-colors duration-200"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Botão Menu Mobile */}
        <motion.button 
          className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(prev => !prev);
          }}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' }}
        >
          <div className="relative w-6 h-5 flex flex-col justify-between">
            <motion.span 
              className="block h-0.5 w-6 bg-[#6E6B46] rounded-full origin-center"
              animate={isMenuOpen ? { 
                transform: 'translateY(9px) rotate(45deg)'
              } : { 
                transform: 'translateY(0) rotate(0)' 
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span 
              className="block h-0.5 w-6 bg-[#6E6B46] rounded-full"
              animate={isMenuOpen ? { 
                opacity: 0 
              } : { 
                opacity: 1 
              }}
              transition={{ duration: 0.1 }}
            />
            <motion.span 
              className="block h-0.5 w-6 bg-[#6E6B46] rounded-full origin-center"
              animate={isMenuOpen ? { 
                transform: 'translateY(-9px) rotate(-45deg)'
              } : { 
                transform: 'translateY(0) rotate(0)' 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.button>
      </div>

      {/* Novo Seletor de Idioma Desktop - Posicionado Absolutamente */}
      <div className="hidden lg:block absolute top-0 right-0 mr-32 h-full flex items-center justify-center" ref={langDropdownRef}>
        <div className="flex items-center h-full relative">
          <motion.button
            onClick={() => setIsLangDropdownOpen(prev => !prev)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors focus:outline-none border border-gray-400 bg-white"
            aria-label="Selecionar idioma"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {selectedLang === 'pt' && <span className="text-sm font-medium text-[#6E6B46]">BR</span>}
            {selectedLang === 'en' && <span className="text-sm font-medium text-[#6E6B46]">EN</span>}
            {selectedLang === 'es' && <span className="text-sm font-medium text-[#6E6B46]">ES</span>}
          </motion.button>
          <AnimatePresence>
            {isLangDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-40 bg-white rounded-md shadow-xl z-50 py-1 border border-gray-200"
              >
                <button
                  onClick={() => { setSelectedLang('pt'); setIsLangDropdownOpen(false); }}
                  className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 font-['Poppins'] ${selectedLang === 'pt' ? 'font-bold text-[#52A4DB]' : 'text-gray-700'}`}
                >
                  <span className="mr-2">🇧🇷</span> Português
                </button>
                <button
                  onClick={() => { setSelectedLang('en'); setIsLangDropdownOpen(false); }}
                  className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 font-['Poppins'] ${selectedLang === 'en' ? 'font-bold text-[#52A4DB]' : 'text-gray-700'}`}
                >
                  <span className="mr-2">🇺🇸</span> English
                </button>
                <button
                  onClick={() => { setSelectedLang('es'); setIsLangDropdownOpen(false); }}
                  className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 font-['Poppins'] ${selectedLang === 'es' ? 'font-bold text-[#52A4DB]' : 'text-gray-700'}`}
                >
                  <span className="mr-2">🇪🇸</span> Español
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Overlay e Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <div key="mobile-menu-container">
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
              key="overlay"
            />
            
            {/* Menu */}
            <motion.div 
              id="mobile-menu"
              className="fixed top-20 left-0 right-0 mx-4 bg-white shadow-xl rounded-lg z-50 max-h-[calc(100vh-6rem)] overflow-y-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ 
                y: -20, 
                opacity: 0,
                transition: { 
                  duration: 0.2,
                  when: "afterChildren"
                } 
              }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 300,
                mass: 0.5,
                delay: 0.1
              }}
              aria-hidden={!isMenuOpen}
              role="dialog"
              aria-modal="true"
              aria-labelledby="menu-heading"
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 id="menu-heading" className="text-lg font-medium text-gray-900">Menu</h2>
              </div>
              <nav className="flex flex-col p-4" aria-label="Menu principal">
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="mb-2"
              >
                <Link 
                  href="/" 
                  className={`block w-full text-left py-3 px-4 rounded-md transition-colors ${pathname === '/' ? 'bg-purple-50 text-[#6E6B46] font-semibold' : 'text-[#6E6B46] hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Início
                </Link>
              </motion.div>
              
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="mb-2"
              >
                <Link 
                  href="/sobre" 
                  className={`block w-full text-left py-3 px-4 rounded-md transition-colors ${pathname === '/sobre' ? 'bg-purple-50 text-[#6E6B46] font-semibold' : 'text-[#6E6B46] hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre Mim
                </Link>
              </motion.div>
              
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="mb-2"
              >
                <Link 
                  href="/blog" 
                  className={`block w-full text-left py-3 px-4 rounded-md transition-colors ${pathname === '/blog' ? 'bg-purple-50 text-[#6E6B46] font-semibold' : 'text-[#6E6B46] hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
              </motion.div>
              
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="mb-4"
              >
                <button 
                  onClick={() => { 
                    openContatoModal(); 
                    setIsMenuOpen(false); 
                  }} 
                  className="w-full text-left py-3 px-4 rounded-md text-[#6E6B46] hover:bg-gray-50 transition-colors"
                >
                  Contato
                </button>
              </motion.div>
              
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="mb-4"
              >
                <Link 
                  href="/loja" 
                  prefetch={false} 
                  className="block w-full text-center bg-[#52A4DB] hover:bg-[#4790c2] text-white font-medium py-3 px-4 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Acessar Loja
                </Link>
              </motion.div>
              
              <div className="pt-4 border-t border-gray-200">
                 {/* Redes Sociais Mobile */}
                <div className="flex flex-col mb-4">
                  <div className="text-sm font-medium text-[#52A4DB] mb-2">
                    Siga-me nas redes sociais
                  </div>
                  <div className="flex items-center space-x-4">
                    <a 
                      href="https://www.facebook.com/profile.php?id=61573695501036" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                      aria-label="Facebook"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://instagram.com/lorenajacob.st" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-pink-50 hover:bg-pink-100 transition-colors"
                      aria-label="Instagram"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                
                {/* Grupo: Minha Conta Mobile + Seletor de Idioma Mobile */}
                <div className="flex items-center space-x-3">
                  {/* Minha Conta Mobile */}
                  {isLoadingAuth ? (
                    <div className="flex flex-col items-center">
                      <div className="w-4.5 h-4.5 bg-gray-200 rounded-full animate-pulse mb-0.5"></div>
                      <div className="h-2 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : currentUser && userProfile ? (
                     <div className="relative" ref={userDropdownRef}> {/* userDropdownRef já está aqui */}
                        <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex flex-col items-center focus:outline-none cursor-pointer">
                            <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium text-xs mb-0.5 border border-purple-300">
                                {userProfile.iniciais || 'U'}
                            </div>
                            <span className="text-[#365F71] text-[10px] font-['Poppins'] truncate max-w-[70px]">Olá, {userProfile.nome.split(' ')[0]}</span>
                        </button>
                        {isUserDropdownOpen && ( /* Este é o dropdown do usuário */
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-xl z-50 py-1 border border-gray-200"
                          >
                            <Link 
                              href="/minha-conta" 
                              onClick={() => { setIsUserDropdownOpen(false); setIsMenuOpen(false); }}
                              className="block px-3 py-1.5 text-[10px] text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-['Poppins']"
                            >
                              Minha Conta
                            </Link>
                            <button 
                              onClick={() => { handleLogout(); setIsMenuOpen(false); }} 
                              className="block w-full text-left px-3 py-1.5 text-[10px] text-red-600 hover:bg-red-50 hover:text-red-700 font-['Poppins']"
                            >
                              Sair
                            </button>
                          </motion.div>
                        )}
                     </div>
                  ) : (
                    <Link href="/autenticacao" className="flex flex-col items-center" onClick={() => setIsMenuOpen(false)}>
                      <Image 
                        src="/assets/perfilIcon.png" 
                        alt="Minha Conta" 
                        width={18} 
                        height={18}
                        className="w-4.5 h-4.5 mb-0.5"
                      />
                      <span className="text-[#365F71] text-[10px] font-['Poppins']">Minha Conta</span>
                    </Link>
                  )}

                  {/* Seletor de Idioma Mobile */}
                  <div className="relative">
                    <button
                      onClick={() => setIsLangDropdownOpen(prev => !prev)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      aria-label="Selecionar idioma"
                      aria-expanded={isLangDropdownOpen}
                      aria-haspopup="true"
                    >
                      <span className="text-sm">
                        {selectedLang === 'pt' && '🇧🇷 PT'}
                        {selectedLang === 'en' && '🇺🇸 EN'}
                        {selectedLang === 'es' && '🇪🇸 ES'}
                      </span>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {isLangDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="language-menu"
                        >
                          <button
                            onClick={() => { setSelectedLang('pt'); setIsLangDropdownOpen(false); }}
                            className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${selectedLang === 'pt' ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'}`}
                            role="menuitem"
                          >
                            <span className="mr-2">🇧🇷</span> Português
                          </button>
                          <button
                            onClick={() => { setSelectedLang('en'); setIsLangDropdownOpen(false); }}
                            className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${selectedLang === 'en' ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'}`}
                            role="menuitem"
                          >
                            <span className="mr-2">🇺🇸</span> English
                          </button>
                          <button
                            onClick={() => { setSelectedLang('es'); setIsLangDropdownOpen(false); }}
                            className={`flex items-center w-full px-3 py-1.5 text-[10px] hover:bg-gray-100 font-['Poppins'] ${selectedLang === 'es' ? 'font-bold text-[#52A4DB]' : 'text-gray-700'}`}
                          >
                            <span className="mr-1.5">🇪🇸</span> Español
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Fechar menu
                </button>
              </div>
            </nav>
          </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Adiciona o elemento div para o Google Translate Widget (oculto) */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      <style jsx global>{`
        body {
          position: relative !important;
          top: 0 !important; /* Impede que o Google Translate empurre o conteúdo para baixo */
        }
        .goog-te-banner-frame {
          display: none !important;
        }
        #goog-gt-tt {
          display: none !important;
          visibility: hidden !important; /* Garante que esteja oculto */
        }
        /* Remove o espaço que o Google pode adicionar no topo do body */
        body > .skiptranslate {
            display: none !important;
        }
        html.translated-ltr body,
        html.translated-rtl body {
            top: 0px !important; /* Garante que não haja deslocamento */
        }
      `}</style>
    </motion.header>
  );
};

export default Header;