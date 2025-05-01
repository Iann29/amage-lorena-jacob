"use client";

import Image from "next/image";
import { useState } from "react";
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
      setEmailEnviado(true);
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.container}>
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
