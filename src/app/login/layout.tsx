import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Login | Lorena Jacob - Terapeuta Infantil",
  description: "Faça login na sua conta para acessar conteúdos exclusivos e produtos de Lorena Jacob.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Na abordagem do App Router, não precisamos definir a estrutura HTML completa
  // Apenas retornamos o conteúdo e o layout pai (app/layout.tsx) vai lidar com o resto
  return children;
}
