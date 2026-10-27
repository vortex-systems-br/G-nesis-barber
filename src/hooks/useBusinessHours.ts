"use client";

import { useEffect, useState } from "react";
import {
  getOpenStatus,
  getTodayWeekday,
  type OpenStatus,
  type Weekday,
} from "@/lib/business-hours";

const REFRESH_MS = 60_000;

// Começa nulo para servidor e navegador renderizarem o mesmo HTML (sem erro de hidratação).
function useNow(intervalMs: number = REFRESH_MS): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}

export function useOpenStatus(): OpenStatus | null {
  const now = useNow();
  return now ? getOpenStatus(now) : null;
}

export function useTodayWeekday(): Weekday | null {
  const now = useNow();
  return now ? getTodayWeekday(now) : null;
}