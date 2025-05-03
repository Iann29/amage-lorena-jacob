"use client";

import Image from "next/image";
import { useEffect } from "react";
import ProfileCard from "@/components/ui/ProfileCard";
import InfoCard from "@/components/ui/InfoCard";
import PortfolioCard from "@/components/ui/PortfolioCard";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Configurações de Fontes
const FONT_URLS = {
  msMadi: "https://fonts.googleapis.com/css2?family=Ms+Madi&display=swap",
  fredokaOne: "https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap",
  fredoka: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500&display=swap",
  poppins: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap",
};

const MOGILA_FONT_STYLE = `
  @font-face {
    font-family: 'Mogila Display';
    src: url('/src/assets/fonts/Mogila Bold.otf') format('opentype');
    font-weight: 400;
    font-style: normal;
  }`;

// Dados do Perfil
const PROFILE_DATA = {
  imageUrl: "https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//lorenaperfil1.png",
  firstName: "Lorena",
  lastName: "Jacob",
  title: "TERAPEUTA INFANTIL",
  socialLinks: {
    facebook: "https://facebook.com/lorenajacob.st",
    instagram: "https://instagram.com/lorenajacob.st",
    handle: "@lorenajacob.st",
  },
};

// Estilos Inline (mantidos exatamente como estavam)
const STYLES = {
  desktopProfileCard: {
    position: "absolute" as const,
    left: "50%",
    transform: "translateX(-71%)",
    top: "220px",
    zIndex: 10,
    pointerEvents: "auto" as const,
  },
  desktopTextSection: {
    top: "330px",
    left: "64%", 
    zIndex: 10, 
    maxWidth: "25%",
  },
  verticalText: {
    transformOrigin: "center",
    zIndex: 0,
  },
  verticalLorena: {
    fontFamily: '"Fredoka One", sans-serif',
    fontSize: "12rem",
    lineHeight: "0.9",
  },
  verticalJacob: {
    fontFamily: '"Fredoka", sans-serif',
    fontWeight: 500,
    fontSize: "14.5rem",
    lineHeight: "0.8",
  },
  rightSection: {
    position: "relative" as const,
    zIndex: 5,
  },
  familyPhoto: {
    zIndex: 2,
    maxWidth: "640px",
    width: "100%",
  },
  visionTitle: {
    fontFamily: '"Fredoka", sans-serif',
  },
  poppinsText: {
    fontFamily: '"Poppins", sans-serif',
  },
  portfolioBackground: {
    backgroundImage: "url('https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//fundosobremim.webp')",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "brightness(1.4) contrast(1.2)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
    maskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
    borderTopLeftRadius: "500px",
    borderTopRightRadius: "500px",
  },
  portfolioMyText: {
    fontFamily: '"Ms Madi", cursive',
  },
  portfolioTitle: {
    fontFamily: "var(--font-mogila)",
  },
};

