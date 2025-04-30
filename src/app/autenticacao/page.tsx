'use client';

import Link from 'next/link';

export default function AutenticacaoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">Área do Cliente</h1>
        
        <div className="space-y-4 mb-8">
          <Link href="/login" className="block w-full">
            <button 
              className="w-full bg-purple-700 text-white py-3 rounded-md font-medium hover:bg-purple-800 transition flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.358-.035-.709-.104-1.05A5.001 5.001 0 0010 11z" clipRule="evenodd" />
              </svg>
              Já tenho uma conta
            </button>
          </Link>
          
          <Link href="/cadastro" className="block w-full">
            <button 
              className="w-full bg-white text-purple-700 py-3 rounded-md font-medium border-2 border-purple-700 hover:bg-purple-50 transition flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Criar uma nova conta
            </button>
          </Link>
        </div>
        
        <div className="max-w-md mx-auto p-6 bg-purple-50 rounded-lg border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-800 mb-2">Por que criar uma conta?</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Acesse facilmente seus cursos e produtos digitais</span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Acompanhe o histórico dos seus pedidos</span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Receba conteúdos exclusivos e promoções especiais</span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Checkout mais rápido nas próximas compras</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
