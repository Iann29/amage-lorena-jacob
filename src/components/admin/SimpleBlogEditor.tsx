"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SimpleBlogEditorProps {
  initialValue: string;
  onChange: (content: string) => void;
}

export default function SimpleBlogEditor({ initialValue, onChange }: SimpleBlogEditorProps) {
  const [content, setContent] = useState(initialValue);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Atualiza o content quando o initialValue muda
    if (initialValue !== content) {
      setContent(initialValue);
    }
  }, [initialValue]);

  // Função para atualizar o conteúdo e chamar o callback
  const updateContent = (newContent: string) => {
    setContent(newContent);
    onChange(newContent);
  };

  // Funções para adicionar formatação de texto
  const addFormatting = (tag: string, placeholder: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    const content = selectedText || placeholder;
    const newText = `${before}<${tag}>${content}</${tag}>${after}`;
    
    updateContent(newText);
    
    // Ajustar o cursor ou seleção após a inserção
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + tag.length + 2, start + tag.length + 2 + content.length);
      } else {
        const newCursorPos = start + tag.length + 2;
        textarea.setSelectionRange(newCursorPos, newCursorPos + placeholder.length);
      }
    }, 0);
  };

  // Função para adicionar uma lista
  const addList = (type: 'ul' | 'ol') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const selectedText = textarea.value.substring(start, textarea.selectionEnd);
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(textarea.selectionEnd);

    let items = '';
    if (selectedText) {
      // Se tiver seleção, tenta dividir por linhas
      items = selectedText.split('\n')
        .map(item => item.trim())
        .filter(item => item)
        .map(item => `  <li>${item}</li>`)
        .join('\n');
    } else {
      items = '  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>';
    }

    const newText = `${before}<${type}>\n${items}\n</${type}>${after}`;
    updateContent(newText);
  };

  // Função para inserir imagem
  const insertImage = () => {
    if (!imageUrl) return;
    
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(start);
    
    const imageTag = `<img src="${imageUrl}" alt="Imagem" style="max-width: 100%; height: auto;" />`;
    const newText = `${before}${imageTag}${after}`;
    
    updateContent(newText);
    setShowImageDialog(false);
    setImageUrl('');
  };

  // Função para lidar com o upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Em produção, enviaria a imagem para o Supabase Storage
    // Por enquanto, apenas cria uma URL local
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  // Adicionar modelo de artigo
  const addArticleTemplate = () => {
    const template = `<h2>Introdução</h2>
<p>Escreva aqui uma introdução sobre o tema do seu artigo...</p>

<h2>Desenvolvimento</h2>
<p>Desenvolva suas ideias principais aqui...</p>

<h3>Subtópico 1</h3>
<p>Conteúdo do subtópico 1...</p>

<h3>Subtópico 2</h3>
<p>Conteúdo do subtópico 2...</p>

<h2>Conclusão</h2>
<p>Resuma suas principais conclusões aqui...</p>`;

    updateContent(template);
  };

  return (
    <div className="border border-gray-400 rounded-md overflow-hidden shadow-sm">
      {/* Barra de ferramentas */}
      <div className="bg-gray-100 border-b border-gray-400 p-2 flex flex-wrap gap-1">
        <button 
          type="button"
          onClick={() => addFormatting('p', 'Escreva seu parágrafo aqui')}
          className="p-1.5 rounded hover:bg-purple-100 text-gray-700 hover:text-purple-700"
          title="Parágrafo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        
        <button 
          type="button"
          onClick={() => addFormatting('h2', 'Título principal')}
          className="p-1.5 rounded hover:bg-purple-100 text-gray-700 hover:text-purple-700"
          title="Título (H2)"
        >
          <span className="font-bold text-base">H2</span>
        </button>
        
        <button 
          type="button"
          onClick={() => addFormatting('h3', 'Subtítulo')}
          className="p-1.5 rounded hover:bg-purple-100 text-gray-700 hover:text-purple-700"
          title="Subtítulo (H3)"
        >
          <span className="font-bold text-sm">H3</span>
        </button>
        
        <div className="h-6 w-px bg-gray-400 mx-1"></div>
        
        <button 
          type="button"
          onClick={() => addFormatting('strong', 'texto em negrito')}
          className="p-1.5 rounded hover:bg-purple-100 text-gray-700 hover:text-purple-700"
          title="Negrito"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.5 10a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button 
          type="button"
          onClick={() => addFormatting('em', 'texto em itálico')}
          className="p-1.5 rounded hover:bg-purple-100 text-gray-700 hover:text-purple-700"
          title="Itálico"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
            <path d="M10 8a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
        
        <div className="h-6 w-px bg-gray-400 mx-1"></div>
        
        <button 
          type="button"
          onClick={() => addList('ul')}
          className="p-1.5 rounded hover:bg-purple-100 text-gray-700 hover:text-purple-700"
          title="Lista com Marcadores"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
        
        <button 
          type="button"
          onClick={() => addList('ol')}
          className="p-1.5 rounded hover:bg-purple-100 text-gray-700 hover:text-purple-700"
          title="Lista Numerada"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
        
        <div className="h-6 w-px bg-gray-400 mx-1"></div>
        
        <button 
          type="button"
          onClick={() => setShowImageDialog(true)}
          className="p-1.5 rounded hover:bg-purple-100 text-gray-700 hover:text-purple-700"
          title="Inserir Imagem"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        
        <div className="h-6 w-px bg-gray-400 mx-1"></div>
        
        <button 
          type="button"
          onClick={addArticleTemplate}
          className="p-1.5 rounded hover:bg-purple-100 text-gray-700 hover:text-purple-700 text-xs font-medium"
          title="Inserir modelo de artigo"
        >
          Modelo de Artigo
        </button>
        
        <div className="flex-1"></div>
        
        <button 
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className={`p-1.5 rounded font-medium ${previewMode ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700 hover:bg-purple-100 hover:text-purple-700'}`}
          title={previewMode ? "Editar" : "Visualizar"}
        >
          {previewMode ? 'Modo Edição' : 'Visualizar'}
        </button>
      </div>
      
      {/* Editor / Preview */}
      {previewMode ? (
        <div 
          className="p-4 min-h-[400px] bg-white"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <textarea
          id="content-editor"
          value={content}
          onChange={(e) => updateContent(e.target.value)}
          className="w-full min-h-[400px] p-4 focus:outline-none focus:ring-0 border-0 text-gray-800 bg-white"
          placeholder="Comece a escrever seu conteúdo aqui... Você pode usar os botões acima para adicionar formatação."
        />
      )}
      
      {/* Modal de inserção de imagem */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-medium mb-4">Inserir Imagem</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload de Imagem
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-50 file:text-purple-700
                    hover:file:bg-purple-100"
                />
              </div>
              
              {selectedFile && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Preview:</p>
                  <div className="mt-1 w-full h-40 relative border border-gray-200 rounded">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowImageDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={insertImage}
                  disabled={!imageUrl}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                    !imageUrl ? 'bg-purple-300' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  Inserir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Dicas de uso */}
      <div className="bg-gray-100 p-3 border-t border-gray-400">
        <details className="text-sm text-gray-700">
          <summary className="cursor-pointer font-medium text-purple-700">Dicas de uso</summary>
          <ul className="mt-2 ml-4 list-disc text-xs space-y-1 text-gray-700">
            <li>Use os botões acima para formatar seu texto facilmente</li>
            <li>Clique em &quot;Visualizar&quot; para ver como seu conteúdo ficará no blog</li>
            <li>Você pode adicionar um modelo básico de artigo clicando no botão &quot;Modelo de Artigo&quot;</li>
            <li>Para adicionar imagens, clique no botão de imagem e faça upload do seu arquivo</li>
            <li>Se você conhece HTML, pode escrever tags diretamente no editor</li>
          </ul>
        </details>
      </div>
    </div>
  );
}
