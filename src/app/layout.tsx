import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "../styles/globals.css";

// Wrapper para animação de carregamento
import LoadingWrapper from "@/components/layout/LoadingWrapper";

// Provedor de layout que gerencia Header e Footer
import LayoutProvider from "@/components/layout/LayoutProvider";

// Fontes do Google
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fontes locais
const museoSansRounded = localFont({
  variable: "--font-museo-sans",
  display: "swap",
  src: [
    {
      path: "../assets/fonts/MuseoSansRounded300.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/MuseoSansRounded500.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/MuseoSansRounded900.otf",
      weight: "900",
      style: "normal",
    },
  ],
});

const mogilaBold = localFont({
  variable: "--font-mogila",
  src: "../assets/fonts/Mogila Bold.otf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lorena Jacob | Terapeuta Infantil",
  description: "E-commerce e Blog de terapia infantil especializada em desenvolvimento, autismo, TDAH e outros transtornos do neurodesenvolvimento.",
  keywords: "terapia infantil, desenvolvimento infantil, autismo, TDAH",
  appleWebApp: {
    title: "Lorena",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} ${museoSansRounded.variable} ${mogilaBold.variable} antialiased flex flex-col min-h-screen`}>
        <LoadingWrapper>
          <LayoutProvider>
            {children}
          </LayoutProvider>
        </LoadingWrapper>
      </body>
    </html>
  );
}
