"use client";

import Image from "next/image";
// import Link from "next/link"; // Removido - não utilizado
import ServiceCard from "@/components/ui/ServiceCard";
import { useModal } from "@/contexts/ModalContext"; // Adicionar importação
import Separator from "@/components/ui/Separator";
import BlogCarousel from "@/components/ui/BlogCarousel";
import EbookBanner from "@/components/ui/EbookBanner";
import TestimonialsCarousel from "@/components/ui/TestimonialsCarousel";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import { motion } from "framer-motion";
// Tipos e função da API do blog
import { getPublishedBlogPosts, type BlogPostPublic } from '@/lib/blog-api';
import { useEffect, useState } from "react";

// Interface para os dados do post do blog como esperado pelo BlogCarousel
interface CarouselPost {
  id: string; // Mantido como string para compatibilidade com UUID da API
  title: string;
  summary: string;
  imageUrl: string;
  postUrl: string;
  viewCount: number;
  commentCount: number;
  content?: string; // Adicionado para que o card possa extrair resumo se necessário
}

export default function Home() {
  const { openContatoModal } = useModal(); // Chamar o hook
  const [carouselPosts, setCarouselPosts] = useState<CarouselPost[]>([]);
  const [isLoadingCarouselPosts, setIsLoadingCarouselPosts] = useState(true);

  useEffect(() => {
    const fetchBlogPostsForCarousel = async () => {
      setIsLoadingCarouselPosts(true);
      try {
        // Buscar, por exemplo, os 6 posts mais recentes (página 1, 6 itens)
        // Ajuste a paginação e ordenação conforme necessário e disponível na API
        const { posts: apiPosts } = await getPublishedBlogPosts(1, 6);

        const formattedPosts: CarouselPost[] = apiPosts.map((post: BlogPostPublic) => ({
          id: post.id,
          title: post.titulo,
          // Usar resumo se disponível, senão deixar string vazia (ou extrair do conteúdo se preferir)
          summary: post.resumo || "", 
          // Passar o conteúdo completo para que BlogPostCard possa usar extractTextFromHtml
          content: post.conteudo, 
          imageUrl: post.imagem_destaque_url || "/assets/blog-placeholder.jpg", // Fallback para placeholder
          postUrl: `/blog/${post.slug}`,
          viewCount: post.view_count || 0,
          commentCount: post.comment_count || 0,
        }));
        setCarouselPosts(formattedPosts);
      } catch (error) {
        console.error("Erro ao buscar posts para o carrossel:", error);
        // Poderia definir um estado de erro aqui e exibir uma mensagem na UI
        setCarouselPosts([]); // Define como vazio em caso de erro para não quebrar o carrossel
      } finally {
        setIsLoadingCarouselPosts(false);
      }
    };

    fetchBlogPostsForCarousel();
  }, []);

  const instagramPostsData = [
    {
      link: "https://www.instagram.com/p/DJaFil7uiwT/",
      imageUrl: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/instagram-posts/1.jpg",
      altText: "Post 1 do Instagram de Lorena Jacob"
    },
    {
      link: "https://www.instagram.com/p/DJSbLQEoCjj/?img_index=1",
      imageUrl: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/instagram-posts/2.jpg",
      altText: "Post 2 do Instagram de Lorena Jacob"
    },
    {
      link: "https://www.instagram.com/p/DJIB1fBxass/",
      imageUrl: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/instagram-posts/3.jpg",
      altText: "Post 3 do Instagram de Lorena Jacob"
    },
    {
      link: "https://www.instagram.com/p/DJC5ELqxCWJ/",
      imageUrl: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/instagram-posts/4.jpg",
      altText: "Post 4 do Instagram de Lorena Jacob"
    },
    {
      link: "https://www.instagram.com/p/DI1BE1wRlec/",
      imageUrl: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/instagram-posts/5.jpg",
      altText: "Post 5 do Instagram de Lorena Jacob"
    },
    {
      link: "https://www.instagram.com/p/DIv275cK5BJ/?img_index=1",
      imageUrl: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/instagram-posts/6.jpg",
      altText: "Post 6 do Instagram de Lorena Jacob"
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full bg-white overflow-hidden">
        {/* Background Image - Desktop */}
        <div className="w-screen hidden md:block relative" style={{ height: 'auto' }}>
          <Image 
            src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/Backgroud.webp" 
            alt="Fundo Desktop" 
            width={1920}
            height={1080}
            priority
            sizes="100vw"
            quality={85}
            className="w-full h-auto"
            style={{ display: 'block' }}
          />
        </div>
        
        {/* Background Image - Mobile */}
        <div className="w-screen md:hidden relative" style={{ height: 'auto' }}>
          <Image 
            src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/backMobile.webp" 
            alt="Fundo Mobile" 
            width={750}
            height={1334}
            priority
            sizes="100vw"
            quality={85}
            className="w-full h-auto"
            style={{ display: 'block' }}
          />
        </div>

        <div className="container mx-auto px-4 pt-12 md:pt-32 pb-8 md:pb-20 absolute top-0 left-0 right-0 z-10 flex flex-col md:flex-row items-start">
          {/* Texto do Banner Principal */}
          <div className="relative w-full md:w-[570px] md:h-80 text-white mb-12 md:mb-0 md:pl-16 lg:pl-32">
            {/* Banner para Desktop */}
            <div className="hidden md:block">
              <div className="w-[600px] relative left-[32px] justify-center">
                <h1 className="text-white text-8xl lg:text-9xl font-bold leading-none" style={{ fontFamily: 'var(--font-museo-sans)' }}>SUPORTE</h1>
              </div>
              
              <div className="w-[650px] relative left-[16px] justify-center -mt-1">
                <h2 className="text-white text-6xl lg:text-7xl font-bold leading-none" style={{ fontFamily: 'var(--font-museo-sans)' }}>PERSONALIZADO</h2>
              </div>
              
              <div className="w-[650px] relative left-[24px] justify-center mt-1">
                <span className="text-white text-4xl lg:text-5xl font-bold leading-none" style={{ fontFamily: 'var(--font-museo-sans)' }}>PARA O </span>
                <span className="text-[#FFFCB3] text-4xl lg:text-5xl font-bold leading-none" style={{ fontFamily: 'var(--font-museo-sans)' }}>DESENVOLVIMENTO</span>
              </div>
              
              <div className="w-[650px] relative left-[32px] justify-center mt-1">
                <h2 className="text-[#FFFCB3] text-7xl lg:text-9xl font-bold leading-none" style={{ fontFamily: 'var(--font-museo-sans)' }}>INFANTIL</h2>
              </div>
            </div>
            
            {/* Banner para Tablets */}
            <div className="hidden sm:block md:hidden">
              <h1 className="text-white text-5xl font-bold leading-none" style={{ fontFamily: 'var(--font-museo-sans)' }}>SUPORTE</h1>
              <h2 className="text-white text-4xl font-bold leading-none -mt-1" style={{ fontFamily: 'var(--font-museo-sans)' }}>PERSONALIZADO</h2>
              <div className="mt-1">
                <span className="text-white text-xl font-bold leading-none" style={{ fontFamily: 'var(--font-museo-sans)' }}>PARA O </span>
                <span className="text-[#FFFCB3] text-xl font-bold leading-none" style={{ fontFamily: 'var(--font-museo-sans)' }}>DESENVOLVIMENTO</span>
              </div>
              <h2 className="text-[#FFFCB3] text-5xl font-bold leading-none mt-1" style={{ fontFamily: 'var(--font-museo-sans)' }}>INFANTIL</h2>
            </div>
            
            {/* Banner para Mobile */}
            <div className="sm:hidden absolute inset-0 flex flex-col justify-start items-center pt-6">
              <div className="flex flex-col items-center mx-auto">
                {/* SUPORTE */}
                <div className="text-white text-5xl font-bold leading-[52px] [text-shadow:_-2px_2px_0px_rgb(3_122_179_/_1.00)]" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                  SUPORTE
                </div>
                
                {/* PERSONALIZADO */}
                <div className="text-white text-3xl font-bold leading-7 [text-shadow:_-2px_2px_0px_rgb(3_122_179_/_1.00)] -mt-1" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                  PERSONALIZADO
                </div>
                
                {/* PARA O DESENVOLVIMENTO */}
                <div className="flex mt-2 gap-1">
                  <span className="text-white text-base font-bold leading-none" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                    PARA O
                  </span>
                  <span className="text-[#FFFCB3] text-base font-bold leading-none" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                    DESENVOLVIMENTO
                  </span>
                </div>
                
                {/* INFANTIL */}
                <div className="text-[#FFFCB3] text-5xl font-bold leading-[53px] mt-0" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                  INFANTIL
                </div>
              </div>
            
              <div className="mt-3 flex justify-center">
                <a
                  href="https://wa.me/message/FDF46FODEQMTL1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FAFFE7] text-[#6E6B46] px-4 py-2 text-xs rounded-lg font-bold inline-block hover:bg-opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
                >
                  Agende uma Avaliação
                </a>
              </div>
              
              <div className="mt-8 border-l-4 border-white pl-3 py-2 max-w-[250px] mx-auto">
                <p className="text-sm leading-5 text-left font-[var(--font-museo-sans)]">
                  Acompanhamento especializado para <span className="font-medium">auxiliar crianças com autismo, TDAH</span> e outras necessidades especiais.
                </p>
              </div>
            </div>
            
            {/* Botão para tablet e desktop */}
            <div className="hidden sm:block md:hidden pl-4">
              <a
                href="https://wa.me/message/FDF46FODEQMTL1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FAFFE7] text-[#6E6B46] px-6 py-2 text-sm rounded-lg font-medium inline-block hover:bg-opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 mt-8"
              >
                Agende uma Avaliação
              </a>
            </div>
            
            {/* Botão para desktop */}
            <div className="hidden md:flex pl-[32px] mt-12 justify-center">
              <a
                href="https://wa.me/message/FDF46FODEQMTL1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FAFFE7] text-[#6E6B46] px-8 py-3 rounded-lg inline-block hover:bg-opacity-90 hover:scale-110 active:scale-95 transition-all duration-200 hover:shadow-md" 
                style={{ fontFamily: 'var(--font-museo-sans)', fontWeight: 'bold', fontSize: '1.125rem' }}
              >
                Agende uma Avaliação
              </a>
            </div>

            {/* Texto informativo para tablet */}
            <div className="mt-8 border-l-4 border-white pl-4 py-1 hidden sm:block md:hidden">
              <p className="text-sm whitespace-nowrap" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                Acompanhamento especializado para <span className="font-bold" style={{ fontFamily: 'var(--font-museo-sans)' }}>auxiliar crianças</span>
              </p>
              <p className="text-sm whitespace-nowrap" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                <span className="font-bold" style={{ fontFamily: 'var(--font-museo-sans)' }}>com o autismo, TDAH</span> e outras necessidades especiais.
              </p>
            </div>
            
            {/* Texto informativo para desktop */}
            <div className="mt-12 border-l-6 border-white pl-6 py-2 hidden md:block">
              <p className="text-lg md:text-xl whitespace-nowrap" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                Acompanhamento especializado para <span className="font-bold" style={{ fontFamily: 'var(--font-museo-sans)' }}>auxiliar crianças</span>
              </p>
              <p className="text-lg md:text-xl whitespace-nowrap" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                <span className="font-bold" style={{ fontFamily: 'var(--font-museo-sans)' }}>com o autismo, TDAH</span> e outras necessidades especiais.
              </p>
            </div>
          </div>

          {/* Espaço para imagem (está no background) */}
          <div className="md:w-1/2">
            {/* A imagem está no background */}
          </div>
        </div>
      </section>

      {/* Sobre Mim Section */}
      <section className="py-12 md:py-16 bg-white overflow-visible relative">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          {/* Sobre Mim Card */}
          <div className="md:w-1/2 mb-8 md:mb-0 relative overflow-visible">
            <div className="rounded-3xl overflow-visible">
              <div className="relative">
                {/* Imagem para Desktop e Mobile */}
                <div className="w-full relative overflow-visible flex justify-center md:block" style={{ marginLeft: 'md:-5%', marginTop: '-27%', zIndex: 10 }}>
                  <Image 
                    src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//Sobre%20Mim.png" 
                    alt="Lorena Jacob" 
                    width={605} 
                    height={805} 
                    className="rounded-2xl w-full h-auto max-w-[680px] md:ml-[-5%]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* O Diferencial Section */}
          <div className="md:w-1/2 md:pl-12 md:-mt-40 relative z-10">
            <h2 className="text-5xl lg:text-6xl font-bold mb-1 text-center" style={{ color: 'white', WebkitTextStroke: '0.61px #7A674C', fontFamily: 'var(--font-museo-sans)' }}>O DIFERENCIAL</h2>
            <h3 className="text-5xl lg:text-6xl font-bold mb-10 text-center" style={{ color: '#8B7659', fontFamily: 'var(--font-museo-sans)' }}>O DIFERENCIAL</h3>
            
            {/* Cards */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-6">
              <ServiceCard 
                title="Acompanhamento"
                subtitle="Personalizado"
                buttonText="SAIBA MAIS"
                linkHref="https://wa.me/5527998206121?text=Ol%C3%A1%2C%20Lorena!%20Tenho%20interesse%20em%20saber%20mais%20sobre%20o%20acompanhamento%20personalizado.%20Pode%20me%20explicar%20como%20funciona%3F"
                target="_blank"
                rel="noopener noreferrer"
              />
              
              <ServiceCard 
                title="Treinamento para"
                subtitle="Pais & Educadores"
                buttonText="SAIBA MAIS"
                linkHref="https://wa.me/5527998206121?text=Oi%2C%20Lorena!%20Gostaria%20de%20saber%20mais%20sobre%20o%20treinamento%20para%20pais%20e%20educadores.%20Voc%C3%AA%20pode%20me%20enviar%20mais%20informa%C3%A7%C3%B5es%3F"
                target="_blank"
                rel="noopener noreferrer"
                backgroundImage="/assets/treinamento-bg.jpg"
              />
              
              <ServiceCard 
                title="Palestras &"
                subtitle="Consultorias"
                buttonText="SAIBA MAIS"
                linkHref="https://wa.me/5527998206121?text=Ol%C3%A1%2C%20Lorena!%20Me%20interessei%20pelas%20palestras%20e%20consultorias.%20Pode%20me%20contar%20como%20funciona%20e%20como%20agendar%3F"
                target="_blank"
                rel="noopener noreferrer"
                backgroundImage="/assets/palestras-bg.jpg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Separador antes da seção de redes sociais */}
      <Separator />

      {/* Redes Sociais Section */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#E9F291' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Texto e Botão */}
            <div className="mb-8 md:mb-0 md:w-1/2">
              <h2 className="text-4xl md:text-5xl mb-0 md:mb-2 text-center md:text-left" style={{ color: '#0B5394', fontWeight: 500, fontFamily: 'var(--font-museo-sans)' }}>SIGA-ME NAS</h2>
              <h2 className="text-4xl md:text-6xl font-bold mb-4 text-center md:text-left" style={{ color: '#0B5394', fontFamily: 'var(--font-museo-sans)' }}>REDES SOCIAIS</h2>
              <div className="flex items-center justify-center md:justify-start md:pl-[calc(35%-110px)]">
          {/* Ícone do Instagram */}
          <motion.a 
            href="https://instagram.com/lorenajacob.st" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mb-6 mr-2"
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-8 h-8" fill="#09519c" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </motion.a>
          {/* Ícone do Facebook */}
          <motion.a 
            href="https://www.facebook.com/profile.php?id=61573695501036" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mb-6 mr-2"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-8 h-8" fill="#09519c" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </motion.a>
          <p className="text-xl mb-6" style={{ color: '#0B5394', fontWeight: 500, fontFamily: 'var(--font-museo-sans)' }}>/@lorenajacob.st</p>
        </div>
        
        {/* Posts do Instagram - Apenas Mobile */}
        <div className="grid grid-cols-2 gap-3 mx-auto max-w-sm md:hidden mt-6">
          {instagramPostsData.slice(0, 4).map((post, index) => (
            <a
              key={index}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-square rounded-lg overflow-hidden relative group hover:shadow-lg transition-shadow duration-300"
              aria-label={`Ver post ${index + 1} no Instagram`}
            >
              <Image
                src={post.imageUrl}
                alt={post.altText}
                fill
                sizes="50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority={index < 2}
                quality={75}
              />
            </a>
          ))}
        </div>
              
              <div className="flex justify-center md:justify-start md:ml-5 mt-8">
                <a href="https://instagram.com/lorenajacob.st" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 rounded-lg text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg" style={{ backgroundColor: '#0B5394', color: 'white', fontWeight: 500, fontFamily: 'var(--font-museo-sans)' }}>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  <span className="text-3xl" style={{ fontWeight: 500 }}>SIGA O MEU PERFIL</span>
                </a>
              </div>
            </div>
            
            {/* Imagens */}
            <div className="grid grid-cols-3 gap-4 md:w-1/2">
              {instagramPostsData.map((post, index) => (
                <a
                  key={index}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-square rounded-lg overflow-hidden relative group hover:shadow-lg transition-shadow duration-300"
                  aria-label={`Ver post ${index + 1} no Instagram`}
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.altText}
                    fill
                    sizes="(max-width: 767px) 30vw, 15vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={index < 3} // Prioriza o carregamento das primeiras 3 imagens
                    quality={75}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Separador depois da seção de redes sociais */}
      <Separator />

      {/* Seção Blog - Temas */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#FBFEEF' }}>
        <div className="container mx-auto px-4">
          {/* Título */}
          <div className="text-center mb-12">
            <h2 className="mb-2" style={{ color: '#806D52', fontWeight: 900, fontFamily: 'var(--font-museo-sans)' }}>
              <span className="text-5xl md:text-6xl">Os temas que</span>
            </h2>
            <h2 className="mb-2 whitespace-nowrap" style={{ color: '#806D52' }}>
              <span className="text-3xl md:text-5xl" style={{ fontWeight: 900, fontFamily: 'var(--font-museo-sans)' }}>Você vai </span>
              <span className="text-3xl md:text-5xl italic font-bold" style={{ fontFamily: 'var(--font-mogila)' }}>Encontrar</span>
            </h2>
            <h2 className="text-4xl md:text-5xl italic font-bold" style={{ color: '#806D52', fontFamily: 'var(--font-mogila)' }}>no blog</h2>
          </div>
          
          {/* Cards do Blog - Carrossel */}
          {isLoadingCarouselPosts ? (
            <div className="text-center py-10">
              <p>Carregando posts do blog...</p>
              {/* Poderia adicionar um spinner aqui */}
            </div>
          ) : carouselPosts.length > 0 ? (
            <BlogCarousel posts={carouselPosts} />
          ) : (
            <div className="text-center py-10">
              <p>Nenhum post disponível no momento.</p>
            </div>
          )}
          
          {/* Botão para acessar o blog */}
          <div className="mt-16 text-center">
            <motion.a 
              href="/blog" 
              className="inline-block py-4 px-12 bg-[#806D52] text-white rounded-lg text-2xl font-bold hover:bg-opacity-90"
              style={{ boxShadow: '0 6px 15px rgba(128, 109, 82, 0.6), 0 4px 6px rgba(0, 0, 0, 0.2)' }}
              whileHover={{ boxShadow: '0 8px 20px rgba(128, 109, 82, 0.7), 0 6px 8px rgba(0, 0, 0, 0.25)', scale: 1.05 }}
              transition={{ duration: 0.1 }}
            >
              ACESSE O BLOG
            </motion.a>
          </div>
        </div>
      </section>
      
      {/* Seção de E-book */}
      <EbookBanner />
      
      {/* Seção de Depoimentos */}
      <section className="py-10 sm:py-12 md:py-20 w-full relative overflow-hidden" style={{ backgroundColor: '#00BCD4' }}>
        {/* Imagem de fundo */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/depoimentosbackground.png" 
            alt="Fundo de depoimentos" 
            fill 
            priority
            className="object-cover object-center"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Título */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white" style={{ fontFamily: 'var(--font-museo-sans)' }}>DEPOIMENTOS</h2>
          </div>
          
          {/* Carrossel de Depoimentos */}
          <TestimonialsCarousel 
            testimonials={[
              {
                id: 1,
                quote: "Que no mundo venha ter mais profissionais assim como você.",
                name: "Gabryella",
                avatarSrc: "/assets/avatar/gabryella-placeholder.png"
              },
              {
                id: 2,
                quote: "Que no mundo venha ter mais profissionais assim como você.",
                name: "Bruna",
                avatarSrc: "/assets/avatar/bruna-placeholder.png"
              },
              {
                id: 3,
                quote: "Que no mundo venha ter mais profissionais assim como você.",
                name: "Luana",
                avatarSrc: "/assets/avatar/luana-placeholder.png"
              },
              {
                id: 4,
                quote: "Meu filho evoluiu muito com suas técnicas e abordagem personalizada.",
                name: "Michele",
                avatarSrc: "/assets/avatar/michele-placeholder.png"
              },
              {
                id: 5,
                quote: "A forma como a Lorena trabalha é extraordinária, recomendo a todos os pais.",
                name: "Raphaella",
                avatarSrc: "/assets/avatar/raphaella-placeholder.png"
              }
            ]}
          />
        </div>
      </section>
      
      {/* Decorative footer icons */}
      <div className="w-full h-12 bg-white flex justify-center items-center">
        <div className="flex space-x-6">
          {/* Aqui entrariam os ícones decorativos */}
        </div>
      </div>

      {/* Botão flutuante do WhatsApp */}
      <WhatsAppFloat />
    </div>
  );
}
