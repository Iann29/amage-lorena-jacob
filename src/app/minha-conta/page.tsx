'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

// Os metadados agora são exportados de um arquivo separado
// pois componentes 'use client' não podem exportar metadados

export default function MinhaContaPage() {
  const supabase = createClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estados para autenticação e dados do usuário
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<{
    nome: string;
    sobrenome: string;
    email: string;
    telefone?: string;
    dataCadastro: string;
  } | null>(null);
  
  // Estados para dados dinâmicos
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  
  // Estados para formulário de dados
  const [formValues, setFormValues] = useState({
    nome: '',
    sobrenome: '',
    telefone: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [formMessage, setFormMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Função para logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Carregar dados do usuário e perfil
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      
      // Verificar se o usuário está autenticado
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error("MinhaContaPage: Erro ao buscar sessão ou usuário não logado", sessionError);
        router.push('/autenticacao');
        return;
      }
      
      const user = session.user;
      setCurrentUser(user);
      
      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profileError) {
        console.error("MinhaContaPage: Erro ao buscar perfil do usuário", profileError);
      } else if (profile) {
        // Formatar a data de cadastro
        const dataCadastro = user.created_at 
          ? new Date(user.created_at).toLocaleDateString('pt-BR') 
          : new Date().toLocaleDateString('pt-BR');
        
        setUserProfile({
          nome: profile.nome || '',
          sobrenome: profile.sobrenome || '',
          email: user.email || '',
          telefone: profile.telefone || '',
          dataCadastro
        });
        
        // Preencher os valores do formulário
        setFormValues({
          ...formValues,
          nome: profile.nome || '',
          sobrenome: profile.sobrenome || '',
          telefone: profile.telefone || '',
        });
      }
      
      // Buscar pedidos do usuário
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (ordersError) {
        console.error("MinhaContaPage: Erro ao buscar pedidos", ordersError);
      } else {
        // Formatar os dados dos pedidos
        const formattedOrders = ordersData.map(order => ({
          id: order.id,
          data: new Date(order.created_at).toLocaleDateString('pt-BR'),
          status: order.status,
          total: order.total_amount,
          itens: order.order_items.map((item: any) => ({
            nome: item.product_name,
            quantidade: item.quantity,
            preco: item.price
          }))
        }));
        
        setPedidos(formattedOrders);
      }
      
      // Buscar cursos do usuário
      const { data: coursesData, error: coursesError } = await supabase
        .from('user_courses')
        .select('*, courses(*)')
        .eq('user_id', user.id);
      
      if (coursesError) {
        console.error("MinhaContaPage: Erro ao buscar cursos", coursesError);
      } else {
        // Formatar os dados dos cursos
        const formattedCourses = coursesData.map((userCourse: any) => ({
          id: userCourse.course_id,
          nome: userCourse.courses?.name || 'Curso sem nome',
          progresso: userCourse.progress || 0,
          dataAcesso: userCourse.last_accessed 
            ? new Date(userCourse.last_accessed).toLocaleDateString('pt-BR')
            : 'Nunca acessado',
          imagem: userCourse.courses?.cover_image || '/placeholder-curso-1.jpg'
        }));
        
        setCursos(formattedCourses);
      }
      
      // Buscar downloads do usuário
      const { data: downloadsData, error: downloadsError } = await supabase
        .from('user_downloads')
        .select('*, products(*)')
        .eq('user_id', user.id);
      
      if (downloadsError) {
        console.error("MinhaContaPage: Erro ao buscar downloads", downloadsError);
      } else {
        // Formatar os dados dos downloads
        const formattedDownloads = downloadsData.map((download: any) => ({
          id: download.id,
          nome: download.products?.name || 'Produto sem nome',
          tipo: download.file_type || 'PDF',
          tamanho: download.file_size || '0 MB',
          dataCompra: download.created_at 
            ? new Date(download.created_at).toLocaleDateString('pt-BR')
            : new Date().toLocaleDateString('pt-BR')
        }));
        
        setDownloads(formattedDownloads);
      }
      
      setIsLoading(false);
    };
    
    fetchUserData();
    
    // Listener para mudanças no estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/autenticacao');
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);
  
  // Função para atualizar dados do perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormMessage(null);
    
    if (!currentUser) {
      setFormMessage({ type: 'error', text: 'Usuário não está logado.' });
      setIsSaving(false);
      return;
    }
    
    // Validar campos
    if (!formValues.nome.trim()) {
      setFormMessage({ type: 'error', text: 'Nome é obrigatório.' });
      setIsSaving(false);
      return;
    }
    
    // Se tiver senha atual, validar nova senha
    if (formValues.senhaAtual) {
      if (!formValues.novaSenha) {
        setFormMessage({ type: 'error', text: 'Nova senha é obrigatória.' });
        setIsSaving(false);
        return;
      }
      
      if (formValues.novaSenha.length < 6) {
        setFormMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' });
        setIsSaving(false);
        return;
      }
      
      if (formValues.novaSenha !== formValues.confirmarSenha) {
        setFormMessage({ type: 'error', text: 'As senhas não coincidem.' });
        setIsSaving(false);
        return;
      }
    }
    
    try {
      // Atualizar perfil do usuário
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          nome: formValues.nome,
          sobrenome: formValues.sobrenome,
          telefone: formValues.telefone
        })
        .eq('user_id', currentUser.id);
      
      if (profileError) {
        throw new Error(`Erro ao atualizar perfil: ${profileError.message}`);
      }
      
      // Se tiver senha atual, atualizar senha
      if (formValues.senhaAtual) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formValues.novaSenha
        });
        
        if (passwordError) {
          throw new Error(`Erro ao atualizar senha: ${passwordError.message}`);
        }
        
        // Limpar campos de senha
        setFormValues({
          ...formValues,
          senhaAtual: '',
          novaSenha: '',
          confirmarSenha: ''
        });
      }
      
      setFormMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
      
      // Atualizar dados do perfil no estado
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          nome: formValues.nome,
          sobrenome: formValues.sobrenome,
          telefone: formValues.telefone
        });
      }
    } catch (error: any) {
      console.error("Erro ao salvar dados:", error);
      setFormMessage({ type: 'error', text: error.message || 'Ocorreu um erro ao salvar os dados.' });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handler para atualizar os valores do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Componente de carregamento
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Carregando informações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-purple-800 mb-8">Minha Conta</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Menu lateral */}
        <div className="md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                {userProfile?.nome.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-semibold">{userProfile?.nome} {userProfile?.sobrenome}</h3>
                <p className="text-sm text-gray-500">{userProfile?.email}</p>
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
              <button 
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-medium"
              >
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
                      {pedidos.length > 0 ? pedidos.slice(0, 3).map((pedido) => (
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
                      )) : (
                        <tr>
                          <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                            Você ainda não realizou nenhum pedido.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">Meus Cursos</h3>
                  
                  {cursos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cursos.slice(0, 2).map((curso) => (
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
                
                {formMessage && (
                  <div className={`mb-6 p-4 rounded-md ${
                    formMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {formMessage.text}
                  </div>
                )}
                
                <form className="max-w-2xl" onSubmit={handleUpdateProfile}>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Dados Pessoais</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nome" className="block text-gray-700 font-medium mb-1">Nome</label>
                        <input
                          type="text"
                          id="nome"
                          name="nome"
                          value={formValues.nome}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="sobrenome" className="block text-gray-700 font-medium mb-1">Sobrenome</label>
                        <input
                          type="text"
                          id="sobrenome"
                          name="sobrenome"
                          value={formValues.sobrenome}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">E-mail</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={userProfile?.email || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
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
                          value={formValues.telefone}
                          onChange={handleInputChange}
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
                          value={formValues.senhaAtual}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="novaSenha" className="block text-gray-700 font-medium mb-1">Nova Senha</label>
                        <input
                          type="password"
                          id="novaSenha"
                          name="novaSenha"
                          value={formValues.novaSenha}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmarSenha" className="block text-gray-700 font-medium mb-1">Confirmar Nova Senha</label>
                        <input
                          type="password"
                          id="confirmarSenha"
                          name="confirmarSenha"
                          value={formValues.confirmarSenha}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-purple-700 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-800 transition flex items-center justify-center min-w-[150px]"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Salvando...
                        </>
                      ) : 'Salvar Alterações'}
                    </button>
                    
                    <button
                      type="button"
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-50 transition"
                      onClick={() => {
                        // Resetar formulário para valores originais
                        setFormValues({
                          nome: userProfile?.nome || '',
                          sobrenome: userProfile?.sobrenome || '',
                          telefone: userProfile?.telefone || '',
                          senhaAtual: '',
                          novaSenha: '',
                          confirmarSenha: ''
                        });
                        setFormMessage(null);
                      }}
                      disabled={isSaving}
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
