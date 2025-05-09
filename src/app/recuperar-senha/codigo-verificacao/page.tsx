"use client";

import { useState, useEffect, Suspense } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { createClient } from '@/utils/supabase/client';

// Componente interno para ler o parâmetro 'code' e gerenciar o estado inicial
function PasswordResetCore() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recoveryToken = searchParams.get("code"); // O Supabase pode usar 'code' ou similar

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null); // null = verificando, true = válido, false = inválido

  useEffect(() => {
    // O evento 'PASSWORD_RECOVERY' é disparado pelo Supabase Auth JS SDK
    // quando ele detecta os parâmetros de recuperação na URL (seja hash ou query param como ?code=...).
    // Ele estabelece uma sessão temporária para o usuário.
    // Não precisamos verificar ativamente o 'code' aqui, apenas se uma sessão de usuário foi estabelecida.
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Isso confirma que o Supabase processou o link/token e a sessão está pronta para updateUser
        setIsValidToken(true);
        // Limpar o código da URL para segurança e evitar reprocessamento
        // router.replace() pode ser mais suave do que window.history
        router.replace(window.location.pathname, { scroll: false });
      } else if (isValidToken === null && !session) {
        // Se o evento não for PASSWORD_RECOVERY na primeira verificação e não houver sessão,
        // o link pode ser inválido ou já usado, ou não é um link de recuperação.
        // Se um 'code' estava na URL, mas não resultou em PASSWORD_RECOVERY, é um problema.
        if (recoveryToken) {
            setMessage({ type: 'error', text: 'Link de recuperação inválido, expirado ou já utilizado. Por favor, solicite um novo link.'});
        }
        setIsValidToken(false); // Marcar como inválido se não for um evento de recuperação
      } else if (isValidToken === null && session && event !== 'INITIAL_SESSION') {
        // Se há uma sessão mas não foi de PASSWORD_RECOVERY (e não é a sessão inicial que pode ainda não ter tipo)
        // pode ser um usuário já logado normalmente.
         setIsValidToken(false);
         setMessage({ type: 'error', text: 'Você já está logado. Para redefinir a senha de outra conta, saia primeiro.'});
      }
      // Se isValidToken já for true ou false, não fazemos nada para evitar loops
    });

    // Checagem inicial caso o onAuthStateChange demore ou não dispare imediatamente com INITIAL_SESSION
    // para o caso de code na URL.
    if (recoveryToken && isValidToken === null) {
        // Presumimos que o listener onAuthStateChange pegará o evento PASSWORD_RECOVERY.
        // Se após um curto delay ele não mudar, podemos considerar inválido.
        // Esta parte é delicada pois o tempo de processamento do Supabase pode variar.
        // Por enquanto, vamos confiar no onAuthStateChange.
    } else if (!recoveryToken && isValidToken === null) {
        setIsValidToken(false);
        setMessage({ type: 'error', text: 'Nenhum código de recuperação encontrado. Acesse esta página através do link enviado para seu e-mail.'});
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router, recoveryToken, isValidToken]); // Adicionado recoveryToken e isValidToken

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
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  if (isValidToken === null) { // Ainda verificando
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-700">Verificando link...</p>
      </div>
    );
  }

  return (
    <>
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
            position: 'absolute', // Para sobrepor o conteúdo se necessário
            top: '80px', // Ajuste conforme o header
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            minWidth: '300px'
          }}
        >
          {message.text}
        </div>
      )}

      {isValidToken && message?.type !== 'success' && (
        <form onSubmit={handleSubmit} className={styles.form} style={{ marginTop: message ? '60px' : '0'}}> {/* Ajuste de margem se houver mensagem */}
          <p className={styles.instructions} style={{marginBottom: '1.5rem', textAlign: 'center'}}>
            Crie uma nova senha para sua conta.
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
              style={{ position: 'absolute', right: '10px', top: 'calc(50% + 12px)', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer'}}
              disabled={isUpdating}
              aria-label="Mostrar/Esconder senha"
            >
              {showPassword ? '🙈' : '👁️'}
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
              style={{ position: 'absolute', right: '10px', top: 'calc(50% + 12px)', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer'}}
              disabled={isUpdating}
              aria-label="Mostrar/Esconder confirmação de senha"
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
      {/* Se !isValidToken e uma mensagem de erro já foi setada, ela será mostrada. 
          Não precisamos de um else explícito aqui para mostrar o erro, 
          pois a mensagem já é exibida condicionalmente no topo. */}
    </>
  );
}

export default function CodigoVerificacaoPage() {
  // A UI principal da página, como logo e imagem de fundo, pode ficar aqui.
  // O Suspense é necessário porque PasswordResetCore usa useSearchParams.
  return (
    <div className={styles.container}>
      <Link 
        href="/login" 
        className={styles.backButton} // Reutilizando estilo do backButton
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          // ... (outros estilos do botão voltar, se necessário)
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
            {/* O título pode mudar dependendo se o token é válido ou não, 
                mas a lógica principal de UI/formulário está no PasswordResetCore */} 
            <h1 className={styles.title}>Redefinir Sua Senha</h1> 
          </div>
          
          <div className={styles.content} style={{ display: 'flex', justifyContent: 'center'}}>
            <div className={styles.formSection} style={{maxWidth: '450px'}}>
              <Suspense fallback={
                <div style={{display: 'flex', justifyContent:'center', alignItems:'center', height: '100px'}}>
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }>
                <PasswordResetCore />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
