"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface LoaderProps {
  // Este parâmetro é recebido mas não é chamado diretamente neste componente
  // É usado apenas para tipagem, pois o componente pai (LoadingWrapper) o chama
  finishLoading: () => void;
}

const Loader = ({ /* finishLoading não utilizado diretamente */ }: LoaderProps) => {
  const [counter, setCounter] = useState(0);

  // O finishLoading é chamado pelo componente pai (LoadingWrapper)

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevCounter + 10;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/logos/logo1.webp"
          alt="Lorena Jacob - Terapeuta Infantil"
          width={300}
          height={60}
          unoptimized
          priority
          style={{ width: "300px", height: "auto" }}
          className="mb-8"
        />
        
        <div className="w-80 h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-[#52A4DB] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${counter}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>
        
        <p className="text-[#6E6B46] text-sm font-['Poppins']">
          Carregando... {counter}%
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Loader;
