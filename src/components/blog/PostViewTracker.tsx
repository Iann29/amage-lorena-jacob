'use client';

import { useEffect, useState } from 'react';

// Componente para rastrear visualizações de posts de forma assíncrona
export default function PostViewTracker({ postId, slug }: { postId: string; slug: string }) {
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    // Verificar se já registramos esta visualização recentemente
    const viewKey = `post-view-${slug}`;
    const hasRecentView = localStorage.getItem(viewKey);
    
    // Se não registrou recentemente, incrementar visualização
    if (!hasRecentView && !tracked) {
      // Função para incrementar visualização de forma assíncrona
      const trackView = async () => {
        try {
          // Registrar que visualizou este post (para não duplicar contagens)
          localStorage.setItem(viewKey, Date.now().toString());
          setTracked(true);
          
          // Enviar incremento de visualização para a API
          const response = await fetch(`/api/blog/increment-view`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId, slug }),
          });
          
          if (!response.ok) {
            console.warn('Falha ao registrar visualização:', await response.text());
          }
        } catch (error) {
          console.warn('Erro ao rastrear visualização:', error);
        }
      };
      
      // Iniciar rastreamento após o carregamento da página
      trackView();
      
      // Limpar visualizações antigas (mais de 8 horas)
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('post-view-')) {
            const timestamp = Number(localStorage.getItem(key));
            const eightHoursAgo = Date.now() - 8 * 60 * 60 * 1000;
            if (timestamp < eightHoursAgo) {
              localStorage.removeItem(key);
            }
          }
        });
      } catch (e) {
        // Ignorar erros de limpeza
      }
    }
  }, [postId, slug, tracked]);

  // Este componente não renderiza nada visível
  return null;
} 