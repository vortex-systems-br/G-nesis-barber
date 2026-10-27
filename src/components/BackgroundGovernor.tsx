"use client";
import { useEffect } from "react";

export function BackgroundGovernor({ sentinelId }: { sentinelId: string }) {
  useEffect(() => {
    const el = document.getElementById(sentinelId);
    if (!el) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(([e]) => {
      const covered = !e.isIntersecting && e.boundingClientRect.top > 0;
      root.dataset.bg = covered ? "paused" : "running";
    });
    io.observe(el);
    return () => io.disconnect();
  }, [sentinelId]);
  return null;
}