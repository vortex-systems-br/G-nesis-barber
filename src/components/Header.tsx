"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_WHATSAPP_URL } from "@/lib/whatsapp";

const NAV_LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#agendamento", label: "Montar Pedido" },
  { href: "#sobre", label: "A Barbearia" },
  { href: "#localizacao", label: "Horários e Local" },
] as const;

const MOBILE_MENU_ID = "menu-movel";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Esc fecha o menu mobile e devolve o foco ao botão.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <a
          href="#inicio"
          className="flex flex-col leading-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500"
        >
          <span className="font-display font-bold text-2xl tracking-wider text-zinc-50 uppercase">
            Gênesis
          </span>
          <span className="font-sans text-[11px] tracking-[0.2em] text-amber-500 font-semibold uppercase mt-1">
            Barbearia
          </span>
        </a>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-300 hover:text-amber-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500"
            >
              {link.label}
            </a>
          ))}
          <a
            href={DEFAULT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider px-5 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            Agendar pelo WhatsApp
          </a>
        </nav>

        {/* Botão Mobile */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-expanded={isOpen}
          aria-controls={MOBILE_MENU_ID}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          className="md:hidden w-11 h-11 flex items-center justify-center border border-zinc-800 bg-zinc-900 text-zinc-100 hover:border-amber-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          <span aria-hidden="true">{isOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <nav
          id={MOBILE_MENU_ID}
          className="md:hidden border-b border-zinc-800 bg-zinc-950 px-6 py-6 flex flex-col gap-4"
          aria-label="Menu móvel"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="py-2 text-zinc-200 font-medium border-b border-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              {link.label}
            </a>
          ))}
          <a
            href={DEFAULT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full text-center bg-amber-500 text-zinc-950 font-bold uppercase tracking-wider py-3.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            Agendar pelo WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}