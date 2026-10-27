import type { CSSProperties } from "react";

const COUNT = 12;

// PRNG determinístico: mesma saída em qualquer render/engine
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(0x9e3779b9);
const between = (a: number, b: number) => a + rnd() * (b - a);
const sec = (n: number) => `${n.toFixed(2)}s`;

const ITEMS = Array.from({ length: COUNT }, (_, i) => {
  const dx = between(15, 35);
  const dy = between(15, 35);
  const dr = between(10, 25);
  return {
    scissor: i % 2 === 0,
    style: {
      "--dx": sec(dx),
      "--dy": sec(dy),
      "--dr": sec(dr),
      "--ox": sec(-rnd() * 2 * dx),
      "--oy": sec(-rnd() * 2 * dy),
      "--or": sec(-rnd() * dr),
    } as CSSProperties,
  };
});

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "block h-full w-full",
} as const;

const Scissor = () => (
  <svg {...svgProps}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

const Clipper = () => (
  <svg {...svgProps}>
    <rect x="7" y="8" width="10" height="12" rx="2" />
    <path d="M8 8V5c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v3" />
    <line x1="9" y1="4" x2="9" y2="2" />
    <line x1="12" y1="4" x2="12" y2="2" />
    <line x1="15" y1="4" x2="15" y2="2" />
  </svg>
);

export default function FloatingBackground() {
  return (
    <div
      aria-hidden="true"
      className="fb pointer-events-none fixed inset-x-0 top-0 -z-10 h-[100lvh] overflow-hidden bg-zinc-950"
    >
      {ITEMS.map((it, i) => (
        <div key={i} className="fb-x absolute left-0 top-0" style={it.style}>
          <div className="fb-y">
            <div className="fb-spin text-zinc-700/50">
              {it.scissor ? <Scissor /> : <Clipper />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}