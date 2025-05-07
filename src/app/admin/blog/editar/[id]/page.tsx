// src/app/admin/blog/editar/[id]/page.tsx
"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react'; // Next.js 13+ hook for promises
import Image from 'next/image';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { getPostForEdit, updatePost, getBlogCategories, type BlogCategoryFromDB } from '../../actions';
import { createClient } from '@/utils/supabase/client'; // Importar cliente Supabase

interface EditarPostParams {
  params: Promise<{
    id: string;
  }>;
}

export default function EditarBlogPostPage({ params }: EditarPostParams) {
  const router = useRouter();
  const supabase = createClient(); // Instanciar cliente
  const unwrappedParams = use(params);
  const postId = unwrappedParams.id;

  const [formData, setFormData] = useState({
    titulo: '',
    slug: '',
    resumo: '',
    conteudo: '',
    categorias: [] as string[],
    imagem_destaque_url: '', // Guarda a URL atual vinda do banco
    is_published: false,
    like_count: 0,
    view_count: 0,
  });
  const [blogCategoriesOptions, setBlogCategoriesOptions] = useState<BlogCategoryFromDB[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Para preview local via ObjectURL
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null); // Estado para o NOVO arquivo selecionado
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null); // Guarda a URL original ao carregar
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading geral do submit
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isFetching, setIsFetching] = useState(true);
  const [serverMessage, setServerMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null); // Ref para gerenciar ObjectURL

  // Carregar dados iniciais do post e categorias
  useEffect(() => {
    let isMounted = true;
    let hasRun = false;

    async function fetchData() {
      if (hasRun || !isMounted) return;
      hasRun = true;
      setIsFetching(true); // Garante que o estado de loading é ativado

      try {
        const [categories, post] = await Promise.all([
          getBlogCategories(),
          getPostForEdit(postId)
        ]);

        if (!isMounted) return;

        setBlogCategoriesOptions(categories || []);

        if (post) {
          setFormData({
            titulo: post.titulo,
            slug: post.slug,
            resumo: post.resumo || '',
            conteudo: post.conteudo,
            categorias: post.categorias || [],
            imagem_destaque_url: post.imagem_destaque_url || '', // URL atual salva
            is_published: post.is_published || false,
            like_count: post.like_count || 0,
            view_count: post.view_count || 0,
          });
          setOriginalImageUrl(post.imagem_destaque_url || null); // Guarda a URL original
          // Não definimos previewUrl aqui, ele só é usado para novas imagens
        } else {
          setServerMessage({ type: 'error', text: 'Post não encontrado ou erro ao carregar.' });
          // Considerar redirecionar ou mostrar erro permanente
          // router.push('/admin/blog');
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Erro ao carregar dados para edição:', error);
        setServerMessage({ type: 'error', text: 'Erro ao carregar dados do post. Tente recarregar a página.' });
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    }

    fetchData();

    // Limpar URL de objeto ao desmontar
    return () => {
      isMounted = false;
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, [postId, router]); // Dependências corretas

  const generateSlug = (title: string) => {
    return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      // Não gerar slug automaticamente na edição para evitar mudanças indesejadas
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleContentChange = useCallback((htmlContent: string) => {
    setFormData(prevFormData => ({ ...prevFormData, conteudo: htmlContent }));
    if (errors.conteudo) setErrors(prev => ({ ...prev, conteudo: '' }));
  }, [errors.conteudo]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, categorias: selectedOptions }));
    if (errors.categorias) setErrors(prev => ({ ...prev, categorias: '' }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedImageFile(null);
       if (previewUrlRef.current) {
           URL.revokeObjectURL(previewUrlRef.current);
           previewUrlRef.current = null;
       }
      setPreviewUrl(null); // Remove o preview se o usuário cancelou a seleção
      return;
    }
    setSelectedImageFile(file);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const localPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = localPreviewUrl;
    setPreviewUrl(localPreviewUrl); // Mostra preview da NOVA imagem
    if (errors.imagem_destaque_url) setErrors(prev => ({ ...prev, imagem_destaque_url: '' }));
    // NÃO atualiza formData.imagem_destaque_url ainda
  };

  const handleRemoveImage = async () => { // Precisa ser async para deletar do storage
    const urlToRemove = formData.imagem_destaque_url; // Pega a URL atual (que está no banco)

     if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
     }
    setPreviewUrl(null);
    setSelectedImageFile(null);
    setFormData(prev => ({ ...prev, imagem_destaque_url: '' })); // Define a URL como vazia no form
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Se havia uma URL salva, tenta deletar do storage
    if (urlToRemove) {
        console.log("Removendo imagem do storage:", urlToRemove);
        try {
            const pathToDelete = urlToRemove.split('/lorena-images-db/')[1]; // <<< Ajuste o bucket
            if (pathToDelete) {
                setIsLoading(true); // Mostra feedback
                const { error: deleteImgError } = await supabase.storage
                    .from('lorena-images-db') // <<< SEU BUCKET CORRETO
                    .remove([pathToDelete]);
                 setIsLoading(false);
                if (deleteImgError) throw deleteImgError;
                console.log("Imagem removida do storage ao clicar em remover.");
                setOriginalImageUrl(null); // Atualiza o estado da URL original também
            }
        } catch (error: any) {
            setIsLoading(false);
            console.error("Erro ao remover imagem do storage:", error.message);
            alert("Erro ao remover a imagem do armazenamento. A referência será removida ao salvar.");
        }
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.titulo.trim()) newErrors.titulo = 'O título é obrigatório';
    if (!formData.slug.trim()) newErrors.slug = 'O slug é obrigatório';
    if (!formData.resumo.trim()) newErrors.resumo = 'O resumo é obrigatório';
    const plainTextContent = formData.conteudo.replace(/<[^>]*>?/gm, '').trim();
    if (!plainTextContent) newErrors.conteudo = 'O conteúdo é obrigatório';
    if (formData.categorias.length === 0) newErrors.categorias = 'Selecione pelo menos uma categoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerMessage(null);
    if (!validateForm()) return;

    setIsLoading(true);
    let finalImageUrl = formData.imagem_destaque_url; // Começa com a URL atual

    // 1. Upload da NOVA imagem (se houver)
    if (selectedImageFile) {
      setIsUploading(true);
      const fileExtension = selectedImageFile.name.split('.').pop() || 'png';
      const safeSlug = formData.slug || `post-${postId}`;
      const fileName = `${safeSlug}-${Date.now()}.${fileExtension}`;
      const filePath = `blog-post/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('lorena-images-db') // <<< SEU BUCKET CORRETO
          .upload(filePath, selectedImageFile, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('lorena-images-db') // <<< SEU BUCKET CORRETO
          .getPublicUrl(filePath);

        if (!urlData?.publicUrl) throw new Error("URL pública não encontrada após upload.");

        finalImageUrl = urlData.publicUrl; // Define a nova URL
        setIsUploading(false);
      } catch (error: any) {
        console.error('Erro no upload da imagem (editar):', error);
        setServerMessage({ type: 'error', text: `Erro no upload: ${error.message}` });
        setIsUploading(false);
        setIsLoading(false);
        return;
      }
    }

    // 2. Preparar payload para a Server Action
    const { like_count, view_count, ...payloadBase } = formData; // Remove contadores
    const payload = {
      ...payloadBase,
      imagem_destaque_url: finalImageUrl, // Envia a URL final (nova ou a antiga mantida)
    };

    // 3. Chamar a Server Action updatePost, passando a URL original para possível deleção
    try {
      const result = await updatePost(postId, payload, originalImageUrl); // Passa originalImageUrl

      if (result.success) {
        setServerMessage({ type: 'success', text: result.message || "Post atualizado!" });
        setOriginalImageUrl(finalImageUrl); // Atualiza a URL original no estado
        setSelectedImageFile(null); // Limpa o arquivo selecionado
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current); // Limpa preview local
        setPreviewUrl(null);
        setTimeout(() => router.push('/admin/blog'), 1500);
      } else {
        setServerMessage({ type: 'error', text: result.message || "Falha ao atualizar." });
        // Se o update falhou APÓS um NOVO upload ter sido feito, deleta a imagem recém-enviada
        if (selectedImageFile && finalImageUrl !== originalImageUrl) {
          console.warn("Update falhou após upload. Removendo imagem nova:", finalImageUrl);
          const pathToDelete = finalImageUrl?.split('/lorena-images-db/')[1];
          if (pathToDelete) {
            await supabase.storage.from('lorena-images-db').remove([pathToDelete]);
          }
        }
      }
    } catch (error: any) {
      console.error('Erro ao chamar updatePost:', error);
      setServerMessage({ type: 'error', text: "Erro inesperado ao salvar." });
       // Deletar imagem nova em caso de erro inesperado também
        if (selectedImageFile && finalImageUrl !== originalImageUrl) {
          console.warn("Erro inesperado após upload. Removendo imagem nova:", finalImageUrl);
          const pathToDelete = finalImageUrl?.split('/lorena-images-db/')[1];
          if (pathToDelete) {
            await supabase.storage.from('lorena-images-db').remove([pathToDelete]);
          }
        }
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300">Editar Post</h1>
        <Link href="/admin/blog" className="text-purple-600 hover:text-purple-800 font-medium underline">
          Cancelar e voltar
        </Link>
      </div>

      {serverMessage && (
        <div className={`p-3 my-4 rounded-md text-sm ${serverMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {serverMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-md divide-y divide-gray-300">
          {/* Informações básicas */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 pb-2 border-b border-purple-200">Informações Básicas</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Título */}
              <div className="sm:col-span-4">
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-800">Título</label>
                <div className="mt-1">
                  <input type="text" name="titulo" id="titulo" value={formData.titulo} onChange={handleChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-400 rounded-md bg-white text-gray-800 ${errors.titulo ? 'border-red-300' : ''}`} />
                  {errors.titulo && (<p className="mt-1 text-sm text-red-600">{errors.titulo}</p>)}
                </div>
              </div>

              {/* Slug */}
              <div className="sm:col-span-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-800">Slug</label>
                <div className="mt-1">
                  <input type="text" name="slug" id="slug" value={formData.slug} onChange={handleChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-400 rounded-md bg-white text-gray-800 ${errors.slug ? 'border-red-300' : ''}`} />
                  {errors.slug && (<p className="mt-1 text-sm text-red-600">{errors.slug}</p>)}
                </div>
                <p className="mt-1 text-sm text-gray-600 font-medium">URL amigável do post. Cuidado ao alterar.</p>
              </div>

              {/* Resumo */}
              <div className="sm:col-span-6">
                <label htmlFor="resumo" className="block text-sm font-medium text-gray-800">Resumo</label>
                <div className="mt-1">
                  <textarea id="resumo" name="resumo" rows={3} value={formData.resumo} onChange={handleChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-400 rounded-md bg-white text-gray-800 ${errors.resumo ? 'border-red-300' : ''}`} />
                  {errors.resumo && (<p className="mt-1 text-sm text-red-600">{errors.resumo}</p>)}
                </div>
                <p className="mt-1 text-sm text-gray-600 font-medium">Breve descrição do post.</p>
              </div>

              {/* Categorias */}
              <div className="sm:col-span-4">
                <label htmlFor="categorias" className="block text-sm font-medium text-gray-800">Categorias</label>
                <div className="mt-1">
                  <select id="categorias" name="categorias" multiple value={formData.categorias} onChange={handleCategoryChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-400 rounded-md bg-white text-gray-800 ${errors.categorias ? 'border-red-300' : ''}`} size={5}>
                    {blogCategoriesOptions.map((categoria: BlogCategoryFromDB) => (
                      <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                    ))}
                  </select>
                  {errors.categorias && (<p className="mt-1 text-sm text-red-600">{errors.categorias}</p>)}
                </div>
                <p className="mt-1 text-sm text-gray-600 font-medium">Segure CTRL (ou Command) para selecionar múltiplas.</p>
              </div>

              {/* Status de Publicação */}
              <div className="sm:col-span-2 flex items-end">
                <div className="flex items-center h-full">
                  <input id="is_published" name="is_published" type="checkbox" checked={formData.is_published} onChange={handleChange} className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"/>
                  <label htmlFor="is_published" className="ml-2 block text-sm font-medium text-gray-800">Publicar Post</label>
                </div>
              </div>
            </div>
          </div>

          {/* Imagem de destaque */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 pb-2 border-b border-purple-200">Imagem de Destaque</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-800">Imagem</label>
                <div className="mt-1 flex items-center">
                   {/* Mostra preview da nova imagem OU a imagem atual salva */}
                  {(previewUrl || formData.imagem_destaque_url) ? (
                    <div className="relative">
                      <div className="w-40 h-40 rounded-md overflow-hidden bg-gray-100">
                        <Image
                           src={previewUrl || formData.imagem_destaque_url!} // Prioriza o preview local
                           alt="Preview da imagem"
                           width={160} height={160}
                           className="w-full h-full object-cover"
                           key={previewUrl || formData.imagem_destaque_url} // Força re-render se URL mudar
                         />
                      </div>
                      <button type="button" onClick={handleRemoveImage} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 focus:outline-none" title="Remover imagem">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div className="w-40 h-40 flex justify-center items-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <label htmlFor="image-upload" className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">Selecionar nova imagem</label>
                        <input id="image-upload" name="image-upload" type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="sr-only" />
                      </div>
                    </div>
                  )}
                   {/* Feedback de Upload */}
                   {isUploading && <p className="mt-2 text-sm text-purple-600">Enviando imagem...</p>}
                </div>
                {errors.imagem_destaque_url && (<p className="mt-1 text-sm text-red-600">{errors.imagem_destaque_url}</p>)}
                <p className="mt-1 text-sm text-gray-600 font-medium">Recomendado: 1200 x 630 pixels.</p>
              </div>
            </div>
          </div>

          {/* Conteúdo do post */}
          <div className="p-6 bg-gray-50">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 pb-2 border-b border-purple-200">Conteúdo e Estilo</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="conteudo" className="block text-sm font-medium text-gray-800">Conteúdo</label>
                <div className="mt-1">
                   {/* Passa o conteúdo inicial para o editor */}
                   {isFetching ? (
                     <div className="p-4 border border-gray-300 rounded-md shadow-sm bg-white min-h-[478px] animate-pulse"></div>
                   ) : (
                     <RichTextEditor initialContent={formData.conteudo} onChange={handleContentChange}/>
                   )}
                  {errors.conteudo && (<p className="mt-1 text-sm text-red-600">{errors.conteudo}</p>)}
                </div>
                <p className="mt-1 text-sm text-gray-600 font-medium">Use a barra de ferramentas para formatar.</p>
              </div>
            </div>
          </div>

          {/* Estatísticas do Post */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 pb-2 border-b border-purple-200">Estatísticas</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-800">Curtidas</label>
                <p className="mt-1 text-lg text-gray-900">{formData.like_count}</p>
              </div>
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-800">Visualizações</label>
                <p className="mt-1 text-lg text-gray-900">{formData.view_count}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-5">
          <Link href="/admin/blog" className="px-4 py-2 border border-gray-400 rounded-md shadow-sm text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${ (isLoading || isUploading) ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}>
            {(isLoading || isUploading) ? (
              <div className="flex items-center">
                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 <span>{isUploading ? 'Enviando Imagem...' : 'Salvando...'}</span>
              </div>
            ) : (
              formData.is_published ? 'Atualizar e Publicar' : 'Salvar Rascunho'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}