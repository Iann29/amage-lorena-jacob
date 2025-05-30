import { notFound } from 'next/navigation';
import { lojaApi } from '@/lib/loja-api';
import ProdutosPageClient from './ProdutosPageClient';

// Gerar rotas estáticas para as categorias
export async function generateStaticParams() {
  try {
    const { categories } = await lojaApi.getCategories();
    return categories.map((category) => ({
      categoria: category.slug,
    }));
  } catch (error) {
    console.error('Erro ao gerar parâmetros estáticos:', error);
    return [];
  }
}

// Página da categoria
export default async function CategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  
  console.log('=== DEBUG CATEGORIA PAGE ===');
  console.log('Slug recebido:', categoria);
  
  try {
    // Buscar dados da categoria
    console.log('Buscando categoria com slug:', categoria);
    const { category } = await lojaApi.getCategoryBySlug(categoria);
    console.log('Categoria encontrada:', category);
    
    if (!category) {
      notFound();
    }

    // Buscar produtos da categoria
    const { products, total, totalPages } = await lojaApi.getProducts({
      category: categoria,
      page: 1,
      limit: 12
    });

    return (
      <ProdutosPageClient 
        category={category}
        initialProducts={products}
        initialTotal={total}
        initialTotalPages={totalPages}
      />
    );
  } catch (error) {
    console.error('=== ERRO AO CARREGAR CATEGORIA ===');
    console.error('Slug que causou erro:', categoria);
    console.error('Detalhes do erro:', error);
    console.error('Tipo do erro:', typeof error);
    if (error instanceof Error) {
      console.error('Mensagem do erro:', error.message);
      console.error('Stack trace:', error.stack);
    }
    notFound();
  }
}