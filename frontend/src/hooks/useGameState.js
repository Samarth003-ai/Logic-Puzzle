import { useState, useEffect } from "react";

const STORAGE_KEY = "DREAM_LOGIC_STATE_V1";

const initialGameState = {
  currentLevel: 1,
  gamePhase: "HOME", // 'HOME' | 'PLAYING' | 'SUCCESS_MODAL' | 'ENDING'
  attempts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  completedLevels: [],
  soundEnabled: false,
  lastSuccessResponse: "",
};

export function useGameState() {
  const [gameState, setGameState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialGameState,
          ...parsed,
          // Ensure attempts structure is intact
          attempts: { ...initialGameState.attempts, ...(parsed.attempts || {}) },
        };
      }
    } catch (e) {
      console.warn("Could not load game state from storage:", e);
    }
    return initialGameState;
  });

  // Save state on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.warn("Could not save game state to storage:", e);
    }
  }, [gameState]);

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: "PLAYING",
    }));
  };

  const recordAttempt = (levelId) => {
    setGameState((prev) => ({
      ...prev,
      attempts: {
        ...prev.attempts,
        [levelId]: (prev.attempts[levelId] || 0) + 1,
      },
    }));
  };

  const completeLevel = (levelId, successResponse) => {
    setGameState((prev) => {
      const updatedCompleted = Array.from(new Set([...prev.completedLevels, levelId]));
      const isFinalLevel = levelId >= 5;
      return {
        ...prev,
        completedLevels: updatedCompleted,
        lastSuccessResponse: successResponse || "The world remembers your words.",
        gamePhase: isFinalLevel ? "SUCCESS_MODAL" : "SUCCESS_MODAL",
      };
    });
  };

  const advanceToNextLevel = () => {
    setGameState((prev) => {
      const nextLevel = prev.currentLevel + 1;
      if (nextLevel > 5) {
        return {
          ...prev,
          gamePhase: "ENDING",
        };
      }
      return {
        ...prev,
        currentLevel: nextLevel,
        gamePhase: "PLAYING",
      };
    });
  };

  const toggleSound = (enabled) => {
    setGameState((prev) => ({
      ...prev,
      soundEnabled: enabled !== undefined ? enabled : !prev.soundEnabled,
    }));
  };

  const restartDream = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState(initialGameState);
  };

  return {
    ...gameState,
    startGame,
    recordAttempt,
    completeLevel,
    advanceToNextLevel,
    toggleSound,
    restartDream,
  };
}
