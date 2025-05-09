"use client";

import { useState, useEffect, Suspense } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { createClient } from '@/utils/supabase/client';

// Componente principal que contém a lógica
function PasswordResetForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recoveryCode = searchParams.get("code"); // O Supabase usa 'code' como query param aqui

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;
    console.log("Effect triggered. Recovery code from URL:", recoveryCode);

    // Se não houver código na URL, o link é inválido para esta página.
    if (!recoveryCode) {
      if (isMounted) {
        setMessage({ type: 'error', text: 'Link de recuperação inválido. Nenhum código fornecido.' });
        setShowPasswordInput(false);
        setInitialLoading(false);
      }
      return;
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      console.log("Auth event:", event, "Session:", session);

      if (event === 'PASSWORD_RECOVERY') {
        console.log("Evento PASSWORD_RECOVERY recebido. Sessão estabelecida para redefinição.");
        setMessage(null); // Limpar mensagens anteriores
        setShowPasswordInput(true);
        setInitialLoading(false);
        // É uma boa prática limpar o código da URL após ser processado
        // para evitar que seja usado novamente ou fique visível.
        router.replace(window.location.pathname, { scroll: false });
      } else if (session && event !== 'INITIAL_SESSION' && event !== 'SIGNED_IN' && event !== 'USER_UPDATED') {
        // Se houver uma sessão, mas não for de PASSWORD_RECOVERY (e não for um evento genérico de sessão já existente)
        // Isso pode indicar que o usuário já está logado normalmente, o que não deveria acontecer se o teste for em aba anônima.
        // Ou o token de recuperação era inválido e não resultou no evento PASSWORD_RECOVERY.
        // Se o initialLoading ainda for true, significa que estamos na primeira carga e esperávamos PASSWORD_RECOVERY.
        if (initialLoading) {
            console.log("Sessão existente, mas não é PASSWORD_RECOVERY. Evento:", event);
            setMessage({ type: 'error', text: 'Este link parece ser inválido ou já foi utilizado. Por favor, solicite um novo link de recuperação.' });
            setShowPasswordInput(false);
            setInitialLoading(false);
        }
      } else if (!session && initialLoading && recoveryCode) {
        // Se não há sessão, mas havia um recoveryCode e ainda estamos no loading inicial,
        // o token pode ser inválido e não resultou no evento PASSWORD_RECOVERY.
        console.log("Sem sessão após tentativa de recuperação com code.");
        setMessage({ type: 'error', text: 'O link de recuperação é inválido, expirado ou já foi utilizado.' });
        setShowPasswordInput(false);
        setInitialLoading(false);
      }
    });
    
    // Fallback para o caso de não haver evento PASSWORD_RECOVERY após um tempo, mas o code existia.
    // Isso é para cobrir casos onde o listener pode não capturar o evento como esperado inicialmente.
    const timer = setTimeout(() => {
        if (isMounted && initialLoading && recoveryCode && !showPasswordInput) {
            console.log("Timeout: Evento PASSWORD_RECOVERY não recebido, considerando link inválido.");
            setMessage({ type: 'error', text: 'Falha ao processar o link de recuperação. Pode ser inválido ou expirado.' });
            setShowPasswordInput(false);
            setInitialLoading(false);
        }
    }, 2500); // Aumentar um pouco o timeout para dar mais margem ao Supabase SDK

    return () => {
      isMounted = false;
      clearTimeout(timer);
      authListener.subscription.unsubscribe();
    };
  // Adicionado recoveryCode como dependência para reavaliar se ele mudar (improvável, mas seguro)
  }, [supabase, router, recoveryCode, initialLoading, showPasswordInput]); 

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
      setShowPasswordInput(false); // Esconder formulário após sucesso
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
    <>
      {message && (
        <div 
          className={styles.messageBox} 
          style={{
            padding: '0.8rem 1rem',
            margin: '1rem 0',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '0.9rem',
            border: message.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
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
          {/* Campos de senha aqui - reutilizando a estrutura que você já tem, se possível */}
          {/* Exemplo: */}
          <div className={styles.inputGroup} style={{position: 'relative'}}>
            <label htmlFor="password" className={styles.label}>Nova Senha</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className={styles.input} // Use a classe do seu CSS module
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              required
              disabled={isUpdating}
            />
             <button 
                type="button" 
                onClick={() => setShowPassword(prev => !prev)}
                className={styles.passwordToggle} // Use a classe do seu CSS module se tiver
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
              className={styles.input} // Use a classe do seu CSS module
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              required
              disabled={isUpdating}
            />
             <button 
                type="button" 
                onClick={() => setShowConfirmPassword(prev => !prev)}
                className={styles.passwordToggle} // Use a classe do seu CSS module se tiver
                style={{ position: 'absolute', right: '10px', top: 'calc(50% + 12px)', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer'}}
                aria-label="Mostrar/Esconder confirmação de senha"
                disabled={isUpdating}
            >
                {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button 
            type="submit" 
            className={styles.submitButton} // Use a classe do seu CSS module
            disabled={isUpdating || !password || !confirmPassword}
            style={{marginTop: '2rem'}}
          >
            {isUpdating ? 'Atualizando...' : 'Redefinir Senha'}
          </button>
        </form>
      )}
    </>
  );
}

// Componente da página que envolve o Suspense e o PasswordResetForm
export default function CodigoVerificacaoPage() {
  return (
    <div className={styles.container}>
      <Link 
        href="/login" 
        className={styles.backButton}
        // Estilos do botão voltar como antes
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
              <Suspense fallback={
                <div style={{display: 'flex',flexDirection: 'column', justifyContent:'center', alignItems:'center', minHeight: '150px'}}>
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="ml-3 mt-3 text-gray-600 text-sm">Verificando...</p>
                </div>
              }>
                <PasswordResetForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
