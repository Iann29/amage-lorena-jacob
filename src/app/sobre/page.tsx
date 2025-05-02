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
      <div className="hidden md:block absolute" style={{ top: '180px', left: '58%', zIndex: 10, maxWidth: '25%' }}>
        <div className="mb-6">
          <div className="flex items-baseline flex-wrap">
            <span className="text-stone-700 text-xl md:text-2xl font-semibold font-['Fredoka'] leading-tight mr-2">Eu sou</span>
            <span className="text-stone-700 text-lg md:text-xl font-semibold font-['Poppins'] leading-tight">Lorena Jacob,</span>
          </div>
          
          <div>
            <span className="text-stone-700 text-sm md:text-base font-normal font-['Poppins'] leading-normal">Terapeuta Infantil, especialista em autismo e comorbidades.</span>
          </div>
        </div>
        
        <div className="mt-6">
          <div>
            <div>
              <span className="text-stone-700 text-sm md:text-base font-bold font-['Poppins'] leading-normal">Há mais de 10 anos atuo com crianças autistas,</span>
              <span className="text-stone-700 text-sm md:text-base font-normal font-['Poppins'] leading-normal"> ajudando famílias a construírem caminhos mais leves, funcionais e efetivos no desenvolvimento infantil. </span>
              <span className="text-stone-700 text-sm md:text-base font-semibold font-['Poppins'] leading-normal">Estou me formando como Terapeuta Ocupacional</span>
              <span className="text-stone-700 text-sm md:text-base font-normal font-['Poppins'] leading-normal"> e possuo diversas especializações na área, o que me permite unir técnica, experiência e sensibilidade em cada atendimento.</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row w-full">
        {/* Lado esquerdo - Fundo azul */}
        <div className="w-full md:w-1/2 bg-[#ADD4E4] relative overflow-hidden min-h-screen md:min-h-[120vh] lg:min-h-[130vh]">
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
          
          {/* Espaço reservado para o componente da família que será implementado posteriormente */}
        </div>
        
        {/* Lado direito - Fundo branco */}
        <div className="w-full md:w-3/5 bg-white py-10 px-6 md:px-12 lg:px-16 min-h-screen md:min-h-[120vh] lg:min-h-[130vh]" style={{ position: 'relative', zIndex: 5 }}>
          {/* Espaço para conteúdo adicional no futuro */}
          <div className="md:pt-80">
            {/* Área reservada para conteúdo futuro */}
          </div>
        </div>
      </div>
    </div>
  );
}
