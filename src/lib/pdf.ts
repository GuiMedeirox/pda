import { jsPDF } from 'jspdf';
import type { PlanoDeAula, Referencia } from './types';
import { rotuloMomento } from './ordinais';
import { referenciaABNT, REFERENCIA_BNCC, referenciaTemConteudo, type Segmento } from './abnt';
import { camposDasHabilidades } from './bncc';

const PAGE_W = 210;
const PAGE_H = 297;
const MARGEM = 20;
const LARGURA = PAGE_W - MARGEM * 2;
const CORPO = 12; // pt
const ALTURA_LINHA = 5.9; // mm (12 pt com entrelinha ~1.4)
const PRIMEIRA_BASE = MARGEM + 5.2;
const LIMITE_INFERIOR = PAGE_H - MARGEM;
const GAP_SECAO = 7;
const GAP_ITEM = 2.6;

type EstiloFonte = 'normal' | 'bold' | 'italic' | 'bolditalic';

interface Token {
  text: string;
  bold?: boolean;
  /** Fonte fixa do token (p. ex. heading de momento em bolditalic). */
  estilo?: EstiloFonte;
}

function tokenizar(texto: string, estilo: EstiloFonte = 'normal'): Token[] {
  return texto
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ({ text: w, estilo }));
}

function fonteDoToken(t: Token): EstiloFonte {
  return t.estilo ?? (t.bold ? 'bold' : 'normal');
}

function tokensDeSegmentos(segs: Segmento[]): Token[] {
  return segs.flatMap((s) =>
    s.text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ text: w, bold: s.bold })),
  );
}

class Escritor {
  readonly pdf: jsPDF;
  y = PRIMEIRA_BASE;

  constructor() {
    this.pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    this.setFonte('normal');
  }

  setFonte(estilo: EstiloFonte = 'normal', tamanho = CORPO) {
    this.pdf.setFont('times', estilo);
    this.pdf.setFontSize(tamanho);
  }

  largura(texto: string): number {
    return this.pdf.getTextWidth(texto);
  }

  /** Quebra a página se o conteúdo não couber. */
  cabe(altura: number) {
    if (this.y + altura > LIMITE_INFERIOR) {
      this.pdf.addPage();
      this.y = PRIMEIRA_BASE;
    }
  }
}

/** Quebra palavras em linhas respeitando a largura da primeira linha (recuo do rótulo). */
function quebrar(esc: Escritor, tokensIn: Token[], primeiraLargura: number, largura: number): Token[][] {
  const linhas: Token[][] = [];
  let atual: Token[] = [];
  let max = primeiraLargura;

  const larguraDe = (t: Token) => {
    esc.setFonte(fonteDoToken(t));
    return esc.largura(t.text);
  };
  const larguraLinha = (tks: Token[]) =>
    tks.reduce((acc, t) => acc + larguraDe(t), 0) + esc.largura(' ') * (tks.length - 1);

  for (const token of tokensIn) {
    if (atual.length && larguraLinha([...atual, token]) > max) {
      linhas.push(atual);
      atual = [token];
      max = largura;
      continue;
    }
    // palavra sozinha maior que a linha: corta no meio (URLs longas)
    if (!atual.length && larguraDe(token) > max) {
      let pedaco = token.text;
      while (esc.largura(pedaco) > max && pedaco.length > 1) {
        let fim = pedaco.length - 1;
        while (fim > 1 && esc.largura(pedaco.slice(0, fim)) > max) fim--;
        linhas.push([{ text: pedaco.slice(0, fim), bold: token.bold }]);
        pedaco = pedaco.slice(fim);
      }
      atual = [{ text: pedaco, bold: token.bold }];
      max = largura;
      continue;
    }
    atual.push(token);
  }
  if (atual.length) linhas.push(atual);
  return linhas;
}

