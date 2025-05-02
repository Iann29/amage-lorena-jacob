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
      <div className="flex flex-col md:flex-row w-full">
        {/* Lado esquerdo - Fundo azul */}
        <div className="w-full md:w-1/2 bg-[#ADD4E4] relative overflow-hidden min-h-screen md:min-h-[120vh] lg:min-h-[130vh]">
          {/* Texto vertical "Lorena Jacob" */}
          <div className="hidden md:block absolute -left-24 top-1/4 -rotate-90 select-none" style={{ transformOrigin: 'center', zIndex: 0 }}>
            <div className="flex flex-col items-center space-y-0">
              <span className="tracking-wide text-[#C0E5F4]" style={{ fontFamily: '"Fredoka One", sans-serif', fontSize: '10rem', lineHeight: '0.9' }}>Lorena</span>
              <span className="tracking-wide text-[#9CCDE1] -mt-16" style={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 500, fontSize: '12rem', lineHeight: '0.8' }}>Jacob</span>
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
          {/* Header "Eu sou Lorena Jacob..." */}
          <div className="mb-8 md:mb-10">
            <h2 className="font-normal text-xl md:text-2xl mb-1 lg:leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
              <span className="font-medium">Eu sou</span> <span className="text-[#7A674C] font-medium">Lorena Jacob</span>, Terapeuta Infantil,
            </h2>
            <p className="text-gray-800 text-lg" style={{ fontFamily: '"Poppins", sans-serif' }}>
              especialista em autismo e comorbidades.
            </p>
          </div>
          
          {/* Segundo parágrafo */}
          <div className="mb-10 md:mb-14">
            <h3 className="font-medium text-lg md:text-xl mb-3" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Há mais de 10 anos atuo com crianças autistas,
            </h3>
            <p className="text-gray-800 leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
              ajudando famílias a construírem caminhos mais leves, funcionais e efetivos
              no desenvolvimento infantil. <span className="font-medium">Estou me formando como Terapeuta Ocupacional</span> e
              possuo diversas especializações na área, o que me permite unir técnica, experiência e
              sensibilidade em cada atendimento.
            </p>
          </div>
          
          {/* Espaço para conteúdo adicional no futuro */}
        </div>
      </div>
    </div>
  );
}
