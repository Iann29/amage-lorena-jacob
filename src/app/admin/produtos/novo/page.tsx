"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

export default function NovoProdutoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    descricao_completa: '',
    preco: '',
    preco_promocional: '',
    estoque: '',
    categoria: '',
    tipo_produto: 'digital',
    ativo: true,
    destaque: false,
    peso: '',
    dimensoes: {
      comprimento: '',
      largura: '',
      altura: ''
    },
    tags: '',
    meta_title: '',
    meta_description: ''
  });

  const [images, setImages] = useState<{
    principal: File | null;
    galeria: File[];
  }>({
    principal: null,
    galeria: []
  });

  const [previewUrls, setPreviewUrls] = useState<{
    principal: string | null;
    galeria: string[];
  }>({
    principal: null,
    galeria: []
  });

  const categories = ['E-books', 'Cursos', 'Mentorias', 'Áudios', 'Workshops'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'principal' | 'galeria') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'principal' && files[0]) {
      setImages(prev => ({ ...prev, principal: files[0] }));
      const url = URL.createObjectURL(files[0]);
      setPreviewUrls(prev => ({ ...prev, principal: url }));
    } else if (type === 'galeria') {
      const newFiles = Array.from(files);
      setImages(prev => ({ ...prev, galeria: [...prev.galeria, ...newFiles] }));
      const urls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => ({ ...prev, galeria: [...prev.galeria, ...urls] }));
    }
  };

  const removeGalleryImage = (index: number) => {
    setImages(prev => ({
      ...prev,
      galeria: prev.galeria.filter((_, i) => i !== index)
    }));
    setPreviewUrls(prev => ({
      ...prev,
      galeria: prev.galeria.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Produto criado com sucesso!');
    router.push('/admin/produtos');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Novo Produto</h1>
          <Link
            href="/admin/produtos"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Voltar para produtos
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição Curta
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    rows={3}
                    value={formData.descricao}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Breve descrição do produto..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição Completa
                  </label>
                  <RichTextEditor
                    value={formData.descricao_completa}
                    onChange={(content) => setFormData(prev => ({ ...prev, descricao_completa: content }))}
                  />
                </div>
              </div>
            </div>

            {/* Preços e Estoque */}
            <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preços e Estoque</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Regular (R$) *
                  </label>
                  <input
                    type="number"
                    id="preco"
                    name="preco"
                    required
                    step="0.01"
                    min="0"
                    value={formData.preco}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="preco_promocional" className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Promocional (R$)
                  </label>
                  <input
                    type="number"
                    id="preco_promocional"
                    name="preco_promocional"
                    step="0.01"
                    min="0"
                    value={formData.preco_promocional}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="estoque" className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque *
                  </label>
                  <input
                    type="number"
                    id="estoque"
                    name="estoque"
                    required
                    min="0"
                    value={formData.estoque}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Para produtos digitais, use 999 para ilimitado</p>
                </div>

                <div>
                  <label htmlFor="tipo_produto" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Produto
                  </label>
                  <select
                    id="tipo_produto"
                    name="tipo_produto"
                    value={formData.tipo_produto}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="digital">Digital</option>
                    <option value="fisico">Físico</option>
                    <option value="servico">Serviço</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Frete (apenas para produtos físicos) */}
            {formData.tipo_produto === 'fisico' && (
              <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações de Frete</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      id="peso"
                      name="peso"
                      step="0.001"
                      min="0"
                      value={formData.peso}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dimensões (cm)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        name="dimensoes.comprimento"
                        placeholder="Comp."
                        step="0.1"
                        min="0"
                        value={formData.dimensoes.comprimento}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="number"
                        name="dimensoes.largura"
                        placeholder="Larg."
                        step="0.1"
                        min="0"
                        value={formData.dimensoes.largura}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="number"
                        name="dimensoes.altura"
                        placeholder="Alt."
                        step="0.1"
                        min="0"
                        value={formData.dimensoes.altura}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEO */}
            <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="meta_title"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Título para mecanismos de busca"
                  />
                </div>

                <div>
                  <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    id="meta_description"
                    name="meta_description"
                    rows={3}
                    value={formData.meta_description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Descrição para mecanismos de busca"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            {/* Status e Categoria */}
            <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status e Organização</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    required
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Separadas por vírgula"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="ativo"
                      checked={formData.ativo}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Produto ativo</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="destaque"
                      checked={formData.destaque}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Produto em destaque</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Imagens */}
            <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagens</h2>
              
              <div className="space-y-4">
                {/* Imagem Principal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem Principal
                  </label>
                  {previewUrls.principal ? (
                    <div className="relative">
                      <img
                        src={previewUrls.principal}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImages(prev => ({ ...prev, principal: null }));
                          setPreviewUrls(prev => ({ ...prev, principal: null }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">Clique para enviar</p>
                        <p className="text-xs text-gray-500">PNG, JPG até 10MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'principal')}
                      />
                    </label>
                  )}
                </div>

                {/* Galeria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Galeria de Imagens
                  </label>
                  <div className="space-y-2">
                    {previewUrls.galeria.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <label className="flex items-center justify-center w-full py-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <svg className="w-6 h-6 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm text-gray-600">Adicionar imagens</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageChange(e, 'galeria')}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/admin/produtos"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Salvando...' : 'Criar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
}