"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Fechar o menu ao trocar de página
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="w-full bg-white py-3.5 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="container mx-auto px-6 flex justify-between items-center min-h-[80px] max-w-[1280px]">
        {/* Logo à esquerda */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/logos/logo1.webp" 
            alt="Lorena Jacob - Terapeuta Infantil" 
            width={250} 
            height={50}
            priority
            unoptimized
            style={{ width: '250px', height: 'auto' }}
            className="max-w-none"
          />
        </Link>

        {/* Menu de navegação centralizado - desktop */}
        <nav className="hidden lg:flex items-center justify-center flex-[0.7]">
          <div className="flex items-center justify-center">
            <Link 
              href="/" 
              className={`text-[#6E6B46] text-base ${pathname === '/' ? 'font-bold' : 'font-normal'} hover:text-[#52A4DB] transition px-3 font-['Poppins']`}
            >
              Início
            </Link>
            
            <div className="h-4 mx-2 w-px bg-gray-300"></div>
            
            <Link 
              href="/sobre" 
              className={`text-[#6E6B46] text-base ${pathname === '/sobre' ? 'font-bold' : 'font-normal'} hover:text-[#52A4DB] transition px-3 font-['Poppins']`}
            >
              Sobre Mim
            </Link>
            
            <div className="h-4 mx-2 w-px bg-gray-300"></div>
            
            <Link 
              href="/blog" 
              className={`text-[#6E6B46] text-base ${pathname === '/blog' ? 'font-bold' : 'font-normal'} hover:text-[#52A4DB] transition px-3 font-['Poppins']`}
            >
              Blog
            </Link>
            
            <div className="h-4 mx-2 w-px bg-gray-300"></div>
            
            <Link 
              href="/contato" 
              className={`text-[#6E6B46] text-base ${pathname === '/contato' ? 'font-bold' : 'font-normal'} hover:text-[#52A4DB] transition px-3 font-['Poppins']`}
            >
              Contato
            </Link>
            
            <div className="h-4 mx-2 w-px bg-gray-300"></div>
            
            <div className="px-3">
              <Link 
                href="/loja" 
                className="bg-[#52A4DB] text-white text-sm font-['Poppins'] rounded-md px-4 py-1 hover:bg-[#4790c2] transition"
              >
                Loja
              </Link>
            </div>
          </div>
        </nav>

        {/* Área direita - desktop */}
        <div className="hidden lg:flex items-center flex-[0.3]">
          <div className="flex-1"></div> {/* Espaçador para empurrar conteúdo para direita */}
          
          {/* Área de "Minha Conta" (estilo da segunda imagem) */}
          <div className="flex flex-col items-center mr-32">
            <Link href="/minha-conta" className="flex flex-col items-center">
              <Image 
                src="/assets/perfilIcon.png" 
                alt="Minha Conta" 
                width={40} 
                height={40}
                className="mb-0.5"
                unoptimized
                style={{ width: '40px', height: '40px' }}
              />
              <span className="text-[#365F71] text-xs font-['Poppins']">Minha Conta</span>
            </Link>
          </div>
          
          {/* Área de "Siga-me nas redes sociais" */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-['Poppins'] mb-1 text-center">
              <span className="text-[#52A4DB] font-bold">Siga-me</span>
              <span className="text-[#52A4DB]"> nas</span><br/>
              <span className="text-[#52A4DB]">redes sociais</span>
            </div>
            <div className="flex items-center">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-1.5">
                <Image 
                  src="/assets/facebookHe.png" 
                  alt="Facebook" 
                  width={20} 
                  height={20}
                  className="w-5 h-5"
                />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-1.5">
                <Image 
                  src="/assets/instagramHe.png" 
                  alt="Instagram" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Botão do menu mobile */}
        <button 
          className="lg:hidden text-[#6E6B46] focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
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
        </button>
      </div>

      {/* Menu móvel */}
      {isMenuOpen && (
        <div className="lg:hidden mt-1 py-2 border-t border-gray-200 px-4">
          <nav className="flex flex-col space-y-2">
            <Link 
              href="/" 
              className={`text-[#6E6B46] text-xs ${pathname === '/' ? 'font-bold' : 'font-normal'} py-1 font-['Poppins']`}
            >
              Início
            </Link>
            
            <Link 
              href="/sobre" 
              className={`text-[#6E6B46] text-xs ${pathname === '/sobre' ? 'font-bold' : 'font-normal'} py-1 font-['Poppins']`}
            >
              Sobre Mim
            </Link>
            
            <Link 
              href="/blog" 
              className={`text-[#6E6B46] text-xs ${pathname === '/blog' ? 'font-bold' : 'font-normal'} py-1 font-['Poppins']`}
            >
              Blog
            </Link>
            
            <Link 
              href="/contato" 
              className={`text-[#6E6B46] text-xs ${pathname === '/contato' ? 'font-bold' : 'font-normal'} py-1 font-['Poppins']`}
            >
              Contato
            </Link>
            
            <Link 
              href="/loja" 
              className="bg-[#52A4DB] text-white text-xs font-['Poppins'] text-center rounded-md px-3 py-1 my-1"
            >
              Loja
            </Link>
            
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
        </div>
      )}
    </header>
  );
};

export default Header;