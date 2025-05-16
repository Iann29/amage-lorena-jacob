'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ShareButtonProps {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Verificar se a API de compartilhamento está disponível
    setCanShare(!!navigator.share);
    
    // Fechar o menu ao clicar fora dele
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
        // Se falhar, mostrar o menu
        setShowMenu(true);
      }
    } else {
      // Mostrar menu de compartilhamento
      setShowMenu(!showMenu);
    }
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
      setShowMenu(false);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      alert('Não foi possível copiar o link. Por favor, tente novamente.');
    }
  };
  
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    setShowMenu(false);
  };
  
  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
    setShowMenu(false);
  };
  
  const shareOnInstagram = () => {
    // Instagram não tem API direta para compartilhamento de links
    // Copiaremos o link para a área de transferência
    copyToClipboard();
    alert('Link copiado! Cole no Instagram para compartilhar.');
  };

  return (
    <div className="relative">
      <button 
        className="flex items-center justify-center hover:opacity-80 transition" 
        onClick={handleShare}
        aria-label="Compartilhar"
      >
        <Image 
          src="/assets/compartilharIcon.svg" 
          alt="Compartilhar" 
          width={22} 
          height={22} 
        />
      </button>
      
      {showCopiedMessage && (
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-md shadow-lg px-3 py-2 z-10 whitespace-nowrap">
          Link copiado!
        </div>
      )}
      
      {showMenu && (
        <div 
          ref={menuRef}
          className="absolute bottom-full right-0 mb-2 bg-white rounded-md shadow-lg p-2 min-w-[180px] z-10"
        >
          <div className="flex flex-col">
            <button 
              onClick={shareOnFacebook}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
            >
              <Image src="/assets/facebook-icon.svg" alt="Facebook" width={20} height={20} />
              <span>Facebook</span>
            </button>
            <button 
              onClick={shareOnWhatsApp}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
            >
              <Image src="/assets/whatsapp-icon.svg" alt="WhatsApp" width={20} height={20} />
              <span>WhatsApp</span>
            </button>
            <button 
              onClick={shareOnInstagram}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
            >
              <Image src="/assets/instagram-icon.svg" alt="Instagram" width={20} height={20} />
              <span>Instagram</span>
            </button>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
              </svg>
              <span>Copiar link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 