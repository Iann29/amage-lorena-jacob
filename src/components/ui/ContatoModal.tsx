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

        <h2 className={styles.title}>Entre em Contato</h2>

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
        
        <p className={styles.whatsappText}>Entre em contato pelo WhatsApp</p>
        
        <a 
          href="https://wa.me/5591999999999" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.whatsappButton}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.whatsappIcon}>
            <path d="M17.6 6.31999C16.8 5.49999 15.8 4.84999 14.7 4.38999C13.6 3.92999 12.3 3.69999 11.1 3.69999C9.9 3.69999 8.6 3.92999 7.5 4.38999C6.3 4.84999 5.3 5.49999 4.5 6.31999C3.8 7.09999 3.1 7.99999 2.7 8.99999C2.3 10 2 11.3 2 12.5C2 14.3 2.4 15.9 3.2 17.2L2 22L6.8 20.8C8.1 21.6 9.7 22 11.5 22C12.7 22 13.9 21.7 15 21.3C16.1 20.9 17 20.2 17.8 19.5C18.6 18.7 19.2 17.7 19.7 16.6C20.2 15.5 20.4 14.3 20.4 13C20.3 11.7 20 10.4 19.6 9.39999C19 7.99999 18.4 7.09999 17.6 6.31999ZM11.1 20.3C9.7 20.3 8.3 19.9 7.1 19.2L6.8 19L4.1 19.7L4.8 17L4.6 16.7C3.9 15.5 3.5 14.1 3.5 12.7C3.5 11.7 3.7 10.7 4.1 9.79999C4.5 8.89999 5 8.09999 5.6 7.39999C6.3 6.69999 7.1 6.19999 8 5.79999C8.9 5.39999 9.9 5.19999 10.9 5.19999C11.9 5.19999 12.9 5.39999 13.8 5.79999C14.7 6.19999 15.5 6.69999 16.2 7.39999C16.9 8.09999 17.4 8.89999 17.8 9.79999C18.2 10.7 18.4 11.7 18.4 12.7C18.4 13.7 18.2 14.7 17.8 15.6C17.4 16.5 16.9 17.3 16.2 18C15.5 18.7 14.7 19.2 13.8 19.6C12.8 20 11.9 20.3 11.1 20.3ZM15.7 14.4C15.5 14.3 14.3 13.7 14.1 13.6C13.9 13.5 13.8 13.5 13.7 13.7C13.6 13.9 13.1 14.5 13 14.6C12.9 14.7 12.8 14.8 12.6 14.7C12.4 14.6 11.6 14.4 10.6 13.5C9.8 12.8 9.3 11.9 9.2 11.7C9.1 11.5 9.2 11.4 9.3 11.3C9.4 11.2 9.5 11.1 9.6 10.9C9.7 10.7 9.7 10.6 9.8 10.5C9.9 10.4 9.9 10.2 9.8 10.1C9.7 10 9.3 9.09999 9.1 8.59999C8.9 8.09999 8.7 8.19999 8.6 8.19999C8.5 8.19999 8.4 8.19999 8.3 8.19999C8.2 8.19999 8 8.29999 7.8 8.49999C7.6 8.69999 7 9.29999 7 10.2C7 11.1 7.6 12 7.7 12.1C7.8 12.2 9.3 14.6 11.7 15.5C12.2 15.7 12.6 15.9 13 16C13.6 16.2 14.2 16.2 14.6 16.1C15.1 16 16.1 15.5 16.3 14.9C16.5 14.3 16.5 13.8 16.4 13.7C16.3 13.6 16.1 13.5 15.7 14.4Z" fill="white"/>
          </svg>
          Chamar no WhatsApp
        </a>
        
        <a 
          href="https://instagram.com/lorenajacob" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.instagramButton}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.instagramIcon}>
            <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" fill="white"/>
          </svg>
          Siga-me no Instagram
        </a>

        <div className={styles.emailContainer}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.emailIcon}>
            <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#333333"/>
          </svg>
          <span className={styles.emailText}>lorenajacobterapeuta@gmail.com</span>
        </div>
      </div>
    </div>
  );
}
