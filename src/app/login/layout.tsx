import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import type { Metadata } from 'next';
import '@/styles/globals.css';

// Fontes do Google
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Fontes locais
const museoSansRounded = localFont({
  variable: "--font-museo-sans",
  display: "swap",
  src: [
    {
      path: "../../assets/fonts/MuseoSansRounded300.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../assets/fonts/MuseoSansRounded500.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../assets/fonts/MuseoSansRounded900.otf",
      weight: "900",
      style: "normal",
    },
  ],
});

// Fonte Mogila Bold para o "transformam"
const mogilaBold = localFont({
  variable: "--font-mogila",
  display: "swap",
  src: [
    {
      path: "../../assets/fonts/Mogila Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Login | Lorena Jacob - Terapeuta Infantil",
  description: "Faça login na sua conta para acessar conteúdos exclusivos e produtos de Lorena Jacob.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} ${museoSansRounded.variable} ${mogilaBold.variable}`}>
        {children}
      </body>
    </html>
  );
}
