"use client";

import { useOpenStatus } from "@/hooks/useBusinessHours";

export default function OpenStatus() {
  const status = useOpenStatus();

  return (
    <p
      role="status"
      className="flex min-h-5 items-center gap-2 text-sm uppercase tracking-wider text-zinc-300"
    >
      {status ? (
        <>
          <span
            aria-hidden="true"
            className={`size-2 rounded-full ${status.isOpen ? "bg-emerald-500" : "bg-zinc-600"}`}
          />
          {status.label}
        </>
      ) : (
        <span aria-hidden="true" className="h-4 w-52 animate-pulse rounded bg-zinc-800" />
      )}
    </p>
  );
}