function desenharLinha(
  esc: Escritor,
  linha: Token[],
  x: number,
  y: number,
  largura: number,
  justificar: boolean,
) {
  esc.setFonte('normal');
  const espaco = esc.largura(' ');
  const desenhar = (t: Token, gapExtra = 0) => {
    esc.setFonte(fonteDoToken(t));
    esc.pdf.text(t.text, x, y);
    x += esc.largura(t.text) + espaco + gapExtra;
  };
  if (!justificar || linha.length === 1) {
    for (const t of linha) desenhar(t);
    return;
  }
  const natural =
    linha.reduce((acc, t) => {
      esc.setFonte(fonteDoToken(t));
      return acc + esc.largura(t.text);
    }, 0) +
    espaco * (linha.length - 1);
  const extra = Math.max(0, (largura - natural) / (linha.length - 1));
  for (const t of linha) desenhar(t, extra);
}

interface OpcoesParagrafo {
  /** Recuo x da primeira linha (p/ rótulo em negrito antes do texto). */
  primeiraX?: number;
  x?: number;
  largura?: number;
  alturaLinha?: number;
  justificar?: boolean;
  estilo?: EstiloFonte;
  tokens?: Token[];
}

function paragrafo(esc: Escritor, texto: string, op: OpcoesParagrafo = {}) {
  const { x = MARGEM, largura = LARGURA, alturaLinha = ALTURA_LINHA, justificar = true } = op;
  const tk = op.tokens ?? tokenizar(texto, op.estilo ?? 'normal');
  if (!tk.length) return;
  esc.setFonte('normal');
  const primeiraLargura = op.primeiraX != null ? x + largura - op.primeiraX : largura;
  const linhas = quebrar(esc, tk, primeiraLargura, largura);
  linhas.forEach((linha, i) => {
    esc.cabe(alturaLinha);
    const lx = i === 0 && op.primeiraX != null ? op.primeiraX : x;
    const lw = i === 0 && op.primeiraX != null ? primeiraLargura : largura;
    desenharLinha(esc, linha, lx, esc.y, lw, justificar && i < linhas.length - 1);
    esc.y += alturaLinha;
  });
}

function rotuloSecao(esc: Escritor, rotulo: string) {
  esc.y += GAP_SECAO;
  esc.cabe(ALTURA_LINHA * 3);
  esc.setFonte('bold');
  esc.pdf.text(rotulo, MARGEM, esc.y);
  esc.y += ALTURA_LINHA + 1.2;
}

function rótuloInline(esc: Escritor, rotulo: string, texto: string) {
  esc.y += GAP_SECAO;
  esc.cabe(ALTURA_LINHA * 3);
  esc.setFonte('bold');
  esc.pdf.text(rotulo, MARGEM, esc.y);
  const larguraRotulo = esc.largura(rotulo) + 2; // espaço fixo entre o rótulo e o texto
  esc.setFonte('normal');
  paragrafo(esc, texto, { primeiraX: MARGEM + larguraRotulo });
}

function bullet(esc: Escritor, texto: string) {
  const recuoTexto = 11.5;
  esc.cabe(ALTURA_LINHA);
  esc.setFonte('normal');
  esc.pdf.text('\u2022', MARGEM + 6, esc.y);
  const linhas = quebrar(esc, tokenizar(texto), LARGURA - recuoTexto, LARGURA - recuoTexto);
  linhas.forEach((linha, i) => {
    if (i > 0) esc.cabe(ALTURA_LINHA);
    desenharLinha(esc, linha, MARGEM + recuoTexto, esc.y, LARGURA - recuoTexto, i < linhas.length - 1);
    esc.y += ALTURA_LINHA;
  });
  esc.y += 0.6;
}

function referenciasValidas(plano: PlanoDeAula): Referencia[] {
  const lista = [...plano.referencias];
  if (plano.incluirRefBNCC) lista.unshift(REFERENCIA_BNCC);
  return lista.filter(referenciaTemConteudo);
}

