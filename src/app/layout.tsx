import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

// Componentes de layout
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Wrapper para animação de carregamento
import LoadingWrapper from "@/components/layout/LoadingWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lorena Jacob | Terapeuta Infantil",
  description: "E-commerce e Blog de terapia infantil especializada em desenvolvimento, autismo, TDAH e outros transtornos do neurodesenvolvimento.",
  keywords: "terapia infantil, desenvolvimento infantil, autismo, TDAH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoadingWrapper>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </LoadingWrapper>
      </body>
    </html>
  );
}
