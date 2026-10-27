export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface TimeRange {
  open: string; // "HH:MM"
  close: string; // "HH:MM"
}

// Lista vazia = fechado o dia todo. Mais de um intervalo = expediente dividido.
// Os intervalos devem estar em ordem crescente e não podem passar da meia-noite.
export type WeeklySchedule = Record<Weekday, readonly TimeRange[]>;

export interface OpenStatus {
  isOpen: boolean;
  label: string;
}

export const TIME_ZONE = "America/Sao_Paulo";

const EVENING: TimeRange = { open: "19:00", close: "21:00" };

const STANDARD_DAY: readonly TimeRange[] = [
  { open: "08:30", close: "16:00" },
  EVENING,
];

// Única fonte da verdade dos horários: o status de aberto/fechado e a tabela do site saem daqui.
export const SCHEDULE: WeeklySchedule = {
  0: [],
  1: STANDARD_DAY,
  2: STANDARD_DAY,
  3: STANDARD_DAY,
  4: [{ open: "08:30", close: "18:30" }, EVENING],
  5: STANDARD_DAY,
  6: [{ open: "08:00", close: "19:00" }],
};

// Ordem de exibição na tabela de horários (segunda a domingo).
export const WEEK_ORDER: readonly Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  0: "Domingo",
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado",
};

const WEEKDAY_WHEN: Record<Weekday, string> = {
  0: "no domingo",
  1: "na segunda",
  2: "na terça",
  3: "na quarta",
  4: "na quinta",
  5: "na sexta",
  6: "no sábado",
};

const WEEKDAY_BY_SHORT_NAME: Record<string, Weekday | undefined> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const FALLBACK_LABEL = "Atendimento com horário consultado via WhatsApp";

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Lê dia da semana e hora no fuso de Araçatuba, independente de onde o código roda.
function getLocalParts(date: Date): { weekday: Weekday; minutes: number } | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value;

    const weekday = WEEKDAY_BY_SHORT_NAME[get("weekday") ?? ""];
    const hour = Number(get("hour"));
    const minute = Number(get("minute"));

    if (weekday === undefined || Number.isNaN(hour) || Number.isNaN(minute)) {
      return null;
    }

    return { weekday, minutes: hour * 60 + minute };
  } catch {
    return null;
  }
}

// Dia da semana atual em Araçatuba (e não no fuso do visitante).
export function getTodayWeekday(date: Date = new Date()): Weekday | null {
  return getLocalParts(date)?.weekday ?? null;
}

// Texto da tabela de horários, ex.: "08:30–16:00 e 19:00–21:00" ou "Fechado".
export function formatDayHours(
  weekday: Weekday,
  schedule: WeeklySchedule = SCHEDULE,
): string {
  const ranges = schedule[weekday];
  if (ranges.length === 0) return "Fechado";
  return ranges.map((range) => `${range.open}–${range.close}`).join(" e ");
}

export function getOpenStatus(
  date: Date = new Date(),
  schedule: WeeklySchedule = SCHEDULE,
): OpenStatus {
  const local = getLocalParts(date);
  if (!local) return { isOpen: false, label: FALLBACK_LABEL };

  const { weekday, minutes } = local;
  const todayRanges = schedule[weekday];

  const current = todayRanges.find(
    (range) => minutes >= toMinutes(range.open) && minutes < toMinutes(range.close),
  );
  if (current) {
    return { isOpen: true, label: `Aberto agora · Fecha às ${current.close}` };
  }

  const nextToday = todayRanges.find((range) => toMinutes(range.open) > minutes);
  if (nextToday) {
    return { isOpen: false, label: `Fechado agora · Abre hoje às ${nextToday.open}` };
  }

  for (let offset = 1; offset <= 7; offset++) {
    const nextWeekday = ((weekday + offset) % 7) as Weekday;
    const first = schedule[nextWeekday][0];
    if (first) {
      const when = offset === 1 ? "amanhã" : WEEKDAY_WHEN[nextWeekday];
      return { isOpen: false, label: `Fechado agora · Abre ${when} às ${first.open}` };
    }
  }

  return { isOpen: false, label: FALLBACK_LABEL };
}