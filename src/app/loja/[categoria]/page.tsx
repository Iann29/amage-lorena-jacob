import { notFound } from 'next/navigation';
import ProdutosPage from '../produtos/page';
import { allCategories } from '@/lib/mockDataLoja';

export async function generateStaticParams() {
  return allCategories.map((category) => ({
    categoria: category.slug,
  }));
}

export default async function CategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const category = allCategories.find(c => c.slug === categoria);
  
  if (!category) {
    notFound();
  }

  return <ProdutosPage categoryId={category.id} categoryName={category.nome} />;
}