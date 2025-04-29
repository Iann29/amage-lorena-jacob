'use client';

import { useState } from 'react';
import Link from 'next/link';

// Os metadados agora são exportados de um arquivo separado
// pois componentes 'use client' não podem exportar metadados

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    confirmarSenha: '',
    nome: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui será implementada a integração com Supabase Auth
    console.log('Formulário enviado:', formData);
    alert(isLogin ? 'Login realizado com sucesso!' : 'Cadastro realizado com sucesso!');
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Limpar campos ao alternar entre login e cadastro
    setFormData({
      email: '',
      senha: '',
      confirmarSenha: '',
      nome: ''
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          {isLogin ? 'Entrar na sua conta' : 'Criar uma conta'}
        </h1>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="nome" className="block text-gray-700 font-medium mb-1">Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Seu nome completo"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="seu.email@exemplo.com"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="senha" className="block text-gray-700 font-medium mb-1">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="********"
            />
          </div>
          
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="confirmarSenha" className="block text-gray-700 font-medium mb-1">Confirmar Senha</label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="********"
              />
            </div>
          )}
          
          {isLogin && (
            <div className="flex justify-end mb-4">
              <Link href="/recuperar-senha" className="text-purple-700 text-sm hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-3 rounded-md font-medium hover:bg-purple-800 transition mb-4"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={toggleForm}
              className="text-purple-700 hover:underline"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
            </button>
          </div>
        </form>
        
        <div className="mt-8">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-600">ou continue com</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
              </svg>
              <span>Google</span>
            </button>
            
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
              </svg>
              <span>Facebook</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto mt-8 p-6 bg-purple-50 rounded-lg border border-purple-100">
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
  );
}
