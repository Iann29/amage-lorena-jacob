"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";

export default function EsqueciMinhaSenha() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSending(true);
    
    try {
      // Aqui será implementada a lógica de backend para enviar o e-mail de recuperação
      // Por enquanto, apenas simulamos o envio
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Depois que o email for enviado, redirecionar para a página de código de verificação
      // Na implementação real, você pode querer passar o email como query param ou usar Context API
      window.location.href = `/recuperar-senha/codigo-verificacao?email=${encodeURIComponent(email)}`;
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Botão para voltar para a página de login */}
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
                "todos nós um dia já esquecemos."
                <span className={styles.quoteAuthor}>disse a Dory</span>
              </p>
            </div>
          </div>
          
          <div className={styles.content}>
            <div className={styles.formSection}>
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
                      />
                    </div>
                  </form>
                  
                  <button 
                    type="button" 
                    className={styles.submitButton}
                    disabled={isSending}
                    onClick={handleSubmit}
                  >
                    {isSending ? "Enviando..." : "Enviar"}
                  </button>
                </>
              ) : (
                <div className={styles.successMessage}>
                  <p>Um e-mail com instruções de recuperação foi enviado para <strong>{email}</strong>.</p>
                  <p>Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
                  <button 
                    onClick={() => setEmailEnviado(false)} 
                    className={styles.backButton}
                  >
                    Voltar
                  </button>
                </div>
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
