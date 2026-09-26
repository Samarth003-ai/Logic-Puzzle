import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { interactWithGame, fetchLevel } from "../services/api";
import { audioService } from "../services/audioService";
import { SoundToggle } from "./SoundToggle";
import { AttemptCounter } from "./AttemptCounter";
import { Send, RotateCcw, HelpCircle, PauseCircle } from "lucide-react";

export function GameScreen({
  levelId,
  attempts,
  onRecordAttempt,
  onCompleteLevel,
  onOpenRestartModal,
  soundEnabled,
  onToggleSound,
}) {
  const [levelData, setLevelData] = useState(null);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([]);
  const [inactivityTimer, setInactivityTimer] = useState(0);
  const inputRef = useRef(null);
  const logEndRef = useRef(null);

  // Load level details
  useEffect(() => {
    let isMounted = true;
    fetchLevel(levelId).then((data) => {
      if (isMounted && data) {
        setLevelData(data);
        setHistory([]);
        setInput("");
      }
    });
    return () => {
      isMounted = false;
    };
  }, [levelId]);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [levelId, isProcessing]);

  // Auto-scroll history log
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isProcessing]);

  // Special inactivity tracker for Level 5 (The Room That Waits)
  useEffect(() => {
    if (levelId !== 5 || isProcessing) return;

    const interval = setInterval(() => {
      setInactivityTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [levelId, isProcessing]);

  const handleSubmit = async (overrideInput) => {
    const textToSubmit = overrideInput !== undefined ? overrideInput : input;
    
    // For level 5, empty submission or "remain still" is allowed. For other levels, avoid empty whitespace
    if (levelId !== 5 && !textToSubmit.trim()) return;
    if (isProcessing) return;

    setIsProcessing(true);
    audioService.playTick();
    onRecordAttempt(levelId);

    const userEntry = textToSubmit.trim() || "[ Silence / Waiting ]";
    
    // Send to backend
    const result = await interactWithGame(levelId, textToSubmit);

    setIsProcessing(false);

    if (result.success) {
      audioService.playSuccessChime();
      onCompleteLevel(levelId, result.response);
    } else {
      setHistory((prev) => [
        ...prev,
        {
          input: userEntry,
          response: result.response,
        },
      ]);
      setInput("");
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const levelFormatted = `LEVEL ${String(levelId).padStart(2, "0")} / 05`;

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 md:p-8 z-10 max-w-4xl mx-auto">
      {/* Top Navigation Bar */}
      <header className="w-full flex items-center justify-between pb-6 border-b border-dream-violet/20">
        <div className="flex items-center gap-4">
          <span className="font-system text-xs tracking-widest text-dream-muted uppercase">
            DREAM LOGIC
          </span>
          <AttemptCounter attempts={attempts[levelId]} />
        </div>

        <div className="flex items-center gap-3">
          <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
          
          <button
            onClick={onOpenRestartModal}
            className="p-2 rounded-full border border-dream-violet/40 bg-dream-card/40 text-dream-muted hover:text-dream-text transition-colors"
            title="Restart Dream"
            aria-label="Restart Dream"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="font-system text-xs text-dream-glow tracking-widest uppercase pl-2 border-l border-dream-violet/30">
            {levelFormatted}
          </div>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="flex-1 flex flex-col justify-center py-8 space-y-8">
        {/* Scene Title & Description */}
        <div className="space-y-4 text-center">
          <h2 className="font-system text-xs tracking-widest text-dream-muted uppercase">
            {levelData ? levelData.title : "LOADING DREAM..."}
          </h2>

          <div className="font-narrative text-2xl md:text-4xl text-dream-text leading-relaxed font-normal whitespace-pre-line max-w-2xl mx-auto">
            {levelData ? levelData.scene : "The room takes form..."}
          </div>
        </div>

        {/* Previous Attempts History Log */}
        {history.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-4 p-4 rounded-xl bg-dream-card/40 border border-dream-violet/30 font-narrative text-lg">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1 border-b border-dream-violet/20 pb-3 last:border-none last:pb-0">
                <div className="text-dream-muted text-base italic font-sans flex items-center gap-2">
                  <span className="text-dream-violet">›</span> "{item.input}"
                </div>
                <div className="text-dream-text text-xl pl-4 border-l-2 border-dream-glow/30">
                  {item.response}
                </div>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        )}

        {/* Interaction Input Area */}
        <div className="space-y-4 max-w-2xl mx-auto w-full">
          <div className="relative group">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              placeholder={levelId === 5 ? "What will you do? (Or say nothing...)" : "What do you say?"}
              className="w-full px-6 py-4 rounded-xl bg-dream-card/80 border border-dream-violet/50 text-dream-text font-ui text-lg placeholder-dream-muted/60 focus:outline-none focus:border-dream-glow focus:ring-1 focus:ring-dream-glow shadow-glow-sm transition-all duration-300 disabled:opacity-50"
            />

            <button
              onClick={() => handleSubmit()}
              disabled={isProcessing || (levelId !== 5 && !input.trim())}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-dream-violet/60 hover:bg-dream-violet border border-dream-glow/30 text-dream-glow hover:text-white transition-all duration-300 flex items-center gap-2 font-ui text-xs tracking-wider uppercase disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Level 5 Special Action Option */}
          {levelId === 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center gap-4 pt-2"
            >
              <button
                onClick={() => handleSubmit("I choose to wait and remain still.")}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dream-card border border-dream-violet/40 text-dream-muted hover:text-dream-glow font-system text-xs tracking-wider transition-colors"
              >
                <PauseCircle className="w-3.5 h-3.5 text-dream-glow" />
                <span>REMAIN STILL / WAIT</span>
              </button>
            </motion.div>
          )}

          {/* Processing Spinner state */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 text-dream-glow font-system text-xs tracking-widest uppercase pt-2"
            >
              <span className="w-2 h-2 rounded-full bg-dream-glow animate-ping" />
              <span>the room is thinking...</span>
            </motion.div>
          )}
        </div>
      </main>

      {/* Bottom Atmospheric Status Footer */}
      <footer className="w-full text-center py-4 border-t border-dream-violet/20 font-system text-xs text-dream-muted/70 tracking-widest uppercase">
        the world is listening.
      </footer>
    </div>
  );
}
