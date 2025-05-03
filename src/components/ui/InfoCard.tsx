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

  // Ícone conforme cor do card
  const getIconBgColor = () => {
    return bgColor === "yellow" ? "bg-white" : "bg-[#8C785B]";
  };

  return (
    <div 
      className={`flex flex-col h-full relative ${className}`}
    >
      {/* Card com borda branca */}
      <div className="bg-white p-1.5 rounded-3xl shadow-lg w-full h-full">
        <div 
          className={`flex flex-col rounded-2xl overflow-hidden ${getBgColor()} ${getTextColor()} h-full`}
        >
          {/* Ícone no topo */}
          <div className="absolute -top-6 left-[50%] transform -translate-x-1/2 z-10">
            <div className={`p-3 rounded-xl ${getIconBgColor()} border-4 border-white shadow-md flex items-center justify-center`} style={{width: '70px', height: '70px'}}>
              <Image 
                src={iconSrc} 
                alt={title} 
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>

          {/* Conteúdo do card */}
          <div className="pt-14 pb-8 px-6 flex flex-col h-full">
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
