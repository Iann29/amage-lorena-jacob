import { redirect } from 'next/navigation';

// Redireciona para a página principal da loja
export default function ProdutosPage() {
  redirect('/loja');
}