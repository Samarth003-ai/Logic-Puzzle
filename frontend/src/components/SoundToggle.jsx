import React from "react";
import { Volume2, VolumeX } from "lucide-react";

export function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-dream-violet/40 bg-dream-card/60 text-dream-muted hover:text-dream-glow hover:border-dream-glow/40 transition-all duration-300 font-system text-xs focus:outline-none focus:ring-1 focus:ring-dream-glow/50"
      title={enabled ? "Mute Ambient Sound" : "Enable Ambient Sound"}
      aria-label={enabled ? "Mute Ambient Sound" : "Enable Ambient Sound"}
    >
      {enabled ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-dream-glow animate-pulse" />
          <span>SOUND ON</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 opacity-60" />
          <span>SOUND OFF</span>
        </>
      )}
    </button>
  );
}
