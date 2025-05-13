"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import styles from "./styles.module.css";

// Componente Fallback para Suspense (simples, pode ser mais elaborado)
function LoadingFallback() {
  return (
    <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
      <div className={styles.spinner}></div>
      <p className="ml-3 mt-3 text-gray-700">Carregando...</p>
    </div>
  );
}

export default function RecuperarSenhaPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RecuperarSenhaContent />
    </Suspense>
  );
}

function RecuperarSenhaContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    let isMounted = true;
    console.log("RecuperarSenhaPage: Verificando sessão de recuperação...");

    const checkRecoverySession = async () => {
      try {
        const isRecoverySource = searchParams.get('source') === 'recovery';
        if (isRecoverySource) {
          console.log("RecuperarSenhaPage: Parâmetro source=recovery detectado");
        }

        const hash = window.location.hash;
        const isRecoveryHash = hash.includes('type=recovery');
        if (isRecoveryHash) {
          console.log("RecuperarSenhaPage: Hash de recuperação detectado");
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError && isMounted) {
          console.error("RecuperarSenhaPage: Erro ao verificar usuário:", userError);
          setMessage({ type: 'error', text: 'Link de recuperação inválido ou expirado. Por favor, solicite um novo link.' });
          setIsValidSession(false);
          setIsLoading(false);
          return;
        }
        
        if (user && isMounted) {
          console.log("RecuperarSenhaPage: Usuário autenticado", user.id);
          
          if (isRecoveryHash || isRecoverySource) {
            console.log("RecuperarSenhaPage: Sessão de recuperação válida (hash/source)");
            if (window.history.replaceState) {
              window.history.replaceState(null, '', window.location.pathname);
            }
            setIsValidSession(true);
            setMessage(null);
            setIsLoading(false);
            return;
          }
          
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log("RecuperarSenhaPage: Sessão ativa detectada, considerando como recuperação");
            setIsValidSession(true);
            setMessage(null);
            setIsLoading(false);
            return;
          }
            
          console.log("RecuperarSenhaPage: Usuário logado mas não é uma sessão de recuperação clara.");
          setMessage({ 
            type: 'info', 
            text: 'Você já está logado. Se quiser redefinir a senha desta conta, prossiga. Para outra conta, saia primeiro.' 
          });
          // Ainda permite redefinir se o usuário quiser, mas informa.
          setIsValidSession(true); // Permite redefinir mesmo se já logado, mas com aviso.
          setIsLoading(false);

        } else if (isMounted) {
          console.log("RecuperarSenhaPage: Nenhum usuário autenticado e link não parece ser de recuperação direta.");
          setMessage({ type: 'error', text: 'Link de recuperação inválido, expirado ou você não está em uma sessão de recuperação. Por favor, solicite um novo link.' });
          setIsValidSession(false);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("RecuperarSenhaPage: Erro durante verificação:", error);
          setMessage({ type: 'error', text: 'Ocorreu um erro ao verificar a sessão. Tente novamente.' });
          setIsValidSession(false);
          setIsLoading(false);
        }
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (!isMounted) return;
      console.log(`RecuperarSenhaPage: Evento Auth: ${event}`, session?.user?.id);
      
      if (event === 'PASSWORD_RECOVERY') {
        console.log("RecuperarSenhaPage: Evento PASSWORD_RECOVERY recebido");
        setIsValidSession(true);
        setMessage(null);
        setIsLoading(false);
      } else if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && searchParams.get('source') === 'recovery') {
        console.log("RecuperarSenhaPage: SIGNED_IN / INITIAL_SESSION com source=recovery");
        setIsValidSession(true);
        setMessage(null);
        setIsLoading(false);
      }
    });

    checkRecoverySession();

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, searchParams]);

  const handleLogoutAndRetry = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      // Força recarregamento da página com o parâmetro para tentar novamente
      window.location.href = `${window.location.pathname}?source=recovery`; 
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setMessage({ type: 'error', text: 'Não foi possível sair da conta atual. Tente novamente.' });
      setIsLoading(false);
    }
  };

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
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Erro ao atualizar senha.' });
      } else {
        setMessage({ type: 'success', text: 'Senha atualizada com sucesso! Você será redirecionado para o login.' });
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (error) {
      console.error("Erro ao atualizar senha Supabase:", error);
      setMessage({ type: 'error', text: 'Ocorreu um erro inesperado.' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className={`${styles.themeVariables} ${styles.container}`}>
      <Link href="/login" className={styles.backButton}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Ir para Login
      </Link>

      <div className={styles.contentWrapper}>
        <div className={styles.logoContainer}>
          <Image src="/logos/logo1.webp" alt="Logo Lorena Jacob" width={200} height={70} className={styles.logo} priority />
        </div>

        <div className={styles.mainContent}>
          <div className={styles.textCenter}>
            <h1 className={styles.title}>Redefinir Senha</h1>
            {message && (
              <p className={`${styles.messageBox} ${styles[message.type]}`}>
                {message.text}
              </p>
            )}
             {/* Subtítulo dinâmico ou instrução */} 
            {!message || message.type !== 'success' && (
              <p className={styles.subtitle}>
                {isValidSession 
                  ? 'Crie uma nova senha para sua conta.'
                  : message?.type !== 'error' 
                    ? 'Verifique o link de recuperação enviado para seu e-mail.'
                    : '' // Não mostra subtítulo se já tem mensagem de erro principal
                }
              </p>
            )}
          </div>

          {isValidSession && message?.type !== 'success' && (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Nova Senha</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Digite sua nova senha"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isUpdating}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.passwordToggle} aria-label="Mostrar/esconder senha">
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirmar Nova Senha</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirme sua nova senha"
                    className={styles.input}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isUpdating}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.passwordToggle} aria-label="Mostrar/esconder confirmação de senha">
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              
              <button type="submit" className={styles.submitButton} disabled={isUpdating || !password || !confirmPassword}>
                {isUpdating ? <span className={styles.spinner}></span> : 'Redefinir Senha'}
              </button>
            </form>
          )}

          {message?.type === 'info' && message.text.includes('já está logado') && (
            <div style={{textAlign: 'center', marginTop: '1rem'}}>
              <button onClick={handleLogoutAndRetry} className={`${styles.submitButton} ${styles.secondaryActionButton}`}>
                {isLoading ? <span className={styles.spinner}></span> : 'Sair e tentar redefinir'}
              </button>
            </div>
          )}

          {!isValidSession && message?.type === 'error' && (
            <div style={{textAlign: 'center', marginTop: '1rem'}}>
              <Link href="/esqueci-minha-senha" className={`${styles.submitButton} ${styles.secondaryActionButton}`}>
                Solicitar Novo Link
              </Link>
            </div>
          )}

          {message?.type === 'success' && (
             <div style={{textAlign: 'center', marginTop: '1rem'}}>
              <Link href="/login" className={`${styles.submitButton} ${styles.continueButton}`}>
                Ir para Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
