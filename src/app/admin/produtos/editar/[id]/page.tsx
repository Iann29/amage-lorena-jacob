"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { adminApi } from '@/lib/admin-api';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditarProdutoPage({ params }: PageProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [productId, setProductId] = useState<string>('');
  const [categories, setCategories] = useState<Array<{ id: string; nome: string }>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existingImages, setExistingImages] = useState<Array<{ id: string; image_url: string; is_primary: boolean }>>([]);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    preco_promocional: '',
    quantidade_estoque: '',
    category_id: '',
    idade_min: '0',
    idade_max: '12',
    tags: '',
    is_active: true
  });

  const [newImages, setNewImages] = useState<{
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

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      setProductId(resolvedParams.id);
      
      try {
        // Carregar categorias
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('id, nome')
          .eq('is_active', true)
          .order('nome');
        
        if (categoriesData) {
          setCategories(categoriesData);
        }

        // Carregar produto
        const product = await adminApi.getProduct(resolvedParams.id);
        
        setFormData({
          nome: product.nome,
          descricao: product.descricao || '',
          preco: product.preco.toString(),
          preco_promocional: product.preco_promocional ? product.preco_promocional.toString() : '',
          quantidade_estoque: product.quantidade_estoque.toString(),
          category_id: product.category_id || '',
          idade_min: product.idade_min ? product.idade_min.toString() : '0',
          idade_max: product.idade_max ? product.idade_max.toString() : '12',
          tags: product.tags ? product.tags.join(', ') : '',
          is_active: product.is_active
        });

        // Carregar imagens existentes
        if (product.images && product.images.length > 0) {
          setExistingImages(product.images);
          const primaryImage = product.images.find((img: any) => img.is_primary);
          if (primaryImage) {
            setPreviewUrls(prev => ({ ...prev, principal: primaryImage.image_url }));
          }
          const galleryImages = product.images
            .filter((img: any) => !img.is_primary)
            .map((img: any) => img.image_url);
          setPreviewUrls(prev => ({ ...prev, galeria: galleryImages }));
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        alert('Erro ao carregar produto');
        router.push('/admin/produtos');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [params, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'principal' | 'galeria') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'principal' && files[0]) {
      setNewImages(prev => ({ ...prev, principal: files[0] }));
      const url = URL.createObjectURL(files[0]);
      setPreviewUrls(prev => ({ ...prev, principal: url }));
    } else if (type === 'galeria') {
      const newFiles = Array.from(files);
      setNewImages(prev => ({ ...prev, galeria: [...prev.galeria, ...newFiles] }));
      const urls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => ({ ...prev, galeria: [...prev.galeria, ...urls] }));
    }
  };

  const removeExistingImage = async (imageUrl: string) => {
    setExistingImages(prev => prev.filter(img => img.image_url !== imageUrl));
    setPreviewUrls(prev => ({
      ...prev,
      principal: prev.principal === imageUrl ? null : prev.principal,
      galeria: prev.galeria.filter(url => url !== imageUrl)
    }));
  };

  const removeGalleryImage = (index: number) => {
    setNewImages(prev => ({
      ...prev,
      galeria: prev.galeria.filter((_, i) => i !== index)
    }));
    
    // Remover a URL de preview correspondente
    const currentGalleryUrls = previewUrls.galeria.filter(url => !existingImages.some(img => img.image_url === url));
    currentGalleryUrls.splice(index, 1);
    
    setPreviewUrls(prev => ({
      ...prev,
      galeria: [...existingImages.filter(img => !img.is_primary).map(img => img.image_url), ...currentGalleryUrls]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.preco || parseFloat(formData.preco) <= 0) newErrors.preco = 'Preço deve ser maior que zero';
    if (!formData.quantidade_estoque || parseInt(formData.quantidade_estoque) < 0) newErrors.quantidade_estoque = 'Estoque não pode ser negativo';
    if (!formData.category_id) newErrors.category_id = 'Categoria é obrigatória';
    
    // Validar preço promocional se preenchido
    if (formData.preco_promocional && parseFloat(formData.preco_promocional) >= parseFloat(formData.preco)) {
      newErrors.preco_promocional = 'Preço promocional deve ser menor que o preço normal';
    }
    
    // Validar faixa etária
    if (parseInt(formData.idade_min) > parseInt(formData.idade_max)) {
      newErrors.idade_min = 'Idade mínima não pode ser maior que a idade máxima';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      // Upload das novas imagens
      const uploadedImages: Array<{ url?: string; image_url?: string; is_primary?: boolean }> = [];
      
      // Manter imagens existentes
      uploadedImages.push(...existingImages);
      
      if (newImages.principal) {
        setIsUploading(true);
        const fileExt = newImages.principal.name.split('.').pop();
        const fileName = `${Date.now()}-principal.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('lorena-images-db')
          .upload(filePath, newImages.principal);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('lorena-images-db')
          .getPublicUrl(filePath);
          
        // Remover imagem principal antiga se houver uma nova
        const oldPrincipalIndex = uploadedImages.findIndex(img => img.is_primary);
        if (oldPrincipalIndex >= 0) {
          const oldImageUrl = uploadedImages[oldPrincipalIndex].image_url;
          if (oldImageUrl) {
            const pathToDelete = oldImageUrl.split('/lorena-images-db/')[1];
            if (pathToDelete) {
              await supabase.storage.from('lorena-images-db').remove([pathToDelete]);
            }
          }
          uploadedImages.splice(oldPrincipalIndex, 1);
        }
        
        uploadedImages.push({ url: urlData.publicUrl, is_primary: true });
      }
      
      // Upload das imagens da galeria
      for (let i = 0; i < newImages.galeria.length; i++) {
        const file = newImages.galeria[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${i}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('lorena-images-db')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('lorena-images-db')
          .getPublicUrl(filePath);
          
        uploadedImages.push({ url: urlData.publicUrl, is_primary: false });
      }
      
      setIsUploading(false);
      
      // Atualizar produto
      const productData = {
        nome: formData.nome,
        descricao: formData.descricao || null,
        preco: parseFloat(formData.preco),
        preco_promocional: formData.preco_promocional ? parseFloat(formData.preco_promocional) : null,
        quantidade_estoque: parseInt(formData.quantidade_estoque),
        category_id: formData.category_id || null,
        idade_min: parseInt(formData.idade_min),
        idade_max: parseInt(formData.idade_max),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        is_active: formData.is_active,
        images: uploadedImages
      };
      
      await adminApi.updateProduct(productId, productData);
      
      alert('Produto atualizado com sucesso!');
      router.push('/admin/produtos');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto. Tente novamente.');
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsSaving(true);
    
    try {
      // Buscar todas as imagens do produto para deletar do bucket
      const product = await adminApi.getProduct(productId);
      
      if (product.images && product.images.length > 0) {
        const imagePaths = product.images.map((img: any) => {
          const url = img.image_url;
          const path = url.split('/lorena-images-db/')[1];
          return path;
        }).filter(Boolean);
        
        if (imagePaths.length > 0) {
          await supabase.storage.from('lorena-images-db').remove(imagePaths);
        }
      }
      
      // Deletar produto (que também deletará as referências de imagens no banco)
      await adminApi.deleteProduct(productId);
      
      alert('Produto excluído com sucesso!');
      router.push('/admin/produtos');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-3 text-purple-700">Carregando produto...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Editar Produto</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDelete}
              disabled={isSaving}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Excluir Produto
            </button>
            <Link
              href="/admin/produtos"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Voltar para produtos
            </Link>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">Fazendo upload das imagens...</p>
        </div>
      )}

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
                    className={`w-full px-3 py-2 border ${errors.nome ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-600`}
                  />
                  {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
                </div>

                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    rows={4}
                    value={formData.descricao}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-600"
                    placeholder="Descrição completa do produto..."
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
                    Preço (R$) *
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
                    className={`w-full px-3 py-2 border ${errors.preco ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-600`}
                  />
                  {errors.preco && <p className="mt-1 text-sm text-red-600">{errors.preco}</p>}
                </div>

                <div>
                  <label htmlFor="quantidade_estoque" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade em Estoque *
                  </label>
                  <input
                    type="number"
                    id="quantidade_estoque"
                    name="quantidade_estoque"
                    required
                    min="0"
                    value={formData.quantidade_estoque}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.quantidade_estoque ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-600`}
                  />
                  {errors.quantidade_estoque && <p className="mt-1 text-sm text-red-600">{errors.quantidade_estoque}</p>}
                  <p className="text-xs text-gray-500 mt-1">Para produtos digitais, use 999 para ilimitado</p>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-600"
                    placeholder="Deixe vazio se não houver promoção"
                  />
                  <p className="text-xs text-gray-500 mt-1">Preço com desconto (opcional)</p>
                </div>
              </div>
            </div>

            {/* Faixa Etária e Tags */}
            <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Adicionais</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="idade_min" className="block text-sm font-medium text-gray-700 mb-1">
                      Idade Mínima
                    </label>
                    <input
                      type="number"
                      id="idade_min"
                      name="idade_min"
                      min="0"
                      max="99"
                      value={formData.idade_min}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">Idade mínima recomendada</p>
                  </div>

                  <div>
                    <label htmlFor="idade_max" className="block text-sm font-medium text-gray-700 mb-1">
                      Idade Máxima
                    </label>
                    <input
                      type="number"
                      id="idade_max"
                      name="idade_max"
                      min="0"
                      max="99"
                      value={formData.idade_max}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">Idade máxima recomendada</p>
                  </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-600"
                    placeholder="autismo, desenvolvimento, coordenação motora"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separe as tags por vírgula</p>
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
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    required
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.category_id ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-600`}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                  {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Produto ativo</span>
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
                          // Se for uma imagem existente, remover da lista
                          const existingImg = existingImages.find(img => img.image_url === previewUrls.principal && img.is_primary);
                          if (existingImg && previewUrls.principal) {
                            removeExistingImage(previewUrls.principal);
                          } else {
                            // Se for uma nova imagem, limpar
                            setNewImages(prev => ({ ...prev, principal: null }));
                            setPreviewUrls(prev => ({ ...prev, principal: null }));
                          }
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
                    {previewUrls.galeria.map((url, index) => {
                      const isExisting = existingImages.some(img => img.image_url === url);
                      return (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (isExisting) {
                                removeExistingImage(url);
                              } else {
                                // Calcular o índice correto para imagens novas
                                const newImagesStartIndex = existingImages.filter(img => !img.is_primary).length;
                                const newImageIndex = index - newImagesStartIndex;
                                if (newImageIndex >= 0) {
                                  removeGalleryImage(newImageIndex);
                                }
                              }
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
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

            {/* Informações do Produto */}
            <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-gray-700">ID:</span> <span className="text-gray-900 text-xs">{productId}</span></p>
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
            disabled={isSaving}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}