export function gerarPdfPlanoDeAula(plano: PlanoDeAula): jsPDF {
  const esc = new Escritor();

  // Cabeçalho
  esc.setFonte('bold', 14);
  esc.pdf.text('PLANO DE AULA', PAGE_W / 2, esc.y, { align: 'center' });
  esc.y += 8.6;
  esc.setFonte('bold', 13);
  const titulo = (plano.titulo.trim() || 'Título da Aula').toUpperCase();
  esc.pdf.text(`\u201C${titulo}\u201D`, PAGE_W / 2, esc.y, { align: 'center' });
  esc.y += ALTURA_LINHA;

  const inline = (rotulo: string, valor: string) => {
    if (!valor.trim()) return;
    rótuloInline(esc, rotulo, valor.trim());
  };

  inline('TEMA:', plano.tema);
  inline('DURAÇÃO:', plano.duracao);
  inline('FAIXA ETÁRIA:', plano.faixaEtaria);
  inline('CONTEÚDO:', plano.conteudo);

  const campos = camposDasHabilidades(plano.habilidades);
  if (campos.length) {
    rotuloSecao(esc, 'CAMPO DE EXPERIÊNCIA:');
    for (const campo of campos) {
      bullet(esc, campo + ';');
    }
  }

  if (plano.habilidades.length) {
    rotuloSecao(esc, 'HABILIDADES:');
    for (const h of plano.habilidades) {
      paragrafo(esc, `(${h.codigo}) ${h.descricao}`);
      esc.y += GAP_ITEM;
    }
  }

  const paragrafosObjetivos = plano.objetivos
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (paragrafosObjetivos.length) {
    rótuloInline(esc, 'OBJETIVOS:', paragrafosObjetivos[0]);
    for (const par of paragrafosObjetivos.slice(1)) {
      esc.y += GAP_ITEM;
      paragrafo(esc, par);
    }
  }

  const momentos = plano.momentos
    .map((m, i) => ({ m, i }))
    .filter(({ m }) => m.objetivo.trim() || m.descricao.trim());
  if (momentos.length) {
    rotuloSecao(esc, 'METODOLOGIA:');
    for (const { m, i } of momentos) {
      esc.y += GAP_ITEM + 1.5;
      esc.cabe(ALTURA_LINHA * 3);
      const objetivo = m.objetivo.trim();
      const rotulo = objetivo ? `${rotuloMomento(i)}: ${objetivo}` : `${rotuloMomento(i)}:`;
      paragrafo(esc, rotulo, { estilo: 'bolditalic', justificar: false });
      if (m.descricao.trim()) paragrafo(esc, m.descricao.trim());
    }
  }

  const recursos = plano.recursos.map((r) => r.texto.trim()).filter(Boolean);
  if (recursos.length) {
    rotuloSecao(esc, 'RECURSOS DIDÁTICOS:');
    for (const r of recursos) bullet(esc, r);
  }

  const paragrafosAvaliacao = plano.avaliacao
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (paragrafosAvaliacao.length) {
    rótuloInline(esc, 'Avaliação:', paragrafosAvaliacao[0]);
    for (const par of paragrafosAvaliacao.slice(1)) {
      esc.y += GAP_ITEM;
      paragrafo(esc, par);
    }
  }

  const referencias = referenciasValidas(plano);
  if (referencias.length) {
    rotuloSecao(esc, 'REFERÊNCIAS:');
    for (const ref of referencias) {
      // ABNT: alinhadas à esquerda, espaço simples
      paragrafo(esc, '', { tokens: tokensDeSegmentos(referenciaABNT(ref)), alturaLinha: 4.9, justificar: false });
      esc.y += 2.4;
    }
  }

  return esc.pdf;
}

export function slugify(texto: string): string {
  return (
    texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'sem-titulo'
  );
}

export function nomeArquivoPdf(plano: PlanoDeAula): string {
  return `plano-de-aula-${slugify(plano.titulo)}.pdf`;
}

export function baixarPdfPlanoDeAula(plano: PlanoDeAula) {
  gerarPdfPlanoDeAula(plano).save(nomeArquivoPdf(plano));
}
