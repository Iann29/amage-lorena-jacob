'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setIsLoading(false);

    if (error) {
      console.error('Erro no login:', error);
      if (error.message.includes("Invalid login credentials")) {
        setErrorMessage('E-mail ou senha inválidos. Verifique seus dados e tente novamente.');
      } else if (error.message.includes("Email not confirmed")) {
        setErrorMessage('Seu e-mail ainda não foi confirmado. Por favor, verifique sua caixa de entrada.');
      } else {
        setErrorMessage(error.message || 'Ocorreu um erro ao tentar fazer login. Tente novamente.');
      }
    } else {
      router.push('/minha-conta');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Erro no login com Google:', error);
      setErrorMessage('Ocorreu um erro ao tentar fazer login com o Google. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Link href="/" className={styles.backButton}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Voltar para o site
      </Link>
      <div className={styles.formSide}>
        <div className={styles.formContent}>
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
          
          {errorMessage && (
            <div className={styles.errorMessageContainer} style={{ 
              backgroundColor: 'rgba(255, 230, 230, 0.9)', 
              border: '1px solid #f5c6cb', 
              color: '#721c24', 
              marginBottom: '1rem', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              textAlign: 'center',
              fontSize: '0.875rem'
            }}>
              {errorMessage}
            </div>
          )}
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className={styles.inputField}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className={styles.inputGroup} style={{position: 'relative'}}>
              <label htmlFor="senha" className={styles.inputLabel}>
                Senha
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="senha"
                name="senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className={styles.inputField}
                required
                disabled={isLoading}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY( calc(-50% + 12px) )',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px'
                }}
                disabled={isLoading}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 2L22 22" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
            
            <Link href="/esqueci-minha-senha" className={styles.forgotPasswordLink}>
              Esqueci minha Senha
            </Link>
            
            <button type="submit" className={styles.loginButton} disabled={isLoading}>
              {isLoading ? (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{color: 'currentColor'}}>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
          
          <div className={styles.separator}>
            <span>ou</span>
          </div>
          
          <button 
            className={styles.googleButton} 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
            type="button"
          >
            {isLoading ? (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{color: 'currentColor'}}>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando...
              </div>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3.979c1.688 0 2.813.73 3.458 1.335l2.563-2.5C14.354 1.218 12.313.02 10 .02 6.105.02 2.792 2.39 1.146 5.787l2.979 2.312C4.875 5.583 7.25 3.979 10 3.979z" fill="#EA4335"/>
                  <path d="M19.375 10.208c0-.73-.063-1.25-.188-1.802H10v3.25h5.321c-.115.844-.73 2.115-2.084 2.969l2.917 2.26c1.73-1.595 2.73-3.943 2.73-6.677z" fill="#4285F4"/>
                  <path d="M4.136 11.901l-.511.428-2.917-2.261-.26.021C1.676 14.302 5.427 20 10 20c2.313 0 4.26-.76 5.677-2.073l-2.917-2.26c-.813.552-1.86.937-3.26.937-2.75 0-5.083-1.844-5.927-4.323l-.166-.368.094-.012z" fill="#34A853"/>
                  <path d="M1.147 5.787C.417 7.208 0 8.802 0 10.5c0 1.698.417 3.292 1.135 4.703.1.01.012.021.023.021l3.188-2.468c-.188-.563-.292-1.167-.292-1.803 0-.635.1-1.24.281-1.802L1.147 5.787z" fill="#FBBC05"/>
                </svg>
                Acessar com a Conta Google
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className={styles.imageSide}>
        <Image 
          src="/backgroundLogin.png"
          alt="Lorena Jacob com criança"
          fill
          className={styles.backgroundImage}
          priority
        />
        <div className={styles.overlay}>
          <div className={styles.quote}>
            <div>
              <div className={styles.quoteSymbol}>“</div>
              <div className={styles.quoteText}>
                <span className={styles.highlightYellow}>Conhecimento, estímulo<br/>e constância</span> <span className={styles.highlight}>transformam</span><br/>o desenvolvimento da<br/>criança com autismo.
              </div>
              <div className={styles.quoteAuthor}>Lorena Jacob</div>
            </div>
          </div>
          
          <Link href="https://instagram.com/lorenajacob.st" className={styles.instagramLink} target="_blank">
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
