"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Variável comentada pois não está sendo utilizada no código
  // const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  
  // Valores para transformações baseadas no scroll - com transições mais suaves
  const headerHeight = useTransform(scrollY, [0, 100], ["80px", "65px"]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.98]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.72]);
  const headerShadow = useTransform(
    scrollY,
    [0, 20, 100],
    ["none", "0px 2px 8px rgba(0,0,0,0.05)", "0px 4px 12px rgba(0,0,0,0.15)"]
  );
  
  // Fechar o menu ao trocar de página - movido para antes da verificação condicional
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname, isMenuOpen]);
  
  // Código comentado pois a variável isScrolled não está sendo utilizada
  // useMotionValueEvent(scrollY, "change", (latest) => {
  //   if (latest > 50) {
  //     setIsScrolled(true);
  //   } else {
  //     setIsScrolled(false);
  //   }
  // });
  
  // A lógica de exibição/ocultação do Header foi movida para o template.tsx principal

  return (
    <motion.header 
      className="w-full sticky top-0 z-50 bg-white"
      style={{
        boxShadow: headerShadow,
        height: headerHeight,
        opacity: headerOpacity,
      }}
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center h-full max-w-[1280px]">
        {/* Logo à esquerda - animado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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

        {/* Menu de navegação centralizado - desktop */}
        <motion.nav 
          className="hidden lg:flex items-center justify-center flex-[0.7]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ 
            translateY: useTransform(scrollY, [0, 100], [0, -2]),
            scale: useTransform(scrollY, [0, 100], [1, 0.95]) 
          }}
        >
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
              <Link 
                href="/contato" 
                className={`text-[#6E6B46] text-base ${pathname === '/contato' ? 'font-bold' : 'font-normal'} hover:text-[#52A4DB] transition px-3 font-['Poppins'] relative group`}
              >
                Contato
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#52A4DB] transition-all duration-200 group-hover:w-full"></span>
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
                href="https://instagram.com" 
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