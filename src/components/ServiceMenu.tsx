"use client";

import { useId, useState } from "react";
import { SERVICES } from "@/lib/services";
import { buildBookingMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

interface Option {
  label: string;
  value: string;
}

const DAY_OPTIONS: readonly Option[] = [
  { label: "Hoje", value: "hoje" },
  { label: "Amanhã", value: "amanhã" },
  { label: "Esta semana", value: "esta semana" },
];

const PERIOD_OPTIONS: readonly Option[] = [
  { label: "Manhã", value: "de manhã" },
  { label: "Tarde", value: "à tarde" },
  { label: "Noite (19h–21h)", value: "à noite" },
];

interface ToggleChipProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

function ToggleChip({ label, active, onToggle }: ToggleChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
        active
          ? "bg-amber-500 border-amber-500 text-zinc-950"
          : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-600"
      }`}
    >
      {label}
    </button>
  );
}

interface SingleChoiceGroupProps {
  legend: string;
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
}

// Escolha única; clicar de novo na opção ativa desmarca.
function SingleChoiceGroup({ legend, options, value, onChange }: SingleChoiceGroupProps) {
  const labelId = useId();

  return (
    <div role="group" aria-labelledby={labelId}>
      <p id={labelId} className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
        {legend}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <ToggleChip
              key={option.value}
              label={option.label}
              active={active}
              onToggle={() => onChange(active ? "" : option.value)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function ServiceMenu() {
  const servicesLabelId = useId();
  const previewLabelId = useId();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const toggleService = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
    );
  };

  // Filtra a partir do catálogo para a mensagem seguir sempre a ordem dos serviços, não a ordem dos cliques.
  const selectedTitles = SERVICES.filter((service) => selectedIds.includes(service.id)).map(
    (service) => service.title,
  );

  const finalMessage = buildBookingMessage({
    services: selectedTitles,
    day: selectedDay,
    period: selectedPeriod,
  });
  const whatsappHref = buildWhatsAppUrl(finalMessage);

  return (
    <>
      <section id="servicos" className="scroll-mt-20 py-20 md:py-28 px-6 border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-amber-500 text-xs font-bold uppercase tracking-widest block mb-3">
                Cuidado Pessoal
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase text-zinc-50">
                Serviços Disponíveis
              </h2>
            </div>
            <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
              Escolha um serviço abaixo para chamar direto no WhatsApp ou utilize o montador mais abaixo para combinar mais de um procedimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => {
              const directUrl = buildWhatsAppUrl(buildBookingMessage({ services: [service.title] }));

              return (
                <article
                  key={service.id}
                  className="flex flex-col justify-between p-8 border border-zinc-800 bg-zinc-900/40 hover:border-amber-500 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-amber-500 px-2.5 py-1 bg-zinc-950 border border-zinc-800">
                        {service.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold uppercase text-zinc-50 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                      {service.description}
                    </p>
                  </div>

                  <a
                    href={directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full pt-4 border-t border-zinc-800/80 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:text-amber-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                  >
                    <span>Consultar e Agendar</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Montador de Mensagem Interativo */}
      <section
        id="agendamento"
        className="scroll-mt-20 py-20 md:py-28 px-6 border-b border-zinc-800 bg-zinc-900/30"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <span className="text-amber-500 text-xs font-bold uppercase tracking-widest block mb-3">
                Atendimento Ágil
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase text-zinc-50 mb-3">
                Monte sua Mensagem
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Selecione um ou mais serviços, o dia e o período de preferência. A mensagem já vai pronta para o WhatsApp da Gênesis.
              </p>
            </div>

            <div role="group" aria-labelledby={servicesLabelId}>
              <p
                id={servicesLabelId}
                className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3"
              >
                1. Quais serviços você procura?
              </p>
              <div className="flex flex-wrap gap-2.5">
                {SERVICES.map((service) => (
                  <ToggleChip
                    key={service.id}
                    label={service.title}
                    active={selectedIds.includes(service.id)}
                    onToggle={() => toggleService(service.id)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SingleChoiceGroup
                legend="2. Quando prefere?"
                options={DAY_OPTIONS}
                value={selectedDay}
                onChange={setSelectedDay}
              />
              <SingleChoiceGroup
                legend="3. Período"
                options={PERIOD_OPTIONS}
                value={selectedPeriod}
                onChange={setSelectedPeriod}
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 p-8 flex flex-col gap-6">
            <span
              id={previewLabelId}
              className="text-xs font-bold uppercase tracking-widest text-amber-500"
            >
              Prévia da mensagem para o WhatsApp
            </span>
            <div
              aria-labelledby={previewLabelId}
              aria-live="polite"
              aria-atomic="true"
              className="p-5 bg-zinc-900 border-l-4 border-amber-500 text-zinc-100 text-sm leading-relaxed min-h-[96px]"
            >
              {finalMessage}
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider text-sm py-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              Enviar Mensagem no WhatsApp
            </a>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Nenhum dado fica salvo no site. Ao clicar, o WhatsApp abrirá com o texto acima pronto para envio ao número (18) 98121-2959.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}