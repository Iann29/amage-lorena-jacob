"use client";

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // Não renderizar a paginação se houver apenas uma página
  if (totalPages <= 1) return null;

  // Função para gerar array de páginas a serem exibidas
  const getPageNumbers = () => {
    const pages = [];
    
    // Sempre mostrar a primeira página
    pages.push(1);
    
    // Adicionar páginas ao redor da página atual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    
    // Sempre mostrar a última página se houver mais de uma
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Adicionar marcadores de elipses para indicar páginas omitidas
    const result = [];
    let prev = 0;
    
    for (const page of pages) {
      if (page - prev > 1) {
        result.push(-1); // Usa -1 para representar elipses
      }
      result.push(page);
      prev = page;
    }
    
    return result;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center mt-8" aria-label="Paginação">
      <ul className="inline-flex">
        {/* Botão Anterior */}
        {currentPage > 1 ? (
          <li>
            <Link 
              href={`${baseUrl}/${currentPage - 1}`} 
              className="px-4 py-2 border border-gray-300 bg-white text-[#715B3F] rounded-l-md hover:bg-gray-50 flex items-center"
              aria-label="Ir para página anterior"
            >
              Anterior
            </Link>
          </li>
        ) : (
          <li>
            <span className="px-4 py-2 border border-gray-300 bg-gray-100 text-gray-400 rounded-l-md cursor-not-allowed">
              Anterior
            </span>
          </li>
        )}
        
        {/* Números de Página */}
        {pageNumbers.map((page, index) => (
          page === -1 ? (
            <li key={`ellipsis-${index}`}>
              <span className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-500">
                ...
              </span>
            </li>
          ) : (
            <li key={page}>
              {page === currentPage ? (
                <span className="px-4 py-2 border-t border-b border-gray-300 bg-[#715B3F] text-white">
                  {page}
                </span>
              ) : (
                <Link 
                  href={`${baseUrl}/${page}`} 
                  className="px-4 py-2 border-t border-b border-gray-300 bg-white text-[#715B3F] hover:bg-gray-50"
                  aria-label={`Ir para página ${page}`}
                >
                  {page}
                </Link>
              )}
            </li>
          )
        ))}
        
        {/* Botão Próxima */}
        {currentPage < totalPages ? (
          <li>
            <Link 
              href={`${baseUrl}/${currentPage + 1}`} 
              className="px-4 py-2 border border-gray-300 bg-white text-[#715B3F] rounded-r-md hover:bg-gray-50"
              aria-label="Ir para próxima página"
            >
              Próxima
            </Link>
          </li>
        ) : (
          <li>
            <span className="px-4 py-2 border border-gray-300 bg-gray-100 text-gray-400 rounded-r-md cursor-not-allowed">
              Próxima
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
}
