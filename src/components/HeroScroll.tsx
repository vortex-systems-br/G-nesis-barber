"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Lê o progresso do scroll de 0 (topo) a 1 (fim da secção)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Animações de Parallax e Zoom amarradas ao Scroll
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.35]); // Zoom in suave
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]); // Movimento para baixo

  // Opacidade da Tipografia (aparece e desaparece como num filme)
  const text1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.25, 0.4, 0.55], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.55, 0.7, 1], [0, 1, 1]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-zinc-950">
      
      {/* Container "Sticky": Fica preso no ecrã enquanto a secção dura */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-zinc-950">
        
        {/* A imagem animada pelo SCROLL com o caminho corrigido */}
        <motion.div
          style={{ scale, y }}
          className="absolute inset-0 w-full h-full origin-center"
        >
          <Image
            src="/images/hero-barbearia.png"
            alt="Gênesis Barbearia - Corte de Cabelo"
            fill
            className="object-cover object-center grayscale contrast-125 brightness-75"
            priority
          />
        </motion.div>

        {/* Camada escura por cima da imagem para dar destaque aos textos */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950/95" />

        {/* --- NARRATIVA 1 --- */}
        <motion.div
          style={{ opacity: text1Opacity }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <span className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-4">
            A Experiência
          </span>
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase text-zinc-50 tracking-tight">
            Onde o estilo encontra a <span className="text-amber-500">precisão</span>
          </h2>
        </motion.div>

        {/* --- NARRATIVA 2 --- */}
        <motion.div
          style={{ opacity: text2Opacity }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase text-zinc-50 tracking-tight drop-shadow-2xl">
            Sem enrolação.<br />Apenas técnica pura.
          </h2>
        </motion.div>

        {/* --- NARRATIVA 3 --- */}
        <motion.div
          style={{ opacity: text3Opacity }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase text-zinc-50 tracking-tight mb-8">
            Pronto para a transformação?
          </h2>
          <div className="inline-block border border-amber-500 bg-zinc-950/50 backdrop-blur-sm text-amber-500 font-bold uppercase tracking-wider text-sm px-10 py-5">
            Continue a descer
          </div>
        </motion.div>

      </div>
    </section>
  );
}