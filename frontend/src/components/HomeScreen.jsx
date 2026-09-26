import React from "react";
import { motion } from "framer-motion";
import { SoundToggle } from "./SoundToggle";
import { ArrowRight, Sparkles } from "lucide-react";

export function HomeScreen({ onStart, soundEnabled, onToggleSound }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-6 md:p-12 z-10">
      {/* Top Header Bar */}
      <div className="w-full max-w-5xl flex justify-between items-center">
        <div className="font-system text-xs tracking-widest text-dream-muted uppercase">
          [ D R E A M — L O G I C ]
        </div>
        <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
      </div>

      {/* Main Center Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="flex flex-col items-center text-center my-auto max-w-2xl px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dream-violet/40 bg-dream-card/40 text-dream-glow text-xs font-system"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>NATURAL LANGUAGE INFERENCE LAB</span>
        </motion.div>

        <h1 className="font-narrative text-6xl md:text-8xl tracking-tight text-dream-text font-bold mb-6 dream-glow-text leading-none">
          DREAM LOGIC
        </h1>

        <p className="font-narrative text-xl md:text-2xl text-dream-muted italic max-w-lg mb-12 leading-relaxed font-normal">
          "Some worlds only make sense when you stop making sense."
        </p>

        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(183, 166, 255, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-dream-violet/80 to-[#1b152b] border border-dream-glow/40 text-dream-text font-ui font-medium text-base tracking-wide shadow-glow-sm hover:border-dream-glow transition-all duration-300 cursor-pointer"
        >
          <span>ENTER THE DREAM</span>
          <ArrowRight className="w-4 h-4 text-dream-glow group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>

      {/* Bottom Footer Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-center font-system text-xs text-dream-muted/70 tracking-widest uppercase"
      >
        A natural-language puzzle experience
      </motion.div>
    </div>
  );
}