// Variantes de animação
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function SobrePage() {
  // Refs para animação no scroll
  const visionRef = useRef(null);
  const infoCardsRef = useRef(null);
  const portfolioRef = useRef(null);
  
  const isVisionInView = useInView(visionRef, { once: true, margin: "-100px" });
  const isInfoCardsInView = useInView(infoCardsRef, { once: true, margin: "-100px" });
  const isPortfolioInView = useInView(portfolioRef, { once: true, margin: "-100px" });

  // Carregar Fontes
  useEffect(() => {
    document.body.classList.add("font-poppins");

    // Ms Madi Font
    const linkMsMadi = document.createElement("link");
    linkMsMadi.href = FONT_URLS.msMadi;
    linkMsMadi.rel = "stylesheet";
    document.head.appendChild(linkMsMadi);

    // Mogila Font
    const styleMogila = document.createElement("style");
    styleMogila.textContent = MOGILA_FONT_STYLE;
    document.head.appendChild(styleMogila);

    // Google Fonts
    const gFonts = [
      FONT_URLS.fredokaOne,
      FONT_URLS.fredoka,
      FONT_URLS.poppins,
    ];
    
    gFonts.forEach((url) => {
      const link = document.createElement("link");
      link.href = url;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    });

    return () => {
      document.body.classList.remove("font-poppins");
    };
  }, []);

  return (
    <div className="w-full">
      {/* HERO / TÍTULO E CARD DE PERFIL */}
      
      {/* Card Desktop - SEM ANIMAÇÃO PARA NÃO AFETAR POSICIONAMENTO */}
      <div 
        className="hidden md:block"
        style={STYLES.desktopProfileCard}
      >
        <ProfileCard {...PROFILE_DATA} />
      </div>

      {/* Texto Desktop */}
      <motion.div
        className="hidden md:block absolute"
        style={STYLES.desktopTextSection}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="mb-6">
          <p>
            <span className="text-stone-700 text-2xl md:text-3xl font-semibold font-['Fredoka'] leading-normal mr-2">
              Eu sou
            </span>
            <span className="text-stone-700 text-base md:text-lg font-semibold font-['Poppins'] leading-normal">
              Lorena Jacob,
            </span>
            <span className="text-stone-700 text-base md:text-lg font-normal font-['Poppins'] leading-normal">
              {" "}
              Terapeuta Infantil, especialista em autismo e comorbidades.
            </span>
          </p>
        </div>

        <motion.div 
          className="mt-6"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div>
            <span className="text-black text-base md:text-lg font-bold font-['Poppins'] leading-normal">
              Há mais de 10 anos atuo com crianças autistas,
            </span>
            <span className="text-black text-base md:text-lg font-normal font-['Poppins'] leading-normal">
              {" "}
              ajudando famílias a construírem caminhos mais leves, funcionais e
              efetivos no desenvolvimento infantil.{" "}
            </span>
            <span className="text-black text-base md:text-lg font-semibold font-['Poppins'] leading-normal">
              Estou me formando como Terapeuta Ocupacional
            </span>
            <span className="text-black text-base md:text-lg font-normal font-['Poppins'] leading-normal">
              {" "}
              e possuo diversas especializações na área, o que me permite unir
              técnica, experiência e sensibilidade em cada atendimento.
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* LAYOUT DE FUNDO: DUAS COLUNAS */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Lado Esquerdo - Azul */}
        <div className="w-full md:w-1/2 bg-[#ADD4E4] relative overflow-hidden">
          {/* Texto Vertical Desktop */}
          <motion.div
            className="hidden md:block absolute -left-40 top-65 -rotate-90 select-none"
            style={STYLES.verticalText}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            <div className="flex flex-col items-center space-y-0">
              <span
                className="tracking-wide text-[#C0E5F4]"
                style={STYLES.verticalLorena}
              >
                Lorena
              </span>
              <span
                className="tracking-wide text-[#9CCDE1] -mt-16"
                style={STYLES.verticalJacob}
              >
                Jacob
              </span>
            </div>
          </motion.div>

          {/* Card Mobile */}
          <motion.div 
            className="relative mx-auto pt-12 pb-8 block md:hidden"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
          >
            <div className="mx-4">
              <ProfileCard {...PROFILE_DATA} />
            </div>
          </motion.div>

          <div className="min-h-screen md:min-h-[95vh] lg:min-h-[95vh]" />
        </div>

        {/* Lado Direito - Branco */}
        <div
          className="w-full md:w-3/5 bg-white py-10 px-6 md:px-12 lg:px-16"
          style={STYLES.rightSection}
        >
          <div className="min-h-screen md:min-h-[95vh] lg:min-h-[95vh]" />
        </div>
      </div>

      {/* SEÇÃO "A VISÃO DE MÃE" */}
      <div className="w-full bg-[#FFFDF2] py-5 px-5 md:py-10 md:px-6 relative" ref={visionRef}>
        {/* Foto Vazando */}
        <motion.div
          className="absolute left-[-80px] md:left-[0%] lg:left-[5%] top-[-70px] md:top-[-90px] rotate-[-5deg]"
          style={STYLES.familyPhoto}
          initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
          animate={isVisionInView ? { opacity: 1, rotate: -5, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//familia.png"
            alt="Lorena com seus filhos"
            width={540}
            height={540}
            className="w-full object-contain"
          />
        </motion.div>

        {/* Seta */}
        <motion.div 
          className="hidden md:block absolute left-[48%] top-[80%]"
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisionInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Image
            src="/assets/arrow.png"
            alt="Seta conectando a foto ao texto"
            width={250}
            height={83}
          />
        </motion.div>

        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Placeholder */}
            <div className="w-full md:w-1/2 relative mb-12 md:mb-0 opacity-0">
              <div className="h-[300px] md:h-[400px]" />
            </div>

            {/* Texto */}
            <motion.div 
              className="w-full md:w-2/5 pl-0 md:pl-16 lg:pl-24 mr-0 md:mr-52"
              initial="hidden"
              animate={isVisionInView ? "visible" : "hidden"}
              variants={slideInRight}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-[#1CADD9] text-5xl md:text-6xl font-bold mb-4"
                style={STYLES.visionTitle}
              >
                A visão de mãe
              </h2>
              <p
                className="text-black text-base mb-3"
                style={STYLES.poppinsText}
              >
                Sou mãe de duas crianças autistas, e essa vivência me permite
                enxergar o desenvolvimento infantil sob uma perspectiva completa
                — técnica, prática e emocional.
              </p>
              <p
                className="text-black text-base mb-2"
                style={STYLES.poppinsText}
              >
                <span className="font-bold">
                  Eu sei, na prática, o que funciona, o que precisa ser
                </span>
                <br />
                <span className="font-bold">ajustado</span> e como conduzir cada família com empatia,
                escuta e conhecimento.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ESPAÇADOR COM BACKGROUND DIVIDIDO */}
      <div className="flex flex-col md:flex-row w-full relative h-32 md:h-48 lg:h-64">
        <div className="absolute inset-0 flex w-full h-full">
          <div className="w-full md:w-1/2 bg-[#ADD4E4]" />
          <div className="w-full md:w-3/5 bg-white" />
        </div>
      </div>

      {/* SEÇÃO DE CARDS INFORMATIVOS */}
      <div className="flex flex-col md:flex-row w-full py-12 md:py-20 relative" ref={infoCardsRef}>
        <div className="absolute inset-0 flex w-full h-full">
          <div className="w-full md:w-1/2 bg-[#ADD4E4]" />
          <div className="w-full md:w-3/5 bg-white" />
        </div>

        <div className="container mx-auto px-4 md:px-8 lg:px-12 z-10 relative">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14 lg:gap-10 max-w-7xl mx-auto"
            initial="hidden"
            animate={isInfoCardsInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {/* CARD 1 */}
            <motion.div 
              className="h-full aspect-[4/5] md:aspect-[4/5] lg:w-[300px] lg:h-[420px] mx-auto"
              variants={fadeInUp}
            >
              <InfoCard
                iconSrc="/assets/oquefaco.png"
                title="O QUE FAÇO"
                bgColor="yellow"
                content={
                  <>
                    <p>
                      Há mais de 10 anos, <strong>ajudo famílias de crianças autistas a construírem um desenvolvimento mais leve, funcional e efetivo</strong>, com atendimentos personalizados online e presenciais em Londres.
                    </p>
                  </>
                }
              />
            </motion.div>

            {/* CARD 2 */}
            <motion.div 
              className="h-full aspect-[4/5] md:aspect-[4/5] lg:w-[300px] lg:h-[420px] mx-auto"
              variants={fadeInUp}
            >
              <InfoCard
                iconSrc="/assets/comocheguei.png"
                title="COMO CHEGUEI ATÉ AQUI"
                bgColor="brown"
                content={
                  <>
                    <p>
                      Sou mãe de duas crianças autistas, e essa vivência, somada à minha formação em Terapia Ocupacional e especializações na área, me deu uma visão completa — técnica, prática e emocional — sobre o desenvolvimento infantil.
                    </p>
                  </>
                }
              />
            </motion.div>

            {/* CARD 3 */}
            <motion.div 
              className="h-full aspect-[4/5] md:aspect-[4/5] lg:w-[300px] lg:h-[420px] mx-auto"
              variants={fadeInUp}
            >
              <InfoCard
                iconSrc="/assets/ondeainda.png"
                title="ONDE AINDA QUERO CHEGAR"
                bgColor="yellow"
                content={
                  <>
                    <p>
                      Quero <strong>ampliar meu alcance</strong>, levando conhecimento e <strong>estratégias práticas para mais famílias</strong>, fortalecendo o cuidado personalizado e tornando o desenvolvimento infantil mais <strong>acessível e significativo</strong>.
                    </p>
                  </>
                }
              />
            </motion.div>

            {/* CARD 4 */}
            <motion.div 
              className="h-full aspect-[4/5] md:aspect-[4/5] lg:w-[300px] lg:h-[420px] mx-auto"
              variants={fadeInUp}
            >
              <InfoCard
                iconSrc="/assets/meusservicos.png"
                title="MEUS SERVIÇOS"
                bgColor="brown"
                content={
                  <>
                    <p>
                      Experiência, conhecimento técnico e empatia, com escuta ativa e estratégias adaptadas à realidade de cada família. Também realizo palestras, consultorias, adaptação de ambientes e produzo <strong>materiais personalizados, como rotinas visuais e PECs</strong>.
                    </p>
                  </>
                }
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* SEÇÃO PORTFÓLIO */}
      <div className="flex flex-col md:flex-row w-full py-12 md:py-24 relative" ref={portfolioRef}>
        {/* Fundo Dividido */}
        <div className="absolute inset-0 flex w-full h-full">
          <div className="w-full md:w-1/2 bg-[#ADD4E4]" />
          <div className="w-full md:w-3/5 bg-white" />
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <motion.div 
            className="bg-[#9B8669] rounded-3xl py-16 px-6 md:py-20 md:px-12 lg:px-16 pb-24 md:pb-32 lg:pb-40 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={isPortfolioInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Background Decorativo */}
            <div
              className="absolute inset-0 opacity-100 rounded-t-[500px]"
              style={STYLES.portfolioBackground}
            />

            {/* Título */}
            <motion.div 
              className="relative z-10 pt-24 md:pt-32 lg:pt-40 mb-10 text-center"
              initial="hidden"
              animate={isPortfolioInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3
                className="text-[#FFFBE2] text-7xl md:text-8xl lg:text-9xl font-normal absolute left-1/4 md:left-1/3 top-16 md:top-14 lg:top-12"
                style={STYLES.portfolioMyText}
              >
                Meu
              </h3>
              <h2
                className="text-[#FFFBE2] text-6xl md:text-8xl lg:text-9xl italic"
                style={STYLES.portfolioTitle}
              >
                Portfólio
              </h2>
            </motion.div>

            {/* Logo */}
            <motion.div 
              className="relative z-10 flex justify-center mb-16"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isPortfolioInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Image
                src="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/logos/logobranca.webp"
                alt="Lorena Jacob - Terapeuta Infantil"
                width={240}
                height={70}
                className="object-contain"
              />
            </motion.div>

            {/* Grade de Cards */}
            <motion.div
              className="
                relative z-10
                grid grid-cols-1 md:grid-cols-2
                gap-6 md:gap-8
                max-w-5xl mx-auto
                md:auto-rows-[12rem] lg:auto-rows-[14rem]
              "
              initial="hidden"
              animate={isPortfolioInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              {/* Topo */}
              <motion.div
                className="h-full w-full md:row-span-2"
                variants={scaleIn}
              >
                <PortfolioCard
                  className="h-full w-full"
                  imageUrl="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//acompanhamento-personalizado.webp"
                  subtitle="Acompanhamento"
                  title="Personalizado"
                />
              </motion.div>
              <motion.div
                className="h-full w-full md:row-span-1"
                variants={scaleIn}
              >
                <PortfolioCard
                  className="h-full w-full"
                  imageUrl="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//orientacao-para-pais.webp"
                  subtitle="Orientação para"
                  title="Pais e Cuidadores"
                />
              </motion.div>

              {/* Base */}
              <motion.div
                className="h-full w-full md:row-span-3"
                variants={scaleIn}
              >
                <PortfolioCard
                  className="h-full w-full"
                  imageUrl="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//atividades-recreativas-terapeuticas.webp"
                  subtitle="Atividades Recreativas"
                  title="Terapêuticas"
                />
              </motion.div>
              <motion.div
                className="h-full w-full md:row-span-2"
                variants={scaleIn}
              >
                <PortfolioCard
                  className="h-full w-full"
                  imageUrl="https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//implementacao-treinamento-pecs.webp"
                  subtitle="Implementação e"
                  title="Treinamento com PECS"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}