'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function AutenticacaoPage() {
  return (
    <div className={styles.authContainer}>
      {/* Botão para voltar para o site */}
      <Link href="/" className={styles.backButton}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Voltar para o site
      </Link>
      {/* Fundo azul na parte superior */}
      <div className={styles.topBackground}>
        {/* Logo centralizada */}
        <div className={styles.logoContainer}>
          <Image 
            src="/logos/logobranca.webp" 
            alt="Lorena Jacob - Terapeuta Infantil" 
            width={350} 
            height={100} 
            priority
          />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className={styles.contentContainer}>
        <div className={styles.authCard}>
          <h2 className={styles.greeting}>
            Olá! Para comprar, <span className={styles.highlight}>acesse ou crie a sua conta</span>
          </h2>
          
          {/* Botões de autenticação */}
          <div className={styles.buttonContainer}>
            <Link href="/login" className={styles.authLink}>
              <button className={styles.loginButton}>
                <Image 
                  src="/assets/perfilIcon.png" 
                  alt="Perfil" 
                  width={24} 
                  height={24} 
                  className={styles.perfilIcon}
                />
                Já tenho conta
              </button>
            </Link>
            
            <Link href="/cadastro" className={styles.authLink}>
              <button className={styles.registerButton}>
                Criar Conta
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
