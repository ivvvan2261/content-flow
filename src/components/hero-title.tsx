"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming cn utility exists, if not I will use clsx/tailwind-merge directly or import locally

export function HeroTitle() {
  const text = "让好内容在每一个平台\n都能发光";
  const lines = text.split("\n");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="relative z-10">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight pb-2 flex flex-col items-center">
        {lines.map((line, lineIndex) => (
          <motion.div
            key={lineIndex}
            className="flex flex-wrap justify-center items-center"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {line.split("").map((letter, index) => (
              <motion.span
                variants={child}
                key={index}
                className={cn(
                  "inline-block",
                  "bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-violet-600 to-blue-600 dark:from-blue-400 dark:via-violet-400 dark:to-blue-400",
                  "bg-size-[200%_auto]"
                )}
                style={{
                  backgroundSize: "200% auto",
                }}
                animate={{
                  backgroundPosition: ["0% center", "200% center"],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {letter}
              </motion.span>
            ))}
            {/* Cursor */}
            {lineIndex === lines.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  delay: 2.2 // Wait for text to fully appear
                }}
                className="ml-2 inline-block relative translate-y-1"
              >
                <motion.div
                  className="relative"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [1, 0.8, 1] 
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-8 h-8 text-amber-400 dark:text-amber-300 fill-amber-400/20" />
                  
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 z-10"
                    style={{
                      maskImage: "linear-gradient(60deg, transparent 40%, black 50%, transparent 60%)",
                      WebkitMaskImage: "linear-gradient(60deg, transparent 40%, black 50%, transparent 60%)",
                      maskSize: "200% 100%",
                      WebkitMaskSize: "200% 100%",
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                    }}
                    animate={{ 
                      maskPosition: ["250% 0", "-150% 0"],
                      WebkitMaskPosition: ["250% 0", "-150% 0"]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 6,
                      ease: "linear",
                      delay: 2.4
                    }}
                  >
                    <Sparkles className="w-8 h-8 text-white dark:text-white fill-white" />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </h1>
      
      {/* 科技感装饰元素：光晕 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl -z-10" 
      />
    </div>
  );
}
