"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function usePageTransition() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousPathRef = useRef(pathname);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpa timeout anterior
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    const previousPath = previousPathRef.current;
    const wasInStore = previousPath.startsWith('/loja');
    const isInStore = pathname.startsWith('/loja');
    
    // Detecta mudança entre contextos (loja <-> site)
    const isContextChange = wasInStore !== isInStore;
    
    if (isContextChange) {
      setIsTransitioning(true);
      
      // Tempo de transição adaptativo
      const transitionDuration = isInStore ? 600 : 500;
      
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration);
    }
    
    previousPathRef.current = pathname;
    
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [pathname]);

  return { isTransitioning, isInStore: pathname.startsWith('/loja') };
}