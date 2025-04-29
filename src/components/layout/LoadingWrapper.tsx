"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Loader from "@/components/ui/Loader";

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para simular uma verificação se o site já foi carregado antes
  useEffect(() => {
    // Usa um bloco try/catch para evitar erros em ambiente SSR
    try {
      // Verifica se o site já foi carregado antes
      const hasLoaded = window.sessionStorage.getItem("hasLoaded");
      
      if (hasLoaded) {
        // Se já carregou antes nesta sessão, não mostra o loader
        setIsLoading(false);
      } else {
        // Marca que o site já foi carregado
        window.sessionStorage.setItem("hasLoaded", "true");
        
        // Define um timer para remover o loader após 2 segundos
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Em caso de erro (como em SSR), apenas desativa o loader após 2 segundos
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <Loader finishLoading={() => setIsLoading(false)} />}
      </AnimatePresence>
      <div style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.5s ease" }}>
        {children}
      </div>
    </>
  );
}
