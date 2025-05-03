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

  // Obter a cor do ícone interno (não mais usado)
  const getIconBgColor = () => {
    return bgColor === "yellow" ? "bg-white" : "bg-[#8C785B]";
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
          <div className="absolute -top-14 left-[50%] transform -translate-x-1/2 z-10">
            <div className={`p-3 rounded-[24px] ${getBgColor()} shadow-lg flex items-center justify-center`} style={{width: '110px', height: '110px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'}}>
              <div className="bg-white w-[85%] h-[85%] rounded-[20px] flex items-center justify-center">
                <Image 
                  src={iconSrc} 
                  alt={title} 
                  width={75}
                  height={65}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Conteúdo do card */}
          <div className="pt-14 pb-8 px-7 flex flex-col h-full">
            <h3 className="font-bold text-center text-xl md:text-2xl mb-4 uppercase" style={{ fontFamily: '"Fredoka", sans-serif' }}>
              {title}
            </h3>
            <div className="text-sm md:text-base flex-grow" style={{ fontFamily: '"Poppins", sans-serif' }}>
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
