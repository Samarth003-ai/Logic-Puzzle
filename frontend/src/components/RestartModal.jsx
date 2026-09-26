import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, X } from "lucide-react";

export function RestartModal({ isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md bg-dream-card/90 border border-dream-violet/60 rounded-xl p-6 shadow-glow-lg text-center relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-dream-muted hover:text-dream-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-dream-violet/30 border border-dream-glow/30 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6 text-dream-glow" />
            </div>

            <h3 className="font-narrative text-2xl text-dream-text mb-2">RESTART THE DREAM?</h3>
            <p className="font-sans text-sm text-dream-muted mb-6 leading-relaxed">
              All progress and attempt counters will be wiped clean. The world will dissolve and return to Level 1.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-dream-violet/50 text-dream-muted hover:text-dream-text font-ui text-sm transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-5 py-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 hover:bg-red-900/60 font-ui text-sm transition-colors shadow-glow-sm"
              >
                CONFIRM RESTART
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
