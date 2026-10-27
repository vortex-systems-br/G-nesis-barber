export const WHATSAPP_NUMBER = "5518981212959";
export const WHATSAPP_DISPLAY = "(18) 98121-2959";
export const PHONE_TEL = `tel:+${WHATSAPP_NUMBER}`;

const MESSAGE_INTRO =
  "Olá! Vim pelo site da Gênesis Barbearia e gostaria de consultar horários";

export interface BookingMessageOptions {
  services?: readonly string[];
  day?: string;
  period?: string;
}

// Sem mensagem, devolve só o link da conversa (usado no rodapé).
export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Ex.: "Olá! ... horários para: Corte de cabelo e barba e Limpeza de pele. Minha preferência: hoje, à noite."
export function buildBookingMessage({
  services = [],
  day,
  period,
}: BookingMessageOptions = {}): string {
  const subject =
    services.length > 0
      ? ` para: ${new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" }).format(services)}`
      : " disponíveis";

  const preferences = [day, period].filter((item): item is string => Boolean(item));
  const preference =
    preferences.length > 0 ? ` Minha preferência: ${preferences.join(", ")}.` : "";

  return `${MESSAGE_INTRO}${subject}.${preference}`;
}

export const DEFAULT_WHATSAPP_URL = buildWhatsAppUrl(buildBookingMessage());