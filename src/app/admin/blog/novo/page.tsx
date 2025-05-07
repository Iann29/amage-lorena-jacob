// src/app/admin/blog/novo/page.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { createPost, getBlogCategories } from '../actions';
import { createClient } from '@/utils/supabase/client'; // Importar cliente Supabase

interface CategoryOption {
  id: string;
  nome: string;
}

export default function NovoBlogPostPage() {
  const router = useRouter();
  const supabase = createClient(); // Instanciar cliente
  const [formData, setFormData] = useState({
    titulo: '',
    slug: '',
    resumo: '',
    conteudo: '',
    categorias: [] as string[],
    imagem_destaque_url: '', // Guarda a URL final vinda do storage
    is_published: false,
  });
  const [blogCategoriesOptions, setBlogCategoriesOptions] = useState<CategoryOption[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Para preview local via ObjectURL
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null); // Estado para o arquivo selecionado
  const [isUploading, setIsUploading] = useState(false); // Estado para feedback de upload
  const [isLoading, setIsLoading] = useState(false); // Loading geral do submit
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [serverMessage, setServerMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null); // Ref para gerenciar ObjectURL

  useEffect(() => {
    async function loadCategories() {
      const categories = await getBlogCategories();
      setBlogCategoriesOptions(categories || []);
    }
    loadCategories();

    // Limpar URL de objeto ao desmontar o componente
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const generateSlug = (title: string) => {
    return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      if (name === 'titulo') {
        // Gera slug automaticamente apenas se o campo slug estiver vazio ou for igual ao slug anterior do título
        setFormData(prev => ({ ...prev, titulo: value, slug: generateSlug(value) }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleContentChange = useCallback((htmlContent: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      conteudo: htmlContent
    }));
    if (errors.conteudo) {
      setErrors(prevErrors => ({ ...prevErrors, conteudo: '' }));
    }
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
      setPreviewUrl(null);
      return;
    }

    setSelectedImageFile(file); // Guarda o ARQUIVO no estado

    // Limpa URL de objeto anterior se existir
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    // Gera URL local para preview e guarda a referência
    const localPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = localPreviewUrl;
    setPreviewUrl(localPreviewUrl);

    // Limpa o erro da imagem, se houver
    if (errors.imagem_destaque_url) setErrors(prev => ({ ...prev, imagem_destaque_url: '' }));
  };

  const handleRemoveImage = () => { // Não precisa ser async aqui, pois não há imagem salva ainda
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current); // Limpa memória
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setSelectedImageFile(null);
    // Limpa a URL no formData, embora em 'novo' ela provavelmente já esteja vazia
    setFormData(prev => ({ ...prev, imagem_destaque_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.titulo.trim()) newErrors.titulo = 'O título é obrigatório';
    if (!formData.slug.trim()) newErrors.slug = 'O slug é obrigatório';
    if (!formData.resumo.trim()) newErrors.resumo = 'O resumo é obrigatório';
    const plainTextContent = formData.conteudo.replace(/<[^>]*>?/gm, '').trim();
    if (!plainTextContent) newErrors.conteudo = 'O conteúdo é obrigatório';
    if (formData.categorias.length === 0) newErrors.categorias = 'Selecione pelo menos uma categoria';
    // if (!selectedImageFile) newErrors.imagem_destaque_url = 'Uma imagem de destaque é obrigatória.'; // Descomente se a imagem for obrigatória
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerMessage(null);
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    let finalImageUrl = ''; // Começa vazia para novo post

    // 1. Fazer upload da imagem SE uma foi selecionada
    if (selectedImageFile) {
      setIsUploading(true);
      const fileExtension = selectedImageFile.name.split('.').pop() || 'png'; // Default to png if no extension
      const safeSlug = formData.slug || `post-${Date.now()}`; // Fallback slug
      const fileName = `${safeSlug}-${Date.now()}.${fileExtension}`;
      const filePath = `blog-post/${fileName}`; // Salva na pasta 'blog-post/'

      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('lorena-images-db') // <<< SEU BUCKET CORRETO
          .upload(filePath, selectedImageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('lorena-images-db') // <<< SEU BUCKET CORRETO
          .getPublicUrl(filePath);

        if (!urlData || !urlData.publicUrl) {
           throw new Error("Não foi possível obter a URL pública da imagem após o upload.");
        }

        finalImageUrl = urlData.publicUrl;
        setIsUploading(false);

      } catch (error: any) {
        console.error('Erro no upload da imagem:', error);
        setServerMessage({type: 'error', text: `Erro no upload da imagem: ${error.message}`});
        setIsUploading(false);
        setIsLoading(false);
        return;
      }
    }

    // 2. Preparar o payload para a Server Action
    const payload = {
      ...formData,
      imagem_destaque_url: finalImageUrl || undefined, // Envia a URL ou undefined se não houver imagem
    };

    // 3. Chamar a Server Action createPost
    try {
      const result = await createPost(payload);

      if (result.success) {
        setServerMessage({type: 'success', text: result.message || "Post criado com sucesso!"});
        handleRemoveImage(); // Limpa preview e file state
        setFormData({ // Resetar form
          titulo: '', slug: '', resumo: '', conteudo: '', categorias: [], imagem_destaque_url: '', is_published: false
        });
        if (fileInputRef.current) fileInputRef.current.value = ''; // Limpa input file
        setTimeout(() => {
          router.push('/admin/blog');
        }, 1500);
      } else {
        setServerMessage({type: 'error', text: result.message || "Falha ao criar o post."});
        // Deletar imagem recém-enviada se o save falhou
        if (selectedImageFile && finalImageUrl) {
          console.warn("Criação do post falhou após upload. Tentando remover imagem do storage...");
          const pathToDelete = finalImageUrl.split('/lorena-images-db/')[1];
          if(pathToDelete) {
            await supabase.storage.from('lorena-images-db').remove([pathToDelete]);
            console.log("Imagem órfã removida do storage.");
          }
        }
      }
    } catch (error: any) {
      console.error('Erro ao chamar createPost:', error);
      setServerMessage({type: 'error', text: "Ocorreu um erro inesperado ao salvar o post."});
       // Deletar imagem recém-enviada em caso de erro inesperado
       if (selectedImageFile && finalImageUrl) {
          console.warn("Erro inesperado ao salvar post após upload. Tentando remover imagem...");
           const pathToDelete = finalImageUrl.split('/lorena-images-db/')[1];
           if(pathToDelete) {
             await supabase.storage.from('lorena-images-db').remove([pathToDelete]);
             console.log("Imagem órfã removida.");
           }
        }
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300">Novo Post</h1>
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
                  <input type="text" name="slug" id="slug" value={formData.slug} onChange={handleChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-400 rounded-md bg-white text-gray-800 ${errors.slug ? 'border-red-300' : ''}`} readOnly/> {/* Slug gerado automaticamente */}
                  {errors.slug && (<p className="mt-1 text-sm text-red-600">{errors.slug}</p>)}
                </div>
                <p className="mt-1 text-sm text-gray-600 font-medium">URL amigável (gerada automaticamente a partir do título).</p>
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
                  <select
                    id="categorias"
                    name="categorias"
                    multiple
                    value={formData.categorias}
                    onChange={handleCategoryChange}
                    className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-400 rounded-md bg-white text-gray-800 ${errors.categorias ? 'border-red-300' : ''}`}
                    size={5}
                  >
                    {blogCategoriesOptions.length === 0 && <option disabled>Carregando categorias...</option>}
                    {blogCategoriesOptions.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                  {errors.categorias && (<p className="mt-1 text-sm text-red-600">{errors.categorias}</p>)}
                </div>
                <p className="mt-1 text-sm text-gray-600 font-medium">Segure CTRL (ou Command) para selecionar múltiplas.</p>
              </div>

              {/* Status de Publicação */}
              <div className="sm:col-span-2 flex items-end">
                <div className="flex items-center h-full">
                  <input
                    id="is_published"
                    name="is_published"
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_published" className="ml-2 block text-sm font-medium text-gray-800">
                    Publicar Post
                  </label>
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
                  {previewUrl ? ( // Mostra preview local se existir
                    <div className="relative">
                      <div className="w-40 h-40 rounded-md overflow-hidden bg-gray-100">
                        <Image src={previewUrl} alt="Preview da imagem" width={160} height={160} className="w-full h-full object-cover"/>
                      </div>
                      <button type="button" onClick={handleRemoveImage} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 focus:outline-none" title="Remover imagem">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : ( // Senão, mostra placeholder e botão de upload
                    <div className="flex items-center space-x-4">
                      <div className="w-40 h-40 flex justify-center items-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <label htmlFor="image-upload" className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">Selecionar imagem</label>
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
            <h2 className="text-lg font-semibold text-purple-800 mb-4 pb-2 border-b border-purple-200">Conteúdo</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <div className="mt-1">
                  <RichTextEditor
                    initialContent={formData.conteudo}
                    onChange={handleContentChange}
                  />
                  {errors.conteudo && (
                    <p className="mt-1 text-sm text-red-600">{errors.conteudo}</p>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600 font-medium">
                  Use a barra de ferramentas para formatar o texto.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
         <div className="flex justify-end space-x-4 pt-5">
          <Link
            href="/admin/blog"
            className="px-4 py-2 border border-gray-400 rounded-md shadow-sm text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading || isUploading} // Desabilita se estiver carregando ou fazendo upload
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              (isLoading || isUploading) ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
          >
            {(isLoading || isUploading) ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{isUploading ? 'Enviando Imagem...' : 'Salvando Post...'}</span>
              </div>
            ) : (
              formData.is_published ? 'Publicar Post' : 'Salvar Rascunho'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}