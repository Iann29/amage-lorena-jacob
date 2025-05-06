// src/components/admin/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import React, { useEffect } from 'react';

// --- Barra de Ferramentas ---
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  // Pega a cor atual do texto selecionado/cursor, ou preto como padrão
  const currentColor = editor.getAttributes('textStyle').color || '#000000';

  return (
    <div className="bg-gray-100 border-b border-gray-300 p-2 flex flex-wrap gap-x-2 gap-y-1 items-center sticky top-0 z-10">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded text-sm font-semibold ${editor.isActive('bold') ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
        title="Negrito (Ctrl+B)"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded text-sm italic ${editor.isActive('italic') ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
        title="Itálico (Ctrl+I)"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`px-2 py-1 rounded text-sm ${editor.isActive('paragraph') ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
        title="Parágrafo"
      >
        P
      </button>
       <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded text-sm font-semibold ${editor.isActive('heading', { level: 2 }) ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
        title="Título Nível 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded text-sm font-semibold ${editor.isActive('heading', { level: 3 }) ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
        title="Título Nível 3"
      >
        H3
      </button>
       <div className="h-5 w-px bg-gray-400"></div>
      <input
        type="color"
        onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
        value={currentColor} // Atualizado para refletir a cor da seleção
        className="w-7 h-7 p-0.5 border border-gray-300 rounded cursor-pointer bg-transparent"
        title="Escolher cor do texto"
      />
       <button
        type="button"
        onClick={() => editor.chain().focus().unsetColor().run()}
        disabled={!editor.getAttributes('textStyle').color} // Desabilita se nenhuma cor estiver aplicada
        className="px-2 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
        title="Remover cor"
      >
        Limpar Cor
      </button>
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
        // Você pode configurar ou desabilitar partes do StarterKit se necessário
        // Ex: heading: { levels: [2, 3] } para permitir apenas H2 e H3
      }),
      TextStyle, // Fundamental para `style` inline
      Color.configure({
        types: ['textStyle'], // Garante que 'Color' funcione com 'TextStyle' para aplicar styles inline
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Aplicamos 'prose' para uma estilização base, mas ela não deve sobrescrever cores inline
        // A chave é como os estilos inline (style="color:...") são mais específicos que os seletores do prose
        // para o atributo 'color'.
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none p-4 min-h-[400px] bg-white text-gray-700 border-t-0 rounded-b-md',
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, false);
    }
  }, [initialContent, editor]);

  if (!editor) {
    return <div className="p-4 border rounded-md min-h-[436px] bg-gray-50 flex items-center justify-center text-gray-400">Carregando editor...</div>;
  }

  return (
    // O contêiner principal agora tem a borda, e o ProseMirror não terá borda superior
    <div className="border border-gray-300 rounded-md shadow-sm bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
       {/* Adicionando estilos CSS para garantir que as cores inline tenham prioridade
           e para melhorar a aparência dos títulos dentro do editor. */}
      <style jsx>{`
        :global(.ProseMirror) {
          min-height: 400px; /* Ou a altura desejada */
          padding: 1rem;
          outline: none;
        }
        :global(.ProseMirror:focus) {
          /* Estilo de foco sutil, já que a borda está no wrapper */
        }

        /* Garantir que os estilos de cor inline do TipTap (em spans) tenham prioridade */
        :global(.ProseMirror span[style*="color"]) {
          /* Não precisa de !important se o seletor for específico o suficiente */
          /* Se ainda houver problemas, pode ser necessário adicionar !important com cautela */
        }

        /* Ajustar cores padrão de elementos dentro do prose para DENTRO DO EDITOR,
           se os padrões do Tailwind Typography estiverem muito fortes e
           atrapalhando a visualização das cores aplicadas.
           A ideia é que o editor reflita o mais fielmente possível o resultado final.
        */
        :global(.ProseMirror h1),
        :global(.ProseMirror h2),
        :global(.ProseMirror h3),
        :global(.ProseMirror h4),
        :global(.ProseMirror h5),
        :global(.ProseMirror h6) {
          /* Se a cor do prose estiver sobrescrevendo, você pode forçar a herança aqui
             para que o style inline do span (se houver) funcione, ou definir uma cor base.
             Exemplo: color: inherit; ou uma cor base do editor */
          /* Se você aplicou uma cor via TipTap, ela estará num <span style="color:..."> DENTRO do h2,
             então o h2 em si pode ter uma cor base. */
        }
        /* Você pode adicionar mais overrides aqui se necessário */
      `}</style>
    </div>
  );
};

export default RichTextEditor;