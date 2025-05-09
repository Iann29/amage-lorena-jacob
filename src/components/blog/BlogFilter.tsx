"use client";

import Image from 'next/image';
import styles from '@/app/blog/blog.module.css';

interface BlogFilterProps {
  isOpen: boolean;
  categorias: {
    id: string;
    nome: string;
    slug?: string;
    quantidade?: number;
  }[];
  selectedCategories: string[];
  onCategoryChange: (categoryId: string) => void;
  selectedTemas: string[];
  onTemaChange: (tema: string) => void;
}

export default function BlogFilter({ 
  isOpen, 
  categorias, 
  selectedCategories, 
  onCategoryChange,
  selectedTemas,
  onTemaChange
}: BlogFilterProps) {
  // Lista de temas mockados
  const temas = [
    'Rotina saudável para crianças',
    'Como lidar com birras',
    'Atraso na fala infantil',
    'A importância do brincar',
    'Terapia para dificuldades escolares'
  ];

  return (
    <div className={`${styles.filterPanel} ${isOpen ? styles.filterPanelOpen : ''}`}>
      <h3 className={styles.filterHeading}>Filtrar</h3>
      
      {/* Temas */}
      <h4 className={styles.filterCategory}>Temas</h4>
      <div>
        {temas.map((tema, index) => (
          <div key={index} className={styles.filterCheckbox}>
            <input 
              type="checkbox" 
              id={`tema-${index}`}
              checked={selectedTemas.includes(tema)}
              onChange={() => onTemaChange(tema)}
            />
            <label htmlFor={`tema-${index}`}>
              {tema}
            </label>
          </div>
        ))}
      </div>
      
      {/* Categorias */}
      <h4 className={styles.filterCategory}>Categoria</h4>
      <div>
        {categorias.map((categoria) => (
          <div key={categoria.id} className={styles.filterCheckbox}>
            <input 
              type="checkbox" 
              id={`cat-${categoria.id}`}
              checked={selectedCategories.includes(categoria.id)}
              onChange={() => onCategoryChange(categoria.id)}
            />
            <label htmlFor={`cat-${categoria.id}`}>
              {categoria.nome}
            </label>
          </div>
        ))}
      </div>

      {/* Logo */}
      <div className={styles.filterLogo}>
        <Image 
          src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/logos/logo1.webp" 
          alt="Lorena Jacob - Terapeuta Infantil" 
          width={140} 
          height={70}
          className="mt-3"
        />
      </div>
    </div>
  );
}
