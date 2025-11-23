"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Pencil as PencilIcon } from "lucide-react";
import Pencil from "../../public/Silhouette_quill_writing_curves___Premium_Vector-removebg-preview.png";

const Main = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-sans selection:bg-purple-500 selection:text-white">

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
      >
        <source src="/myvideo.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 z-10" />

      {/* Floating Orbs */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-4">

        {/* Pre-title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <span className="px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs md:text-sm font-medium tracking-wider uppercase backdrop-blur-md">
            The Ultimate Digital Canvas
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              EDUNAX
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              DRAW APP
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-center max-w-2xl"
        >
          <p className="text-lg md:text-2xl font-light text-gray-300 leading-relaxed">
            Unleash your creativity with tools that help you <br className="hidden md:block" />
            <span className="text-white font-medium">Draw the Imagination</span> into reality.
          </p>
        </motion.div>

        {/* NEW Premium Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12"
        >
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="
                relative px-6 py-2 md:px-10 md:py-2 rounded-full 
                font-extralight text-base md:text-xl tracking-wide
                bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                shadow-[0_0_15px_rgba(168,85,247,0.6)]
                hover:shadow-[0_0_35px_rgba(236,72,153,0.9)]
                transition-all duration-300
                text-white flex items-center gap-2 md:gap-
                backdrop-blur-xl border border-white/10
              "
            >
              Go to Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Floating Pencil */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 z-20 hidden lg:block"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full" />
          <Image
            src={Pencil}
            alt="Decorative Pencil"
            width={200}
            height={200}
            className="relative drop-shadow-2xl rotate-12"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Main;