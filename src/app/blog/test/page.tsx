"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getPublishedBlogPosts, 
  getPublicBlogCategories, 
  getPopularBlogPosts,
  type BlogPostPublic,
  type BlogCategoryPublic
} from '@/lib/blog-api';

export default function EdgeFunctionTestPage() {
  const [posts, setPosts] = useState<BlogPostPublic[]>([]);
  const [categories, setCategories] = useState<BlogCategoryPublic[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPostPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Testar todas as funções de uma vez
        const [postsData, categoriesData, popularData] = await Promise.all([
          getPublishedBlogPosts(),
          getPublicBlogCategories(),
          getPopularBlogPosts(3)
        ]);

        setPosts(postsData);
        setCategories(categoriesData);
        setPopularPosts(popularData);
        setError(null);
      } catch (err) {
        console.error('Erro ao testar Edge Functions:', err);
        setError('Erro ao buscar dados do blog através das Edge Functions.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#715B3F]">
        Teste de Edge Functions
      </h1>

      <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-yellow-800 text-sm">
        <p>Esta página testa se as Edge Functions estão funcionando corretamente.</p>
        <p>Os dados são carregados diretamente das Edge Functions no Supabase em vez das Server Actions do Next.js.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block w-8 h-8 border-4 border-[#6FB1CE] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#6FB1CE]">Carregando dados das Edge Functions...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-700">
          <h2 className="font-bold mb-2">Erro</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Posts */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-[#715B3F]">
              Posts ({posts.length})
            </h2>
            {posts.length > 0 ? (
              <ul className="space-y-2">
                {posts.slice(0, 5).map(post => (
                  <li key={post.id} className="border-b pb-2">
                    <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                      {post.titulo}
                    </Link>
                    <p className="text-gray-600 text-sm">Likes: {post.like_count} | Views: {post.view_count}</p>
                  </li>
                ))}
                {posts.length > 5 && (
                  <li className="text-center text-sm text-gray-500 pt-2">
                    + {posts.length - 5} post(s) não mostrados
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhum post encontrado</p>
            )}
          </div>

          {/* Categories */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-[#715B3F]">
              Categorias ({categories.length})
            </h2>
            {categories.length > 0 ? (
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id} className="border-b pb-2">
                    <span className="text-[#6FB1CE] font-medium">{category.nome}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      ({category.quantidade} post{category.quantidade !== 1 ? 's' : ''})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhuma categoria encontrada</p>
            )}
          </div>

          {/* Popular Posts */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-[#715B3F]">
              Posts Populares ({popularPosts.length})
            </h2>
            {popularPosts.length > 0 ? (
              <ul className="space-y-2">
                {popularPosts.map(post => (
                  <li key={post.id} className="border-b pb-2">
                    <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                      {post.titulo}
                    </Link>
                    <p className="text-gray-600 text-sm">Likes: {post.like_count}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhum post popular encontrado</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/blog" className="inline-block px-6 py-3 bg-[#6FB1CE] text-white rounded-md hover:bg-[#5B9AB8] transition-colors">
          Voltar para o Blog
        </Link>
      </div>
    </div>
  );
} 