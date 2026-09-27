import dataset from './bncc-ei.json';

export interface BnccHabilidade {
  codigo: string;
  descricao: string;
  /** Sigla do campo de experiências (EO, CG, TS, EF, ET). */
  campo: string;
  /** Sigla do grupo etário (EI01, EI02, EI03). */
  grupo: string;
}

export interface GrupoEtario {
  sigla: string;
  nome: string;
  curto: string;
}

export interface CampoExperiencia {
  sigla: string;
  nome: string;
}

export const GRUPOS_ETARIOS = dataset.grupos as GrupoEtario[];
export const CAMPOS_EXPERIENCIA = dataset.campos as CampoExperiencia[];
export const HABILIDADES_BNCC = dataset.habilidades as BnccHabilidade[];

export function nomeCampo(sigla: string): string | undefined {
  return CAMPOS_EXPERIENCIA.find((c) => c.sigla === sigla)?.nome;
}

/** Campos de experiências únicos, na ordem em que as habilidades foram selecionadas. */
export function camposDasHabilidades(habilidades: { codigo: string }[]): string[] {
  const nomes: string[] = [];
  for (const h of habilidades) {
    const achada = HABILIDADES_BNCC.find((b) => b.codigo === h.codigo);
    if (!achada) continue;
    const nome = nomeCampo(achada.campo);
    if (nome && !nomes.includes(nome)) nomes.push(nome);
  }
  return nomes;
}
