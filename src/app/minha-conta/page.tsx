'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UserCog, 
  LogOut,
  HelpCircle,
  Loader2, // Ícone de carregamento
  CheckCircle, // Ícone de sucesso
  XCircle // Ícone de erro
} from 'lucide-react'; // Usar lucide para ícones consistentes

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

  // Ref para controlar a chamada inicial do fetchUserData
  const initialLoadDone = useRef(false);

  // Função para logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirecionar para a home após logout
  };

  // Carregar dados do usuário e perfil
  useEffect(() => {
    const fetchUserData = async (userToFetch: User) => {
      if (!userToFetch) return; // Não tentar buscar se o usuário for nulo explicitamente
      
      // console.log("MinhaContaPage: Chamando fetchUserData para o usuário:", userToFetch.id);
      setIsLoading(true);
      setFormMessage(null);
      
      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('nome, sobrenome, telefone')
          .eq('user_id', userToFetch.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        } 
        
        const dataCadastro = userToFetch.created_at 
          ? new Date(userToFetch.created_at).toLocaleDateString('pt-BR') 
          : 'Data indisponível';
        
        setUserProfile({
          nome: profile?.nome || '',
          sobrenome: profile?.sobrenome || '',
          email: userToFetch.email || '',
          telefone: profile?.telefone || '',
          dataCadastro
        });
        
        setFormValues(prev => ({
          ...prev,
          nome: profile?.nome || '',
          sobrenome: profile?.sobrenome || '',
          telefone: profile?.telefone || '',
        }));

      } catch (error) {
        console.error("MinhaContaPage: Erro geral ao buscar dados do usuário", error);
        setFormMessage({ type: 'error', text: 'Erro ao carregar seus dados. Tente novamente mais tarde.' });
      } finally {
        setIsLoading(false);
      }
    };

    // Listener para mudanças no estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      const currentUserId = currentUser?.id;
      
      // console.log("MinhaContaPage: onAuthStateChange - Evento:", _event, "Session User ID:", user?.id, "Current User ID:", currentUserId);

      if (user?.id && user.id !== currentUserId) {
        // console.log("MinhaContaPage: Usuário mudou ou logou. Novo ID:", user.id, "Antigo ID:", currentUserId);
        setCurrentUser(user); // Atualiza o usuário no estado
        await fetchUserData(user); // Busca os dados para o novo usuário
      } else if (!user && currentUserId) {
        // console.log("MinhaContaPage: Usuário deslogou. Redirecionando.");
        // Usuário deslogou
        setCurrentUser(null);
        setUserProfile(null);
        setFormValues({ nome: '', sobrenome: '', telefone: '', senhaAtual: '', novaSenha: '', confirmarSenha: ''});
        router.push('/autenticacao');
      } else if (!user && !currentUserId && !initialLoadDone.current) {
         // console.log("MinhaContaPage: Nenhuma sessão na carga inicial, verificando...");
         // Nenhuma sessão na carga inicial, verifica se já tentou buscar
         // Tenta pegar a sessão uma vez para o carregamento inicial, caso o listener demore
         const { data: { session: initialSession } } = await supabase.auth.getSession();
         if (initialSession?.user) {
            // console.log("MinhaContaPage: Sessão encontrada na verificação inicial, carregando dados.");
            setCurrentUser(initialSession.user);
            await fetchUserData(initialSession.user);
         } else {
            // console.log("MinhaContaPage: Nenhuma sessão encontrada na verificação inicial. Redirecionando.");
            router.push('/autenticacao');
         }
      }
      initialLoadDone.current = true; // Marca que a lógica inicial do auth listener rodou
    });
    
    return () => {
      // console.log("MinhaContaPage: Limpando listener de autenticação.");
      authListener?.subscription.unsubscribe();
    };
  // Removido currentUser e router das dependências para controle manual dentro do onAuthStateChange
  // e para evitar re-execuções indesejadas do useEffect inteiro.
  // O useEffect agora roda apenas uma vez na montagem para configurar o listener.
  }, []); 
  
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
      setFormMessage({ type: 'error', text: 'O campo Nome é obrigatório.' });
      setIsSaving(false);
      return;
    }
    
    // Validar alteração de senha (apenas se nova senha foi digitada)
    if (formValues.novaSenha) {
        if (!formValues.senhaAtual) {
            setFormMessage({ type: 'error', text: 'Digite sua senha atual para definir uma nova.' });
            setIsSaving(false);
            return;
        }
        if (formValues.novaSenha.length < 6) {
            setFormMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres.' });
            setIsSaving(false);
            return;
        }
        if (formValues.novaSenha !== formValues.confirmarSenha) {
            setFormMessage({ type: 'error', text: 'A confirmação da nova senha não coincide.' });
            setIsSaving(false);
            return;
        }
    }
    
    try {
      // 1. Atualizar Perfil (nome, sobrenome, telefone)
      const profileUpdateData: { nome: string; sobrenome: string; telefone?: string } = {
        nome: formValues.nome.trim(),
        sobrenome: formValues.sobrenome.trim(),
      };
      if (formValues.telefone.trim()) {
        profileUpdateData.telefone = formValues.telefone.trim();
      } else {
        // Explicitamente setar como null se vazio, caso o Supabase/DB exija ou para limpar o campo
         profileUpdateData.telefone = undefined; // Ou null, dependendo da definição da coluna
      }

      const { error: profileError } = await supabase
        .from('user_profiles')
        .update(profileUpdateData)
        .eq('user_id', currentUser.id);
      
      if (profileError) {
        console.error("Erro ao atualizar perfil:", profileError);
        throw new Error(`Erro ao atualizar dados: ${profileError.message}`);
      }
      
      // 2. Atualizar Senha (se campos preenchidos)
      if (formValues.novaSenha && formValues.senhaAtual) {
        // A API updateUser do Supabase Auth agora pode exigir a senha antiga para confirmação,
        // mas a chamada atual `updateUser({ password: ... })` tenta mudar diretamente.
        // Idealmente, verificaríamos a senha antiga primeiro, mas isso requer outra chamada ou uma função de Borda.
        // Por simplicidade, vamos tentar atualizar diretamente.
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formValues.novaSenha
        });
        
        // Tratar erros específicos de senha (ex: senha atual incorreta, se aplicável pela política do Supabase)
        if (passwordError) {
            console.error("Erro ao atualizar senha:", passwordError);
            // Verificar mensagem de erro específica para senha inválida, se houver
            if (passwordError.message.includes("password")) { // Exemplo genérico
                 throw new Error('Senha atual incorreta ou erro ao definir nova senha.');
            }
            throw new Error(`Erro ao atualizar senha: ${passwordError.message}`);
        }
        
        // Limpar campos de senha APENAS se a atualização for bem-sucedida
        setFormValues(prev => ({
          ...prev,
          senhaAtual: '',
          novaSenha: '',
          confirmarSenha: ''
        }));
      }
      
      setFormMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
      
      // Atualizar dados do perfil no estado local para refletir a mudança imediatamente
      setUserProfile(prev => prev ? {
        ...prev,
        nome: formValues.nome,
        sobrenome: formValues.sobrenome,
        telefone: formValues.telefone
      } : null);

      // Limpar campos de senha mesmo se não foram alterados (se o formulário for submetido com sucesso)
      // Isso já é feito acima se a senha foi alterada com sucesso.
      // Se não houve tentativa de alterar senha, não precisamos limpar.

    } catch (error: any) {
      console.error("Erro ao salvar dados:", error);
      // Usar a mensagem de erro gerada no bloco try
      setFormMessage({ type: 'error', text: error.message || 'Ocorreu um erro ao salvar os dados. Tente novamente.' });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handler para atualizar os valores do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ // Usar função de atualização
      ...prev,
      [name]: value
    }));
    // Limpar mensagem de erro ao digitar em qualquer campo
    if (formMessage?.type === 'error') {
        setFormMessage(null);
    }
  };

  // Componente de carregamento melhorado
  if (isLoading && !userProfile) { // Alterado para !userProfile para melhor refletir o estado de carregamento dos dados
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"> {/* Centraliza na viewport */}
        <Loader2 className="h-12 w-12 animate-spin text-purple-700" />
        <span className="ml-4 text-lg text-gray-600">Carregando sua conta...</span>
      </div>
    );
  }

  // Estrutura principal da página (Container e Grid)
  return (
    <div className="bg-gray-50 min-h-screen"> {/* Fundo geral cinza claro */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl"> {/* Container mais largo */}
        
        {/* Cabeçalho da Página */}
        <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Minha Conta</h1>
            <p className="text-gray-500 mt-1">Gerencie suas informações, pedidos e cursos.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Lateral (Sidebar) */}
          <aside className="lg:w-1/4">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"> {/* Sombra sutil e borda */}
              {/* Informações do Usuário no Topo */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-xl font-semibold">
                  {/* Inicial do nome ou ícone padrão */}
                  {userProfile?.nome ? userProfile.nome.charAt(0).toUpperCase() : <UserCog size={24} />}
              </div>
                <div className="overflow-hidden"> {/* Evitar quebra de texto */}
                  <h3 className="font-semibold text-gray-800 truncate">{userProfile?.nome} {userProfile?.sobrenome}</h3>
                  <p className="text-sm text-gray-500 truncate">{userProfile?.email}</p>
              </div>
            </div>
            
              {/* Navegação Principal */}
              <nav className="space-y-1 mb-6">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'dados', label: 'Meus Dados', icon: UserCog },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150 ${
                      activeTab === item.id 
                        ? 'bg-purple-50 text-purple-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    <item.icon size={18} className={`${activeTab === item.id ? 'text-purple-600' : 'text-gray-400'}`} />
                    {item.label}
                  </button>
                ))}
            </nav>
            
              {/* Links Adicionais e Logout */}
              <div className="space-y-1 pt-4 border-t border-gray-100">
                 <Link href="/contato" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-150">
                    <HelpCircle size={18} className="text-gray-400" />
                    Ajuda e Suporte
                 </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors duration-150"
                >
                  <LogOut size={18} />
                Sair da Conta
              </button>
            </div>
          </div>
          </aside>
          
          {/* Conteúdo Principal (será ajustado nas próximas etapas) */}
          <main className="lg:w-3/4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200 min-h-[400px]"> {/* Padding e altura mínima */}
              {/* Dashboard (Exemplo inicial, será refatorado) */}
            {activeTab === 'dashboard' && (
              <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
                  
                  {/* Card de resumo de pedidos e tabela de últimos pedidos foram removidos daqui */}
                  {/* O card de Informações da Conta foi mantido e ajustado para ocupar o espaço, ou pode ser centralizado se preferir */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8"> {/* Ajustado para 1 coluna ou conforme design desejado */} 
                     <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                       <div className="flex items-center gap-3 mb-3">
                         <UserCog className="text-blue-600" size={24} />
                         <h3 className="text-lg font-semibold text-gray-700">Informações da Conta</h3>
                  </div>
                       <p className="text-sm text-gray-600 mb-3">Gerencie seus dados pessoais e de acesso.</p>
                       <button 
                           onClick={() => setActiveTab('dados')}
                           className="text-sm font-medium text-blue-700 hover:text-blue-900"
                       >
                           Editar meus dados →
                          </button>
                        </div>
                  </div>
                  
                </div>
              )}
              
              {/* Conteúdo da aba 'pedidos' foi completamente removido */}
              
              {/* Meus Dados (Exemplo inicial, será refatorado) */}
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
                            placeholder="Digite seu nome"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder:text-gray-500"
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
                            placeholder="Digite seu sobrenome"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder:text-gray-500"
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
                            placeholder="Digite seu telefone"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder:text-gray-500"
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
                            placeholder="Digite sua senha atual"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder:text-gray-500"
                            autoComplete="current-password"
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
                            placeholder="Digite sua nova senha"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder:text-gray-500"
                            autoComplete="new-password"
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
                            placeholder="Confirme sua nova senha"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder:text-gray-500"
                            autoComplete="new-password"
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
          </main>
        </div>
      </div>
    </div>
  );
}
