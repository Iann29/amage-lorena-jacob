import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loja | Lorena Jacob',
  description: 'E-books, cursos e materiais terapêuticos para desenvolvimento infantil, autismo e TDAH.'
};

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}