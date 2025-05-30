"use client";

import { useEffect } from "react";

export function useImageErrorDebug() {
  useEffect(() => {
    // Intercepta erros de imagem
    const handleError = (event: Event) => {
      const target = event.target as HTMLImageElement;
      if (target.tagName === 'IMG' && target.src.includes('loja/')) {
        console.error('[Image 404 Debug]', {
          src: target.src,
          currentSrc: target.currentSrc,
          baseURI: target.baseURI,
          outerHTML: target.outerHTML.substring(0, 200)
        });
      }
    };

    // Monitora requisições de rede para imagens
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource' && 
              entry.name.includes('loja/') && 
              !entry.name.includes('/assets/')) {
            console.warn('[Network 404 Debug]', {
              url: entry.name,
              type: (entry as any).initiatorType,
              duration: entry.duration,
              responseStatus: (entry as any).responseStatus
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['resource'] });
      
      return () => {
        observer.disconnect();
      };
    }

    document.addEventListener('error', handleError, true);
    
    return () => {
      document.removeEventListener('error', handleError, true);
    };
  }, []);
}