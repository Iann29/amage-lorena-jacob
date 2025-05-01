"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./styles.module.css";

// Componente separado para lidar com parâmetros da URL
function EmailParamReader({ onEmailRead }: { onEmailRead: (email: string) => void }) {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  
  useEffect(() => {
    onEmailRead(emailParam);
  }, [emailParam, onEmailRead]);
  
  return null;
}

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [senhaRedefinida, setSenhaRedefinida] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erro, setErro] = useState("");
  
  // Função para atualizar o email do parâmetro da URL
  const handleEmailRead = (emailFromParam: string) => {
    setEmail(emailFromParam);
  };

  // Verificar se temos o email necessário para prosseguir
  useEffect(() => {
    if (!email) {
      setErro("Email não fornecido. Por favor, inicie o processo de recuperação de senha novamente.");
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!senha) {
      setErro("Por favor, digite uma senha.");
      return;
    }
    
    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    
    setErro("");
    setIsSaving(true);
    
    try {
      // Aqui será implementada a lógica de backend para redefinir a senha
      // Por enquanto, apenas simulamos o processo
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSenhaRedefinida(true);
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      setErro("Ocorreu um erro ao redefinir sua senha. Por favor, tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Componente para ler o email da URL dentro de Suspense */}
      <Suspense fallback={null}>
        <EmailParamReader onEmailRead={handleEmailRead} />
      </Suspense>
      
      <Link 
        href="/login" 
        className={styles.backButton}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Voltar para o login
      </Link>

      <div className={styles.logoContainer}>
        <Image 
          src="/logos/logo1.webp" 
          alt="Logo Lorena Jacob" 
          width={320} 
          height={90}
          className={styles.logo}
          priority
        />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.textCenter}>
          <h1 className={styles.title}>Redefinir Senha</h1>
        </div>
        
        <div className={styles.content}>
          {erro && (
            <div className={styles.errorAlert}>
              <p>{erro}</p>
            </div>
          )}
          
          {!senhaRedefinida ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="senha" className={styles.label}>Nova Senha</label>
                <input
                  type="password"
                  id="senha"
                  placeholder="Digite sua nova senha"
                  className={styles.input}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="confirmarSenha" className={styles.label}>Confirmar Senha</label>
                <input
                  type="password"
                  id="confirmarSenha"
                  placeholder="Confirme sua nova senha"
                  className={styles.input}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Redefinir"}
              </button>
            </form>
          ) : (
            <div className={styles.successMessage}>
              <div className={styles.checkIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="22" stroke="#4CAF50" strokeWidth="4"/>
                  <path d="M16 24L22 30L32 18" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className={styles.successText}>
                Sua senha foi redefinida com sucesso! Agora você pode entrar na sua conta utilizando a nova senha.
              </p>
              
              <Link href="/login" className={styles.continueButton}>
                Ir para o Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
