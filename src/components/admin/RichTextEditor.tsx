// src/components/admin/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import React from 'react';

// --- Barra de Ferramentas ---
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="bg-gray-100 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center">
      {/* Botões de formatação básica */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-purple-200 text-purple-800' : 'hover:bg-purple-100 text-gray-700 hover:text-purple-700'}`}
        title="Negrito (Ctrl+B)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 10.293a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" /><path fillRule="evenodd" d="M5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg> B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-purple-200 text-purple-800' : 'hover:bg-purple-100 text-gray-700 hover:text-purple-700'}`}
        title="Itálico (Ctrl+I)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 9.097c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-1.5 rounded ${editor.isActive('paragraph') ? 'bg-purple-200 text-purple-800' : 'hover:bg-purple-100 text-gray-700 hover:text-purple-700'}`}
        title="Parágrafo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg> P
      </button>

       {/* Botões de Título */}
       <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-purple-200 text-purple-800' : 'hover:bg-purple-100 text-gray-700 hover:text-purple-700'}`}
        title="Título Nível 2"
      >
        <span className="font-bold text-sm">H2</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1.5 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-purple-200 text-purple-800' : 'hover:bg-purple-100 text-gray-700 hover:text-purple-700'}`}
        title="Título Nível 3"
      >
        <span className="font-bold text-xs">H3</span>
      </button>

       {/* Separador */}
       <div className="h-5 w-px bg-gray-300 mx-1"></div>

      {/* Seleção de Cor */}
      <input
        type="color"
        onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
        value={editor.getAttributes('textStyle').color || '#000000'} // Pega a cor atual ou preto
        className="w-8 h-8 p-0 border-none cursor-pointer rounded bg-transparent"
        title="Escolher cor do texto"
        data-testid="setColor"
      />
       <button
        type="button"
        onClick={() => editor.chain().focus().unsetColor().run()}
        disabled={!editor.getAttributes('textStyle').color}
        className="p-1.5 rounded hover:bg-purple-100 text-gray-700 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Remover cor"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> Cor
      </button>

      {/* Adicione outros botões aqui (lista, link, imagem etc.) conforme necessário */}

    </div>
  );
};

// --- Editor Principal ---
interface RichTextEditorProps {
  initialContent: string;
  onChange: (htmlContent: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialContent, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Você pode desabilitar extensões do StarterKit aqui se não precisar delas
        // Ex: heading: false,
      }),
      TextStyle, // Necessário para Color funcionar
      Color,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Adiciona classes Tailwind ao editor
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none p-4 min-h-[300px] border border-gray-300 rounded-b-md',
      },
    },
  });

  return (
    <div className="border border-gray-300 rounded-md">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
       {/* Adicionar estilos para o editor TipTap se necessário (ou usar plugin typography do Tailwind) */}
       <style jsx global>{`
        .ProseMirror {
          min-height: 250px; /* Ou a altura desejada */
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 0 0 4px 4px; /* Apenas cantos inferiores */
          border-top: none; /* Remove a borda superior que já existe no container */
          outline: none;
        }
        .ProseMirror:focus {
          border-color: #a35bc4; /* Cor roxa para foco */
          box-shadow: 0 0 0 1px #a35bc4;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 1.2em;
          margin-bottom: 0.4em;
        }
        .ProseMirror p {
          margin-bottom: 1em;
          line-height: 1.6;
        }
        .ProseMirror ul, .ProseMirror ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .ProseMirror li > p {
           margin-bottom: 0.2em; /* Reduz margem em parágrafos dentro de listas */
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;