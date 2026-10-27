"use client";

import { useTodayWeekday } from "@/hooks/useBusinessHours";
import { WEEKDAY_LABEL, WEEK_ORDER, formatDayHours } from "@/lib/business-hours";
import { PHONE_TEL, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export default function InfoSection() {
  const today = useTodayWeekday();

  return (
    <>
      <section id="sobre" className="scroll-mt-20 py-20 px-6 border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest block mb-3">
              A Barbearia
            </span>
            <h2 className="font-display text-4xl font-bold uppercase text-zinc-50">
              Sobre a Gênesis
            </h2>
          </div>
          <div className="md:col-span-7 flex flex-col gap-4 text-zinc-400 leading-relaxed">
            <p>
              Localizada no Residencial Paquere II em Araçatuba, a Gênesis Barbearia é um espaço dedicado ao cuidado pessoal masculino com atendimento direto e sem enrolação.
            </p>
            <p>
              Você explica o que procura ou traz a sua referência e alinha direto com o barbeiro o melhor caminho para o seu visual — do corte clássico ou degradê à limpeza de pele e manutenção da barba.
            </p>
          </div>
        </div>
      </section>

      <section
        id="localizacao"
        className="scroll-mt-20 py-20 md:py-28 px-6 border-b border-zinc-800 bg-zinc-950"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">

          <div className="lg:col-span-5 flex flex-col justify-between gap-8 p-8 border border-zinc-800 bg-zinc-900/30">
            <div>
              <span className="text-amber-500 text-xs font-bold uppercase tracking-widest block mb-3">
                Onde Estamos
              </span>
              <h2 className="font-display text-3xl font-bold uppercase text-zinc-50 mb-6">
                Localização
              </h2>
              <address className="not-italic text-zinc-300 space-y-2 text-base">
                <strong className="block text-xl font-display uppercase text-zinc-50 tracking-wide">
                  Gênesis Barbearia
                </strong>
                <p>Av. 2 de Dezembro, 149</p>
                <p>Residencial Paquere – II · Araçatuba–SP</p>
                <p className="text-amber-500 font-semibold text-sm pt-2">
                  Referência: Em frente à rotatória
                </p>
                <p className="text-zinc-400 text-sm pt-2">
                  WhatsApp: {WHATSAPP_DISPLAY}
                </p>
              </address>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Av.+2+de+Dezembro%2C+149%2C+Ara%C3%A7atuba+-+SP"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center border border-zinc-700 hover:border-amber-500 text-zinc-100 hover:text-amber-500 font-bold uppercase tracking-wider text-xs py-4 px-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                Traçar Rota no Mapa
              </a>
              <a
                href={PHONE_TEL}
                className="text-center border border-zinc-800 bg-zinc-950 hover:border-zinc-600 text-zinc-300 font-bold uppercase tracking-wider text-xs py-4 px-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                Ligar
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest block mb-3">
              Planeje sua Visita
            </span>
            <h2 className="font-display text-3xl font-bold uppercase text-zinc-50 mb-6">
              Horários de Funcionamento
            </h2>

            <ul className="divide-y divide-zinc-800 border-y border-zinc-800">
              {WEEK_ORDER.map((weekday) => {
                const isToday = today === weekday;
                const hours = formatDayHours(weekday);
                return (
                  <li
                    key={weekday}
                    aria-current={isToday ? "date" : undefined}
                    className={`py-4 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 ${
                      isToday ? "bg-zinc-900/90 border-l-4 border-l-amber-500" : ""
                    }`}
                  >
                    <span className="font-bold text-zinc-100 flex items-center gap-2">
                      {WEEKDAY_LABEL[weekday]}
                      {isToday && (
                        <span className="text-[10px] uppercase tracking-widest bg-amber-500 text-zinc-950 font-bold px-2 py-0.5">
                          Hoje
                        </span>
                      )}
                    </span>
                    <span className={`text-sm ${hours === "Fechado" ? "text-zinc-500" : "text-zinc-300"}`}>
                      {hours}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-zinc-500 mt-4">
              * Em feriados, confirme o expediente diretamente pelo WhatsApp antes de se deslocar.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}