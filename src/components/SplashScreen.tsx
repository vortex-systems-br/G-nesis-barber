"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [iconType, setIconType] = useState<"scissors" | "clipper">("scissors");

  useEffect(() => {
    // Escolhe aleatoriamente entre a tesoura e a máquina a cada load
    setIconType(Math.random() > 0.5 ? "scissors" : "clipper");

    // Remove o ecrã de carregamento após 3 segundos exatos
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 splash-container">
      <style>{`
        .splash-container {
          animation: fadeOut 0.5s ease-in-out 2.5s forwards;
        }
        .animate-cut-line {
          animation: progressLine 2s cubic-bezier(0.7, 0, 0.3, 1) 0.3s forwards;
        }
        .scissor-snip {
          animation: snip 0.3s ease-in-out infinite alternate;
        }
        .clipper-vibrate {
          animation: vibrate 0.08s linear infinite;
        }

        /* Animação de desaparecer o fundo */
        @keyframes fadeOut {
          0% { opacity: 1; visibility: visible; }
          100% { opacity: 0; visibility: hidden; }
        }

        /* Animação da barra a crescer (o corte) */
        @keyframes progressLine {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        /* Animação da Tesoura a cortar */
        @keyframes snip {
          0% { transform: translateY(-50%) rotate(-10deg) scale(1.2); }
          100% { transform: translateY(-50%) rotate(10deg) scale(1.2); }
        }

        /* Animação da Máquina a vibrar */
        @keyframes vibrate {
          0% { transform: translateY(-50%) translate(0px, 0px) rotate(90deg) scale(1.2); }
          25% { transform: translateY(-50%) translate(-1px, 1px) rotate(91deg) scale(1.2); }
          50% { transform: translateY(-50%) translate(0px, -1px) rotate(90deg) scale(1.2); }
          75% { transform: translateY(-50%) translate(1px, 1px) rotate(89deg) scale(1.2); }
          100% { transform: translateY(-50%) translate(0px, 0px) rotate(90deg) scale(1.2); }
        }
      `}</style>

      {/* Marca Premium */}
      <h1 className="text-zinc-50 font-display text-4xl uppercase tracking-[0.3em] mb-12 opacity-80">
        Gênesis
      </h1>

      {/* A linha de corte e o ícone */}
      <div className="relative w-64 md:w-80 h-px bg-zinc-800 rounded-full">
        {/* O progresso âmbar que "segue" o ícone */}
        <div className="absolute top-0 left-0 h-full bg-amber-500 animate-cut-line w-0 origin-left">
          
          {/* O Ícone (acoplado à ponta direita da linha) */}
          <div className="absolute right-0 top-1/2 translate-x-1/2 text-amber-500">
            {iconType === "scissors" ? (
              // Ícone de Tesoura Brutalista
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="scissor-snip bg-zinc-950 rounded-full px-1"
              >
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
                <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
                <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
              </svg>
            ) : (
              // Ícone de Máquina de Cortar Cabelo Customizada
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="clipper-vibrate bg-zinc-950 rounded-full px-1"
              >
                <rect x="7" y="8" width="10" height="12" rx="2"></rect>
                <path d="M8 8V5c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v3"></path>
                <line x1="9" y1="4" x2="9" y2="2"></line>
                <line x1="12" y1="4" x2="12" y2="2"></line>
                <line x1="15" y1="4" x2="15" y2="2"></line>
              </svg>
            )}
          </div>
        </div>
      </div>
      
      <span className="text-zinc-600 text-xs font-mono uppercase tracking-widest mt-12">
        Preparando o visual...
      </span>
    </div>
  );
}