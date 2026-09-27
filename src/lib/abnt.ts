import type { Referencia, TipoReferencia } from './types';

export interface Segmento {
  text: string;
  bold?: boolean;
}

export const TIPOS_REFERENCIA: { valor: TipoReferencia; rotulo: string }[] = [
  { valor: 'livro', rotulo: 'Livro' },
  { valor: 'artigo', rotulo: 'Artigo de periódico' },
  { valor: 'site', rotulo: 'Site ou documento online' },
  { valor: 'documento', rotulo: 'Documento oficial / legislação' },
];

export const REFERENCIA_BNCC: Referencia = {
  id: 'bncc-automatica',
  tipo: 'documento',
  autor: '',
  titulo: 'Base Nacional Comum Curricular',
  subtitulo: '',
  edicao: '',
  local: 'Brasília',
  editora: 'MEC',
  ano: '2018',
  revista: '',
  volume: '',
  numero: '',
  paginas: '',
  nomeSite: '',
  url: '',
  acesso: '',
  entidade: 'BRASIL',
  orgao: 'Ministério da Educação',
};

/** "Sobrenome, Nome" → "SOBRENOME, Nome" (padrão ABNT). Vários autores separados por ";". */
function sobrenomeMaiusculo(autor: string): string {
  return autor
    .split(';')
    .map((parte) => {
      const a = parte.trim();
      if (!a) return '';
      const virgula = a.indexOf(',');
      return virgula > 0 ? a.slice(0, virgula).toUpperCase() + a.slice(virgula) : a.toUpperCase();
    })
    .filter(Boolean)
    .join('; ');
}

function juntar(partes: (string | Segmento | null | false)[]): Segmento[] {
  const segs: Segmento[] = [];
  for (const parte of partes) {
    if (!parte) continue;
    if (typeof parte === 'string') {
      if (parte.trim()) segs.push({ text: parte.trim() });
    } else {
      if (parte.text.trim()) segs.push(parte);
    }
  }
  // separa os blocos com um espaço e devolve
  return segs.flatMap((s, i) => (i === 0 ? [s] : [{ text: ' ' }, s]));
}

const bold = (text: string): Segmento => ({ text, bold: true });

/** Bloco final "Local: Editora, Ano." tolerando campos vazios. */
function publicacao(local: string, editora: string, ano: string): string {
  const l = local.trim();
  const e = editora.trim();
  const a = ano.trim();
  const inicio = [l && `${l}:`, e].filter(Boolean).join(' ');
  if (!inicio) return a ? `${a}.` : '';
  return a ? `${inicio}, ${a}.` : `${inicio}.`;
}

/**
 * Formata a referência no padrão ABNT NBR 6023 (título em negrito).
 * Retorna segmentos para permitir o negrito na UI e no PDF.
 */
export function referenciaABNT(r: Referencia): Segmento[] {
  const autor = sobrenomeMaiusculo(r.autor);
  switch (r.tipo) {
    case 'livro': {
      const titulo = [r.titulo.trim(), r.subtitulo.trim() && `: ${r.subtitulo.trim()}`]
        .filter(Boolean)
        .join('');
      return juntar([
        autor && `${autor}.`,
        titulo && bold(titulo + '.'),
        r.edicao.trim() && `${r.edicao.trim()}. ed.`,
        publicacao(r.local, r.editora, r.ano),
      ]);
    }
    case 'artigo': {
      const detalhes = [
        r.volume.trim() && `v. ${r.volume.trim()}`,
        r.numero.trim() && `n. ${r.numero.trim()}`,
        r.paginas.trim() && `p. ${r.paginas.trim()}`,
        r.ano.trim(),
      ]
        .filter(Boolean)
        .join(', ');
      return juntar([
        autor && `${autor}.`,
        r.titulo.trim() && `${r.titulo.trim()}.`,
        r.revista.trim() && bold(r.revista.trim() + (detalhes ? ',' : '.')),
        detalhes && `${detalhes}.`,
      ]);
    }
    case 'site': {
      const ano = r.ano.trim();
      return juntar([
        autor && `${autor}.`,
        r.titulo.trim() && bold(r.titulo.trim() + '.'),
        r.nomeSite.trim() && `${r.nomeSite.trim()}.`,
        ano && `${ano}.`,
        r.url.trim() && `Disponível em: ${r.url.trim()}.`,
        r.acesso.trim() && `Acesso em: ${r.acesso.trim()}.`,
      ]);
    }
    case 'documento': {
      const autor2 = [r.entidade.trim(), r.orgao.trim()].filter(Boolean).join('. ');
      return juntar([
        autor2 && `${autor2}.`,
        r.titulo.trim() && bold(r.titulo.trim() + '.'),
        publicacao(r.local, r.editora, r.ano),
      ]);
    }
  }
}

export function referenciaTexto(r: Referencia): string {
  return referenciaABNT(r)
    .map((s) => s.text)
    .join('');
}

export function referenciaTemConteudo(r: Referencia): boolean {
  return referenciaTexto(r).replace(/\s/g, '').length > 3;
}
