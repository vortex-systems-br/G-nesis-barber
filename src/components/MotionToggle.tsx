"use client";
import { useEffect, useState } from "react";

const KEY = "fb-motion";
const apply = (paused: boolean) => {
  document.documentElement.dataset.motion = paused ? "paused" : "running";
};

export function MotionToggle() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let stored = false;
    try { stored = localStorage.getItem(KEY) === "paused"; } catch {}
    setPaused(stored);
    apply(stored);
  }, []);

  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={() => {
        const next = !paused;
        setPaused(next);
        apply(next);
        try { localStorage.setItem(KEY, next ? "paused" : "running"); } catch {}
      }}
      className="fixed bottom-4 right-4 z-50 font-mono text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 hover:text-amber-500 transition-colors"
    >
      {paused ? "Retomar fundo" : "Pausar fundo"}
    </button>
  );
}