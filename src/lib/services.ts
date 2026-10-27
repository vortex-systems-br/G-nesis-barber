export interface Service {
  id: string;
  title: string;
  tag: string;
  description: string;
}

export const SERVICES: readonly Service[] = [
  {
    id: "corte-barba",
    title: "Corte de cabelo e barba",
    tag: "Principal",
    description:
      "Cabelo na tesoura ou degradê e barba alinhada na navalha conforme o seu estilo. Se tiver referência, basta enviar.",
  },
  {
    id: "assinatura-mensal",
    title: "Assinatura mensal",
    tag: "Recorrente",
    description:
      "Plano para manter o visual alinhado o mês inteiro. Consulte os pacotes disponíveis e condições pelo WhatsApp.",
  },
  {
    id: "limpeza-de-pele",
    title: "Limpeza de pele",
    tag: "Estética Facial",
    description:
      "Higienização e cuidado com a pele do rosto para renovar o aspecto facial e completar sua rotina.",
  },
  {
    id: "depilacao-nasal-orelha",
    title: "Depilação nasal e de orelha",
    tag: "Acabamento",
    description:
      "Remoção segura e rápida dos pelos aparentes do nariz e orelha para um acabamento limpo.",
  },
  {
    id: "selagem-alisamento",
    title: "Selagem e alisamento",
    tag: "Química & Fios",
    description:
      "Controle de volume, alinhamento dos fios e redução de frizz. Fale com a equipe para avaliar o seu cabelo.",
  },
  {
    id: "remocao-de-cravos",
    title: "Remoção de cravos",
    tag: "Cuidado Facial",
    description:
      "Extração técnica voltada à desobstrução dos poros e limpeza profunda da pele.",
  },
];