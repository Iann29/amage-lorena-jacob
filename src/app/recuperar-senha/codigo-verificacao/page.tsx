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
    let isMounted = true;
    // Flag para controlar se a checagem inicial baseada no recoveryToken já foi feita.
    // Isso ajuda a evitar que a lógica de "token inválido" seja executada prematuramente
    // se o evento PASSWORD_RECOVERY demorar um pouco para ser emitido pelo SDK.
    let initialCheckDone = false;

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log("Auth Event:", event, "Session:", session, "Current isValidToken:", isValidToken);

      if (event === 'PASSWORD_RECOVERY') {
        console.log("PASSWORD_RECOVERY event detected.");
        setIsValidToken(true);
        initialCheckDone = true; 
        // Limpar o ?code da URL após o processamento bem-sucedido
        // Isso previne que o mesmo link seja reprocessado se a página for recarregada com o code ainda na URL.
        // Também melhora a aparência da URL.
        const currentPath = window.location.pathname;
        router.replace(currentPath, { scroll: false }); 
        return;
      }

      // Se já determinamos o estado do token (válido ou inválido) e não é um logout, não fazemos mais nada.
      if (isValidToken !== null && event !== 'SIGNED_OUT') {
        return;
      }

      if (event === 'SIGNED_OUT') {
        console.log("SIGNED_OUT event detected.");
        setIsValidToken(false); 
        // Poderia adicionar uma mensagem se relevante, mas geralmente o usuário já saiu.
        // setMessage({ type: 'error', text: 'Sessão encerrada.' });
        initialCheckDone = true;
        return;
      }
      
      // Lógica para ser executada apenas uma vez na carga inicial ou se o estado do token ainda é null
      if (isValidToken === null && !initialCheckDone) {
        if (recoveryToken) {
          // Se temos um recoveryToken (code) na URL, mas o evento PASSWORD_RECOVERY ainda não ocorreu.
          // Damos um pequeno tempo para o evento ocorrer. Se não ocorrer, consideramos inválido.
          // Esta é uma heurística, o ideal é confiar no PASSWORD_RECOVERY.
          // Se o PASSWORD_RECOVERY não vier logo após o INITIAL_SESSION (ou uma rápida sucessão de eventos),
          // pode ser que o token seja inválido ou já usado.
          console.log("Initial check: recoveryToken present, waiting for PASSWORD_RECOVERY event or timeout.");
          // Não setamos isValidToken aqui imediatamente, esperamos o evento ou um timeout implícito.
          // Se após os eventos iniciais do onAuthStateChange, isValidToken ainda for null e recoveryToken existia,
          // então o evento PASSWORD_RECOVERY não ocorreu.
        } else {
          // Não há recoveryToken na URL.
          console.log("Initial check: No recoveryToken in URL.");
          setMessage({ type: 'error', text: 'Nenhum código de recuperação encontrado. Acesse esta página através do link enviado para seu e-mail.'});
          setIsValidToken(false);
          initialCheckDone = true;
        }
      }
    });

    // Se após a inscrição e os eventos iniciais, e temos um recovery token mas isValidToken não foi setado para true pelo evento,
    // então consideramos o token inválido. Isso é um fallback.
    // Idealmente, o evento PASSWORD_RECOVERY cuidaria disso.
    // Esta verificação é feita fora do listener para capturar o estado após os eventos iniciais.
    // Usamos um timeout para dar chance ao evento PASSWORD_RECOVERY de ser processado.
    const fallbackTimer = setTimeout(() => {
        if (isMounted && isValidToken === null && recoveryToken) {
            console.log("Fallback: No PASSWORD_RECOVERY event, marking token as invalid.");
            setMessage({ type: 'error', text: 'Link de recuperação inválido ou expirado (fallback). Por favor, solicite um novo link.'});
            setIsValidToken(false);
        }
        // Se não havia recoveryToken, já foi tratado no listener ou na checagem síncrona abaixo.
        else if (isMounted && isValidToken === null && !recoveryToken){
             console.log("Fallback: No recoveryToken, already handled or should be.");
             // A mensagem de "Nenhum código..." já deve ter sido setada.
             // Apenas garantimos que isValidToken não fique como null.
             if(!message) setMessage({ type: 'error', text: 'Link de recuperação inválido (sem token).' });
             setIsValidToken(false); 
        }
    }, 1500); // Ajuste o tempo se necessário, 1.5s pode ser suficiente.

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router, recoveryToken]); // Removido isValidToken para controlar a lógica de "primeira vez"

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
