"use client";
import Image from "next/image";
import React from "react";

interface InfoCardProps {
  iconSrc: string;
  title: string;
  content: React.ReactNode;
  bgColor: "yellow" | "brown";
  className?: string;
}

export default function InfoCard({
  iconSrc,
  title,
  content,
  bgColor,
  className = "",
}: InfoCardProps) {
  const getBgColor = () => {
    switch (bgColor) {
      case "yellow":
        return "bg-[#FFE88F]";
      case "brown":
        return "bg-[#8C785B]";
      default:
        return "bg-[#FFE88F]";
    }
  };

  const getTextColor = () => {
    return bgColor === "brown" ? "text-white" : "text-black";
  };

  return (
    <div 
      className={`flex flex-col h-full relative ${className}`}
    >
      {/* Card com borda branca */}
      <div className="bg-white p-[2px] rounded-[32px] w-full h-full" style={{ boxShadow: '0px 0px 25px rgba(0, 0, 0, 0.1), 0px 5px 15px rgba(0, 0, 0, 0.07), 0px 3px 8px rgba(0, 0, 0, 0.06)' }}>
        <div 
          className={`flex flex-col rounded-[28px] overflow-hidden ${getBgColor()} ${getTextColor()} h-full`}
        >
          {/* Ícone no topo com fundo branco para todos os cards */}
          <div className="absolute -top-10 md:-top-14 left-[50%] transform -translate-x-1/2 z-10">
            <div className={`p-3 rounded-[24px] ${getBgColor()} shadow-lg flex items-center justify-center w-[90px] h-[90px] md:w-[110px] md:h-[110px]`} style={{boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'}}>
              <div className="bg-white w-[85%] h-[85%] rounded-[20px] flex items-center justify-center">
                <Image 
                  src={iconSrc} 
                  alt={title} 
                  width={75}
                  height={65}
                  className="object-contain w-[60px] h-[50px] md:w-[75px] md:h-[65px]"
                />
              </div>
            </div>
          </div>

          {/* Conteúdo do card */}
          <div className="pt-10 md:pt-14 pb-6 md:pb-8 px-5 md:px-7 flex flex-col h-full">
            <h3 className="font-bold text-center text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 uppercase" style={{ fontFamily: '"Fredoka", sans-serif' }}>
              {title}
            </h3>
            <div className="text-xs md:text-sm lg:text-base flex-grow leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
