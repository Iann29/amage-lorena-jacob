'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './cadastro.module.css';

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [dataCollectionChecked, setDataCollectionChecked] = useState(false);
  const [notificationsChecked, setNotificationsChecked] = useState(false);

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
    console.log('Cadastro enviado:', formData);
    
    if (!termsChecked || !dataCollectionChecked) {
      alert('Você precisa aceitar os termos e a política de privacidade para continuar.');
      return;
    }
    
    // Futuramente redirecionaremos para a página de minha-conta após o cadastro bem-sucedido
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={styles.cadastroContainer}>
      {/* Botão para voltar para o site */}
      <Link href="/" className={styles.backButton}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Voltar para o site
      </Link>
      <Image 
        src="/backgroundcadastro.png" 
        alt="Background" 
        fill
        className={styles.backgroundImage}
        priority
      />
      
      <div className={styles.formContainer}>
        <Image 
          src="/logos/logobranca.webp" 
          alt="Lorena Jacob - Terapeuta Infantil" 
          width={220} 
          height={60} 
          className={styles.logo}
        />
        
        <div className={styles.title}>
          <span className={styles.titleCrie}>Crie </span>
          <span className={styles.titleSuaConta}>sua conta</span>
        </div>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className={styles.formGroup}>
            <label htmlFor="nome" className={styles.label}>Nome Completo: <span className={styles.requiredAsterisk}>*</span></label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Ex: Sabrina Meireles dos Santos"
              autoComplete="name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>E-mail: <span className={styles.requiredAsterisk}>*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Ex: sabrinamei@gmail.com"
              autoComplete="email"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="senha" className={styles.label}>Senha: <span className={styles.requiredAsterisk}>*</span></label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Insira sua senha"
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility} 
                className={styles.passwordToggle}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z" stroke="#979797" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#979797" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2L22 22" stroke="#979797" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#979797" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12Z" stroke="#979797" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmarSenha" className={styles.label}>Confirmar Senha: <span className={styles.requiredAsterisk}>*</span></label>
            <div className={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Confirme sua senha"
              />
              <button 
                type="button" 
                onClick={toggleConfirmPasswordVisibility} 
                className={styles.passwordToggle}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z" stroke="#979797" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#979797" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2L22 22" stroke="#979797" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#979797" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12Z" stroke="#979797" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.orText}>ou</div>
          
          <button type="button" className={styles.googleButton}>
            <Image 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=" 
              alt="Google" 
              width={18} 
              height={18} 
              className={styles.googleIcon}
            />
            Conecte-se com a Conta Google
          </button>
          
          <label className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              checked={termsChecked}
              onChange={() => setTermsChecked(!termsChecked)}
              className={styles.checkbox}
              required
            />
            <span className={styles.checkboxLabel}>
              Li e estou de acordo com <span className={styles.highlightedTerms}>os Termos de Uso e a Política de Privacidade. *</span>
            </span>
          </label>
          
          <label className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              checked={dataCollectionChecked}
              onChange={() => setDataCollectionChecked(!dataCollectionChecked)}
              className={styles.checkbox}
              required
            />
            <span className={styles.checkboxLabel}>
              Autorizo este site a coletar e armazenar os dados fornecidos neste formulário. *
            </span>
          </label>
          
          <label className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              checked={notificationsChecked}
              onChange={() => setNotificationsChecked(!notificationsChecked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxLabel}>
              Desejo receber atualizações e notificações por e-mail.
            </span>
          </label>
          
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <button type="submit" className={styles.button}>
              Registrar-se
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
