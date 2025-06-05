"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const WhatsAppFloat = () => {
  const whatsappLink = "https://wa.me/message/FDF46FODEQMTL1";
  const [footerOffset, setFooterOffset] = useState(0);
  const { scrollY } = useScroll();
  
  // Detectar a posição do footer e da seção de depoimentos
  useEffect(() => {
    const updateFooterPosition = () => {
      // Procurar pela seção de depoimentos pelo background color
      const sections = document.querySelectorAll('section');
      let depoimentosSection: HTMLElement | null = null;
      
      sections.forEach(section => {
        const bgColor = window.getComputedStyle(section).backgroundColor;
        if (bgColor === 'rgb(0, 188, 212)') { // #00BCD4 em RGB
          depoimentosSection = section;
        }
      });
      
      if (depoimentosSection) {
        const rect = depoimentosSection.getBoundingClientRect();
        const sectionBottom = rect.bottom + window.scrollY;
        setFooterOffset(sectionBottom);
      }
    };

    // Atualizar na montagem e quando redimensionar
    updateFooterPosition();
    window.addEventListener('resize', updateFooterPosition);
    
    // Pequeno delay para garantir que o DOM esteja completamente carregado
    setTimeout(updateFooterPosition, 100);
    
    return () => window.removeEventListener('resize', updateFooterPosition);
  }, []);

  // Calcular a posição Y do botão baseado no scroll
  const buttonY = useTransform(scrollY, (value) => {
    if (footerOffset === 0) return 0; // Se ainda não detectou o footer
    
    const windowHeight = window.innerHeight;
    const buttonHeight = 80; // Altura do botão + margem
    const safetyMargin = 100; // Margem extra para parar antes do footer
    const maxScroll = footerOffset - windowHeight - safetyMargin;
    
    if (value >= maxScroll) {
      // Quando se aproxima do footer, move o botão para cima
      return -(value - maxScroll);
    }
    return 0;
  });

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 1
      }}
      style={{ y: buttonY }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        aria-label="Entrar em contato via WhatsApp"
      >
        {/* Ícone do WhatsApp */}
        <svg
          className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
        </svg>

        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"></div>
      </a>

      {/* Tooltip opcional */}
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Fale conosco no WhatsApp
        <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
      </div>
    </motion.div>
  );
};

export default WhatsAppFloat;