"use client";

import Image from "next/image";
import { useEffect } from "react";
import ProfileCard from "@/components/ui/ProfileCard";
import InfoCard from "@/components/ui/InfoCard";

export default function SobrePage() {
  // Garantir que as fontes Fredoka e Poppins estejam carregadas
  useEffect(() => {
    const linkFredokaOne = document.createElement('link');
    linkFredokaOne.href = 'https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap';
    linkFredokaOne.rel = 'stylesheet';
    
    const linkFredoka = document.createElement('link');
    linkFredoka.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500&display=swap';
    linkFredoka.rel = 'stylesheet';
    
    const linkPoppins = document.createElement('link');
    linkPoppins.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap';
    linkPoppins.rel = 'stylesheet';
    
    document.head.appendChild(linkFredokaOne);
    document.head.appendChild(linkFredoka);
    document.head.appendChild(linkPoppins);
    
    return () => {
      document.head.removeChild(linkFredokaOne);
      document.head.removeChild(linkFredoka);
      document.head.removeChild(linkPoppins);
    };
  }, []);
  
  return (
    <div className="w-full">
      {/* Card posicionado de forma independente no layout */}
      <div className="hidden md:block" style={{ 
        position: 'absolute', 
        left: '50%', 
        transform: 'translateX(-71%)', 
        top: '220px', 
        zIndex: 10,
        pointerEvents: 'auto' 
      }}>
        <ProfileCard 
          imageUrl="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//lorenaperfil1.png"
          firstName="Lorena"
          lastName="Jacob"
          title="TERAPEUTA INFANTIL"
          socialLinks={{
            facebook: "https://facebook.com/lorenajacob.st",
            instagram: "https://instagram.com/lorenajacob.st",
            handle: "@lorenajacob.st"
          }}
        />
      </div>
      
      {/* Texto à direita do card */}
      <div className="hidden md:block absolute" style={{ top: '330px', left: '64%', zIndex: 10, maxWidth: '25%' }}>
        <div className="mb-6">
          <p>
            <span className="text-stone-700 text-2xl md:text-3xl font-semibold font-['Fredoka'] leading-normal mr-2">Eu sou</span>
            <span className="text-stone-700 text-base md:text-lg font-semibold font-['Poppins'] leading-normal">Lorena Jacob,</span>
            <span className="text-stone-700 text-base md:text-lg font-normal font-['Poppins'] leading-normal"> Terapeuta Infantil, especialista em autismo e comorbidades.</span>
          </p>
        </div>
        
        <div className="mt-6">
          <div>
            <div>
              <span className="text-black text-base md:text-lg font-bold font-['Poppins'] leading-normal">Há mais de 10 anos atuo com crianças autistas,</span>
              <span className="text-black text-base md:text-lg font-normal font-['Poppins'] leading-normal"> ajudando famílias a construírem caminhos mais leves, funcionais e efetivos no desenvolvimento infantil. </span>
              <span className="text-black text-base md:text-lg font-semibold font-['Poppins'] leading-normal">Estou me formando como Terapeuta Ocupacional</span>
              <span className="text-black text-base md:text-lg font-normal font-['Poppins'] leading-normal"> e possuo diversas especializações na área, o que me permite unir técnica, experiência e sensibilidade em cada atendimento.</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estrutura de fundo com duas colunas (azul e branco) */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Lado esquerdo - Fundo azul */}
        <div className="w-full md:w-1/2 bg-[#ADD4E4] relative overflow-hidden">
          {/* Texto vertical "Lorena Jacob" */}
          <div className="hidden md:block absolute -left-40 top-65 -rotate-90 select-none" style={{ transformOrigin: 'center', zIndex: 0 }}>
            <div className="flex flex-col items-center space-y-0">
              <span className="tracking-wide text-[#C0E5F4]" style={{ fontFamily: '"Fredoka One", sans-serif', fontSize: '12rem', lineHeight: '0.9' }}>Lorena</span>
              <span className="tracking-wide text-[#9CCDE1] -mt-16" style={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 500, fontSize: '14.5rem', lineHeight: '0.8' }}>Jacob</span>
            </div>
          </div>
          
          {/* Cartão de perfil (apenas mobile) */}
          <div className="relative mx-auto pt-12 pb-8 block md:hidden">
            <div className="mx-4">
              <ProfileCard 
                imageUrl="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//lorenaperfil1.png"
                firstName="Lorena"
                lastName="Jacob"
                title="TERAPEUTA INFANTIL"
                socialLinks={{
                  facebook: "https://facebook.com/lorenajacob.st",
                  instagram: "https://instagram.com/lorenajacob.st",
                  handle: "@lorenajacob.st"
                }}
              />
            </div>
          </div>
          
          {/* Primeira seção de conteúdo - altura mínima */}
          <div className="min-h-screen md:min-h-[95vh] lg:min-h-[95vh]"></div>
        </div>
        
        {/* Lado direito - Fundo branco */}
        <div className="w-full md:w-3/5 bg-white py-10 px-6 md:px-12 lg:px-16" style={{ position: 'relative', zIndex: 5 }}>
          {/* Primeira seção de conteúdo - altura mínima */}
          <div className="min-h-screen md:min-h-[95vh] lg:min-h-[95vh]"></div>
        </div>
      </div>
      
      {/* Seção retangular com cor #FFFDF2 - A visão de mãe */}
      <div className="w-full bg-[#FFFDF2] py-5 px-5 md:py-10 md:px-6 relative">
        {/* Foto posicionada absolutamente para vazar para fora da seção */}
        <div className="absolute left-[-80px] md:left-[0%] lg:left-[5%] top-[-70px] md:top-[-90px] transform rotate-[-5deg]" style={{ zIndex: 2, maxWidth: '640px', width: '100%' }}>
          <Image
            src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//familia.png"
            alt="Lorena com seus filhos"
            width={540}
            height={540}
            style={{ objectFit: 'contain' }}
            className="w-full"
          />
        </div>
        
        {/* Seta posicionada abaixo do texto */}
        <div className="hidden md:block absolute left-[48%] top-[80%]">
          <Image 
            src="/assets/arrow.png" 
            alt="Seta conectando a foto ao texto" 
            width={250} 
            height={83} 
          />
        </div>
        
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Espaço reservado para a imagem (para manter o layout) */}
            <div className="w-full md:w-1/2 relative mb-12 md:mb-0 opacity-0">
              <div className="h-[300px] md:h-[400px]"></div>
            </div>
            
            {/* Lado direito - Texto "A visão de mãe" */}
            <div className="w-full md:w-2/5 pl-0 md:pl-16 lg:pl-24 mr-0 md:mr-52">
              <h2 className="text-[#1CADD9] text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: '"Fredoka", sans-serif' }}>
                A visão de mãe
              </h2>
              <p className="text-black text-base mb-3" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Sou mãe de duas crianças autistas, e essa vivência me permite enxergar o desenvolvimento infantil sob uma perspectiva completa — técnica, prática e emocional.
              </p>
              <p className="text-black text-base mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="text-black font-bold">Eu sei, na prática, o que funciona, o que precisa ser</span><br />
                <span className="text-black font-bold">ajustado</span> e como conduzir cada família com empatia,<br />
                escuta e conhecimento.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seção de cards informativos com background dividido */}
      <div className="flex flex-col md:flex-row w-full py-12 md:py-20 relative">
        {/* Fundo dividido */}
        <div className="absolute inset-0 flex w-full h-full">
          <div className="w-1/2 bg-[#ADD4E4]"></div>
          <div className="w-1/2 bg-white"></div>
        </div>
        
        {/* Container para os cards */}
        <div className="container mx-auto px-4 md:px-8 lg:px-12 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {/* Card 1 - O QUE FAÇO */}
            <div className="h-full aspect-[3/3.6] md:aspect-auto">
              <InfoCard
                iconSrc="/assets/oquefaco.png"
                title="O QUE FAÇO"
                bgColor="yellow"
                content={
                  <>
                    <p>Há mais de 10 anos, <strong>ajudo famílias de crianças autistas a construírem um desenvolvimento mais leve, funcional e efetivo</strong>, com atendimentos personalizados online e presenciais em Londres.</p>
                  </>
                }
              />
            </div>
            
            {/* Card 2 - COMO CHEGUEI ATÉ AQUI */}
            <div className="h-full aspect-[3/3.6] md:aspect-auto">
              <InfoCard
                iconSrc="/assets/comocheguei.png"
                title="COMO CHEGUEI ATÉ AQUI"
                bgColor="brown"
                content={
                  <>
                    <p>Sou mãe de duas crianças autistas, e essa vivência, somada à minha formação em Terapia Ocupacional e especializações na área, me deu uma visão completa — técnica, prática e emocional — sobre o desenvolvimento infantil.</p>
                  </>
                }
              />
            </div>
            
            {/* Card 3 - ONDE AINDA QUERO CHEGAR */}
            <div className="h-full aspect-[3/3.6] md:aspect-auto">
              <InfoCard
                iconSrc="/assets/ondeainda.png"
                title="ONDE AINDA QUERO CHEGAR"
                bgColor="yellow"
                content={
                  <>
                    <p>Quero <strong>ampliar meu alcance</strong>, levando conhecimento e <strong>estratégias práticas para mais famílias</strong>, fortalecendo o cuidado personalizado e tornando o desenvolvimento infantil mais <strong>acessível e significativo</strong>.</p>
                  </>
                }
              />
            </div>
            
            {/* Card 4 - MEUS SERVIÇOS */}
            <div className="h-full aspect-[3/3.6] md:aspect-auto">
              <InfoCard
                iconSrc="/assets/meusservicos.png"
                title="MEUS SERVIÇOS"
                bgColor="brown"
                content={
                  <>
                    <p>Experiência, conhecimento técnico e empatia, com escuta ativa e estratégias adaptadas à realidade de cada família. Também realizo palestras, consultorias, adaptação de ambientes e produzo <strong>materiais personalizados, como rotinas visuais e PECs</strong>.</p>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
