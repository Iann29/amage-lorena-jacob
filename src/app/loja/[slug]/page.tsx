import { notFound } from 'next/navigation';
import { lojaApi } from '@/lib/loja-api';
import ProdutosPageClient from './ProdutosPageClient';

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Página da categoria
export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    // Buscar dados da categoria
    const categoryResponse = await lojaApi.getCategoryBySlug(slug);
    
    // Verificar se tem categories (plural) ao invés de category (singular)
    if (categoryResponse && categoryResponse.categories && Array.isArray(categoryResponse.categories)) {
      // Procurar a categoria pelo slug
      const category = categoryResponse.categories.find((cat: any) => cat.slug === slug);
      
      if (!category) {
        notFound();
      }
      
      // Continuar com a categoria encontrada
      const productsResponse = await lojaApi.getProducts({
        category: slug,
        page: 1,
        limit: 12
      });

      return (
        <ProdutosPageClient 
          category={category}
          initialProducts={productsResponse.products || []}
          initialTotal={productsResponse.total || 0}
          initialTotalPages={productsResponse.totalPages || 1}
        />
      );
    }
    
    if (!categoryResponse || !categoryResponse.category) {
      notFound();
    }

    const { category } = categoryResponse;

    // Buscar produtos da categoria
    const productsResponse = await lojaApi.getProducts({
      category: slug,
      page: 1,
      limit: 12
    });

    return (
      <ProdutosPageClient 
        category={category}
        initialProducts={productsResponse.products || []}
        initialTotal={productsResponse.total || 0}
        initialTotalPages={productsResponse.totalPages || 1}
      />
    );
  } catch (error) {
    console.error('Erro ao carregar categoria:', slug, error);
    notFound();
  }
}