import { notFound } from 'next/navigation';
import { lojaApi } from '@/lib/loja-api';
import ProdutoPageClient from './ProdutoPageClient';

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  console.log('=== DEBUG PRODUTO PAGE ===');
  console.log('Slug recebido:', slug);
  
  try {
    // Buscar dados do produto
    console.log('Buscando produto...');
    const response = await lojaApi.getProductBySlug(slug);
    console.log('Resposta:', response);
    
    // Verificar se está retornando products ao invés de product
    if (response.products && Array.isArray(response.products) && response.products.length > 0) {
      const product = response.products[0];
      const relatedProducts = response.relatedProducts || [];
      
      // Formatar produto para o componente cliente
      const formattedProduct = {
        ...product,
        imagens: product.images || [],
        rating_avg: 4.5, // TODO: Implementar sistema de avaliações
        review_count: 0,
        variants: product.variants || []
      };

      return <ProdutoPageClient product={formattedProduct} relatedProducts={relatedProducts} />;
    }
    
    const { product, relatedProducts } = response;
    
    if (!product) {
      console.log('Produto não encontrado');
      notFound();
    }

    // Formatar produto para o componente cliente
    const formattedProduct = {
      ...product,
      imagens: product.images || [],
      rating_avg: 4.5, // TODO: Implementar sistema de avaliações
      review_count: 0,
      variants: product.variants || []
    };

    return <ProdutoPageClient product={formattedProduct} relatedProducts={relatedProducts || []} />;
  } catch (error) {
    console.error('Erro ao carregar produto:', error);
    notFound();
  }
}