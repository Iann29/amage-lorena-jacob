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
        /* Estilos para o container do editor TipTap */
        :global(.ProseMirror) {
          min-height: 400px;
          padding: 1rem;
          outline: none;
          /* Vamos deixar a cor do texto base ser herdada ou definida pelo Tailwind no wrapper */
          /* A classe 'prose' já define uma cor base para parágrafos */
        }

        /* FORÇAR cores inline a terem prioridade sobre o prose DENTRO DO EDITOR */
        /* Para qualquer elemento dentro do editor que tenha um style inline com 'color' */
        :global(.ProseMirror [style*="color"]) {
          /* Esta é uma tentativa de forçar a cor. Pode não ser sempre ideal usar !important,
             mas para o editor, onde queremos fidelidade visual, pode ser necessário. */
          color: inherit; /* Tenta herdar primeiro */
        }
        /* Se o inherit não for suficiente, você pode tentar ser mais específico ou, em último caso, !important
           Exemplo (com cautela):
           :global(.ProseMirror p span[style*="color"]),
           :global(.ProseMirror h2 span[style*="color"]) {
             color: var(--custom-color, inherit) !important; // Isso é mais complexo e pode não ser necessário
           }
        */

        /* Para os títulos (h1, h2, h3 etc.) dentro do editor:
           Queremos que a cor base deles seja a cor do texto geral do editor,
           permitindo que spans coloridos DENTRO deles se destaquem. */
        :global(.ProseMirror h1),
        :global(.ProseMirror h2),
        :global(.ProseMirror h3),
        :global(.ProseMirror h4),
        :global(.ProseMirror h5),
        :global(.ProseMirror h6) {
          /* Remove a cor específica que o 'prose' pode estar aplicando aos títulos DENTRO DO EDITOR,
             para que a cor venha do span colorido, se houver, ou da cor do texto pai. */
          /* color: inherit; // Isso pode fazer com que eles peguem a cor do text-gray-700 do wrapper.
                             // Se você aplicou uma cor ao H2 como <h2 style="color:blue">Texto</h2>, ela já deve pegar.
                             // Se for <h2><span style="color:blue">Texto</span></h2>, o span já tem a cor.
                             // O 'prose' geralmente colore o H2 diretamente. */
        }

        /* Para parágrafos dentro do editor, também garantir que spans coloridos se sobressaiam */
        :global(.ProseMirror p) {
          /* color: inherit; // Mesma lógica dos títulos. */
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;