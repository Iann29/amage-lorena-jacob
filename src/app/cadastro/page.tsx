'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './cadastro.module.css';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function CadastroPage() {
  const supabase = createClient();
  const router = useRouter();
  const [formData, setFormData] = useState({
    primeiroNome: '',
    sobrenome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [dataCollectionChecked, setDataCollectionChecked] = useState(false);
  const [notificationsChecked, setNotificationsChecked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (formData.senha !== formData.confirmarSenha) {
      setErrorMessage('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }
    
    if (!termsChecked || !dataCollectionChecked) {
      setErrorMessage('Você precisa aceitar os Termos de Uso e a Política de Privacidade para continuar.');
      setIsLoading(false);
      return;
    }

    const emailRedirectTo = window.location.origin + '/';

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.senha,
      options: {
        emailRedirectTo: emailRedirectTo,
        data: {
          primeiro_nome: formData.primeiroNome,
          sobrenome: formData.sobrenome,
        }
      }
    });

    setIsLoading(false);

    if (error) {
      console.error('Erro no cadastro:', error);
      if (error.message.includes("User already registered")) {
        setErrorMessage("Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.");
      } else if (error.message.includes("Password should be at least 6 characters")) {
        setErrorMessage("A senha deve ter pelo menos 6 caracteres.");
      } else if (error.message.includes("Unable to validate email address")) {
        setErrorMessage("O formato do e-mail fornecido é inválido.");
      }
       else {
        setErrorMessage(error.message || 'Ocorreu um erro ao tentar criar a conta. Tente novamente.');
      }
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      setErrorMessage("Este e-mail já está cadastrado, mas a conta não foi confirmada. Verifique seu e-mail ou tente fazer login.");
    } else if (data.session === null && data.user) {
      setSuccessMessage('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar sua conta.');
      setFormData({primeiroNome: '', sobrenome: '', email: '', senha: '', confirmarSenha: ''});
      setTermsChecked(false);
      setDataCollectionChecked(false);
      setNotificationsChecked(false);
    } else if (data.session && data.user) {
      setSuccessMessage('Conta criada com sucesso! Redirecionando...');
      router.push('/minha-conta'); 
    } else {
      setErrorMessage('Ocorreu uma resposta inesperada do servidor. Por favor, tente novamente.');
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        // Não precisamos passar 'primeiro_nome' e 'sobrenome' aqui diretamente,
        // pois o Google Auth geralmente lida com isso.
        // Se precisarmos de dados adicionais no cadastro via Google,
        // teremos que coletá-los em uma etapa posterior ou configurar no Supabase.
      },
    });

    if (error) {
      console.error('Erro no cadastro com Google:', error);
      setErrorMessage('Ocorreu um erro ao tentar criar a conta com o Google. Tente novamente.');
      setIsLoading(false);
    }
    // O redirecionamento para /minha-conta ou a mensagem de sucesso será tratado pelo /auth/callback
    // ou pela lógica de observação do estado de autenticação do Supabase.
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={styles.cadastroContainer}>
      <Link href="/" className={styles.backButton}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Voltar para o site
      </Link>
      <div className={styles.backgroundWrapper}
        style={{
          backgroundImage: `url(https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//backgroundcadastro.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.2,
          zIndex: 0
        }}
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
          {errorMessage && (
            <div className={styles.messageContainer} style={{ backgroundColor: 'rgba(255, 230, 230, 0.9)', border: '1px solid #f5c6cb', color: '#721c24', marginBottom: '1rem', padding: '0.75rem', borderRadius: '4px', textAlign: 'center' }}>
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className={styles.messageContainer} style={{ backgroundColor: 'rgba(230, 245, 230, 0.9)', border: '1px solid #c3e6cb', color: '#155724', marginBottom: '1rem', padding: '0.75rem', borderRadius: '4px', textAlign: 'center' }}>
              {successMessage}
            </div>
          )}

          <div className={styles.nameFieldsContainer}>
            <div className={`${styles.formGroup} ${styles.nameField}`}>
              <label htmlFor="primeiroNome" className={styles.label}>Nome: <span className={styles.requiredAsterisk}>*</span></label>
              <input
                type="text"
                id="primeiroNome"
                name="primeiroNome"
                value={formData.primeiroNome}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={`${styles.input} ${styles.largeInput}`}
                placeholder="Ex: Sabrina"
                autoComplete="given-name"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.nameField}`}>
              <label htmlFor="sobrenome" className={styles.label}>Sobrenome: <span className={styles.requiredAsterisk}>*</span></label>
              <input
                type="text"
                id="sobrenome"
                name="sobrenome"
                value={formData.sobrenome}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={`${styles.input} ${styles.largeInput}`}
                placeholder="Ex: Meireles dos Santos"
                autoComplete="family-name"
              />
            </div>
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
              disabled={isLoading}
              className={`${styles.input} ${styles.largeInput}`}
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
                disabled={isLoading}
                className={styles.input}
                placeholder="Insira sua senha"
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility} 
                className={styles.passwordToggle}
                tabIndex={-1}
                disabled={isLoading}
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
                disabled={isLoading}
                className={styles.input}
                placeholder="Confirme sua senha"
              />
              <button 
                type="button" 
                onClick={toggleConfirmPasswordVisibility} 
                className={styles.passwordToggle}
                tabIndex={-1}
                disabled={isLoading}
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
          
          <button type="button" className={styles.googleButton} disabled={isLoading} onClick={handleGoogleSignUp}>
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
              onChange={(e) => setTermsChecked(e.target.checked)}
              className={styles.checkbox}
              required
              disabled={isLoading}
            />
            <span className={styles.checkboxLabel}>
              Li e estou de acordo com <span className={styles.highlightedTerms}>os Termos de Uso e a Política de Privacidade. <span className={styles.requiredAsterisk}>*</span></span>
            </span>
          </label>
          
          <label className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              checked={dataCollectionChecked}
              onChange={(e) => setDataCollectionChecked(e.target.checked)}
              className={styles.checkbox}
              required
              disabled={isLoading}
            />
            <span className={styles.checkboxLabel}>
              <span className={styles.destacado}>Autorizo este site</span> a coletar e armazenar os dados fornecidos neste formulário. <span className={styles.requiredAsterisk}>*</span>
            </span>
          </label>
          
          <label className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              checked={notificationsChecked}
              onChange={(e) => setNotificationsChecked(e.target.checked)}
              className={styles.checkbox}
              disabled={isLoading}
            />
            <span className={styles.checkboxLabel}>
              <span className={styles.destacado}>Desejo receber</span> atualizações e notificações por e-mail.
            </span>
          </label>
          
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{color: '#3DAEDF'}}>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </div>
              ) : (
                'Registrar-se'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
