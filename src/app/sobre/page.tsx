"use client";

import Image from "next/image";
import { useEffect } from "react";
import ProfileCard from "@/components/ui/ProfileCard";

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
              <span className="text-stone-700 text-base md:text-lg font-bold font-['Poppins'] leading-normal">Há mais de 10 anos atuo com crianças autistas,</span>
              <span className="text-stone-700 text-base md:text-lg font-normal font-['Poppins'] leading-normal"> ajudando famílias a construírem caminhos mais leves, funcionais e efetivos no desenvolvimento infantil. </span>
              <span className="text-stone-700 text-base md:text-lg font-semibold font-['Poppins'] leading-normal">Estou me formando como Terapeuta Ocupacional</span>
              <span className="text-stone-700 text-base md:text-lg font-normal font-['Poppins'] leading-normal"> e possuo diversas especializações na área, o que me permite unir técnica, experiência e sensibilidade em cada atendimento.</span>
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
      <div className="w-full bg-[#FFFDF2] py-3 px-4 relative">
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
        
        {/* Seta da foto para o texto */}
        <div className="hidden md:block absolute left-[42%] top-[25%]">
          <Image 
            src="/assets/arrow.png" 
            alt="Seta conectando a foto ao texto" 
            width={150} 
            height={50} 
            style={{ transform: 'rotate(15deg)' }} 
          />
        </div>
        
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Espaço reservado para a imagem (para manter o layout) */}
            <div className="w-full md:w-1/2 relative mb-12 md:mb-0 opacity-0">
              <div className="h-[300px] md:h-[400px]"></div>
            </div>
            
            {/* Lado direito - Texto "A visão de mãe" */}
            <div className="w-full md:w-1/2 pl-0 md:pl-8 lg:pl-16">
              <h2 className="text-[#1CADD9] text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: '"Fredoka", sans-serif' }}>
                A visão de mãe
              </h2>
              <p className="text-stone-700 text-base mb-6" style={{ fontFamily: '"Poppins", sans-serif' }}>
                Sou mãe de duas crianças autistas, e essa vivência me permite enxergar o desenvolvimento infantil sob uma perspectiva completa — técnica, prática e emocional.
              </p>
              <p className="text-stone-700 text-base mb-2" style={{ fontFamily: '"Poppins", sans-serif' }}>
                <span className="font-bold">Eu sei, na prática, o que funciona, o que precisa ser ajustado</span> e como conduzir cada família com empatia, escuta e conhecimento.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Continuação do background colorido após a seção #FFFDF2 */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Continuação do lado esquerdo - Fundo azul */}
        <div className="w-full md:w-1/2 bg-[#ADD4E4] relative overflow-hidden min-h-[50vh] md:min-h-[70vh]">
          {/* Espaço reservado para conteúdo futuro */}
        </div>
        
        {/* Continuação do lado direito - Fundo branco */}
        <div className="w-full md:w-3/5 bg-white py-10 px-6 md:px-12 lg:px-16 min-h-[50vh] md:min-h-[70vh]">
          {/* Espaço reservado para conteúdo futuro */}
        </div>
      </div>
    </div>
  );
}
