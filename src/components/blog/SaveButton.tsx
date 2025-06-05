'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface SaveButtonProps {
  postId: string;
  initialSaved?: boolean;
}

export default function SaveButton({ postId, initialSaved = false }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuthAndSaveStatus();
  }, [postId]);

  const checkAuthAndSaveStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setIsLoggedIn(true);
      // Verificar se o post já está salvo
      const { data, error } = await supabase
        .from('blog_post_saves')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();
      
      if (data && !error) {
        setIsSaved(true);
      }
    }
  };

  const handleSaveToggle = async () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      if (isSaved) {
        // Remover dos salvos
        const { error } = await supabase
          .from('blog_post_saves')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (!error) {
          setIsSaved(false);
        }
      } else {
        // Adicionar aos salvos
        const { error } = await supabase
          .from('blog_post_saves')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (!error) {
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar/remover post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSaveToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
        isSaved 
          ? 'bg-[#806D52] text-white hover:bg-[#6B5A45]' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isSaved ? 'Remover dos salvos' : 'Salvar post'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isSaved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <span className="text-sm font-medium">
        {isSaved ? 'Salvo' : 'Salvar'}
      </span>
    </button>
  );
}