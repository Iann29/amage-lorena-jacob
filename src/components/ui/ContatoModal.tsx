"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './ContatoModal.module.css';

interface ContatoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContatoModal({ isOpen, onClose }: ContatoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Fechar modal ao pressionar ESC
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevenir scroll do body quando o modal estiver aberto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Fechar ao clicar fora do modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} ref={modalRef}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Fechar modal">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#00D3C7" />
            <path d="M17 7L7 17M7 7L17 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.logoContainer}>
          <Image 
            src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/logos/logoverdeclaro.webp"
            alt="Lorena Jacob Terapeuta Infantil"
            width={220}
            height={90}
            className={styles.logo}
            priority
            quality={90}
            sizes="300px"
            style={{ objectFit: 'contain', maxWidth: '100%' }}
          />
        </div>

        <div className={styles.divider}></div>
        
        <div className={styles.contentContainer}>
          <h2 className={styles.title}>Entre em Contato</h2>
        
        <p className={styles.whatsappText}>Entre em contato pelo WhatsApp</p>
        
        <a 
          href="https://wa.me/5527998206121" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.whatsappButton}
        >
          <Image 
            src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/icons/whatsModal.svg"
            alt="Ícone do WhatsApp"
            width={32}
            height={32}
            className={styles.whatsappIcon}
          />
          Chamar no WhatsApp
        </a>
        
        <a 
          href="https://instagram.com/lorenajacob.st" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.instagramButton}
        >
          <Image 
            src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/icons/instaModal.svg"
            alt="Ícone do Instagram"
            width={32}
            height={32}
            className={styles.instagramIcon}
          />
          Siga-me no Instagram
        </a>

        <div className={styles.emailContainer}>
          <Image 
            src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/icons/mailIcon.svg"
            alt="Ícone de Email"
            width={32}
            height={32}
            className={styles.emailIcon}
          />
          <span className={styles.emailText}>lorenajacobterapeuta@gmail.com</span>
        </div>
        </div>
      </div>
    </div>
  );
}
