import { notFound } from 'next/navigation';
import ProdutosPage from '../produtos/page';
import { mockCategories } from '@/lib/mockDataLoja';

export async function generateStaticParams() {
  return mockCategories.map((category) => ({
    categoria: category.slug,
  }));
}

export default function CategoriaPage({ params }: { params: { categoria: string } }) {
  const category = mockCategories.find(c => c.slug === params.categoria);
  
  if (!category) {
    notFound();
  }

  // Por enquanto, vamos renderizar a mesma página de produtos
  // No futuro, podemos passar a categoria como prop para filtrar automaticamente
  return <ProdutosPage />;
}