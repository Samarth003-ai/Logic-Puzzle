import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function LevelSuccessModal({ levelId, responseText, onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#08090D]/90 backdrop-blur-xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full max-w-xl text-center space-y-8 p-8 md:p-12 rounded-2xl border border-dream-glow/30 bg-dream-card/80 shadow-glow-lg"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dream-glow/40 bg-dream-violet/30 text-dream-glow text-xs font-system">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "8s" }} />
          <span>LEVEL {String(levelId).padStart(2, "0")} UNDERSTOOD</span>
        </div>

        <h2 className="font-narrative text-4xl md:text-5xl text-dream-glow font-bold tracking-tight dream-glow-text">
          THE WORLD REMEMBERS.
        </h2>

        <div className="p-6 rounded-xl bg-dream-violet/20 border border-dream-violet/40 text-left">
          <p className="font-narrative text-xl md:text-2xl text-dream-text italic leading-relaxed">
            "{responseText || "The world bends around your insight."}"
          </p>
        </div>

        <div className="pt-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-dream-glow text-[#08090D] font-ui font-semibold text-base shadow-glow-md hover:bg-white transition-all cursor-pointer"
          >
            <span>{levelId >= 5 ? "VIEW ENDING" : "CONTINUE →"}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
