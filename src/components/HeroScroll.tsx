"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const FRAME_COUNT = 150; // Total de imagens da nossa futura sequência

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(0);

  // 1. Hook do Framer Motion para rastrear o scroll dentro desta secção (de 0 a 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 2. Transforma o progresso do scroll (0 a 1) no índice da imagem (0 a 149)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // Tipografia: Mapeamento de opacidade baseado no scroll para criar a narrativa
  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.25], [1, 1, 0, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.55], [0, 1, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.8, 1], [0, 1, 1, 1]);

  // Função para desenhar o frame no Canvas cobrindo o ecrã inteiro (estilo object-cover)
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    currentFrame.current = index;
    const img = imagesRef.current[index];

    // FALLBACK: Se a imagem não existir (fase de protótipo), desenha um fundo dinâmico de teste
    if (!img || !img.complete || img.naturalWidth === 0) {
      ctx.fillStyle = "#09090b"; // bg-zinc-950
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Círculo âmbar que se move com o scroll simulando o foco de luz
      ctx.beginPath();
      const radius = canvas.width * 0.3;
      const x = canvas.width * 0.2 + (canvas.width * 0.6 * (index / FRAME_COUNT));
      const y = canvas.height * 0.5;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245, 158, 11, 0.1)"; // text-amber-500 com opacidade
      ctx.fill();
      return;
    }

    // Lógica para manter a proporção da imagem (object-fit: cover)
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  };

  useEffect(() => {
    // Pré-carregamento das imagens em memória
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      // O Next.js vai procurar estes ficheiros em: public/frames/frame_001.webp
      const frameNum = String(i).padStart(3, "0");
      img.src = `/frames/frame_${frameNum}.webp`;
      imagesRef.current.push(img);
    }

    // Configuração do Canvas para ter a resolução exata do ecrã
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        renderFrame(currentFrame.current);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Configuração inicial

    // Forçar desenho do primeiro frame assim que a primeira imagem carregar
    if (imagesRef.current[0]) {
      imagesRef.current[0].onload = () => renderFrame(0);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sempre que o utilizador faz scroll, o Framer Motion atualiza o index e nós desenhamos
  useMotionValueEvent(frameIndex, "change", (latest) => {
    renderFrame(Math.floor(latest));
  });

  return (
    // Altura de 400vh cria o espaço longo para fazer scroll enquanto a cena decorre
    <section ref={containerRef} className="relative h-[400vh] bg-zinc-950">
      
      {/* Container Sticky: Fica "preso" no ecrã enquanto descemos a altura acima */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* O Canvas onde o vídeo decorre frame a frame */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Camada de sobreposição escurecida para legibilidade do texto */}
        <div className="absolute inset-0 bg-zinc-950/40" />

        {/* --- NARRATIVA: Os textos que surgem e desaparecem --- */}
        
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

        <motion.div
          style={{ opacity: text2Opacity }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase text-zinc-50 tracking-tight">
            Sem enrolação.<br />Apenas técnica pura.
          </h2>
        </motion.div>

        <motion.div
          style={{ opacity: text3Opacity }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase text-zinc-50 tracking-tight mb-8">
            Pronto para a transformação?
          </h2>
          {/* Botão estético simulando a chamada para a ação */}
          <div className="inline-block border border-amber-500 text-amber-500 font-bold uppercase tracking-wider text-sm px-10 py-5">
            Deslize para agendar
          </div>
        </motion.div>

      </div>
    </section>
  );
}