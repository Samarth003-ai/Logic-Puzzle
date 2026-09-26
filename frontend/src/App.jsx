import React, { useState, useEffect } from "react";
import { useGameState } from "./hooks/useGameState";
import { audioService } from "./services/audioService";
import { AmbientBackground } from "./components/AmbientBackground";
import { HomeScreen } from "./components/HomeScreen";
import { GameScreen } from "./components/GameScreen";
import { LevelSuccessModal } from "./components/LevelSuccessModal";
import { EndingScreen } from "./components/EndingScreen";
import { RestartModal } from "./components/RestartModal";

export default function App() {
  const gameState = useGameState();
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);

  // Synchronize audio state with gameState
  useEffect(() => {
    audioService.toggleSound(gameState.soundEnabled);
  }, [gameState.soundEnabled]);

  return (
    <div className="min-h-screen bg-[#08090D] text-[#E8E5F0] font-sans selection:bg-[#27213A] selection:text-[#B7A6FF] relative overflow-x-hidden">
      {/* Dynamic Ambient Background Canvas */}
      <AmbientBackground />

      {/* Main Game Screen Routing */}
      {gameState.gamePhase === "HOME" && (
        <HomeScreen
          onStart={gameState.startGame}
          soundEnabled={gameState.soundEnabled}
          onToggleSound={() => gameState.toggleSound()}
        />
      )}

      {(gameState.gamePhase === "PLAYING" || gameState.gamePhase === "SUCCESS_MODAL") && (
        <GameScreen
          levelId={gameState.currentLevel}
          attempts={gameState.attempts}
          onRecordAttempt={gameState.recordAttempt}
          onCompleteLevel={gameState.completeLevel}
          onOpenRestartModal={() => setIsRestartModalOpen(true)}
          soundEnabled={gameState.soundEnabled}
          onToggleSound={() => gameState.toggleSound()}
        />
      )}

      {gameState.gamePhase === "SUCCESS_MODAL" && (
        <LevelSuccessModal
          levelId={gameState.currentLevel}
          responseText={gameState.lastSuccessResponse}
          onContinue={gameState.advanceToNextLevel}
        />
      )}

      {gameState.gamePhase === "ENDING" && (
        <EndingScreen
          attempts={gameState.attempts}
          onPlayAgain={gameState.restartDream}
          soundEnabled={gameState.soundEnabled}
          onToggleSound={() => gameState.toggleSound()}
        />
      )}

      {/* Restart Confirmation Modal */}
      <RestartModal
        isOpen={isRestartModalOpen}
        onClose={() => setIsRestartModalOpen(false)}
        onConfirm={() => {
          gameState.restartDream();
          setIsRestartModalOpen(false);
        }}
      />
    </div>
  );
}
