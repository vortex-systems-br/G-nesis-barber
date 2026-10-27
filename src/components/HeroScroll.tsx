"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Tem de ser igual ao nº de ficheiros em /public/frames (001.webp … 129.webp)
const TOTAL_FRAMES = 129;
const FRAMES_DIR = "/frames"; // se mudares para /frames-v2, muda também no next.config.ts
const frameUrl = (n: number) => `${FRAMES_DIR}/${String(n).padStart(3, "0")}.webp`; // n: 1-based

const WINDOW = 12;     // frames decodificados em RAM de cada lado do atual
const CONCURRENCY = 4; // downloads simultâneos

// Enquadramento: igual na <img> (poster) e no <canvas>, senão desalinham
const MEDIA_CLASS =
  "h-full w-full object-cover object-[28%_0%] md:object-[center_0%]";

export default function HeroScroll() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const text1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.25, 0.4, 0.55], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.55, 0.7, 1], [0, 1, 1]);
  // invisível => não clicável nem focável
  const text3Visibility = useTransform(text3Opacity, (o) => (o > 0.05 ? "visible" : "hidden"));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reduced motion: fica só o poster estático, sem descarregar a sequência
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Toque (telemóvel/tablet): 1 frame em cada 2 => ~metade dos MB na rede
    const step = window.matchMedia("(pointer: coarse)").matches ? 2 : 1;
    const count = Math.ceil(TOTAL_FRAMES / step);
    const last = count - 1;

    const abort = new AbortController();
    const blobs: (Blob | undefined)[] = new Array(count); // comprimidos (~poucos MB)
    const bitmaps = new Map<number, ImageBitmap>();        // decodificados (só a janela)
    const decoding = new Set<number>();
    const requested = new Set<number>();
    let active = 0;
    let drawn = -1;
    let raf = 0;
    let disposed = false;

    const toIndex = (p: number) => Math.min(last, Math.max(0, Math.round(p * last)));
    let target = toIndex(scrollYProgress.get()); // respeita scroll restaurado

    const inWindow = (i: number) => Math.abs(i - target) <= WINDOW;

    // Frame decodificado mais próximo do alvo (nunca ecrã vazio)
    const nearest = (t: number) => {
      for (let d = 0; d <= last; d++) {
        if (bitmaps.has(t - d)) return t - d;
        if (bitmaps.has(t + d)) return t + d;
      }
      return -1;
    };

    const paint = () => {
      raf = 0;
      const i = nearest(target);
      if (i === -1 || i === drawn) return;
      const bmp = bitmaps.get(i)!;
      if (canvas.width !== bmp.width || canvas.height !== bmp.height) {
        canvas.width = bmp.width; // só acontece 1x (limpa o canvas)
        canvas.height = bmp.height;
      }
      ctx.drawImage(bmp, 0, 0);
      drawn = i;
      canvas.style.opacity = "1"; // revela o canvas por cima do poster
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const decode = async (i: number) => {
      const blob = blobs[i];
      if (!blob || bitmaps.has(i) || decoding.has(i) || !inWindow(i)) return;
      decoding.add(i);
      try {
        const bmp = await createImageBitmap(blob); // decode fora da main thread
        if (disposed || !inWindow(i)) {
          bmp.close(); // o utilizador já saiu desta zona
          return;
        }
        bitmaps.set(i, bmp);
        schedule();
      } catch {
        /* frame corrompido: o fallback desenha o vizinho mais próximo */
      } finally {
        decoding.delete(i);
      }
    };

    const syncWindow = () => {
      for (const [i, bmp] of bitmaps) {
        if (!inWindow(i)) {
          bmp.close();
          bitmaps.delete(i);
        }
      }
      for (let d = 0; d <= WINDOW; d++) { // do mais próximo para o mais longe
        if (target - d >= 0) void decode(target - d);
        if (d > 0 && target + d <= last) void decode(target + d);
      }
    };

    // Download por prioridade: o frame não pedido mais próximo do scroll atual
    const nextToFetch = () => {
      let best = -1;
      let bestDist = Infinity;
      for (let i = 0; i <= last; i++) {
        if (requested.has(i)) continue;
        const d = Math.abs(i - target);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      return best;
    };

    const pump = () => {
      while (!disposed && active < CONCURRENCY) {
        const i = nextToFetch();
        if (i === -1) return;
        requested.add(i);
        active++;
        fetch(frameUrl(i * step + 1), { signal: abort.signal })
          .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.blob();
          })
          .then((blob) => {
            blobs[i] = blob;
            void decode(i);
          })
          .catch(() => {})
          .finally(() => {
            active--;
            pump();
          });
      }
    };

    const unsubscribe = scrollYProgress.on("change", (p) => {
      const next = toIndex(p);
      if (next === target) return;
      target = next;
      syncWindow();
      schedule();
    });

    pump();

    return () => {
      disposed = true;
      abort.abort();
      unsubscribe();
      cancelAnimationFrame(raf);
      bitmaps.forEach((b) => b.close());
      bitmaps.clear();
      canvas.width = 0; // liberta o backing store no Safari
      canvas.style.opacity = "0";
    };
  }, [scrollYProgress]);

  return (
    <section ref={containerRef} className="hero-scroll relative h-[400svh]">
      {/* imagem em lvh: sem faixa vazia quando a barra do Safari colapsa */}
      <div className="sticky top-0 h-[100lvh] w-full overflow-hidden bg-zinc-950">
        {/* Área da imagem: começa abaixo do cabeçalho (top-20 = 5rem) */}
        <div className="absolute inset-x-0 bottom-0 top-20">
          {/* Poster (SSR): LCP, primeiro paint e fallback de reduced-motion */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frameUrl(1)}
            alt=""
            fetchPriority="high"
            decoding="async"
            className={`absolute inset-0 ${MEDIA_CLASS}`}
          />
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`absolute inset-0 opacity-0 ${MEDIA_CLASS}`}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/30 to-zinc-950/95" />

        {/* texto em svh: centrado na área realmente visível */}
        <div className="absolute inset-x-0 top-0 h-[100svh]">
          <motion.div
            style={{ opacity: text1Opacity }}
            className="hero-panel-1 pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <span className="mb-4 text-sm font-bold uppercase tracking-widest text-amber-500">
              A Experiência
            </span>
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-zinc-50 drop-shadow-lg md:text-7xl">
              Onde o estilo encontra a <span className="text-amber-500">precisão</span>
            </h2>
          </motion.div>

          <motion.div
            style={{ opacity: text2Opacity }}
            className="hero-panel-2 pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-zinc-50 drop-shadow-2xl md:text-6xl">
              Sem enrolação.
              <br />
              Apenas técnica pura.
            </h2>
          </motion.div>

          <motion.div
            style={{ opacity: text3Opacity, visibility: text3Visibility }}
            className="hero-panel-3 pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <h2 className="mb-8 font-display text-4xl font-bold uppercase tracking-tight text-zinc-50 drop-shadow-xl md:text-7xl">
              Pronto para a transformação?
            </h2>
            <a
              href="#after-hero"
              className="pointer-events-auto inline-block border border-amber-500 bg-zinc-950/80 px-10 py-5 text-sm font-bold uppercase tracking-wider text-amber-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500"
            >
              Continue a descer
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}