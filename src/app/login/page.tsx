'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui será implementada a integração com Supabase Auth
    console.log('Login enviado:', formData);
  };

  return (
    <div className={styles.loginContainer}>
      {/* Lado do formulário (esquerdo) */}
      <div className={styles.formSide}>
        <div className={styles.formContent}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <Image 
              src="/logos/logo1.webp" 
              alt="Lorena Jacob - Terapeuta Infantil" 
              width={280} 
              height={90} 
              className={styles.logo}
              priority
            />
          </div>
          
          {/* Formulário de login */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu e-mail"
                className={styles.inputField}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="senha" className={styles.inputLabel}>
                Senha
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Digite sua senha"
                className={styles.inputField}
                required
              />
            </div>
            
            <Link href="/esqueci-minha-senha" className={styles.forgotPasswordLink}>
              Esqueci minha Senha
            </Link>
            
            <button type="submit" className={styles.loginButton}>
              Entrar
            </button>
          </form>
          
          {/* Separador */}
          <div className={styles.separator}>
            <span>ou</span>
          </div>
          
          {/* Botão do Google */}
          <button className={styles.googleButton}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 3.979c1.688 0 2.813.73 3.458 1.335l2.563-2.5C14.354 1.218 12.313.02 10 .02 6.105.02 2.792 2.39 1.146 5.787l2.979 2.312C4.875 5.583 7.25 3.979 10 3.979z" fill="#EA4335"/>
              <path d="M19.375 10.208c0-.73-.063-1.25-.188-1.802H10v3.25h5.321c-.115.844-.73 2.115-2.084 2.969l2.917 2.26c1.73-1.595 2.73-3.943 2.73-6.677z" fill="#4285F4"/>
              <path d="M4.136 11.901l-.511.428-2.917-2.261-.26.021C1.676 14.302 5.427 20 10 20c2.313 0 4.26-.76 5.677-2.073l-2.917-2.26c-.813.552-1.86.937-3.26.937-2.75 0-5.083-1.844-5.927-4.323l-.166-.368.094-.012z" fill="#34A853"/>
              <path d="M1.147 5.787C.417 7.208 0 8.802 0 10.5c0 1.698.417 3.292 1.135 4.703.1.01.012.021.023.021l3.188-2.468c-.188-.563-.292-1.167-.292-1.803 0-.635.1-1.24.281-1.802L1.147 5.787z" fill="#FBBC05"/>
            </svg>
            Acessar com a Conta Google
          </button>
        </div>
      </div>
      
      {/* Lado da imagem (direito) */}
      <div className={styles.imageSide}>
        <Image 
          src="/backgroundLogin.png"
          alt="Lorena Jacob com criança"
          fill
          className={styles.backgroundImage}
          priority
        />
        <div className={styles.overlay}>
          {/* Citação */}
          <div className={styles.quote}>
            <div className={styles.quoteSymbol}>“</div>
            <div className={styles.quoteText}>
              Conhecimento, estímulo<br/>e constância <span className={styles.highlight}>transformam</span><br/>o desenvolvimento da<br/>criança com autismo.
            </div>
            <div className={styles.quoteAuthor}>Lorena Jacob</div>
          </div>
          
          {/* Link do Instagram */}
          <Link href="https://instagram.com/lorenajacob" className={styles.instagramLink} target="_blank">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="#fff"/>
            </svg>
            Siga-me no Instagram
          </Link>
        </div>
      </div>
    </div>
  );
}
