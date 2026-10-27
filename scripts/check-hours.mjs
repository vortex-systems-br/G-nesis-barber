// Roda com: node scripts/check-hours.mjs
// Usa o Node 24 para importar o .ts direto (sem build). Datas com offset -03:00 (Brasil sem horário de verão).
import assert from "node:assert/strict";
import { getOpenStatus } from "../src/lib/business-hours.ts";

const cases = [
  // [descrição, data ISO, isOpen esperado, label esperado]
  ["terça 07:00 (antes de abrir)", "2026-10-27T07:00:00-03:00", false, "Fechado agora · Abre hoje às 08:30"],
  ["terça 08:30 (abertura)", "2026-10-27T08:30:00-03:00", true, "Aberto agora · Fecha às 16:00"],
  ["terça 14:55 (expediente da manhã)", "2026-10-27T14:55:00-03:00", true, "Aberto agora · Fecha às 16:00"],
  ["terça 16:00 (fechamento exato)", "2026-10-27T16:00:00-03:00", false, "Fechado agora · Abre hoje às 19:00"],
  ["terça 17:00 (intervalo)", "2026-10-27T17:00:00-03:00", false, "Fechado agora · Abre hoje às 19:00"],
  ["terça 19:30 (expediente da noite)", "2026-10-27T19:30:00-03:00", true, "Aberto agora · Fecha às 21:00"],
  ["terça 21:30 (depois de fechar)", "2026-10-27T21:30:00-03:00", false, "Fechado agora · Abre amanhã às 08:30"],
  ["quinta 17:00 (quinta fecha 18:30)", "2026-10-29T17:00:00-03:00", true, "Aberto agora · Fecha às 18:30"],
  ["sábado 12:00", "2026-10-31T12:00:00-03:00", true, "Aberto agora · Fecha às 19:00"],
  ["sábado 20:00 (domingo fechado)", "2026-10-31T20:00:00-03:00", false, "Fechado agora · Abre na segunda às 08:30"],
  ["domingo 12:00", "2026-11-01T12:00:00-03:00", false, "Fechado agora · Abre amanhã às 08:30"],
];

let failures = 0;

for (const [name, iso, expectedOpen, expectedLabel] of cases) {
  const result = getOpenStatus(new Date(iso));
  try {
    assert.equal(result.isOpen, expectedOpen);
    assert.equal(result.label, expectedLabel);
    console.log(`OK    ${name} -> ${result.label}`);
  } catch {
    failures += 1;
    console.log(`FALHA ${name}\n      esperado: ${expectedOpen} | ${expectedLabel}\n      obtido:   ${result.isOpen} | ${result.label}`);
  }
}

console.log(failures === 0 ? "\nTodos os cenários passaram." : `\n${failures} cenário(s) falharam.`);
process.exit(failures === 0 ? 0 : 1);