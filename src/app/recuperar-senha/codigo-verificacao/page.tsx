"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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

export default function CodigoVerificacaoPage() {
  const router = useRouter();
  
  // Refs para os inputs de código
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];
  
  // Estado para os valores dos campos de código
  const [codigo, setCodigo] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isVerificando, setIsVerificando] = useState(false);
  const [codigoVerificado, setCodigoVerificado] = useState(false);
  const [erro, setErro] = useState("");
  
  // Função para atualizar o email do parâmetro da URL
  const handleEmailRead = (emailFromParam: string) => {
    setEmail(emailFromParam);
  };
  
  // Função para lidar com a mudança em um campo de código
  const handleCodigoChange = (value: string, index: number) => {
    // Aceitar apenas números
    if (!/^[0-9]*$/.test(value)) return;
    
    // Atualizar o estado do código
    const novoCodigo = [...codigo];
    novoCodigo[index] = value;
    setCodigo(novoCodigo);
    
    // Se um dígito foi inserido, mover para o próximo campo
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Função para lidar com o backspace
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      // Se o campo atual estiver vazio e o usuário pressionar backspace, voltar para o campo anterior
      inputRefs[index - 1].current?.focus();
    }
  };

  // Função para verificar o código
  const verificarCodigo = async () => {
    // Verificar se todos os campos foram preenchidos
    if (codigo.some(digito => !digito)) {
      setErro("Por favor, preencha todos os dígitos do código.");
      return;
    }

    setIsVerificando(true);
    setErro("");
    
    try {
      // Aqui será implementada a lógica de verificação com o Supabase
      // Por enquanto, apenas simulamos a verificação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verificação simulada (código 1234 é aceito)
      const codigoCompleto = codigo.join("");
      if (codigoCompleto === "1234") {
        setCodigoVerificado(true);
      } else {
        setErro("Código de verificação inválido. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      setErro("Ocorreu um erro ao verificar o código. Por favor, tente novamente.");
    } finally {
      setIsVerificando(false);
    }
  };

  // Reseta a página para inserir um novo código
  const resetarCodigo = () => {
    setCodigo(["", "", "", ""]);
    setErro("");
    setCodigoVerificado(false);
    inputRefs[0].current?.focus();
  };

  // Focar no primeiro input ao carregar a página
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  return (
    <div className={styles.container}>
      {/* Componente para ler o email da URL dentro de Suspense */}
      <Suspense fallback={null}>
        <EmailParamReader onEmailRead={handleEmailRead} />
      </Suspense>
      
      {/* Botão para voltar para a página anterior */}
      <Link 
        href="/esqueci-minha-senha" 
        className={styles.backButton}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Voltar
      </Link>
      
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
          <h1 className={styles.title}>
            <span className={styles.titleBlue}>Acabamos de enviar um</span><br className={styles.desktopBreak} />
            <span className={styles.titleLightBlue}>código para o seu e-mail.</span>
          </h1>
        </div>
        
        <div className={styles.content}>
          <div className={styles.formSection}>
            {!codigoVerificado ? (
              <>
                <p className={styles.subtitle}>
                  Insira no campo abaixo o código de verificação de 4 dígitos enviado para o seu e-mail
                </p>
                
                <div className={styles.codigoContainer}>
                  {codigo.map((digito, index) => (
                    <input
                      key={index}
                      ref={inputRefs[index]}
                      type="text"
                      maxLength={1}
                      value={digito}
                      onChange={(e) => handleCodigoChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={styles.digitInput}
                      aria-label={`Dígito ${index + 1}`}
                    />
                  ))}
                </div>

                {erro && <p className={styles.errorMessage}>{erro}</p>}
                
                <button 
                  type="button" 
                  className={styles.submitButton}
                  disabled={isVerificando}
                  onClick={verificarCodigo}
                >
                  {isVerificando ? "Verificando..." : "Enviar"}
                </button>
                
                <div className={styles.helpLinks}>
                  <button 
                    type="button" 
                    className={styles.textButton}
                    onClick={resetarCodigo}
                  >
                    Reenviar código
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.successMessage}>
                <div className={styles.checkIcon}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="22" stroke="#4CAF50" strokeWidth="4"/>
                    <path d="M16 24L22 30L32 18" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className={styles.successTitle}>Código verificado com sucesso!</h2>
                <p className={styles.successText}>
                  Agora você pode criar uma nova senha para sua conta.
                </p>
                
                <Link href={`/recuperar-senha?email=${encodeURIComponent(email)}`} className={styles.continueButton}>
                  Continuar para Redefinição de Senha
                </Link>
              </div>
            )}
          </div>

          <div className={styles.imageContainer}>
            <Image
              src="/assets/recuperarsenha.png"
              alt="Ilustração de verificação de segurança"
              width={315}
              height={315}
              className={styles.image}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
