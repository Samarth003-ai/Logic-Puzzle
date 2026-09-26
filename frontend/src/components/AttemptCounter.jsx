import React from "react";

export function AttemptCounter({ attempts }) {
  const formatted = String(attempts || 0).padStart(2, "0");
  return (
    <div className="font-system text-xs text-dream-muted tracking-wider uppercase flex items-center gap-1.5 px-2.5 py-1 rounded bg-dream-card/40 border border-dream-violet/30">
      <span className="w-1.5 h-1.5 rounded-full bg-dream-glow/70 animate-ping" />
      <span>ATTEMPTS {formatted}</span>
    </div>
  );
}
