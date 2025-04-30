'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui será implementada a integração com Supabase Auth para recuperação de senha
    console.log('Solicitação de recuperação enviada para:', email);
    setEnviado(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          {!enviado ? 'Recuperar Senha' : 'E-mail Enviado'}
        </h1>
        
        {!enviado ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="seu.email@exemplo.com"
              />
              <p className="mt-2 text-sm text-gray-600">
                Digite o e-mail associado à sua conta para receber um link de recuperação de senha.
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-3 rounded-md font-medium hover:bg-purple-800 transition mb-4"
            >
              Enviar link de recuperação
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="mb-6 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg text-gray-700 mb-4">
              Enviamos um e-mail para <span className="font-medium">{email}</span> com instruções para redefinir sua senha.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Por favor, verifique sua caixa de entrada e siga as instruções no e-mail. Se não encontrar o e-mail, verifique sua pasta de spam.
            </p>
            <button
              onClick={() => setEnviado(false)}
              className="text-purple-700 underline font-medium"
            >
              Tentar com outro e-mail
            </button>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link href="/login" className="text-purple-700 hover:underline">
            Voltar para o login
          </Link>
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <Link href="/autenticacao" className="text-purple-700 hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para opções de autenticação
        </Link>
      </div>
    </div>
  );
}
