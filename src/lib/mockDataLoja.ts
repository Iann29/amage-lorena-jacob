export interface Category {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  imagem_url: string;
  produtos_count: number;
}

export interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  ordem_exibicao: number;
}

export interface ProductVariant {
  id: string;
  nome_variante: string;
  preco_adicional: number;
  quantidade_estoque: number;
}

export interface Product {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  preco_promocional?: number;
  quantidade_estoque: number;
  category_id: string;
  category?: Category;
  imagens: ProductImage[];
  variants?: ProductVariant[];
  idade_min?: number;
  idade_max?: number;
  rating_avg?: number;
  review_count?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comentario: string;
  created_at: string;
}

// Categorias principais (aparecem como cards)
export const mockCategories: Category[] = [
  {
    id: "1",
    nome: "Brinquedos Sensoriais",
    slug: "brinquedos-sensoriais",
    descricao: "Brinquedos que estimulam os sentidos e o desenvolvimento sensorial",
    imagem_url: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/brinquedoSensoriais.png",
    produtos_count: 12
  },
  {
    id: "2",
    nome: "PECS",
    slug: "pecs",
    descricao: "Sistema de Comunicação por Troca de Figuras",
    imagem_url: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/pecs.png",
    produtos_count: 8
  },
  {
    id: "3",
    nome: "Material Pedagógico",
    slug: "material-pedagogico",
    descricao: "Materiais educativos para desenvolvimento infantil",
    imagem_url: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/materialPedagogico.png",
    produtos_count: 15
  },
  {
    id: "4",
    nome: "E-books",
    slug: "ebooks",
    descricao: "Livros digitais sobre desenvolvimento infantil",
    imagem_url: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/ebook.png",
    produtos_count: 5
  }
];

// Todas as categorias (incluindo as que aparecem apenas no filtro)
export const allCategories: Category[] = [
  ...mockCategories,
  {
    id: "5",
    nome: "Jogos",
    slug: "jogos",
    descricao: "Jogos educativos e terapêuticos para desenvolvimento",
    imagem_url: "",
    produtos_count: 10
  },
  {
    id: "6",
    nome: "Brinquedos Montessorianos",
    slug: "brinquedos-montessorianos",
    descricao: "Brinquedos baseados no método Montessori",
    imagem_url: "",
    produtos_count: 8
  }
];

