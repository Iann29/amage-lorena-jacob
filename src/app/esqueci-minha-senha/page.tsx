"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./styles.module.css";
import { createClient } from '@/utils/supabase/client';

export default function EsqueciMinhaSenha() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Por favor, insira seu endereço de e-mail.' });
      return;
    }
    
    setIsSending(true);
    setMessage(null);

    const redirectTo = `${window.location.origin}/recuperar-senha?source=recovery`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });

    setIsSending(false);

    if (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
      if (error.message.includes("User not found")) {
        setMessage({ type: 'error', text: 'Nenhuma conta encontrada com este e-mail.' });
      } else if (error.message.includes("Unable to send email for one-time password (OTP)")) {
         setMessage({ type: 'error', text: 'Ocorreu um problema ao tentar enviar o e-mail. Tente novamente mais tarde.' });
      } else {
        setMessage({ type: 'error', text: error.message || 'Ocorreu um erro. Tente novamente.' });
      }
    } else {
      setMessage({ type: 'success', text: `Se uma conta com o e-mail ${email} existir, um link de recuperação foi enviado. Verifique sua caixa de entrada (e spam).` });
    }
  };

  const emailEnviado = message?.type === 'success';

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
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#52A4DB";
          e.currentTarget.style.boxShadow = "0 3px 6px rgba(82, 164, 219, 0.15)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#3068AD";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.08)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Voltar
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
            <h1 className={styles.title}>Esqueceu a senha ?</h1>
            <div className={styles.subtitleContainer}>
              <p className={styles.subtitle}>
                &quot;todos nós um dia já esquecemos.&quot;
                <span className={styles.quoteAuthor}>disse a Dory</span>
              </p>
            </div>
          </div>
          
          <div className={styles.content}>
            <div className={styles.formSection}>
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

              {!emailEnviado ? (
                <>
                  <p className={styles.instructions}>
                    Vamos te ajudar com isso em duas etapas.
                    <br />
                    Preencha com o e-mail cadastrado
                  </p>

                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="email" className={styles.label}>
                        E-mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Digite seu e-mail"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSending}
                      />
                    </div>
                  </form>
                  
                  <button 
                    type="button"
                    className={styles.submitButton}
                    disabled={isSending || !email}
                    onClick={handleSubmit}
                  >
                    {isSending ? (
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{color: 'currentColor'}}>
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </div>
                      ) : (
                        'Enviar Link de Recuperação'
                      )}
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { setMessage(null); setEmail(''); }}
                  className={`${styles.submitButton} ${styles.tryAgainButton}`}
                  style={{marginTop: '1rem'}}
                >
                  Enviar para outro e-mail
                </button>
              )}
            </div>

            <div className={styles.imageContainer}>
              <Image
                src="/assets/esqueceuasenha.png"
                alt="Dory peixe azul"
                width={315}
                height={315}
                className={styles.image}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
