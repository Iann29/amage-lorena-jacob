"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useRoutePreload() {
  const pathname = usePathname();

  useEffect(() => {
    // Preload recursos da loja quando estiver no site principal
    if (!pathname.startsWith('/loja')) {
      // Preload da logo e assets comuns da loja
      const imagesToPreload = [
        '/assets/loja/carrinhoHeader.png',
        '/assets/loja/frete-gratis.png',
        '/assets/loja/pagamento-a-vista.png',
        '/assets/loja/parcelamento.png',
        '/assets/loja/seguranca.png'
      ];

      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });

      // Prefetch da rota da loja
      if ('prefetch' in document.createElement('link')) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = '/loja';
        document.head.appendChild(link);
      }
    }
  }, [pathname]);
}