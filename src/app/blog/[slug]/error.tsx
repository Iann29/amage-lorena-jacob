'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registrar o erro no serviço de logs
    console.error('Blog post error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="text-center max-w-lg">
        <Image 
          src="/assets/error-icon.png" 
          alt="Erro" 
          width={120} 
          height={120}
          className="mx-auto mb-6"
          // Fallback para caso a imagem não exista
          onError={(e) => {
            e.currentTarget.src = '/assets/lorenaJacob-verde.svg';
          }}
        />
        
        <h1 className="text-3xl font-bold text-[#715B3F] mb-4">
          Ops! Ocorreu um erro
        </h1>
        
        <p className="text-gray-600 mb-8">
          Não foi possível carregar o conteúdo deste post. Isso pode ser devido a uma falha de conexão ou o post não está mais disponível.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#6FB1CE] text-white rounded-md hover:bg-[#5B9AB8] transition"
          >
            Tentar novamente
          </button>
          
          <Link
            href="/blog"
            className="px-6 py-3 bg-[#F3F3F3] text-[#715B3F] rounded-md hover:bg-[#E5E5E5] transition"
          >
            Voltar para o Blog
          </Link>
        </div>
      </div>
    </div>
  );
} 