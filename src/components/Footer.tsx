import { WHATSAPP_DISPLAY, buildWhatsAppUrl } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-14 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-zinc-900">
        <div>
          <span className="font-display font-bold text-xl uppercase text-zinc-50 block mb-2">
            Gênesis Barbearia
          </span>
          <p className="text-sm text-zinc-500">
            Corte, barba e cuidados masculinos em Araçatuba–SP.
          </p>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-300 block mb-2">
            Endereço
          </span>
          <p className="text-sm text-zinc-400">
            Av. 2 de Dezembro, 149 · Residencial Paquere II (Em frente à rotatória)
          </p>
        </div>

        <div className="md:text-right">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-300 block mb-2">
            Contato Direto
          </span>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-400 font-bold text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            WhatsApp: {WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
        <p>© 2026 Gênesis Barbearia. Todos os direitos reservados.</p>
        <a
          href="#inicio"
          className="hover:text-zinc-300 transition-colors uppercase tracking-wider font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          Voltar ao topo &uarr;
        </a>
      </div>
    </footer>
  );
}