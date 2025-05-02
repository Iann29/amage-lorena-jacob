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
      <div className="flex flex-col md:flex-row w-full">
        {/* Lado esquerdo - Fundo azul */}
        <div className="w-full md:w-1/2 bg-[#ADD4E4] relative overflow-hidden">
          {/* Texto vertical "Lorena Jacob" */}
          <div className="hidden md:block absolute -left-32 top-1/3 -rotate-90 select-none" style={{ transformOrigin: 'center', zIndex: 0 }}>
            <div className="flex items-center">
              <span className="text-8xl tracking-wide text-[#E7E7E7]" style={{ fontFamily: '"Fredoka One", sans-serif' }}>Lorena</span>
              <span className="text-8xl tracking-wide ml-4 text-[#E7E7E7]" style={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 400 }}>Jacob</span>
            </div>
          </div>
          
          {/* Cartão de perfil */}
          <div className="relative z-10 mx-auto pt-12 md:pt-20 pb-8 max-w-xs md:max-w-sm">
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
          
          {/* Foto da família */}
          <div className="relative z-10 mx-auto max-w-xs md:max-w-sm px-4 md:px-6 mt-4">
            <div className="relative">
              <Image 
                src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//familia.png"
                alt="Lorena com sua família" 
                width={380} 
                height={380}
                className="w-full rounded-lg shadow-md"
              />
              
              {/* Seta apontando */}
              <div className="absolute -bottom-10 -right-2 md:right-0">
                <Image 
                  src="/assets/arrow.png"
                  alt="Seta apontando" 
                  width={65} 
                  height={65}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Lado direito - Fundo branco */}
        <div className="w-full md:w-3/5 bg-white py-10 px-6 md:px-12 lg:px-16">
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
          
          {/* A visão de mãe */}
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl mb-6" style={{ fontFamily: '"Fredoka One", cursive', color: '#28BDDA' }}>
              A visão de mãe
            </h2>
            
            <p className="text-gray-800 mb-5 leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Sou mãe de duas crianças autistas, e essa vivência me permite enxergar o desenvolvimento infantil sob uma
              perspectiva completa — técnica, prática e emocional.
            </p>
            
            <p className="text-gray-800 font-medium leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Eu sei, na prática, o que funciona, o que precisa ser ajustado e como conduzir cada família com empatia,
              escuta e conhecimento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