// Produtos
export const mockProducts: Product[] = [
  // Brinquedos Sensoriais
  {
    id: "p1",
    nome: "Rotina Diária",
    slug: "rotina-diaria",
    descricao: "Transforme os dias das crianças em momentos organizados, leves e cheios de aprendizado! O eBook Rotina Diária foi criado para ajudar pais e cuidadores a estabelecerem uma rotina clara e divertida para crianças de 2 a 8 anos.",
    preco: 69.90,
    preco_promocional: 49.90,
    quantidade_estoque: 100,
    category_id: "1",
    category: mockCategories[0],
    imagens: [
      {
        id: "img1",
        image_url: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    idade_min: 2,
    idade_max: 8,
    rating_avg: 4.5,
    review_count: 23,
    tags: ["rotina", "desenvolvimento", "organização"],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "p2",
    nome: "Torre de Encaixe Montessoriana",
    slug: "torre-encaixe-montessoriana",
    descricao: "Torre colorida com diferentes formas geométricas para encaixe. Desenvolve coordenação motora, reconhecimento de cores e formas.",
    preco: 89.90,
    preco_promocional: 74.90,
    quantidade_estoque: 45,
    category_id: "1",
    category: mockCategories[0],
    imagens: [
      {
        id: "img2",
        image_url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    idade_min: 1,
    idade_max: 4,
    rating_avg: 4.8,
    review_count: 15,
    tags: ["montessori", "coordenação", "cores"],
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z"
  },
  {
    id: "p3",
    nome: "Painel Sensorial Texturas",
    slug: "painel-sensorial-texturas",
    descricao: "Painel com diferentes texturas para estimulação tátil. Inclui tecidos macios, ásperos, lisos e rugosos.",
    preco: 129.90,
    quantidade_estoque: 30,
    category_id: "1",
    category: mockCategories[0],
    imagens: [
      {
        id: "img3",
        image_url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    idade_min: 0,
    idade_max: 3,
    rating_avg: 4.9,
    review_count: 8,
    tags: ["sensorial", "texturas", "tátil"],
    created_at: "2024-01-05T10:00:00Z",
    updated_at: "2024-01-05T10:00:00Z"
  },

  // PECS
  {
    id: "p4",
    nome: "Kit PECS Básico - Rotina",
    slug: "kit-pecs-basico-rotina",
    descricao: "Kit completo com 50 cartões PECS para rotina diária. Inclui atividades básicas como comer, dormir, brincar e higiene.",
    preco: 149.90,
    preco_promocional: 119.90,
    quantidade_estoque: 25,
    category_id: "2",
    category: mockCategories[1],
    imagens: [
      {
        id: "img4",
        image_url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    rating_avg: 4.7,
    review_count: 12,
    tags: ["comunicação", "autismo", "rotina"],
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z"
  },
  {
    id: "p5",
    nome: "Prancha de Comunicação PECS",
    slug: "prancha-comunicacao-pecs",
    descricao: "Prancha magnética para organização dos cartões PECS. Facilita a comunicação visual e organização da rotina.",
    preco: 89.90,
    quantidade_estoque: 35,
    category_id: "2",
    category: mockCategories[1],
    imagens: [
      {
        id: "img5",
        image_url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    rating_avg: 4.6,
    review_count: 9,
    tags: ["organização", "visual", "comunicação"],
    created_at: "2024-01-18T10:00:00Z",
    updated_at: "2024-01-18T10:00:00Z"
  },

  // Material Pedagógico
  {
    id: "p6",
    nome: "Alfabeto Móvel Montessori",
    slug: "alfabeto-movel-montessori",
    descricao: "Letras em madeira para formação de palavras. Vogais em vermelho e consoantes em azul, seguindo o método Montessori.",
    preco: 99.90,
    preco_promocional: 79.90,
    quantidade_estoque: 40,
    category_id: "3",
    category: mockCategories[2],
    imagens: [
      {
        id: "img6",
        image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    idade_min: 4,
    idade_max: 8,
    rating_avg: 4.8,
    review_count: 20,
    tags: ["alfabetização", "montessori", "educação"],
    created_at: "2024-01-12T10:00:00Z",
    updated_at: "2024-01-12T10:00:00Z"
  },
  {
    id: "p7",
    nome: "Jogo da Memória Animais",
    slug: "jogo-memoria-animais",
    descricao: "Jogo educativo com 30 pares de animais. Desenvolve memória, concentração e vocabulário.",
    preco: 49.90,
    quantidade_estoque: 60,
    category_id: "3",
    category: mockCategories[2],
    imagens: [
      {
        id: "img7",
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    idade_min: 3,
    idade_max: 10,
    rating_avg: 4.5,
    review_count: 18,
    tags: ["memória", "animais", "concentração"],
    created_at: "2024-01-08T10:00:00Z",
    updated_at: "2024-01-08T10:00:00Z"
  },
  {
    id: "p8",
    nome: "Kit Matemática Divertida",
    slug: "kit-matematica-divertida",
    descricao: "Material dourado, ábaco e jogos matemáticos. Ensina conceitos de quantidade, adição e subtração de forma lúdica.",
    preco: 159.90,
    preco_promocional: 139.90,
    quantidade_estoque: 20,
    category_id: "3",
    category: mockCategories[2],
    imagens: [
      {
        id: "img8",
        image_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    idade_min: 5,
    idade_max: 12,
    rating_avg: 4.9,
    review_count: 25,
    tags: ["matemática", "números", "educação"],
    created_at: "2024-01-06T10:00:00Z",
    updated_at: "2024-01-06T10:00:00Z"
  },

  // E-books
  {
    id: "p9",
    nome: "E-book: Desenvolvimento Infantil 0-3 anos",
    slug: "ebook-desenvolvimento-infantil-0-3",
    descricao: "Guia completo sobre marcos do desenvolvimento nos primeiros anos. Inclui atividades e dicas práticas.",
    preco: 39.90,
    preco_promocional: 29.90,
    quantidade_estoque: 999,
    category_id: "4",
    category: mockCategories[3],
    imagens: [
      {
        id: "img9",
        image_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    rating_avg: 4.7,
    review_count: 45,
    tags: ["desenvolvimento", "bebês", "guia"],
    created_at: "2024-01-25T10:00:00Z",
    updated_at: "2024-01-25T10:00:00Z"
  },
  {
    id: "p10",
    nome: "E-book: Atividades Sensoriais em Casa",
    slug: "ebook-atividades-sensoriais-casa",
    descricao: "50 atividades sensoriais para fazer em casa com materiais simples. Ideal para desenvolvimento sensorial.",
    preco: 34.90,
    quantidade_estoque: 999,
    category_id: "4",
    category: mockCategories[3],
    imagens: [
      {
        id: "img10",
        image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    rating_avg: 4.8,
    review_count: 32,
    tags: ["atividades", "sensorial", "casa"],
    created_at: "2024-01-22T10:00:00Z",
    updated_at: "2024-01-22T10:00:00Z"
  },

  // Jogos
  {
    id: "p11",
    nome: "Jogo da Memória Emoções",
    slug: "jogo-memoria-emocoes",
    descricao: "Jogo educativo para identificação e reconhecimento de emoções. Contém 20 pares com expressões faciais.",
    preco: 59.90,
    preco_promocional: 49.90,
    quantidade_estoque: 50,
    category_id: "5",
    category: mockCategories[4],
    imagens: [
      {
        id: "img11",
        image_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    idade_min: 3,
    idade_max: 8,
    rating_avg: 4.9,
    review_count: 15,
    tags: ["emoções", "memória", "educativo"],
    created_at: "2024-01-28T10:00:00Z",
    updated_at: "2024-01-28T10:00:00Z"
  },
  {
    id: "p12",
    nome: "Quebra-Cabeça Sequência Lógica",
    slug: "quebra-cabeca-sequencia-logica",
    descricao: "Desenvolve raciocínio lógico e sequencial. 30 peças para formar diferentes sequências.",
    preco: 69.90,
    quantidade_estoque: 35,
    category_id: "5",
    category: mockCategories[4],
    imagens: [
      {
        id: "img12",
        image_url: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    idade_min: 4,
    idade_max: 10,
    rating_avg: 4.7,
    review_count: 12,
    tags: ["lógica", "quebra-cabeça", "raciocínio"],
    created_at: "2024-01-26T10:00:00Z",
    updated_at: "2024-01-26T10:00:00Z"
  },

  // Brinquedos Montessorianos
  {
    id: "p13",
    nome: "Torre Rosa Montessori",
    slug: "torre-rosa-montessori",
    descricao: "Material clássico Montessori para desenvolvimento de percepção visual e coordenação. 10 cubos em madeira.",
    preco: 119.90,
    preco_promocional: 99.90,
    quantidade_estoque: 25,
    category_id: "6",
    category: mockCategories[5],
    imagens: [
      {
        id: "img13",
        image_url: "https://images.unsplash.com/photo-1632204171588-b4e6a8db3c2e?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    idade_min: 2,
    idade_max: 6,
    rating_avg: 5.0,
    review_count: 20,
    tags: ["montessori", "torre rosa", "coordenação"],
    created_at: "2024-01-30T10:00:00Z",
    updated_at: "2024-01-30T10:00:00Z"
  },
  {
    id: "p14",
    nome: "Barras Vermelhas Montessori",
    slug: "barras-vermelhas-montessori",
    descricao: "Material sensorial para compreensão de dimensões e preparação matemática. 10 barras em madeira.",
    preco: 139.90,
    quantidade_estoque: 20,
    category_id: "6",
    category: mockCategories[5],
    imagens: [
      {
        id: "img14",
        image_url: "https://images.unsplash.com/photo-1586095120892-69e5aae5e3b3?w=500",
        is_primary: true,
        ordem_exibicao: 1
      }
    ],
    idade_min: 3,
    idade_max: 7,
    rating_avg: 4.8,
    review_count: 18,
    tags: ["montessori", "matemática", "dimensões"],
    created_at: "2024-01-29T10:00:00Z",
    updated_at: "2024-01-29T10:00:00Z"
  }
];

// Reviews mockadas
export const mockReviews: Review[] = [
  {
    id: "r1",
    product_id: "p1",
    user_id: "u1",
    user_name: "Maria Silva",
    user_avatar: "/assets/avatar-default.png",
    rating: 5,
    comentario: "Excelente produto! Ajudou muito na organização da rotina do meu filho. O material é de ótima qualidade e as instruções são muito claras.",
    created_at: "2024-01-20T14:30:00Z"
  },
  {
    id: "r2",
    product_id: "p1",
    user_id: "u2",
    user_name: "João Santos",
    rating: 4,
    comentario: "Muito bom, mas poderia ter mais opções de atividades.",
    created_at: "2024-01-18T10:15:00Z"
  },
  {
    id: "r3",
    product_id: "p1",
    user_id: "u3",
    user_name: "Ana Costa",
    user_avatar: "/assets/avatar/luana-placeholder.png",
    rating: 5,
    comentario: "Simplesmente perfeito! Minha filha adorou e está super engajada com a rotina. Recomendo muito!",
    created_at: "2024-01-15T09:20:00Z"
  },
  {
    id: "r4",
    product_id: "p2",
    user_id: "u4",
    user_name: "Pedro Oliveira",
    rating: 5,
    comentario: "Torre montessoriana de excelente qualidade. Meu filho de 2 anos adora brincar e aprende muito com ela.",
    created_at: "2024-01-22T16:45:00Z"
  },
  {
    id: "r5",
    product_id: "p2",
    user_id: "u5",
    user_name: "Carla Mendes",
    user_avatar: "/assets/avatar/michele-placeholder.png",
    rating: 4,
    comentario: "Produto muito bom, apenas achei o preço um pouco elevado. Mas a qualidade compensa!",
    created_at: "2024-01-19T11:30:00Z"
  },
  {
    id: "r6",
    product_id: "p3",
    user_id: "u6",
    user_name: "Roberto Lima",
    rating: 5,
    comentario: "O painel sensorial é incrível! Meu bebê fica fascinado explorando as diferentes texturas.",
    created_at: "2024-01-21T13:15:00Z"
  },
  {
    id: "r7",
    product_id: "p4",
    user_id: "u7",
    user_name: "Fernanda Souza",
    user_avatar: "/assets/avatar/gabryella-placeholder.png",
    rating: 5,
    comentario: "Kit PECS completo e muito bem organizado. Facilitou muito a comunicação com meu filho autista.",
    created_at: "2024-01-23T08:00:00Z"
  }
];

// Funções auxiliares
export function getProductsByCategory(categorySlug: string): Product[] {
  return mockProducts.filter(p => p.category?.slug === categorySlug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find(p => p.slug === slug);
}

export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const product = mockProducts.find(p => p.id === productId);
  if (!product) return [];
  
  return mockProducts
    .filter(p => p.id !== productId && p.category_id === product.category_id)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(p => 
    p.nome.toLowerCase().includes(lowerQuery) ||
    p.descricao.toLowerCase().includes(lowerQuery) ||
    p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function filterProducts(filters: {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  minAge?: number;
  maxAge?: number;
}): Product[] {
  return mockProducts.filter(product => {
    // Filtro de categorias
    if (filters.categories?.length && !filters.categories.includes(product.category_id)) {
      return false;
    }
    
    // Filtro de preço
    const price = product.preco_promocional || product.preco;
    if (filters.minPrice && price < filters.minPrice) return false;
    if (filters.maxPrice && price > filters.maxPrice) return false;
    
    // Filtro de idade
    if (filters.minAge && product.idade_max && product.idade_max < filters.minAge) return false;
    if (filters.maxAge && product.idade_min && product.idade_min > filters.maxAge) return false;
    
    return true;
  });
}

// Banner mockado
export const mockBanners = [
  {
    id: "b1",
    image_url: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/banner-loja/banner1.png",
    alt: "Promoção de Brinquedos Sensoriais",
    link: "/loja/brinquedos-sensoriais"
  }
];