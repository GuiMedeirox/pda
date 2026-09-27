const UNIDADES = [
  'Primeiro',
  'Segundo',
  'Terceiro',
  'Quarto',
  'Quinto',
  'Sexto',
  'Sétimo',
  'Oitavo',
  'Nono',
];

const DEZENAS = ['Décimo', 'Vigésimo', 'Trigésimo', 'Quadragésimo'];

/** Rótulo do momento a partir do índice (0-based): 0 → "Primeiro Momento", 12 → "Décimo Terceiro Momento". */
export function rotuloMomento(indice: number): string {
  const n = indice + 1;
  if (n <= 9) return `${UNIDADES[indice]} Momento`;
  const dezena = Math.floor(n / 10);
  const unidade = n % 10;
  const base = DEZENAS[dezena - 1] ?? `${dezena}0º`;
  return unidade === 0 ? `${base} Momento` : `${base} ${UNIDADES[unidade - 1]} Momento`;
}
