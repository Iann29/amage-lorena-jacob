// src/components/admin/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import React, { useEffect, useState } from 'react';

// --- MenuBar (sem alterações) ---
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  // ... (seu código do MenuBar permanece o mesmo) ...
  if (!editor) {
    return null;
  }
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
        value={currentColor}
        className="w-7 h-7 p-0.5 border border-gray-300 rounded cursor-pointer bg-transparent"
        title="Escolher cor do texto"
      />
       <button
        type="button"
        onClick={() => editor.chain().focus().unsetColor().run()}
        disabled={!editor.getAttributes('textStyle').color}
        className="px-2 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
        title="Remover cor"
      >
        Limpar Cor
      </button>
    </div>
  );
};

interface RichTextEditorProps {
  initialContent: string;
  onChange: (htmlContent: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialContent, onChange }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none p-4 min-h-[400px] bg-white text-gray-800',
      },
    },
    immediatelyRender: false,
  }, [onChange]);

  useEffect(() => {
    if (isClient && editor && !editor.isDestroyed) {
      if (editor.isEmpty && initialContent) {
        editor.commands.setContent(initialContent, false);
      }
    }
  }, [initialContent, editor, isClient]);

  if (!isClient || !editor) {
    return <div className="p-4 border border-gray-300 rounded-md shadow-sm bg-white min-h-[478px] animate-pulse">
             <div className="bg-gray-100 border-b border-gray-300 p-2 h-[46px]"></div>
             <div className="p-4 min-h-[400px] bg-gray-50"></div>
           </div>;
  }

  return (
    <div className="border border-gray-300 rounded-md shadow-sm bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <style jsx>{`
        /* ... (seu CSS in-place permanece o mesmo) ... */
        :global(.ProseMirror) {
          min-height: 400px;
          padding: 1rem;
          outline: none;
          line-height: 1.6;
          font-family: var(--font-poppins), sans-serif;
          color: #374151; 
        }
        :global(.ProseMirror p) {
          margin-bottom: 1em;
        }
        :global(.ProseMirror h1),
        :global(.ProseMirror h2),
        :global(.ProseMirror h3),
        :global(.ProseMirror h4),
        :global(.ProseMirror h5),
        :global(.ProseMirror h6) {
          font-family: var(--font-museo-sans), sans-serif;
          font-weight: bold;
          margin-top: 1.2em;
          margin-bottom: 0.6em;
          line-height: 1.3;
          color: #1f2937; 
        }
        :global(.ProseMirror h2) {
          font-size: 1.5em;
        }
        :global(.ProseMirror h3) {
          font-size: 1.25em;
        }
        :global(.ProseMirror strong) {
          font-weight: bold;
        }
        :global(.ProseMirror em) {
          font-style: italic;
        }
        :global(.ProseMirror ul),
        :global(.ProseMirror ol) {
          padding-left: 1.5rem; 
          margin-bottom: 1em; 
          list-style-position: outside; 
        }
        :global(.ProseMirror ul) {
          list-style-type: disc; 
        }
        :global(.ProseMirror ol) {
          list-style-type: decimal; 
        }
        :global(.ProseMirror li > p) {
           margin-bottom: 0.2em;
        }
        :global(.ProseMirror [style*="color"]) {
          -webkit-text-fill-color: currentColor; 
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;