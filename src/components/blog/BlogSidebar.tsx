"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Categoria {
  id: number;
  nome: string;
  slug: string;
  quantidade: number;
}

interface PostPopular {
  id: number;
  titulo: string;
  slug: string;
  imagem_destaque_url: string;
  created_at: string;
  visualizacoes: number;
}

interface BlogSidebarProps {
  categorias: Categoria[];
  postsPopulares: PostPopular[];
}

export default function BlogSidebar({ categorias, postsPopulares }: BlogSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui irá a lógica para buscar posts pelo termo
    console.log('Buscando por:', searchTerm);
  };

  return (
    <aside className="w-full">
      {/* Barra de Busca */}
      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Pesquisar por palavra ou tema" 
              className="w-full py-2 px-4 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#715B3F]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Image 
              src="/assets/searchIcon.png" 
              alt="Buscar" 
              width={20} 
              height={20} 
              className="absolute right-4"
            />
          </div>
        </form>
      </div>
      
      {/* Filtrar */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#715B3F]">Filtrar</h3>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="focus:outline-none"
          >
            <Image 
              src="/assets/configIcon.png" 
              alt="Configurar filtros" 
              width={24} 
              height={24} 
            />
          </button>
        </div>
        
        {showFilters && (
          <>
            {/* Temas */}
            <div className="mb-6">
              <h4 className="text-blue-600 font-medium mb-3">Temas</h4>
              <div className="space-y-2">
                {['Rotina saudável para crianças', 'Como lidar com birras', 'Atraso na fala infantil', 'A importância do brincar', 'Terapia para dificuldades escolares'].map((tema, index) => (
                  <div key={index} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`tema-${index}`} 
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`tema-${index}`} className="text-sm text-gray-700">
                      {tema}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Categorias */}
            <div>
              <h4 className="text-blue-600 font-medium mb-3">Categoria</h4>
              <div className="space-y-2">
                {['Educação', 'Maternidade', 'Saúde', 'Terapia Infantil', 'Dicas'].map((cat, index) => (
                  <div key={index} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`cat-${index}`} 
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`cat-${index}`} className="text-sm text-gray-700">
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Categorias */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#715B3F] mb-4">Categorias</h3>
        <ul className="space-y-2">
          {categorias.map((categoria) => (
            <li key={categoria.id} className="border-b border-gray-100 pb-2">
              <Link 
                href={`/blog/categoria/${categoria.slug}`} 
                className="text-gray-700 hover:text-blue-700 flex justify-between"
              >
                <span>{categoria.nome}</span>
                <span className="text-gray-500 text-sm">{categoria.quantidade}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Posts Populares */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#715B3F] mb-4">Posts Populares</h3>
        <ul className="space-y-4">
          {postsPopulares.map((post) => (
            <li key={post.id} className="flex gap-3">
              <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                {post.imagem_destaque_url ? (
                  <Image 
                    src={post.imagem_destaque_url} 
                    alt={post.titulo} 
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-400">Sem imagem</span>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium leading-tight">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-700">
                    {post.titulo.length > 40 ? post.titulo.substring(0, 40) + '...' : post.titulo}
                  </Link>
                </h4>
                <span className="text-xs text-gray-500">{formatDate(post.created_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Logo Lorena Jacob */}
      <div className="mb-8 flex justify-center">
        <Image 
          src="/public/logos/logo-lorena-jacob.png"
          alt="Lorena Jacob - Terapeuta Infantil"
          width={200}
          height={80}
          className="opacity-80"
        />
      </div>
    </aside>
  );
}
