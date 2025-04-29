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

        <div className="container mx-auto px-4 py-8 md:py-20 absolute top-0 left-0 right-0 z-10 flex flex-col md:flex-row items-center">
          {/* Texto do Banner Principal */}
          <div className="md:w-1/2 text-white mb-12 md:mb-0">
            <h1 className="text-5xl md:text-7xl font-bold mb-2">SUPORTE</h1>
            <h2 className="text-4xl md:text-6xl font-bold mb-2">PERSONALIZADO</h2>
            <h3 className="text-xl md:text-3xl mb-6">PARA O <span className="text-[#FFF786] font-bold text-3xl md:text-5xl">DESENVOLVIMENTO</span></h3>
            <h2 className="text-[#FFF786] font-bold text-5xl md:text-7xl mb-8">INFANTIL</h2>
            
            <Link href="/contato" className="bg-white text-[#27769B] px-8 py-3 rounded-full font-medium inline-block hover:bg-opacity-90 transition">
              Agende uma Avaliação
            </Link>

            <div className="mt-8 border-l-4 border-white pl-4 py-1">
              <p className="text-sm md:text-base">
                Acompanhamento especializado para auxiliar crianças<br />
                com o autismo, TDAH e outras necessidades especiais
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ServiceCard 
                title="Acompanhamento Personalizado"
                buttonText="SAIBA MAIS"
                linkHref="/sobre"
              />
              
              <ServiceCard 
                title="Treinamento para Pais & Educadores"
                buttonText="SAIBA MAIS"
                linkHref="/servicos"
              />
              
              <ServiceCard 
                title="Palestras & Consultorias"
                buttonText="SAIBA MAIS"
                linkHref="/contato"
              />
              
              <ServiceCard 
                title="Material Educativo"
                buttonText="SAIBA MAIS"
                linkHref="/loja"
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
