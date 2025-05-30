"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePageTransition } from "@/hooks/usePageTransition";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { isTransitioning } = usePageTransition();

  return (
    <>
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key="page-loader"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Image
                src="/logos/logo1.webp"
                alt="Lorena Jacob - Terapeuta Infantil"
                width={250}
                height={50}
                unoptimized
                priority
                style={{ width: "250px", height: "auto" }}
                className="mb-6"
              />
              
              <div className="flex space-x-2">
                <motion.div
                  className="w-3 h-3 bg-[#52A4DB] rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="w-3 h-3 bg-[#52A4DB] rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.15,
                  }}
                />
                <motion.div
                  className="w-3 h-3 bg-[#52A4DB] rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={false}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ pointerEvents: isTransitioning ? 'none' : 'auto' }}
      >
        {children}
      </motion.div>
    </>
  );
}