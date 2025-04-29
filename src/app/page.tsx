import Image from "next/image";
import Link from "next/link";
import ServiceCard from "@/components/ui/ServiceCard";

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
                <p className="text-[10px] leading-tight whitespace-nowrap font-['MuseoSansRounded900']">
                  Acompanhamento especializado para <span className="font-medium">auxiliar crianças com autismo, TDAH</span>
                </p>
                <p className="text-[10px] leading-tight whitespace-nowrap font-['MuseoSansRounded900']">
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
              <p className="text-sm whitespace-nowrap font-['MuseoSansRounded900']">
                Acompanhamento especializado para <span className="font-bold">auxiliar crianças</span>
              </p>
              <p className="text-sm whitespace-nowrap font-['MuseoSansRounded900']">
                <span className="font-bold">com o autismo, TDAH</span> e outras necessidades especiais.
              </p>
            </div>
            
            {/* Texto informativo para desktop */}
            <div className="mt-12 border-l-6 border-white pl-6 py-2 hidden md:block">
              <p className="text-lg md:text-xl whitespace-nowrap font-['MuseoSansRounded900']">
                Acompanhamento especializado para <span className="font-bold">auxiliar crianças</span>
              </p>
              <p className="text-lg md:text-xl whitespace-nowrap font-['MuseoSansRounded900']">
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
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          {/* Sobre Mim Card */}
          <div className="md:w-1/2 mb-8 md:mb-0 relative">
            <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: '#8B7659' }}>
              <div className="flex flex-col md:flex-row p-6 md:p-8">
                {/* Texto */}
                <div className="md:w-1/2 text-white p-4">
                  <h2 className="text-[#FFF786] text-3xl font-bold mb-6">SOBRE MIM</h2>
                  
                  <p className="mb-4 text-sm">
                    Sou <strong>Lorena Jacob</strong>, terapeuta infantil, mãe de duas crianças autistas em formação para Terapeuta Ocupacional. Atuo há mais de 10 anos com TEA, TDAH, TOD, seletividade alimentar, deficiência intelectual, entre outros.
                  </p>
                  
                  <p className="mb-4 text-sm">
                    Atendo presencialmente em Londres e online para outros lugares.
                  </p>
                  
                  <p className="text-sm">
                    Ajudo famílias a compreenderem o autismo utilizando abordagens lúdicas e personalizadas para promover avanços no comportamento, linguagem, socialização, autonomia, habilidades cognitivas e motoras.
                  </p>
                </div>
                
                {/* Imagem */}
                <div className="md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
                  <Image 
                    src="/assets/lorenasobremim.webp" 
                    alt="Lorena Jacob" 
                    width={300} 
                    height={400} 
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* O Diferencial Section */}
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-4xl font-bold mb-8 text-center" style={{ color: '#8B7659', WebkitTextStroke: '0.61px #7A674C' }}>O DIFERENCIAL</h2>
            <h3 className="text-4xl font-bold mb-12 text-center" style={{ color: '#8B7659' }}>O DIFERENCIAL</h3>
            
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

      {/* Decorative footer icons */}
      <div className="w-full h-12 bg-white flex justify-center items-center">
        <div className="flex space-x-6">
          {/* Aqui entrariam os ícones decorativos */}
        </div>
      </div>
    </div>
  );
}
