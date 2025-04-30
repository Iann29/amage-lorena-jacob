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
  // Este layout não faz nada além de definir metadados
  // A visão e ocultamento do header e footer é gerenciado pelos próprios componentes
  return children;
}
