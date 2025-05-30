import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/mockDataLoja';
import ProdutoPageClient from './ProdutoPageClient';

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  return <ProdutoPageClient product={product} />;
}