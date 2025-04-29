'use client';

import { useState } from 'react';
import Link from 'next/link';

// Os metadados agora são exportados de um arquivo separado
// pois componentes 'use client' não podem exportar metadados

export default function MinhaContaPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dados mockados do usuário
  // Isso seria obtido do Supabase Auth e Database
  const usuario = {
    nome: 'Maria Silva',
    email: 'maria.silva@exemplo.com',
    telefone: '(11) 98765-4321',
    dataCadastro: '15/01/2025'
  };

  // Dados mockados de pedidos
  const pedidos = [
    {
      id: '123456',
      data: '20/04/2025',
      status: 'Concluído',
      total: 149.90,
      itens: [
        { nome: 'Curso: TDAH na Rotina Familiar', quantidade: 1, preco: 149.90 }
      ]
    },
    {
      id: '123455',
      data: '10/03/2025',
      status: 'Concluído',
      total: 97.80,
      itens: [
        { nome: 'E-book: Guia Prático - Sinais de Autismo', quantidade: 1, preco: 39.90 },
        { nome: 'Kit de Atividades Sensoriais', quantidade: 1, preco: 57.90 }
      ]
    }
  ];

  // Dados mockados de cursos
  const cursos = [
    {
      id: 1,
      nome: 'TDAH na Rotina Familiar',
      progresso: 45,
      dataAcesso: '25/04/2025',
      imagem: '/placeholder-curso-1.jpg'
    }
  ];

  // Dados mockados de downloads
  const downloads = [
    {
      id: 1,
      nome: 'E-book: Guia Prático - Sinais de Autismo',
      tipo: 'PDF',
      tamanho: '3.5 MB',
      dataCompra: '10/03/2025'
    },
    {
      id: 2,
      nome: 'Kit de Atividades Sensoriais',
      tipo: 'ZIP',
      tamanho: '15.8 MB',
      dataCompra: '10/03/2025'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-purple-800 mb-8">Minha Conta</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Menu lateral */}
        <div className="md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                {usuario.nome.slice(0, 1)}
              </div>
              <div>
                <h3 className="font-semibold">{usuario.nome}</h3>
                <p className="text-sm text-gray-500">{usuario.email}</p>
              </div>
            </div>
            
            <nav>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-purple-100 text-purple-800 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('pedidos')}
                    className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'pedidos' ? 'bg-purple-100 text-purple-800 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Meus Pedidos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('cursos')}
                    className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'cursos' ? 'bg-purple-100 text-purple-800 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Meus Cursos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('downloads')}
                    className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'downloads' ? 'bg-purple-100 text-purple-800 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Downloads
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('dados')}
                    className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'dados' ? 'bg-purple-100 text-purple-800 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Meus Dados
                  </button>
                </li>
              </ul>
            </nav>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button className="text-red-600 hover:text-red-800 font-medium">
                Sair da Conta
              </button>
            </div>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">Precisa de ajuda?</h3>
            <p className="text-gray-700 text-sm mb-4">
              Se você tiver dúvidas sobre seu pedido ou conta, entre em contato conosco.
            </p>
            <Link href="/contato" className="text-purple-700 hover:text-purple-900 font-medium text-sm">
              Ir para o Contato →
            </Link>
          </div>
        </div>
        
        {/* Conteúdo principal */}
        <div className="md:w-3/4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-semibold text-purple-800 mb-6">Dashboard</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <h3 className="font-semibold text-purple-800 mb-2">Pedidos</h3>
                    <p className="text-3xl font-bold">{pedidos.length}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <h3 className="font-semibold text-purple-800 mb-2">Cursos</h3>
                    <p className="text-3xl font-bold">{cursos.length}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <h3 className="font-semibold text-purple-800 mb-2">Downloads</h3>
                    <p className="text-3xl font-bold">{downloads.length}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-purple-800 mb-4">Últimos Pedidos</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Pedido
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.map((pedido) => (
                        <tr key={pedido.id}>
                          <td className="py-3 px-4 border-b border-gray-200">
                            <span className="font-medium">#{pedido.id}</span>
                          </td>
                          <td className="py-3 px-4 border-b border-gray-200">
                            {pedido.data}
                          </td>
                          <td className="py-3 px-4 border-b border-gray-200">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              {pedido.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 border-b border-gray-200">
                            R$ {pedido.total.toFixed(2).replace('.', ',')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">Meus Cursos</h3>
                  
                  {cursos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cursos.map((curso) => (
                        <div key={curso.id} className="border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                          <div className="w-16 h-16 bg-purple-200 rounded flex-shrink-0 flex items-center justify-center">
                            <span className="text-purple-700 text-xs">Imagem</span>
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium">{curso.nome}</h4>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2 mb-1">
                              <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${curso.progresso}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{curso.progresso}% concluído</span>
                              <span>Último acesso: {curso.dataAcesso}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-8">
                      <p>Você ainda não possui cursos.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Pedidos */}
            {activeTab === 'pedidos' && (
              <div>
                <h2 className="text-2xl font-semibold text-purple-800 mb-6">Meus Pedidos</h2>
                
                {pedidos.length > 0 ? (
                  <div className="space-y-6">
                    {pedidos.map((pedido) => (
                      <div key={pedido.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">Pedido #{pedido.id}</span>
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                {pedido.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">Realizado em {pedido.data}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Total</p>
                            <p className="text-lg font-bold text-purple-800">
                              R$ {pedido.total.toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-medium mb-2">Itens do Pedido</h3>
                          <div className="space-y-2">
                            {pedido.itens.map((item, index) => (
                              <div key={index} className="flex justify-between">
                                <div>
                                  <p>{item.nome}</p>
                                  <p className="text-sm text-gray-500">Quantidade: {item.quantidade}</p>
                                </div>
                                <p className="font-medium">
                                  R$ {item.preco.toFixed(2).replace('.', ',')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <p>Você ainda não realizou nenhum pedido.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Cursos */}
            {activeTab === 'cursos' && (
              <div>
                <h2 className="text-2xl font-semibold text-purple-800 mb-6">Meus Cursos</h2>
                
                {cursos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cursos.map((curso) => (
                      <div key={curso.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="h-48 bg-purple-200 relative">
                          <div className="absolute inset-0 flex items-center justify-center text-purple-700 font-medium">
                            Imagem do Curso
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-xl font-semibold mb-2">{curso.nome}</h3>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-gray-600">{curso.progresso}% concluído</span>
                            <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-600" 
                                style={{ width: `${curso.progresso}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-500 mb-4">
                            Último acesso: {curso.dataAcesso}
                          </p>
                          
                          <button className="w-full bg-purple-700 text-white py-2 rounded-md font-medium hover:bg-purple-800 transition">
                            Continuar Curso
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <p>Você ainda não possui cursos.</p>
                    <Link href="/loja" className="text-purple-700 hover:underline mt-2 inline-block">
                      Explorar cursos disponíveis
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Downloads */}
            {activeTab === 'downloads' && (
              <div>
                <h2 className="text-2xl font-semibold text-purple-800 mb-6">Meus Downloads</h2>
                
                {downloads.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Produto
                          </th>
                          <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Tamanho
                          </th>
                          <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Data de Compra
                          </th>
                          <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {downloads.map((download) => (
                          <tr key={download.id}>
                            <td className="py-3 px-4 border-b border-gray-200">
                              <span className="font-medium">{download.nome}</span>
                            </td>
                            <td className="py-3 px-4 border-b border-gray-200">
                              {download.tipo}
                            </td>
                            <td className="py-3 px-4 border-b border-gray-200">
                              {download.tamanho}
                            </td>
                            <td className="py-3 px-4 border-b border-gray-200">
                              {download.dataCompra}
                            </td>
                            <td className="py-3 px-4 border-b border-gray-200">
                              <button className="bg-purple-700 text-white px-3 py-1 rounded text-sm hover:bg-purple-800 transition">
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <p>Você ainda não possui downloads disponíveis.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Meus Dados */}
            {activeTab === 'dados' && (
              <div>
                <h2 className="text-2xl font-semibold text-purple-800 mb-6">Meus Dados</h2>
                
                <form className="max-w-2xl">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Dados Pessoais</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nome" className="block text-gray-700 font-medium mb-1">Nome Completo</label>
                        <input
                          type="text"
                          id="nome"
                          name="nome"
                          defaultValue={usuario.nome}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">E-mail</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          defaultValue={usuario.email}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          O e-mail não pode ser alterado.
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="telefone" className="block text-gray-700 font-medium mb-1">Telefone</label>
                        <input
                          type="tel"
                          id="telefone"
                          name="telefone"
                          defaultValue={usuario.telefone}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Alterar Senha</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="senhaAtual" className="block text-gray-700 font-medium mb-1">Senha Atual</label>
                        <input
                          type="password"
                          id="senhaAtual"
                          name="senhaAtual"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="novaSenha" className="block text-gray-700 font-medium mb-1">Nova Senha</label>
                        <input
                          type="password"
                          id="novaSenha"
                          name="novaSenha"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmarSenha" className="block text-gray-700 font-medium mb-1">Confirmar Nova Senha</label>
                        <input
                          type="password"
                          id="confirmarSenha"
                          name="confirmarSenha"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-purple-700 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-800 transition"
                    >
                      Salvar Alterações
                    </button>
                    
                    <button
                      type="button"
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-50 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
