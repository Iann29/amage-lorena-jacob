"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { blogCategorias } from '@/lib/mockData';
import SimpleBlogEditor from '@/components/admin/SimpleBlogEditor';

export default function NovoBlogPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: '',
    slug: '',
    resumo: '',
    conteudo: '',
    categorias: [] as number[],
    imagem_destaque_url: ''
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para gerar slug a partir do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  // Função para lidar com a mudança de valores no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Se o campo modificado for o título, gerar slug automaticamente
    if (name === 'titulo') {
      setFormData({
        ...formData,
        titulo: value,
        slug: generateSlug(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Limpar erro específico ao editar o campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Função para lidar com seleção de categorias (múltipla)
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
    setFormData({
      ...formData,
      categorias: selectedOptions
    });
    
    // Limpar erro de categorias
    if (errors.categorias) {
      setErrors({
        ...errors,
        categorias: ''
      });
    }
  };

  // Função para lidar com upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Em produção, aqui teríamos o upload para o Supabase Storage
    // Por enquanto, vamos apenas criar uma URL local para o arquivo
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      setFormData({
        ...formData,
        imagem_destaque_url: result
      });
    };
    reader.readAsDataURL(file);
    
    // Limpar erro de imagem
    if (errors.imagem_destaque_url) {
      setErrors({
        ...errors,
        imagem_destaque_url: ''
      });
    }
  };

  // Função para remover a imagem selecionada
  const handleRemoveImage = () => {
    setPreviewUrl('');
    setFormData({
      ...formData,
      imagem_destaque_url: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Função para validar o formulário
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validar campos obrigatórios
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'O título é obrigatório';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'O slug é obrigatório';
    }
    
    if (!formData.resumo.trim()) {
      newErrors.resumo = 'O resumo é obrigatório';
    }
    
    if (!formData.conteudo.trim()) {
      newErrors.conteudo = 'O conteúdo é obrigatório';
    }
    
    if (formData.categorias.length === 0) {
      newErrors.categorias = 'Selecione pelo menos uma categoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar o formulário
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Em produção, aqui teríamos o envio para o Supabase
      // Por enquanto, vamos apenas simular o envio
      console.log('Dados do post a serem enviados:', formData);
      
      // Simular um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirecionar para a lista de posts
      router.push('/admin/blog');
    } catch (error) {
      console.error('Erro ao criar post:', error);
      alert('Ocorreu um erro ao criar o post. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300">Novo Post</h1>
        <Link
          href="/admin/blog"
          className="text-purple-600 hover:text-purple-800 font-medium underline"
        >
          Cancelar e voltar
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-md divide-y divide-gray-300">
          {/* Informações básicas */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 pb-2 border-b border-purple-200">Informações Básicas</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Título */}
              <div className="sm:col-span-4">
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-800">
                  Título
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="titulo"
                    id="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-400 rounded-md bg-white text-gray-800 ${errors.titulo ? 'border-red-300' : ''}`}
                  />
                  {errors.titulo && (
                    <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
                  )}
                </div>
              </div>
              
              {/* Slug */}
              <div className="sm:col-span-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-800">
                  Slug
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-400 rounded-md bg-white text-gray-800 ${errors.slug ? 'border-red-300' : ''}`}
                  />
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600 font-medium">
                  URL amigável do post. Será gerada automaticamente a partir do título, mas pode ser editada.
                </p>
              </div>
              
              {/* Resumo */}
              <div className="sm:col-span-6">
                <label htmlFor="resumo" className="block text-sm font-medium text-gray-800">
                  Resumo
                </label>
                <div className="mt-1">
                  <textarea
                    id="resumo"
                    name="resumo"
                    rows={3}
                    value={formData.resumo}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-400 rounded-md bg-white text-gray-800 ${errors.resumo ? 'border-red-300' : ''}`}
                  />
                  {errors.resumo && (
                    <p className="mt-1 text-sm text-red-600">{errors.resumo}</p>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600 font-medium">
                  Breve descrição do post que aparecerá nos cards e nas previews.
                </p>
              </div>
              
              {/* Categorias */}
              <div className="sm:col-span-4">
                <label htmlFor="categorias" className="block text-sm font-medium text-gray-800">
                  Categorias
                </label>
                <div className="mt-1">
                  <select
                    id="categorias"
                    name="categorias"
                    multiple
                    value={formData.categorias.map(String)}
                    onChange={handleCategoryChange}
                    className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-400 rounded-md bg-white text-gray-800 ${errors.categorias ? 'border-red-300' : ''}`}
                    size={5}
                  >
                    {blogCategorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                  {errors.categorias && (
                    <p className="mt-1 text-sm text-red-600">{errors.categorias}</p>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600 font-medium">
                  Segure CTRL (ou Command no Mac) para selecionar múltiplas categorias.
                </p>
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
                  {previewUrl ? (
                    <div className="relative">
                      <div className="w-40 h-40 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={previewUrl}
                          alt="Preview da imagem"
                          width={160}
                          height={160}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 focus:outline-none"
                        title="Remover imagem"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div className="w-40 h-40 flex justify-center items-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      
                      <div>
                        <label htmlFor="image-upload" className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                          Selecionar imagem
                        </label>
                        <input 
                          id="image-upload" 
                          name="image-upload" 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          ref={fileInputRef}
                          className="sr-only" 
                        />
                      </div>
                    </div>
                  )}
                </div>
                {errors.imagem_destaque_url && (
                  <p className="mt-1 text-sm text-red-600">{errors.imagem_destaque_url}</p>
                )}
                <p className="mt-1 text-sm text-gray-600 font-medium">
                  Recomendado: imagem de 1200 x 630 pixels para melhor visualização.
                </p>
              </div>
            </div>
          </div>
          
          {/* Conteúdo do post */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 pb-2 border-b border-purple-200">Conteúdo do Post</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="conteudo" className="block text-sm font-medium text-gray-800">
                  Conteúdo
                </label>
                <div className="mt-1">
                  <SimpleBlogEditor
                    initialValue={formData.conteudo}
                    onChange={(content) => {
                      setFormData({
                        ...formData,
                        conteudo: content
                      });
                      
                      // Limpar erro de conteúdo se existir
                      if (errors.conteudo) {
                        setErrors({
                          ...errors,
                          conteudo: ''
                        });
                      }
                    }}
                    postTitle={formData.titulo}
                    postSubtitle={formData.resumo}
                    postImageUrl={previewUrl}
                    authorName="Lorena Jacob"
                  />
                  {errors.conteudo && (
                    <p className="mt-1 text-sm text-red-600">{errors.conteudo}</p>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600 font-medium">
                  Use os botões do editor para formatar seu texto facilmente. Você também pode inserir HTML diretamente se preferir.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Botões de ação */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/blog"
            className="px-4 py-2 border border-gray-400 rounded-md shadow-sm text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Salvando...</span>
              </div>
            ) : (
              'Publicar Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
