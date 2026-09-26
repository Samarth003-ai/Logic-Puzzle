import React from "react";
import { motion } from "framer-motion";
import { SoundToggle } from "./SoundToggle";
import { RotateCcw, Award } from "lucide-react";

export function EndingScreen({ attempts, onPlayAgain, soundEnabled, onToggleSound }) {
  const totalAttempts = Object.values(attempts || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-6 md:p-12 z-10">
      {/* Top Header */}
      <div className="w-full max-w-4xl flex justify-between items-center">
        <div className="font-system text-xs tracking-widest text-dream-muted uppercase">
          DREAM LOGIC — COMPLETED
        </div>
        <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
      </div>

      {/* Main Ending Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center text-center my-auto max-w-2xl px-4 py-8"
      >
        <div className="w-16 h-16 rounded-full bg-dream-violet/40 border border-dream-glow/50 flex items-center justify-center mb-6 shadow-glow-md">
          <Award className="w-8 h-8 text-dream-glow animate-bounce" style={{ animationDuration: "3s" }} />
        </div>

        <div className="font-system text-sm text-dream-glow tracking-widest uppercase mb-3">
          5 / 5 DREAMS UNDERSTOOD
        </div>

        <h1 className="font-narrative text-4xl md:text-6xl text-dream-text font-bold mb-6 leading-tight">
          "Perhaps the strange thing was never the world."
        </h1>

        <p className="font-narrative text-lg text-dream-muted italic max-w-lg mb-8 leading-relaxed">
          You spent the entire game trying to make the world react. You asked, lied, addressed, and finally learned the art of silence.
        </p>

        {/* Stats card */}
        <div className="w-full max-w-md bg-dream-card/70 border border-dream-violet/40 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-system text-xs text-dream-muted uppercase tracking-wider mb-4 border-b border-dream-violet/30 pb-2">
            EXPERIMENTATION LOG
          </h3>
          <div className="space-y-2 font-system text-xs">
            <div className="flex justify-between text-dream-text">
              <span>LEVEL 01 — THE LISTENING DOOR</span>
              <span className="text-dream-glow">{attempts[1] || 1} attempts</span>
            </div>
            <div className="flex justify-between text-dream-text">
              <span>LEVEL 02 — THE MIRROR</span>
              <span className="text-dream-glow">{attempts[2] || 1} attempts</span>
            </div>
            <div className="flex justify-between text-dream-text">
              <span>LEVEL 03 — THE CAT</span>
              <span className="text-dream-glow">{attempts[3] || 1} attempts</span>
            </div>
            <div className="flex justify-between text-dream-text">
              <span>LEVEL 04 — THE CLOCK</span>
              <span className="text-dream-glow">{attempts[4] || 1} attempts</span>
            </div>
            <div className="flex justify-between text-dream-text">
              <span>LEVEL 05 — THE ROOM THAT WAITS</span>
              <span className="text-dream-glow">{attempts[5] || 1} attempts</span>
            </div>
            <div className="flex justify-between text-dream-glow font-bold border-t border-dream-violet/30 pt-3 mt-3">
              <span>TOTAL INSIGHT ATTEMPTS</span>
              <span>{totalAttempts}</span>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgain}
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-dream-violet border border-dream-glow/40 text-dream-text font-ui font-medium text-sm shadow-glow-sm hover:border-dream-glow transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-dream-glow" />
          <span>ENTER AGAIN (PLAY AGAIN)</span>
        </motion.button>
      </motion.div>

      {/* Footer */}
      <div className="font-system text-xs text-dream-muted/60 tracking-widest uppercase">
        THE DREAM CONTINUES
      </div>
    </div>
  );
}
