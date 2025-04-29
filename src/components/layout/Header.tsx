"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  
  // Valores para transformações baseadas no scroll
  const headerHeight = useTransform(scrollY, [0, 100], ["80px", "65px"]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.98]);
  const logoWidth = useTransform(scrollY, [0, 100], [250, 180]);
  const headerBgColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)"]
  );
  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0px 4px 4px 0px rgba(0,0,0,0.25)", "0px 4px 12px 0px rgba(0,0,0,0.15)"]
  );

  // Detectar scroll para adicionar efeitos adicionais
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fechar o menu ao trocar de página
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <motion.header 
      className="w-full sticky top-0 z-50 transition-all duration-300 bg-white"
      style={{
        backgroundColor: headerBgColor,
        boxShadow: headerShadow,
        height: headerHeight,
        opacity: headerOpacity,
      }}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center h-full max-w-[1280px]">
        {/* Logo à esquerda - animado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={isScrolled ? "scale-90 transition-all duration-300" : "transition-all duration-300"}
        >
          <Link href="/" className="flex items-center">
            <motion.div style={{ width: logoWidth, height: 'auto' }} className="transition-all duration-300">
              <Image 
                src="/logos/logo1.webp" 
                alt="Lorena Jacob - Terapeuta Infantil" 
                width={250} 
                height={50}
                priority
                unoptimized
                style={{ width: '100%', height: 'auto' }}
                className="max-w-none transition-all duration-300"
              />
            </motion.div>
          </Link>
        </motion.div>

        {/* Menu de navegação centralizado - desktop */}
        <motion.nav 
          className={`hidden lg:flex items-center justify-center flex-[0.7] transition-all duration-300 ${isScrolled ? "pt-0" : "pt-1"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ scale: isScrolled ? 0.95 : 1 }}
        >
          <div className="flex items-center justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/" 
                className={`text-[#6E6B46] text-base ${pathname === '/' ? 'font-bold' : 'font-normal'} hover:text-[#52A4DB] transition px-3 font-['Poppins']`}
              >
                Início
              </Link>
            </motion.div>
            
            <div className="h-4 mx-2 w-px bg-gray-300"></div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/sobre" 
                className={`text-[#6E6B46] text-base ${pathname === '/sobre' ? 'font-bold' : 'font-normal'} hover:text-[#52A4DB] transition px-3 font-['Poppins']`}
              >
                Sobre Mim
              </Link>
            </motion.div>
            
            <div className="h-4 mx-2 w-px bg-gray-300"></div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/blog" 
                className={`text-[#6E6B46] text-base ${pathname === '/blog' ? 'font-bold' : 'font-normal'} hover:text-[#52A4DB] transition px-3 font-['Poppins']`}
              >
                Blog
              </Link>
            </motion.div>
            
            <div className="h-4 mx-2 w-px bg-gray-300"></div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/contato" 
                className={`text-[#6E6B46] text-base ${pathname === '/contato' ? 'font-bold' : 'font-normal'} hover:text-[#52A4DB] transition px-3 font-['Poppins']`}
              >
                Contato
              </Link>
            </motion.div>
            
            <div className="h-4 mx-2 w-px bg-gray-300"></div>
            
            <div className="px-3">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/loja" 
                  className="bg-[#52A4DB] text-white text-sm font-['Poppins'] rounded-md px-4 py-1 hover:bg-[#4790c2] transition"
                >
                  Loja
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.nav>

        {/* Área direita - desktop */}
        <motion.div 
          className="hidden lg:flex items-center flex-[0.3]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex-1"></div> {/* Espaçador para empurrar conteúdo para direita */}
          
          {/* Área de "Minha Conta" (estilo da segunda imagem) */}
          <motion.div 
            className="flex flex-col items-center mr-32"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/minha-conta" className="flex flex-col items-center">
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
          
          {/* Área de "Siga-me nas redes sociais" */}
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <div className="text-[10px] font-['Poppins'] mb-1 text-center">
              <span className="text-[#52A4DB] font-bold">Siga-me</span>
              <span className="text-[#52A4DB]"> nas</span><br/>
              <span className="text-[#52A4DB]">redes sociais</span>
            </div>
            <div className="flex items-center">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mx-1.5"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Image 
                  src="/assets/facebookHe.png" 
                  alt="Facebook" 
                  width={20} 
                  height={20}
                  className="w-5 h-5"
                />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mx-1.5"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Image 
                  src="/assets/instagramHe.png" 
                  alt="Instagram" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Botão do menu mobile */}
        <motion.button 
          className="lg:hidden text-[#6E6B46] focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </motion.button>
      </div>

      {/* Menu móvel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden mt-1 py-2 border-t border-gray-200 px-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
          <nav className="flex flex-col space-y-2">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/" 
                className={`text-[#6E6B46] text-xs ${pathname === '/' ? 'font-bold' : 'font-normal'} py-1 font-['Poppins']`}
              >
                Início
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/sobre" 
                className={`text-[#6E6B46] text-xs ${pathname === '/sobre' ? 'font-bold' : 'font-normal'} py-1 font-['Poppins']`}
              >
                Sobre Mim
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/blog" 
                className={`text-[#6E6B46] text-xs ${pathname === '/blog' ? 'font-bold' : 'font-normal'} py-1 font-['Poppins']`}
              >
                Blog
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/contato" 
                className={`text-[#6E6B46] text-xs ${pathname === '/contato' ? 'font-bold' : 'font-normal'} py-1 font-['Poppins']`}
              >
                Contato
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/loja" 
                className="bg-[#52A4DB] text-white text-xs font-['Poppins'] text-center rounded-md px-3 py-1 my-1 inline-block w-full"
              >
                Loja
              </Link>
            </motion.div>
            
            <div className="flex justify-between pt-2 mt-1 border-t border-gray-200">
              {/* Siga-me nas redes sociais (mobile) */}
              <div className="flex flex-col">
                <div className="text-[10px] font-['Poppins']">
                  <span className="text-[#52A4DB] font-bold">Siga-me</span>
                  <span className="text-[#52A4DB]"> nas redes sociais</span>
                </div>
                <div className="flex items-center mt-1 space-x-2">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <Image 
                      src="/assets/facebookHe.png" 
                      alt="Facebook" 
                      width={14} 
                      height={14}
                      className="w-3.5 h-3.5"
                    />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Image 
                      src="/assets/instagramHe.png" 
                      alt="Instagram" 
                      width={14} 
                      height={14}
                      className="w-3.5 h-3.5"
                    />
                  </a>
                </div>
              </div>
              
              {/* Minha Conta (mobile - adaptado para o novo estilo) */}
              <Link href="/minha-conta" className="flex flex-col items-center">
                <Image 
                  src="/assets/perfilIcon.png" 
                  alt="Minha Conta" 
                  width={18} 
                  height={18}
                  className="w-4.5 h-4.5 mb-0.5"
                />
                <span className="text-[#365F71] text-[10px] font-['Poppins']">Minha Conta</span>
              </Link>
            </div>
          </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;