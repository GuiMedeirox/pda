export interface Habilidade {
  codigo: string;
  descricao: string;
}

export interface Momento {
  id: string;
  objetivo: string;
  descricao: string;
}

export interface Recurso {
  id: string;
  texto: string;
}

export type TipoReferencia = 'livro' | 'artigo' | 'site' | 'documento';

export interface Referencia {
  id: string;
  tipo: TipoReferencia;
  autor: string;
  titulo: string;
  subtitulo: string;
  edicao: string;
  local: string;
  editora: string;
  ano: string;
  revista: string;
  volume: string;
  numero: string;
  paginas: string;
  nomeSite: string;
  url: string;
  acesso: string;
  entidade: string;
  orgao: string;
}

export interface PlanoDeAula {
  titulo: string;
  tema: string;
  duracao: string;
  faixaEtaria: string;
  conteudo: string;
  habilidades: Habilidade[];
  objetivos: string;
  momentos: Momento[];
  recursos: Recurso[];
  avaliacao: string;
  referencias: Referencia[];
  incluirRefBNCC: boolean;
}

export function novoId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function novaReferencia(tipo: TipoReferencia): Referencia {
  return {
    id: novoId(),
    tipo,
    autor: '',
    titulo: '',
    subtitulo: '',
    edicao: '',
    local: '',
    editora: '',
    ano: '',
    revista: '',
    volume: '',
    numero: '',
    paginas: '',
    nomeSite: '',
    url: '',
    acesso: '',
    entidade: '',
    orgao: '',
  };
}

export function planoVazio(): PlanoDeAula {
  return {
    titulo: '',
    tema: '',
    duracao: '',
    faixaEtaria: '',
    conteudo: '',
    habilidades: [],
    objetivos: '',
    momentos: [{ id: novoId(), objetivo: '', descricao: '' }],
    recursos: [],
    avaliacao: '',
    referencias: [],
    incluirRefBNCC: false,
  };
}
