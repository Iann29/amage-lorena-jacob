"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { createClient } from '@/utils/supabase/client';

export default function CodigoVerificacaoPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;
    console.log("CodigoVerificacaoPage: useEffect iniciado. Aguardando eventos do Supabase Auth.");

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      console.log(`CodigoVerificacaoPage: Auth Event: ${event}`, session);
      if (event === 'PASSWORD_RECOVERY') {
        console.log("CodigoVerificacaoPage: Evento PASSWORD_RECOVERY recebido.");
        if (isMounted) {
          setMessage(null); 
          setShowPasswordInput(true); 
          setInitialLoading(false); 
        }
        return; 
      }
      
      // Só executa esta verificação se ainda estiver carregando
      if (isMounted && initialLoading) {
        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          console.log("CodigoVerificacaoPage: Sessão detectada, mas não é PASSWORD_RECOVERY.");
          setMessage({ type: 'error', text: 'Link inválido ou você já está logado. Para redefinir a senha de uma conta específica, use o link de recuperação em uma aba anônima ou após sair da sua conta atual.' });
          setShowPasswordInput(false);
          setInitialLoading(false);
        } else if (!session && (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION')) {
          console.log("CodigoVerificacaoPage: Nenhuma sessão ou SIGNED_OUT durante a verificação inicial.");
          setMessage({ type: 'error', text: 'Link de recuperação inválido, expirado ou já utilizado. Por favor, solicite um novo link.' });
          setShowPasswordInput(false);
          setInitialLoading(false);
        }
      }
      
      if (event === 'SIGNED_OUT') { 
        console.log("CodigoVerificacaoPage: Usuário deslogado.");
        if(isMounted){
            setMessage({ type: 'info', text: 'Sua sessão foi encerrada. Solicite um novo link se necessário.' });
            setShowPasswordInput(false);
            setInitialLoading(false); 
        }
      }
    });
    
    const timer = setTimeout(() => {
      if (isMounted && initialLoading) {
        console.log("CodigoVerificacaoPage: Timeout - Nenhum evento de recuperação conclusivo detectado.");
        setMessage({ type: 'error', text: 'Falha ao processar o link de recuperação. Verifique se o link está correto e tente novamente, ou solicite um novo link.' });
        setShowPasswordInput(false);
        setInitialLoading(false);
      }
    }, 3500); 
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router]); // Removido initialLoading das dependências

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }
    setIsUpdating(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    setIsUpdating(false);
    if (error) {
      console.error("Erro ao atualizar senha:", error);
      setMessage({ type: 'error', text: error.message || 'Ocorreu um erro ao tentar atualizar sua senha.' });
    } else {
      setMessage({ type: 'success', text: 'Senha atualizada com sucesso! Você será redirecionado para fazer login.' });
      setPassword('');
      setConfirmPassword('');
      setShowPasswordInput(false); 
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  if (initialLoading) {
    return (
      <div className={styles.loadingContainer} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '200px'}}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 mt-3 text-gray-700">Verificando link de recuperação...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link 
        href="/login" 
        className={styles.backButton}
         style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          color: "#3068AD",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "0.4rem 0.8rem",
          borderRadius: "6px",
          fontFamily: "var(--font-museo-sans)",
          fontSize: "0.85rem",
          fontWeight: 500,
          textDecoration: "none",
          zIndex: 10,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
          transition: "all 0.25s ease",
          border: "1px solid rgba(48, 104, 173, 0.08)"
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Ir para Login
      </Link>
      <div className={styles.contentWrapper}>
        <div className={styles.logoContainer}>
          <Image
            src="/logos/logo1.webp"
            alt="Logo Lorena Jacob"
            width={280}
            height={90}
            className={styles.logo}
            priority
          />
        </div>
        <div className={styles.mainContent}>
          <div className={styles.textCenter}>
            <h1 className={styles.title}>Redefinir Sua Senha</h1>
             <p className={styles.subtitle} style={{marginTop: '0.5rem', marginBottom: '1.5rem'}}>
                Se o link de recuperação for válido, você poderá criar uma nova senha abaixo.
            </p>
          </div>
          <div className={styles.content} style={{ display: 'flex', justifyContent: 'center'}}>
            <div className={styles.formSection} style={{maxWidth: '450px', width: '100%'}}>
                {message && (
                <div 
                  className={styles.messageBox} 
                  style={{
                    padding: '0.8rem 1rem',
                    margin: '1rem 0',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    border: message.type === 'success' ? '1px solid #c3e6cb' : message.type === 'error' ? '1px solid #f5c6cb' : '1px solid #bee5eb', 
                    backgroundColor: message.type === 'success' ? '#d4edda' : message.type === 'error' ? '#f8d7da' : '#d1ecf1', 
                    color: message.type === 'success' ? '#155724' : message.type === 'error' ? '#721c24' : '#0c5460', 
                  }}
                >
                  {message.text}
                </div>
              )}

              {showPasswordInput && message?.type !== 'success' && (
                <form onSubmit={handleSubmit} className={styles.form} style={{width: '100%'}}>
                  <p className={styles.instructions} style={{marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem'}}>
                    Crie uma nova senha para sua conta.
                  </p>
                  <div className={styles.inputGroup} style={{position: 'relative'}}>
                    <label htmlFor="password" className={styles.label}>Nova Senha</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className={styles.input} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite sua nova senha"
                      required
                      disabled={isUpdating}
                      autoComplete="new-password" 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(prev => !prev)}
                        className={styles.passwordToggle} 
                        style={{ position: 'absolute', right: '10px', top: 'calc(50% + 12px)', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer'}}
                        aria-label="Mostrar/Esconder senha"
                        disabled={isUpdating}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <div className={styles.inputGroup} style={{position: 'relative', marginTop: '1rem'}}>
                    <label htmlFor="confirmPassword" className={styles.label}>Confirmar Nova Senha</label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className={styles.input} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua nova senha"
                      required
                      disabled={isUpdating}
                      autoComplete="new-password" 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(prev => !prev)}
                        className={styles.passwordToggle} 
                        style={{ position: 'absolute', right: '10px', top: 'calc(50% + 12px)', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer'}}
                        aria-label="Mostrar/Esconder confirmação de senha"
                        disabled={isUpdating}
                    >
                        {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <button 
                    type="submit" 
                    className={styles.submitButton} 
                    disabled={isUpdating || !password || !confirmPassword}
                    style={{marginTop: '2rem'}}
                  >
                    {isUpdating ? 'Atualizando...' : 'Redefinir Senha'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
