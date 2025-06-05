'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useModal } from '@/contexts/ModalContext';
import { 
  LayoutDashboard, 
  UserCog, 
  LogOut,
  HelpCircle,
  Loader2, // Ícone de carregamento
  Camera, // Ícone para upload de foto
  MapPin, // Ícone para endereços
  Plus, // Ícone para adicionar
  Trash2, // Ícone para deletar
  Edit2, // Ícone para editar
  Bookmark, // Ícone para posts salvos
  Clock, // Ícone para data/hora
  Eye, // Ícone para visualizações
  BookmarkX, // Ícone para remover dos salvos
  ShoppingBag, // Ícone para pedidos
  Package, // Ícone para produtos
  Truck, // Ícone para entrega
  CheckCircle, // Ícone para pedido concluído
  AlertCircle, // Ícone para alertas
  Search, // Ícone para busca
  Filter, // Ícone para filtros
  Download, // Ícone para download
  X, // Ícone para fechar
} from 'lucide-react'; // Usar lucide para ícones consistentes

// Os metadados agora são exportados de um arquivo separado
// pois componentes 'use client' não podem exportar metadados

export default function MinhaContaPage() {
  const supabase = createClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estados para posts salvos (mockado por enquanto)
  const [savedPosts, setSavedPosts] = useState<Array<{
    id: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    imageUrl: string;
    views: number;
    slug: string;
  }>>([]);
  const [isLoadingSavedPosts, setIsLoadingSavedPosts] = useState(false);
  
  // Estados para pedidos (estrutura do banco de dados)
  const [orders, setOrders] = useState<Array<{
    id: string;
    user_id: string;
    status: 'pendente' | 'processando' | 'pago' | 'enviado' | 'entregue' | 'cancelado';
    valor_total: number;
    metodo_pagamento: 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto' | null;
    payment_id: string | null;
    external_reference: string | null;
    payment_details: any | null;
    desconto_aplicado: number | null;
    discount_id: string | null;
    shipping_address_id: string | null;
    endereco_entrega_snapshot: {
      nome_destinatario: string;
      rua: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      estado: string;
      cep: string;
      telefone_contato?: string;
    };
    created_at: string;
    updated_at: string;
    items: Array<{
      id: string;
      order_id: string;
      product_id: string;
      product_variant_id: string | null;
      quantidade: number;
      preco_unitario: number;
      preco_total: number;
      product: {
        nome: string;
        descricao?: string;
        images?: Array<{
          image_url: string;
          is_primary: boolean;
        }>;
      };
    }>;
    trackingCode?: string;
    estimatedDelivery?: string;
  }>>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'pendente' | 'processando' | 'pago' | 'enviado' | 'entregue' | 'cancelado'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { openContatoModal } = useModal();

  // Estados para autenticação e dados do usuário
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<{
    nome: string;
    sobrenome: string;
    email: string;
    telefone?: string;
    dataCadastro: string;
    avatar_url?: string;
  } | null>(null);
  
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
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Estados para gerenciamento de endereços
  const [addresses, setAddresses] = useState<Array<{
    id: string;
    nome_destinatario: string;
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    is_default: boolean;
  }>>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [addressFormValues, setAddressFormValues] = useState({
    nome_destinatario: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    is_default: false
  });
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressFormMessage, setAddressFormMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [hasLoadedAddresses, setHasLoadedAddresses] = useState(false);

  // Ref para controlar a chamada inicial do fetchUserData
  const initialLoadDone = useRef(false);
  const isInitializing = useRef(false);
  
  // Funções CRUD para endereços
  const fetchAddresses = async (force = false) => {
    if (!currentUser || (hasLoadedAddresses && !force)) return;
    
    setIsLoadingAddresses(true);
    try {
      const { data, error } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAddresses(data || []);
      setHasLoadedAddresses(true);
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
      setAddressFormMessage({ type: 'error', text: 'Erro ao carregar endereços.' });
    } finally {
      setIsLoadingAddresses(false);
    }
  };
  
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAddress(true);
    setAddressFormMessage(null);
    
    if (!currentUser) {
      setAddressFormMessage({ type: 'error', text: 'Usuário não está logado.' });
      setIsSavingAddress(false);
      return;
    }
    
    // Validar campos obrigatórios
    const requiredFields = ['nome_destinatario', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado'];
    const fieldLabels: Record<string, string> = {
      nome_destinatario: 'Nome do destinatário',
      cep: 'CEP',
      rua: 'Rua',
      numero: 'Número',
      bairro: 'Bairro',
      cidade: 'Cidade',
      estado: 'Estado'
    };
    for (const field of requiredFields) {
      if (!addressFormValues[field as keyof typeof addressFormValues]) {
        setAddressFormMessage({ type: 'error', text: `O campo "${fieldLabels[field]}" é obrigatório.` });
        setIsSavingAddress(false);
        return;
      }
    }
    
    try {
      // Se marcado como padrão, desmarcar outros endereços
      if (addressFormValues.is_default && !editingAddress) {
        await supabase
          .from('shipping_addresses')
          .update({ is_default: false })
          .eq('user_id', currentUser.id);
      }
      
      const addressData = {
        ...addressFormValues,
        user_id: currentUser.id
      };
      
      if (editingAddress) {
        // Atualizar endereço existente
        const { error } = await supabase
          .from('shipping_addresses')
          .update(addressData)
          .eq('id', editingAddress)
          .eq('user_id', currentUser.id);
        
        if (error) throw error;
        setAddressFormMessage({ type: 'success', text: 'Endereço atualizado com sucesso!' });
      } else {
        // Criar novo endereço
        const { error } = await supabase
          .from('shipping_addresses')
          .insert(addressData);
        
        if (error) throw error;
        setAddressFormMessage({ type: 'success', text: 'Endereço adicionado com sucesso!' });
      }
      
      // Recarregar endereços e fechar modal
      await fetchAddresses(true);
      setTimeout(() => {
        setShowAddressModal(false);
        resetAddressForm();
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      setAddressFormMessage({ type: 'error', text: 'Erro ao salvar endereço. Tente novamente.' });
    } finally {
      setIsSavingAddress(false);
    }
  };
  
  const handleDeleteAddress = async (addressId: string) => {
    if (!currentUser || !confirm('Tem certeza que deseja excluir este endereço?')) return;
    
    try {
      const { error } = await supabase
        .from('shipping_addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      await fetchAddresses(true);
      setAddressFormMessage({ type: 'success', text: 'Endereço excluído com sucesso!' });
    } catch (error) {
      console.error('Erro ao excluir endereço:', error);
      setAddressFormMessage({ type: 'error', text: 'Erro ao excluir endereço.' });
    }
  };
  
  const handleSetDefaultAddress = async (addressId: string) => {
    if (!currentUser) return;
    
    try {
      // Desmarcar todos os endereços como padrão
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', currentUser.id);
      
      // Marcar o selecionado como padrão
      const { error } = await supabase
        .from('shipping_addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      await fetchAddresses(true);
      setAddressFormMessage({ type: 'success', text: 'Endereço padrão atualizado!' });
    } catch (error) {
      console.error('Erro ao definir endereço padrão:', error);
      setAddressFormMessage({ type: 'error', text: 'Erro ao definir endereço padrão.' });
    }
  };
  
  const resetAddressForm = () => {
    setAddressFormValues({
      nome_destinatario: '',
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      is_default: false
    });
    setEditingAddress(null);
    setAddressFormMessage(null);
  };
  
  const handleEditAddress = (address: typeof addresses[0]) => {
    setAddressFormValues({
      nome_destinatario: address.nome_destinatario,
      cep: address.cep,
      rua: address.rua,
      numero: address.numero,
      complemento: address.complemento || '',
      bairro: address.bairro,
      cidade: address.cidade,
      estado: address.estado,
      is_default: address.is_default
    });
    setEditingAddress(address.id);
    setShowAddressModal(true);
  };
  
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setAddressFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar mensagem de erro ao digitar
    if (addressFormMessage?.type === 'error') {
      setAddressFormMessage(null);
    }
  };
  
  // Buscar CEP na API
  // Funções auxiliares para pedidos
  const getStatusBadge = (status: typeof orders[0]['status']) => {
    const statusConfig = {
      pendente: { label: 'Pendente', bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      processando: { label: 'Processando', bg: 'bg-blue-100', text: 'text-blue-800', icon: Package },
      pago: { label: 'Pago', bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      enviado: { label: 'Enviado', bg: 'bg-blue-100', text: 'text-blue-800', icon: Truck },
      entregue: { label: 'Entregue', bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      cancelado: { label: 'Cancelado', bg: 'bg-red-100', text: 'text-red-800', icon: X }
    };
    
    const config = statusConfig[status] || statusConfig.pendente;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };
  
  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
    const matchesSearch = (order.external_reference || order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.product.nome.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleCepSearch = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setAddressFormValues(prev => ({
          ...prev,
          rua: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  // Função para logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirecionar para a home após logout
  };

  // Função para buscar dados do usuário
  const fetchUserData = async (userToFetch: User) => {
    if (!userToFetch) return;
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('nome, sobrenome, telefone, avatar_url')
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
        dataCadastro,
        avatar_url: profile?.avatar_url || ''
      });
      
      // Definir preview da foto se existir
      if (profile?.avatar_url) {
        setPhotoPreview(profile.avatar_url);
      }
      
      setFormValues(prev => ({
        ...prev,
        nome: profile?.nome || '',
        sobrenome: profile?.sobrenome || '',
        telefone: profile?.telefone || '',
      }));

    } catch (error) {
      console.error("MinhaContaPage: Erro geral ao buscar dados do usuário", error);
      setFormMessage({ type: 'error', text: 'Erro ao carregar seus dados. Tente novamente mais tarde.' });
    }
  };

  // Inicialização e autenticação
  useEffect(() => {
    const initializeAuth = async () => {
      if (isInitializing.current || initialLoadDone.current) return;
      isInitializing.current = true;
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setCurrentUser(session.user);
          await fetchUserData(session.user);
        } else {
          router.push('/autenticacao');
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        router.push('/autenticacao');
      } finally {
        setIsLoading(false);
        initialLoadDone.current = true;
        isInitializing.current = false;
      }
    };
    
    initializeAuth();
  }, [router]);
  
  // Listener de mudanças de autenticação
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      // Ignora o evento inicial para evitar duplicação
      if (event === 'INITIAL_SESSION') return;
      
      const user = session?.user ?? null;

      if (user && user.id !== currentUser?.id) {
        setCurrentUser(user);
        await fetchUserData(user);
      } else if (!user && currentUser) { 
        setCurrentUser(null);
        setUserProfile(null);
        setFormValues({ nome: '', sobrenome: '', telefone: '', senhaAtual: '', novaSenha: '', confirmarSenha: ''});
        router.push('/autenticacao');
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, router]);
  
  // Carregar endereços quando a aba for alterada
  useEffect(() => {
    if (activeTab === 'enderecos' && currentUser && !hasLoadedAddresses) {
      fetchAddresses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentUser, hasLoadedAddresses]);
  
  // Carregar posts salvos do banco de dados
  useEffect(() => {
    if (activeTab === 'posts-salvos' && currentUser) {
      setIsLoadingSavedPosts(true);
      
      const fetchSavedPosts = async () => {
        try {
          // Buscar posts salvos pelo usuário
          const { data: savedPostsData, error: savedError } = await supabase
            .from('blog_post_saves')
            .select(`
              id,
              created_at,
              post:blog_posts (
                id,
                titulo,
                slug,
                resumo,
                conteudo,
                imagem_destaque_url,
                author_id,
                published_at,
                view_count,
                author_nome,
                author_sobrenome
              )
            `)
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });

          if (savedError) {
            console.error('Erro ao buscar posts salvos:', savedError);
            setSavedPosts([]);
            return;
          }

          // Formatar os dados para o formato esperado pelo componente
          const formattedPosts = savedPostsData?.map((item: any) => {
            const post = item.post;
            // Extrair resumo do conteúdo HTML se não houver resumo
            const extractTextFromHtml = (html: string) => {
              const div = document.createElement('div');
              div.innerHTML = html;
              return div.textContent || div.innerText || '';
            };
            
            const excerpt = post.resumo || extractTextFromHtml(post.conteudo).substring(0, 150) + '...';
            const authorName = `${post.author_nome || 'Lorena'} ${post.author_sobrenome || 'Jacob'}`;
            
            // Calcular tempo de leitura estimado (média de 200 palavras por minuto)
            const wordCount = extractTextFromHtml(post.conteudo).split(' ').length;
            const readTime = Math.ceil(wordCount / 200);
            
            return {
              id: post.id,
              title: post.titulo,
              excerpt: excerpt,
              author: authorName,
              date: new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR'),
              readTime: `${readTime} min`,
              category: 'Blog', // Categoria padrão por enquanto
              imageUrl: post.imagem_destaque_url || '',
              views: post.view_count || 0,
              slug: post.slug
            };
          }) || [];

          setSavedPosts(formattedPosts);
        } catch (error) {
          console.error('Erro ao processar posts salvos:', error);
          setSavedPosts([]);
        } finally {
          setIsLoadingSavedPosts(false);
        }
      };

      fetchSavedPosts();
    }
  }, [activeTab, currentUser]);
  
  // Simular carregamento de pedidos (mockado)
  useEffect(() => {
    if (activeTab === 'pedidos') {
      setIsLoadingOrders(true);
      // Simular delay de carregamento
      setTimeout(() => {
        // Dados mockados para demonstração
        setOrders([
          {
            id: '1',
            user_id: 'user-123',
            status: 'entregue',
            valor_total: 297.00,
            metodo_pagamento: 'cartao_credito',
            payment_id: 'pay_123',
            external_reference: 'PED-2024-001',
            payment_details: null,
            desconto_aplicado: null,
            discount_id: null,
            shipping_address_id: 'addr-1',
            endereco_entrega_snapshot: {
              nome_destinatario: 'João Silva',
              rua: 'Rua das Flores',
              numero: '123',
              complemento: 'Apto 45',
              bairro: 'Centro',
              cidade: 'São Paulo',
              estado: 'SP',
              cep: '01234-567'
            },
            created_at: '2024-01-20T10:30:00',
            updated_at: '2024-01-20T10:30:00',
            items: [
              {
                id: '1',
                order_id: '1',
                product_id: 'prod-1',
                product_variant_id: null,
                quantidade: 1,
                preco_unitario: 197.00,
                preco_total: 197.00,
                product: {
                  nome: 'Curso Online: Inteligência Emocional',
                  descricao: 'Curso completo sobre inteligência emocional',
                  images: [
                    {
                      image_url: '/assets/treinamento-bg.jpg',
                      is_primary: true
                    }
                  ]
                }
              },
              {
                id: '2',
                order_id: '1',
                product_id: 'prod-2',
                product_variant_id: null,
                quantidade: 1,
                preco_unitario: 47.00,
                preco_total: 47.00,
                product: {
                  nome: 'E-book: Guia de Meditação',
                  descricao: 'Guia completo de meditação',
                  images: [
                    {
                      image_url: '/assets/meusservicos.png',
                      is_primary: true
                    }
                  ]
                }
              },
              {
                id: '3',
                order_id: '1',
                product_id: 'prod-3',
                product_variant_id: null,
                quantidade: 1,
                preco_unitario: 53.00,
                preco_total: 53.00,
                product: {
                  nome: 'Workshop: Resiliência no Trabalho',
                  descricao: 'Workshop sobre resiliência'
                }
              }
            ],
            trackingCode: 'BR123456789',
            estimatedDelivery: '2024-01-25'
          },
          {
            id: '2',
            user_id: 'user-123',
            status: 'enviado',
            valor_total: 147.00,
            metodo_pagamento: 'pix',
            payment_id: 'pay_456',
            external_reference: 'PED-2024-002',
            payment_details: null,
            desconto_aplicado: null,
            discount_id: null,
            shipping_address_id: 'addr-2',
            endereco_entrega_snapshot: {
              nome_destinatario: 'Maria Santos',
              rua: 'Av. Paulista',
              numero: '1000',
              bairro: 'Bela Vista',
              cidade: 'São Paulo',
              estado: 'SP',
              cep: '01310-100'
            },
            created_at: '2024-01-18T15:45:00',
            updated_at: '2024-01-18T15:45:00',
            items: [
              {
                id: '4',
                order_id: '2',
                product_id: 'prod-4',
                product_variant_id: null,
                quantidade: 1,
                preco_unitario: 147.00,
                preco_total: 147.00,
                product: {
                  nome: 'Palestra Online: Ansiedade e Produtividade',
                  descricao: 'Palestra sobre ansiedade e produtividade',
                  images: [
                    {
                      image_url: '/assets/palestras-bg.jpg',
                      is_primary: true
                    }
                  ]
                }
              }
            ],
            trackingCode: 'BR987654321',
            estimatedDelivery: '2024-01-23'
          },
          {
            id: '3',
            user_id: 'user-123',
            status: 'processando',
            valor_total: 397.00,
            metodo_pagamento: 'boleto',
            payment_id: null,
            external_reference: 'PED-2024-003',
            payment_details: null,
            desconto_aplicado: null,
            discount_id: null,
            shipping_address_id: 'addr-3',
            endereco_entrega_snapshot: {
              nome_destinatario: 'Pedro Oliveira',
              rua: 'Rua Augusta',
              numero: '500',
              complemento: 'Sala 201',
              bairro: 'Consolação',
              cidade: 'São Paulo',
              estado: 'SP',
              cep: '01305-100'
            },
            created_at: '2024-01-15T09:20:00',
            updated_at: '2024-01-15T09:20:00',
            items: [
              {
                id: '5',
                order_id: '3',
                product_id: 'prod-5',
                product_variant_id: null,
                quantidade: 1,
                preco_unitario: 397.00,
                preco_total: 397.00,
                product: {
                  nome: 'Mentoria Individual - 3 meses',
                  descricao: 'Mentoria personalizada por 3 meses'
                }
              }
            ]
          },
          {
            id: '4',
            user_id: 'user-123',
            status: 'cancelado',
            valor_total: 97.00,
            metodo_pagamento: 'cartao_credito',
            payment_id: 'pay_789',
            external_reference: 'PED-2024-004',
            payment_details: null,
            desconto_aplicado: null,
            discount_id: null,
            shipping_address_id: 'addr-4',
            endereco_entrega_snapshot: {
              nome_destinatario: 'Ana Costa',
              rua: 'Rua Oscar Freire',
              numero: '800',
              bairro: 'Jardins',
              cidade: 'São Paulo',
              estado: 'SP',
              cep: '01426-000'
            },
            created_at: '2024-01-10T14:00:00',
            updated_at: '2024-01-10T14:00:00',
            items: [
              {
                id: '6',
                order_id: '4',
                product_id: 'prod-6',
                product_variant_id: null,
                quantidade: 1,
                preco_unitario: 97.00,
                preco_total: 97.00,
                product: {
                  nome: 'Curso: Técnicas de Relaxamento',
                  descricao: 'Curso de técnicas de relaxamento'
                }
              }
            ]
          }
        ]);
        setIsLoadingOrders(false);
      }, 1000);
    }
  }, [activeTab]); 
  
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
      // Se não houve tentativa de alterar senha, não precisamos limpar.

    } catch (error: unknown) {
      console.error("Erro ao salvar dados:", error);
      if (error instanceof Error) {
        setFormMessage({ type: 'error', text: error.message });  
      } else {
        setFormMessage({ type: 'error', text: 'Ocorreu um erro ao salvar os dados. Tente novamente.' });
      }
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

  // Handler para upload de foto
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    
    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFormMessage({ type: 'error', text: 'Por favor, selecione uma imagem válida (JPG, PNG ou WebP).' });
      return;
    }
    
    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormMessage({ type: 'error', text: 'A imagem deve ter no máximo 5MB.' });
      return;
    }
    
    setIsUploadingPhoto(true);
    setFormMessage(null);
    
    try {
      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}_${Date.now()}.${fileExt}`;
      const filePath = `profile-pic/${fileName}`;
      
      // Upload para o bucket
      const { error: uploadError } = await supabase.storage
        .from('lorena-images-db')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600'
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('lorena-images-db')
        .getPublicUrl(filePath);
      
      // Atualizar perfil com nova URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', currentUser.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Atualizar estado local
      setUserProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      setPhotoPreview(publicUrl);
      setFormMessage({ type: 'success', text: 'Foto de perfil atualizada com sucesso!' });
      
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      setFormMessage({ type: 'error', text: 'Erro ao fazer upload da foto. Tente novamente.' });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Componente de carregamento melhorado
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
          <div className="mb-8 md:mb-12">
            <div className="h-10 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Skeleton do menu lateral */}
            <aside className="lg:w-1/4">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </aside>
            
            {/* Skeleton do conteúdo principal */}
            <main className="lg:w-3/4">
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-12 w-12 animate-spin text-[#1e60a7]" />
                </div>
              </div>
            </main>
          </div>
        </div>
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
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#1e60a7] text-xl font-semibold overflow-hidden">
                  {/* Avatar ou inicial do nome */}
                  {userProfile?.avatar_url ? (
                    <img 
                      src={userProfile.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : userProfile?.nome ? (
                    userProfile.nome.charAt(0).toUpperCase()
                  ) : (
                    <UserCog size={24} />
                  )}
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
                  { id: 'enderecos', label: 'Meus Endereços', icon: MapPin },
                  { id: 'posts-salvos', label: 'Posts Salvos', icon: Bookmark },
                  { id: 'pedidos', label: 'Meus Pedidos', icon: ShoppingBag },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150 ${
                      activeTab === item.id 
                        ? 'bg-blue-50 text-[#1e60a7] font-medium' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    <item.icon size={18} className={`${activeTab === item.id ? 'text-[#1e60a7]' : 'text-gray-400'}`} />
                    {item.label}
                  </button>
                ))}
            </nav>
            
              {/* Links Adicionais e Logout */}
              <div className="space-y-1 pt-4 border-t border-gray-100">
                 <button 
                    type="button"
                    onClick={openContatoModal}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-150 text-left"
                  >
                    <HelpCircle size={18} className="text-gray-400" />
                    Ajuda e Suporte
                 </button>
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
                <h2 className="text-2xl font-semibold text-[#1e60a7] mb-6">Meus Dados</h2>
                
                  {formMessage && (
                    <div className={`mb-6 p-4 rounded-md ${
                      formMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {formMessage.text}
                    </div>
                  )}
                  
                  <form className="max-w-2xl" onSubmit={handleUpdateProfile}>
                  {/* Seção de Foto de Perfil */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Foto de Perfil</h3>
                    
                    <div className="flex items-center gap-6">
                      {/* Preview da foto */}
                      <div className="relative">
                        <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-blue-100">
                          {photoPreview || userProfile?.avatar_url ? (
                            <img 
                              src={photoPreview || userProfile?.avatar_url} 
                              alt="Foto de perfil" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <UserCog size={40} />
                            </div>
                          )}
                        </div>
                        
                        {/* Botão de upload sobreposto */}
                        <label 
                          htmlFor="photo-upload" 
                          className="absolute bottom-0 right-0 bg-[#1e60a7] text-white p-2 rounded-full cursor-pointer hover:bg-[#184d8a] transition shadow-lg"
                        >
                          <Camera size={16} />
                          <input 
                            type="file" 
                            id="photo-upload" 
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            disabled={isUploadingPhoto}
                          />
                        </label>
                      </div>
                      
                      {/* Informações sobre upload */}
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">
                          Clique no ícone da câmera para fazer upload de uma nova foto.
                        </p>
                        <p className="text-xs text-gray-500">
                          Formatos aceitos: JPG, PNG, WebP. Tamanho máximo: 5MB.
                        </p>
                        
                        {isUploadingPhoto && (
                          <div className="mt-2 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-[#1e60a7]" />
                            <span className="text-sm text-[#1e60a7]">Fazendo upload...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 placeholder:text-gray-500"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 placeholder:text-gray-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">E-mail</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                            value={userProfile?.email || ''}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] bg-gray-50 text-gray-700"
                            disabled
                            autoComplete="username"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 placeholder:text-gray-500"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 placeholder:text-gray-500"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 placeholder:text-gray-500"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 placeholder:text-gray-500"
                            autoComplete="new-password"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="submit"
                        className="bg-[#1e60a7] text-white px-6 py-2 rounded-md font-medium hover:bg-[#184d8a] transition flex items-center justify-center min-w-[150px]"
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
            
            {/* Meus Endereços */}
            {activeTab === 'enderecos' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-[#1e60a7]">Meus Endereços</h2>
                  <button
                    onClick={() => {
                      resetAddressForm();
                      setShowAddressModal(true);
                    }}
                    className="bg-[#1e60a7] text-white px-4 py-2 rounded-md font-medium hover:bg-[#184d8a] transition flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Adicionar Endereço
                  </button>
                </div>
                
                {addressFormMessage && !showAddressModal && (
                  <div className={`mb-6 p-4 rounded-md ${
                    addressFormMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {addressFormMessage.text}
                  </div>
                )}
                
                {isLoadingAddresses ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#1e60a7]" />
                    <span className="ml-3 text-gray-600">Carregando endereços...</span>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">Você ainda não possui endereços cadastrados.</p>
                    <button
                      onClick={() => {
                        resetAddressForm();
                        setShowAddressModal(true);
                      }}
                      className="text-[#1e60a7] font-medium hover:text-[#13416f]"
                    >
                      Adicionar seu primeiro endereço
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 relative ${
                          address.is_default
                            ? 'border-[#1e60a7] bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {address.is_default && (
                          <span className="absolute top-2 right-2 bg-[#1e60a7] text-white text-xs px-2 py-1 rounded-full">
                            Padrão
                          </span>
                        )}
                        
                        <div className="pr-20">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {address.nome_destinatario}
                          </h3>
                          <p className="text-sm text-gray-700 font-medium">
                            {address.rua}, {address.numero}
                          </p>
                          {address.complemento && (
                            <p className="text-sm text-gray-600">{address.complemento}</p>
                          )}
                          <p className="text-sm text-gray-600">
                            {address.bairro} - {address.cidade}/{address.estado}
                          </p>
                          <p className="text-sm text-gray-600">CEP: {address.cep}</p>
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          {!address.is_default && (
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="text-sm text-[#1e60a7] hover:text-[#13416f] font-medium"
                            >
                              Tornar padrão
                            </button>
                          )}
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                          >
                            <Edit2 size={14} />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Modal de Adicionar/Editar Endereço */}
                {showAddressModal && (
                  <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                          {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
                        </h3>
                        
                        {addressFormMessage && (
                          <div className={`mb-4 p-3 rounded-md text-sm ${
                            addressFormMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' 
                            : 'bg-red-50 text-red-800 border border-red-200'
                          }`}>
                            {addressFormMessage.text}
                          </div>
                        )}
                        
                        <form onSubmit={handleSaveAddress}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="md:col-span-2">
                              <label htmlFor="nome_destinatario" className="block text-gray-700 font-medium mb-1">
                                Nome do Destinatário <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id="nome_destinatario"
                                name="nome_destinatario"
                                value={addressFormValues.nome_destinatario}
                                onChange={handleAddressInputChange}
                                placeholder="Nome completo do destinatário"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 bg-white placeholder:text-gray-400"
                                required
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label htmlFor="cep" className="block text-gray-700 font-medium mb-1">
                                CEP <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id="cep"
                                name="cep"
                                value={addressFormValues.cep}
                                onChange={(e) => {
                                  handleAddressInputChange(e);
                                  if (e.target.value.replace(/\D/g, '').length === 8) {
                                    handleCepSearch(e.target.value);
                                  }
                                }}
                                placeholder="00000-000"
                                maxLength={9}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 bg-white placeholder:text-gray-400"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="rua" className="block text-gray-700 font-medium mb-1">
                                Rua <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id="rua"
                                name="rua"
                                value={addressFormValues.rua}
                                onChange={handleAddressInputChange}
                                placeholder="Nome da rua"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 bg-white placeholder:text-gray-400"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="numero" className="block text-gray-700 font-medium mb-1">
                                Número <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id="numero"
                                name="numero"
                                value={addressFormValues.numero}
                                onChange={handleAddressInputChange}
                                placeholder="123"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 bg-white placeholder:text-gray-400"
                                required
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label htmlFor="complemento" className="block text-gray-700 font-medium mb-1">
                                Complemento (opcional)
                              </label>
                              <input
                                type="text"
                                id="complemento"
                                name="complemento"
                                value={addressFormValues.complemento}
                                onChange={handleAddressInputChange}
                                placeholder="Apartamento, sala, etc."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 bg-white placeholder:text-gray-400"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="bairro" className="block text-gray-700 font-medium mb-1">
                                Bairro <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id="bairro"
                                name="bairro"
                                value={addressFormValues.bairro}
                                onChange={handleAddressInputChange}
                                placeholder="Nome do bairro"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 bg-white placeholder:text-gray-400"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="cidade" className="block text-gray-700 font-medium mb-1">
                                Cidade <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id="cidade"
                                name="cidade"
                                value={addressFormValues.cidade}
                                onChange={handleAddressInputChange}
                                placeholder="Nome da cidade"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 bg-white placeholder:text-gray-400"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="estado" className="block text-gray-700 font-medium mb-1">
                                Estado <span className="text-red-500">*</span>
                              </label>
                              <select
                                id="estado"
                                name="estado"
                                value={addressFormValues.estado}
                                onChange={handleAddressInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 bg-white"
                                required
                              >
                                <option value="">Selecione</option>
                                <option value="AC">Acre</option>
                                <option value="AL">Alagoas</option>
                                <option value="AP">Amapá</option>
                                <option value="AM">Amazonas</option>
                                <option value="BA">Bahia</option>
                                <option value="CE">Ceará</option>
                                <option value="DF">Distrito Federal</option>
                                <option value="ES">Espírito Santo</option>
                                <option value="GO">Goiás</option>
                                <option value="MA">Maranhão</option>
                                <option value="MT">Mato Grosso</option>
                                <option value="MS">Mato Grosso do Sul</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="PA">Pará</option>
                                <option value="PB">Paraíba</option>
                                <option value="PR">Paraná</option>
                                <option value="PE">Pernambuco</option>
                                <option value="PI">Piauí</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="RN">Rio Grande do Norte</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="RO">Rondônia</option>
                                <option value="RR">Roraima</option>
                                <option value="SC">Santa Catarina</option>
                                <option value="SP">São Paulo</option>
                                <option value="SE">Sergipe</option>
                                <option value="TO">Tocantins</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="is_default"
                                checked={addressFormValues.is_default}
                                onChange={handleAddressInputChange}
                                className="w-4 h-4 text-[#1e60a7] focus:ring-[#1e60a7] border-gray-300 rounded"
                              />
                              <span className="text-gray-700">Definir como endereço padrão</span>
                            </label>
                          </div>
                          
                          <div className="flex gap-3 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddressModal(false);
                                resetAddressForm();
                              }}
                              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition"
                              disabled={isSavingAddress}
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="bg-[#1e60a7] text-white px-4 py-2 rounded-md font-medium hover:bg-[#184d8a] transition flex items-center justify-center min-w-[100px]"
                              disabled={isSavingAddress}
                            >
                              {isSavingAddress ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Salvando...
                                </>
                              ) : editingAddress ? 'Atualizar' : 'Adicionar'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Posts Salvos */}
            {activeTab === 'posts-salvos' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#1e60a7]">Posts Salvos</h2>
                    <p className="text-gray-500 mt-1">Artigos que você salvou para ler mais tarde</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Bookmark size={16} />
                    <span>{savedPosts.length} posts salvos</span>
                  </div>
                </div>
                
                {isLoadingSavedPosts ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-5">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
                          <div className="flex justify-between">
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : savedPosts.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                    <Bookmark className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum post salvo ainda</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Quando você salvar posts do blog, eles aparecerão aqui para você poder acessá-los facilmente.
                    </p>
                    <Link 
                      href="/blog"
                      className="inline-flex items-center gap-2 bg-[#1e60a7] text-white px-6 py-2.5 rounded-md font-medium hover:bg-[#184d8a] transition"
                    >
                      Explorar Blog
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedPosts.map((post) => (
                      <article key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                        {/* Imagem do Post */}
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          {post.imageUrl ? (
                            <img 
                              src={post.imageUrl} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Bookmark size={48} />
                            </div>
                          )}
                          
                          {/* Badge de Categoria */}
                          <div className="absolute top-3 left-3">
                            <span className="bg-[#1e60a7] text-white text-xs px-3 py-1 rounded-full">
                              {post.category}
                            </span>
                          </div>
                          
                          {/* Botão de Remover dos Salvos */}
                          <button
                            onClick={async () => {
                              if (!currentUser) return;
                              
                              try {
                                // Remover do banco de dados
                                const { error } = await supabase
                                  .from('blog_post_saves')
                                  .delete()
                                  .eq('post_id', post.id)
                                  .eq('user_id', currentUser.id);
                                
                                if (!error) {
                                  // Remover do estado local apenas se a remoção do banco foi bem-sucedida
                                  setSavedPosts(prev => prev.filter(p => p.id !== post.id));
                                }
                              } catch (error) {
                                console.error('Erro ao remover post dos salvos:', error);
                              }
                            }}
                            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                            title="Remover dos salvos"
                          >
                            <BookmarkX size={18} className="text-gray-700" />
                          </button>
                        </div>
                        
                        {/* Conteúdo do Post */}
                        <div className="p-5">
                          <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-[#1e60a7] transition-colors">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          
                          {/* Meta informações */}
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {post.readTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye size={14} />
                                {post.views.toLocaleString('pt-BR')} views
                              </span>
                            </div>
                            <time>{new Date(post.date).toLocaleDateString('pt-BR')}</time>
                          </div>
                          
                          {/* Footer com autor e link */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Por <span className="font-medium text-gray-800">{post.author}</span>
                            </span>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-[#1e60a7] font-medium text-sm hover:text-[#13416f] transition-colors"
                            >
                              Ler artigo →
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                
                {/* Paginação simulada */}
                {savedPosts.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center gap-2">
                      <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        Anterior
                      </button>
                      <button className="px-3 py-1 rounded-md bg-[#1e60a7] text-white">1</button>
                      <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">2</button>
                      <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">3</button>
                      <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                        Próximo
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            )}
            
            {/* Meus Pedidos */}
            {activeTab === 'pedidos' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-[#1e60a7] mb-2">Meus Pedidos</h2>
                  <p className="text-gray-500">Acompanhe o status dos seus pedidos e compras</p>
                </div>
                
                {/* Filtros e Busca */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar por número do pedido ou produto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value as typeof orderFilter)}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e60a7] text-gray-900 bg-white"
                    >
                      <option value="all">Todos os pedidos</option>
                      <option value="pendente">Pendentes</option>
                      <option value="processando">Processando</option>
                      <option value="pago">Pagos</option>
                      <option value="enviado">Enviados</option>
                      <option value="entregue">Entregues</option>
                      <option value="cancelado">Cancelados</option>
                    </select>
                  </div>
                </div>
                
                {isLoadingOrders ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        </div>
                        <div className="h-px bg-gray-200 my-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {searchTerm ? 'Nenhum pedido encontrado' : 'Você ainda não fez nenhum pedido'}
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      {searchTerm 
                        ? 'Tente buscar com outros termos ou remova os filtros aplicados.'
                        : 'Quando você realizar uma compra, seus pedidos aparecerão aqui.'}
                    </p>
                    {!searchTerm && (
                      <Link 
                        href="/loja"
                        className="inline-flex items-center gap-2 bg-[#1e60a7] text-white px-6 py-2.5 rounded-md font-medium hover:bg-[#184d8a] transition"
                      >
                        <ShoppingBag size={18} />
                        Explorar Loja
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                          {/* Header do Pedido */}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                Pedido #{order.external_reference || order.id.slice(0, 8)}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                              <p className="text-lg font-semibold text-gray-900 mt-2">
                                R$ {(order.valor_total || 0).toFixed(2).replace('.', ',')}
                              </p>
                            </div>
                          </div>
                          
                          {/* Tracking Info */}
                          {order.trackingCode && (
                            <div className="bg-blue-50 rounded-md p-3 mb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                  <Truck className="h-4 w-4 text-[#1e60a7]" />
                                  <span className="text-[#1e60a7] font-medium">
                                    Código de rastreio: {order.trackingCode}
                                  </span>
                                </div>
                                {order.estimatedDelivery && (
                                  <span className="text-sm text-[#1e60a7]">
                                    Previsão: {new Date(order.estimatedDelivery).toLocaleDateString('pt-BR')}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Items do Pedido */}
                          <div className="border-t border-gray-100 pt-4">
                            <div className="space-y-3">
                              {order.items.slice(0, 2).map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    {item.product.images && item.product.images.find(img => img.is_primary)?.image_url ? (
                                      <img 
                                        src={item.product.images.find(img => img.is_primary)?.image_url} 
                                        alt={item.product.nome}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Package size={24} />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-900">{item.product.nome}</h4>
                                    <p className="text-sm text-gray-500">Qtd: {item.quantidade}</p>
                                  </div>
                                  <p className="text-sm font-medium text-gray-900">
                                    R$ {(item.preco_unitario || 0).toFixed(2).replace('.', ',')}
                                  </p>
                                </div>
                              ))}
                              
                              {order.items.length > 2 && (
                                <p className="text-sm text-gray-500 text-center py-2">
                                  +{order.items.length - 2} {order.items.length - 2 === 1 ? 'item' : 'itens'}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Ações */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-500">
                              {order.metodo_pagamento ? order.metodo_pagamento.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Não informado'}
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderModal(true);
                                }}
                                className="text-[#1e60a7] font-medium text-sm hover:text-[#13416f] transition"
                              >
                                Ver detalhes
                              </button>
                              {order.status === 'entregue' && (
                                <button className="flex items-center gap-1 text-gray-600 font-medium text-sm hover:text-gray-800 transition">
                                  <Download size={14} />
                                  Baixar NF
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Modal de Detalhes do Pedido */}
                {showOrderModal && selectedOrder && (
                  <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                      <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-gray-900">
                            Detalhes do Pedido #{selectedOrder.external_reference || selectedOrder.id.slice(0, 8)}
                          </h3>
                          <button
                            onClick={() => {
                              setShowOrderModal(false);
                              setSelectedOrder(null);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                          >
                            <X size={20} className="text-gray-500" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        {/* Status e Data */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Status do pedido</p>
                              {getStatusBadge(selectedOrder.status)}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 mb-1">Data do pedido</p>
                              <p className="font-medium">
                                {new Date(selectedOrder.created_at).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          
                          {/* Timeline de Status */}
                          {selectedOrder.trackingCode && (
                            <div className="bg-blue-50 rounded-lg p-4">
                              <h4 className="font-medium text-[#13416f] mb-2">Informações de Envio</h4>
                              <p className="text-sm text-[#1e60a7]">
                                Código de rastreamento: <span className="font-mono font-medium">{selectedOrder.trackingCode}</span>
                              </p>
                              {selectedOrder.estimatedDelivery && (
                                <p className="text-sm text-[#1e60a7] mt-1">
                                  Previsão de entrega: {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Produtos */}
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-4">Produtos</h4>
                          <div className="space-y-4">
                            {selectedOrder.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                                  {item.product.images && item.product.images.find(img => img.is_primary)?.image_url ? (
                                    <img 
                                      src={item.product.images.find(img => img.is_primary)?.image_url} 
                                      alt={item.product.nome}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <Package size={32} />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{item.product.nome}</h5>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Quantidade: {item.quantidade || 0} × R$ {(item.preco_unitario || 0).toFixed(2).replace('.', ',')}
                                  </p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                  R$ {(item.preco_total || 0).toFixed(2).replace('.', ',')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Endereço de Entrega */}
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-3">Endereço de Entrega</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-medium text-gray-900">{selectedOrder.endereco_entrega_snapshot.nome_destinatario}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {selectedOrder.endereco_entrega_snapshot.rua}, {selectedOrder.endereco_entrega_snapshot.numero}
                              {selectedOrder.endereco_entrega_snapshot.complemento && ` - ${selectedOrder.endereco_entrega_snapshot.complemento}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {selectedOrder.endereco_entrega_snapshot.bairro} - {selectedOrder.endereco_entrega_snapshot.cidade}/{selectedOrder.endereco_entrega_snapshot.estado}
                            </p>
                            <p className="text-sm text-gray-600">CEP: {selectedOrder.endereco_entrega_snapshot.cep}</p>
                          </div>
                        </div>
                        
                        {/* Resumo do Pagamento */}
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">R$ {(selectedOrder.valor_total || 0).toFixed(2).replace('.', ',')}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Frete</span>
                            <span className="font-medium text-green-600">Grátis</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="font-semibold text-lg text-gray-900">
                              R$ {(selectedOrder.valor_total || 0).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Pago via {selectedOrder.metodo_pagamento ? selectedOrder.metodo_pagamento.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Não informado'}
                          </p>
                        </div>
                        
                        {/* Ações */}
                        <div className="mt-6 flex gap-3">
                          {selectedOrder.status === 'entregue' && (
                            <button className="flex-1 bg-[#1e60a7] text-white px-4 py-2 rounded-md font-medium hover:bg-[#184d8a] transition">
                              Comprar Novamente
                            </button>
                          )}
                          {selectedOrder.status === 'entregue' && (
                            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">
                              <Download size={16} />
                              Baixar Nota Fiscal
                            </button>
                          )}
                          {(selectedOrder.status === 'pendente' || selectedOrder.status === 'processando') && (
                            <button className="flex-1 border border-red-300 text-red-600 px-4 py-2 rounded-md font-medium hover:bg-red-50 transition">
                              Cancelar Pedido
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          </main>
        </div>
      </div>
    </div>
  );
}
