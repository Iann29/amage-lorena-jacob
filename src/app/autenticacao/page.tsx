'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function AutenticacaoPage() {
  return (
    <div className={styles.authContainer}>
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
