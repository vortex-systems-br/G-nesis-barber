"use client";

import Image from "next/image";
import { useOpenStatus } from "@/hooks/useBusinessHours";
import { DEFAULT_WHATSAPP_URL } from "@/lib/whatsapp";

export default function Hero() {
  const status = useOpenStatus();

  return (
    <section id="inicio" className="border-b border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 border border-zinc-800 bg-zinc-900 text-amber-500 text-xs font-bold uppercase tracking-widest">
              Araçatuba–SP · Res. Paquere II
            </span>
            {status && (
              <span
                role="status"
                className="inline-flex items-center gap-2 px-3 py-1 border border-zinc-800 bg-zinc-900/60 text-zinc-300 text-xs font-medium"
              >
                <span
                  aria-hidden="true"
                  className={`w-2 h-2 rounded-full ${
                    status.isOpen ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-zinc-500"
                  }`}
                />
                {status.label}
              </span>
            )}
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight leading-[0.98] text-zinc-50">
            Corte, Barba e <br />
            <span className="text-amber-500">Acabamento Preciso.</span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
            Cabelo na tesoura ou degradê, barba alinhada e cuidados com a pele na Av. 2 de Dezembro, 149. Sem fila cega: consulte a disponibilidade direto no WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
            <a
              href={DEFAULT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider text-sm px-8 py-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              Consultar Horários no WhatsApp
            </a>
            <a
              href="#agendamento"
              className="inline-flex items-center justify-center border border-zinc-700 hover:border-amber-500 text-zinc-100 hover:text-amber-500 font-bold uppercase tracking-wider text-sm px-8 py-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              Montar Mensagem Rápida
            </a>
          </div>

          <p className="text-xs text-zinc-500">
            * A mensagem inicia o atendimento; o horário fica reservado após confirmação da equipe.
          </p>
        </div>

        {/* Imagem com enquadramento refinado para o cotovelo ficar no limite (object-[63%_center]) */}
        <div className="lg:col-span-5 w-full h-full flex items-center">
          <div className="relative w-full h-[460px] lg:h-[520px] rounded-sm border border-zinc-800 overflow-hidden shadow-2xl bg-zinc-900">
            <Image
              src="/images/hero-barbearia.png"
              alt="Interior da Gênesis Barbearia em Araçatuba"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-[63%_center] grayscale contrast-125 opacity-90"
              priority
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent p-6 pointer-events-none z-10">
              <p className="font-display uppercase text-sm tracking-widest text-amber-500">
                Av. 2 de Dezembro, 149
              </p>
              <p className="text-zinc-300 text-xs mt-1">
                Em frente à rotatória · Residencial Paquere II
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Faixa brutalista estática de especialidades */}
      <div className="border-t border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-display uppercase tracking-widest text-zinc-400">
          <span>◆ Corte & Barba</span>
          <span>◆ Assinatura Mensal</span>
          <span>◆ Limpeza de Pele</span>
          <span>◆ Depilação Nasal e Orelha</span>
          <span>◆ Selagem e Alisamento</span>
          <span>◆ Remoção de Cravos</span>
        </div>
      </div>
    </section>
  );
}