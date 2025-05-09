"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import styles from "../esqueci-minha-senha/styles.module.css";

// Componente fallback para Suspense, se necessário ler searchParams (não usado diretamente aqui)
function FallbackComponent() {
  return null; 
}

export default function RecuperarSenhaPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    let mounted = true;
    // O cliente Supabase (geralmente no middleware ou no root layout)
    // já deve ter processado o fragmento hash da URL (#access_token=...&type=recovery)
    // e estabelecido uma sessão de recuperação se o token for válido.
    // Aqui, apenas verificamos se essa sessão de recuperação está ativa.

    const checkRecoverySession = async () => {
      // Não é necessário chamar onAuthStateChange especificamente para o evento PASSWORD_RECOVERY aqui,
      // pois o cliente Supabase já deve ter atualizado a sessão se o hash estava na URL.
      // Apenas tentamos pegar o usuário para ver se a sessão (de recuperação) está ativa.
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (mounted) {
        if (error) {
          console.error("Erro ao verificar sessão de recuperação:", error);
          setMessage({ type: 'error', text: 'Link de recuperação inválido ou expirado. Por favor, tente solicitar um novo link.'});
          setIsValidSession(false);
        } else if (user) {
          // Se há um usuário, a sessão de recuperação foi estabelecida com sucesso pelo link.
          // Verificamos se o tipo de evento no hash da URL (se ainda presente) é 'recovery'.
          // Isso é uma checagem extra, pois getUser() já indica uma sessão ativa.
          const hash = window.location.hash;
          if (hash.includes('type=recovery')) {
            setIsValidSession(true);
            // Limpar o hash da URL para não ficar visível e não ser processado novamente
            // Isso pode não funcionar em todas as configurações de servidor/roteador, mas é uma boa prática.
            if (window.history.replaceState) {
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          } else {
            // Usuário logado, mas não através de um link de recuperação recente.
            // Isso não deveria acontecer se o redirectTo estiver correto e não houver outra sessão ativa.
            setMessage({ type: 'error', text: 'Link de recuperação inválido ou já utilizado. Solicite um novo.'});
            setIsValidSession(false);
          }
        } else {
          // Nenhum usuário, o link pode ser inválido/expirado ou não foi clicado.
          setMessage({ type: 'error', text: 'Link de recuperação inválido ou expirado. Por favor, solicite um novo link.'});
          setIsValidSession(false);
        }
        setIsSessionChecked(true);
      }
    };

    checkRecoverySession();
    return () => { mounted = false; };
  }, [supabase]);

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
      // Limpar senhas
      setPassword('');
      setConfirmPassword('');
      // Redirecionar para a página de login após um breve delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  if (!isSessionChecked) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-700">Verificando link de recuperação...</p>
      </div>
    );
  }

  return (
    // Envolver com Suspense caso `useSearchParams` seja usado em algum componente filho no futuro.
    <Suspense fallback={<FallbackComponent/>}> 
      <div className={styles.container}>
        <Link 
          href="/login" 
          className={styles.backButton} // Reutilizando estilo do backButton
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
              <h1 className={styles.title}>Redefinir Senha</h1>
            </div>
            
            <div className={styles.content} style={{ display: 'flex', justifyContent: 'center'}}>
              <div className={styles.formSection} style={{maxWidth: '450px'}}>
                {message && (
                  <div 
                    className={styles.messageBox} 
                    style={{
                      padding: '1rem',
                      marginBottom: '1rem',
                      borderRadius: '4px',
                      textAlign: 'center',
                      border: message.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
                      backgroundColor: message.type === 'success' ? 'rgba(210, 240, 210, 0.9)' : 'rgba(255, 230, 230, 0.9)',
                      color: message.type === 'success' ? '#155724' : '#721c24',
                    }}
                  >
                    {message.text}
                  </div>
                )}

                {isValidSession && message?.type !== 'success' && (
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <p className={styles.instructions} style={{marginBottom: '1.5rem'}}>
                      Crie uma nova senha para sua conta. Certifique-se de que é uma senha forte e diferente das anteriores.
                    </p>
                    <div className={styles.inputGroup} style={{position: 'relative'}}>
                      <label htmlFor="password" className={styles.label}>
                        Nova Senha
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Digite sua nova senha"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isUpdating}
                      />
                       <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '10px', top: 'calc(50% + 6px)', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer'}}
                        disabled={isUpdating}
                      >
                        {showPassword ? '🙈' : '👁️'} {/* Simples emoji, substitua por SVGs se preferir */}
                      </button>
                    </div>

                    <div className={styles.inputGroup} style={{position: 'relative', marginTop: '1rem'}}>
                      <label htmlFor="confirmPassword" className={styles.label}>
                        Confirmar Nova Senha
                      </label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirme sua nova senha"
                        className={styles.input}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isUpdating}
                      />
                       <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ position: 'absolute', right: '10px', top: 'calc(50% + 6px)', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer'}}
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

                {/* Se a sessão não for válida e uma mensagem de erro já estiver sendo exibida, não mostrar mais nada aqui */}
                {/* Se a senha foi atualizada com sucesso, a mensagem de sucesso já foi mostrada */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
