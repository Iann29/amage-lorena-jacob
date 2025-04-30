import Image from "next/image";
import Link from "next/link";
import ServiceCard from "@/components/ui/ServiceCard";
import Separator from "@/components/ui/Separator";
import BlogPostCard from "@/components/ui/BlogPostCard";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full bg-white overflow-hidden">
        {/* Background Image - Desktop */}
        <div className="w-screen hidden md:block relative" style={{ height: 'auto' }}>
          <Image 
            src="/Backgroud.webp" 
            alt="Fundo Desktop" 
            width={3000}
            height={3000}
            priority
            className="w-full h-auto"
            style={{ display: 'block' }}
          />
        </div>
        
        {/* Background Image - Mobile */}
        <div className="w-screen md:hidden relative" style={{ height: 'auto' }}>
          <Image 
            src="/Backgroud2mob.png" 
            alt="Fundo Mobile" 
            width={2000}
            height={2000}
            priority
            className="w-full h-auto"
            style={{ display: 'block' }}
          />
        </div>

        <div className="container mx-auto px-4 pt-12 md:pt-32 pb-8 md:pb-20 absolute top-0 left-0 right-0 z-10 flex flex-col md:flex-row items-start">
          {/* Texto do Banner Principal */}
          <div className="relative w-full md:w-[570px] md:h-80 text-white mb-12 md:mb-0 pl-6 md:pl-16 lg:pl-32">
            {/* Banner para Desktop */}
            <div className="hidden md:block">
              <div className="w-[600px] relative left-[32px] justify-center">
                <h1 className="text-white text-8xl lg:text-9xl font-bold font-['Museo_Sans_Rounded'] leading-none">SUPORTE</h1>
              </div>
              
              <div className="w-[650px] relative left-[16px] justify-center -mt-1">
                <h2 className="text-white text-6xl lg:text-7xl font-bold font-['Museo_Sans_Rounded'] leading-none">PERSONALIZADO</h2>
              </div>
              
              <div className="w-[650px] relative left-[24px] justify-center mt-1">
                <span className="text-white text-4xl lg:text-5xl font-bold font-['Museo_Sans_Rounded'] leading-none">PARA O </span>
                <span className="text-[#FFFCB3] text-4xl lg:text-5xl font-bold font-['Museo_Sans_Rounded'] leading-none">DESENVOLVIMENTO</span>
              </div>
              
              <div className="w-[650px] relative left-[32px] justify-center mt-1">
                <h2 className="text-[#FFFCB3] text-7xl lg:text-9xl font-bold font-['Museo_Sans_Rounded'] leading-none">INFANTIL</h2>
              </div>
            </div>
            
            {/* Banner para Tablets */}
            <div className="hidden sm:block md:hidden">
              <h1 className="text-white text-5xl font-bold font-['Museo_Sans_Rounded'] leading-none">SUPORTE</h1>
              <h2 className="text-white text-4xl font-bold font-['Museo_Sans_Rounded'] leading-none -mt-1">PERSONALIZADO</h2>
              <div className="mt-1">
                <span className="text-white text-xl font-bold font-['Museo_Sans_Rounded'] leading-none">PARA O </span>
                <span className="text-[#FFFCB3] text-xl font-bold font-['Museo_Sans_Rounded'] leading-none">DESENVOLVIMENTO</span>
              </div>
              <h2 className="text-[#FFFCB3] text-5xl font-bold font-['Museo_Sans_Rounded'] leading-none mt-1">INFANTIL</h2>
            </div>
            
            {/* Banner para Mobile */}
            <div className="sm:hidden pl-4">
              <div className="relative left-[8px]">
                <h1 className="text-white text-xl font-bold font-['Museo_Sans_Rounded'] leading-none">SUPORTE</h1>
              </div>
              <div className="relative -mt-0.5">
                <h2 className="text-white text-lg font-bold font-['Museo_Sans_Rounded'] leading-none">PERSONALIZADO</h2>
              </div>
              <div className="mt-0.5 relative left-[2px]">
                <span className="text-white text-xs font-bold font-['Museo_Sans_Rounded'] leading-none">PARA O </span>
                <span className="text-[#FFFCB3] text-xs font-bold font-['Museo_Sans_Rounded'] leading-none">DESENVOLVIMENTO</span>
              </div>
              <div className="relative left-[8px] -mt-0.5">
                <h2 className="text-[#FFFCB3] text-xl font-bold font-['Museo_Sans_Rounded'] leading-none">INFANTIL</h2>
              </div>
            
              <div className="mt-3 relative pl-2">
                <Link href="/contato" className="bg-[#FAFFE7] text-[#6E6B46] px-3 py-1 text-[10px] rounded-lg font-medium inline-block hover:bg-opacity-90 hover:scale-105 active:scale-95 transition-all duration-200">
                  Agende uma Avaliação
                </Link>
              </div>
              
              <div className="mt-4 border-l-4 border-white pl-3 py-1">
                <p className="text-[10px] leading-tight whitespace-nowrap font-['Museo_Sans_Rounded']">
                  Acompanhamento especializado para <span className="font-medium">auxiliar crianças com autismo, TDAH</span>
                </p>
                <p className="text-[10px] leading-tight whitespace-nowrap font-['Museo_Sans_Rounded']">
                  e outras necessidades especiais.
                </p>
              </div>
            </div>
            
            {/* Botão para tablet e desktop */}
            <div className="hidden sm:block md:hidden pl-4">
              <Link href="/contato" className="bg-[#FAFFE7] text-[#6E6B46] px-6 py-2 text-sm rounded-lg font-medium inline-block hover:bg-opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 mt-8">
                Agende uma Avaliação
              </Link>
            </div>
            
            {/* Botão para desktop */}
            <div className="hidden md:flex pl-[32px] mt-12 justify-center">
              <Link href="/contato" className="bg-[#FAFFE7] text-[#6E6B46] px-8 py-3 text-base rounded-lg font-medium inline-block hover:bg-opacity-90 hover:scale-110 active:scale-95 transition-all duration-200 hover:shadow-md">
                Agende uma Avaliação
              </Link>
            </div>

            {/* Texto informativo para tablet */}
            <div className="mt-8 border-l-4 border-white pl-4 py-1 hidden sm:block md:hidden">
              <p className="text-sm whitespace-nowrap font-['Museo_Sans_Rounded']">
                Acompanhamento especializado para <span className="font-bold">auxiliar crianças</span>
              </p>
              <p className="text-sm whitespace-nowrap font-['Museo_Sans_Rounded']">
                <span className="font-bold">com o autismo, TDAH</span> e outras necessidades especiais.
              </p>
            </div>
            
            {/* Texto informativo para desktop */}
            <div className="mt-12 border-l-6 border-white pl-6 py-2 hidden md:block">
              <p className="text-lg md:text-xl whitespace-nowrap font-['Museo_Sans_Rounded']">
                Acompanhamento especializado para <span className="font-bold">auxiliar crianças</span>
              </p>
              <p className="text-lg md:text-xl whitespace-nowrap font-['Museo_Sans_Rounded']">
                <span className="font-bold">com o autismo, TDAH</span> e outras necessidades especiais.
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
                {/* Imagem em tamanho grande */}
                <div className="w-full relative overflow-visible" style={{ marginLeft: '-5%', marginTop: '-27%', zIndex: 10 }}>
                  <Image 
                    src="/assets/lorenasobremim.webp" 
                    alt="Lorena Jacob" 
                    width={605} 
                    height={805} 
                    className="rounded-2xl w-full h-auto max-w-[680px]"
                    priority
                  />
                </div>
                
                {/* Texto sobreposto */}
                <div className="absolute top-12 left-6 md:w-[320px] text-white p-4" style={{ zIndex: 20, maxWidth: '320px' }}>
                  <h2 className="text-[#FFF786] text-3xl font-bold mb-4 text-center">SOBRE MIM</h2>
                  
                  <p className="mb-3 text-sm leading-tight">
                    Sou <strong>Lorena Jacob</strong>, terapeuta infantil, mãe de duas crianças autistas em formação para Terapeuta Ocupacional. Atuo há mais de 10 anos com <strong>TEA</strong>, <strong>TDAH</strong>, <strong>TOD</strong>, <strong>seletividade alimentar</strong>, <strong>deficiência intelectual</strong>, entre outros.
                  </p>
                  
                  <p className="mb-3 text-sm leading-tight">
                    Atendo presencialmente em Londres e online para outros lugares.
                  </p>
                  
                  <p className="text-sm leading-tight">
                    <strong>Ajudo famílias a compreenderem o</strong> <strong>autismo</strong> utilizando abordagens lúdicas e personalizadas para promover avanços no comportamento, linguagem, socialização, autonomia, habilidades cognitivas e motoras.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* O Diferencial Section */}
          <div className="md:w-1/2 md:pl-12 md:-mt-40 relative z-10">
            <h2 className="text-5xl font-bold mb-1 text-center" style={{ color: 'white', WebkitTextStroke: '0.61px #7A674C' }}>O DIFERENCIAL</h2>
            <h3 className="text-5xl font-bold mb-10 text-center" style={{ color: '#8B7659' }}>O DIFERENCIAL</h3>
            
            {/* Cards */}
            <div className="flex flex-wrap justify-center gap-6">
              <ServiceCard 
                title="Acompanhamento"
                subtitle="Personalizado"
                buttonText="SAIBA MAIS"
                linkHref="/sobre"
              />
              
              <ServiceCard 
                title="Treinamento para"
                subtitle="Pais & Educadores"
                buttonText="SAIBA MAIS"
                linkHref="/servicos"
                backgroundImage="/assets/treinamento-bg.jpg"
              />
              
              <ServiceCard 
                title="Palestras &"
                subtitle="Consultorias"
                buttonText="SAIBA MAIS"
                linkHref="/contato"
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
              <h2 className="text-5xl mb-2 font-['Museo_Sans_Rounded']" style={{ color: '#0B5394', fontWeight: 500 }}>SIGA-ME NAS</h2>
              <h2 className="text-6xl font-bold mb-4 font-['Museo_Sans_Rounded']" style={{ color: '#0B5394' }}>REDES SOCIAIS</h2>
              <p className="text-xl mb-6 font-['Museo_Sans_Rounded']" style={{ color: '#0B5394', fontWeight: 500, paddingLeft: '35%' }}>/@lorenajacob.st</p>
              
              <a href="https://instagram.com/lorenajacob.st" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 rounded-lg text-white transition-all duration-300 mt-8 font-['Museo_Sans_Rounded'] transform hover:scale-105 hover:shadow-lg" style={{ backgroundColor: '#0B5394', color: 'white', fontWeight: 500, marginLeft: '20px' }}>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                <span className="text-3xl" style={{ fontWeight: 500 }}>SIGA O MEU PERFIL</span>
              </a>
            </div>
            
            {/* Imagens */}
            <div className="grid grid-cols-3 gap-4 md:w-1/2">
              {/* Placeholder para 6 imagens de posts do Instagram */}
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white aspect-square rounded-lg"></div>
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
            <h2 className="text-4xl md:text-5xl font-['Museo_Sans_Rounded'] mb-2" style={{ color: '#806D52', fontWeight: 900, fontSize: 'calc(1.25rem + 1.5vw)' }}>Os temas que você vai</h2>
            <h2 className="text-4xl md:text-5xl italic" style={{ color: '#806D52', fontFamily: 'Mogila', fontWeight: 'bold' }}>encontrar no blog</h2>
          </div>
          
          {/* Cards do Blog - Carrossel */}
          <div className="relative max-w-6xl mx-auto px-12">
            {/* Seta esquerda */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
              <button className="bg-transparent border-none hover:scale-110 transition-transform">
                <svg width="24" height="45" viewBox="0 0 24 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L2 22.5L22 43" stroke="#806D52" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
              <BlogPostCard 
                title="Título aqui"
                summary="Resumo do artigo aqui resumo do artigo aqui resumo do artigo aqui resumo do artigo aqui resumo do artigo."
                imageUrl="/assets/blog-placeholder.jpg"
                postUrl="/blog/post-1"
                viewCount={4}
                commentCount={2}
              />
              
              <BlogPostCard 
                title="Título aqui"
                summary="Resumo do artigo aqui resumo do artigo aqui resumo do artigo aqui resumo do artigo aqui resumo do artigo."
                imageUrl="/assets/blog-placeholder.jpg"
                postUrl="/blog/post-2"
                viewCount={4}
                commentCount={2}
              />
              
              <BlogPostCard 
                title="Título aqui"
                summary="Resumo do artigo aqui resumo do artigo aqui resumo do artigo aqui resumo do artigo aqui resumo do artigo."
                imageUrl="/assets/blog-placeholder.jpg"
                postUrl="/blog/post-3"
                viewCount={4}
                commentCount={2}
              />
            </div>

            {/* Seta direita */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
              <button className="bg-transparent border-none hover:scale-110 transition-transform">
                <svg width="24" height="45" viewBox="0 0 24 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2L22 22.5L2 43" stroke="#806D52" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Botão para acessar o blog */}
          <div className="mt-16 text-center">
            <a href="/blog" className="inline-block py-4 px-12 bg-[#806D52] text-white rounded-lg text-2xl font-bold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg">
              ACESSE O BLOG
            </a>
          </div>
        </div>
      </section>
      
      {/* Decorative footer icons */}
      <div className="w-full h-12 bg-white flex justify-center items-center">
        <div className="flex space-x-6">
          {/* Aqui entrariam os ícones decorativos */}
        </div>
      </div>
    </div>
  );
}
