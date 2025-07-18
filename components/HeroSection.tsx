// components/HeroSection.tsx
"use client"; // This component uses client-side hooks like useState, so mark it.

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  // Framer Motion variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15, // Delay between child animations
        delayChildren: 0.2, // Initial delay for children
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    },
  };

  const mockupVariants = {
    initial: { opacity: 0, y: 80, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: 0.8, // Delay after text animations
        staggerChildren: 0.2,
      },
    },
  };

  const phoneVariants = {
    initial: { opacity: 0, y: 50, rotate: 0 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      rotate: i === 0 ? -4 : i === 1 ? 4 : 0, // Slight rotation for visual interest
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    }),
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-32 bg-gradient-sky min-h-screen flex flex-col items-center justify-center">
      {/* Background blobs for visual interest */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-80 h-80 bg-sky-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob top-10 left-1/4"></div>
        <div className="absolute w-96 h-96 bg-sky-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 bottom-20 right-1/4"></div>
        <div className="absolute w-72 h-72 bg-sky-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-sky-blue-900 leading-tight mb-6 tracking-tighter"
          >
            Bring the Power of AI to Your{" "}
            <span className="text-gradient-sky">Captions.</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-sky-blue-700 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Extract stunning caption styles from any Instagram Reel and apply
            them effortlessly to your videos.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link href="/get-started" passHref>
              <Button
                size="xl" // Use the larger 'xl' size
                className="px-12 py-4 rounded-full text-lg shadow-custom-lg hover:shadow-custom-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Get Started &rarr;
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Visual Mockups Section */}
        <motion.div
          variants={mockupVariants}
          initial="initial"
          animate="animate"
          className="relative mt-20 md:mt-28 flex justify-center items-end space-x-4 md:space-x-8"
        >
          {/* Mockup 1: Instagram Reel */}
          <motion.div
            variants={phoneVariants}
            custom={0} // Custom prop for index-based animation
            className="relative w-48 h-96 md:w-64 md:h-[32rem] rounded-3xl overflow-hidden shadow-custom-xl bg-white
                       transform rotate-[-4deg] translate-y-4 hover:rotate-0 hover:scale-105 transition-all duration-300 ease-out"
          >
            <Image
              src="/images/hero-mockup-1.png"
              alt="Instagram Reel Example UI"
              layout="fill"
              objectFit="cover"
              className="rounded-3xl"
            />
          </motion.div>

          {/* Mockup 2: Timeline Editor (center, slightly larger/prominent) */}
          <motion.div
            variants={phoneVariants}
            custom={1}
            className="relative w-52 h-[26rem] md:w-72 md:h-[36rem] rounded-3xl overflow-hidden shadow-custom-xl bg-white
                       transform scale-105 z-10 hover:scale-110 transition-all duration-300 ease-out"
          >
            <Image
              src="/images/hero-mockup-2.png"
              alt="Timeline Editor Example UI"
              layout="fill"
              objectFit="cover"
              className="rounded-3xl"
            />
          </motion.div>

          {/* Mockup 3: Caption Editor Panel (hidden on small screens) */}
          <motion.div
            variants={phoneVariants}
            custom={2}
            className="relative w-48 h-96 md:w-64 md:h-[32rem] rounded-3xl overflow-hidden shadow-custom-xl bg-white
                       transform rotate-[4deg] translate-y-4 hover:rotate-0 hover:scale-105 transition-all duration-300 ease-out hidden md:block"
          >
            <Image
              src="/images/hero-mockup-3.png"
              alt="Caption Editor Panel Example UI"
              layout="fill"
              objectFit="cover"
              className="rounded-3xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
