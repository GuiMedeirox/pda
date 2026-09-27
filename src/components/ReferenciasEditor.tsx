'use client';

import { useState } from 'react';
import type { Referencia, TipoReferencia } from '@/lib/types';
import { novaReferencia } from '@/lib/types';
import { referenciaABNT, REFERENCIA_BNCC, TIPOS_REFERENCIA, type Segmento } from '@/lib/abnt';
import { inputCx, labelCx } from './ui';

function Segmentos({ segs }: { segs: Segmento[] }) {
  return (
    <>
      {segs.map((s, i) => (s.bold ? <strong key={i}>{s.text}</strong> : <span key={i}>{s.text}</span>))}
    </>
  );
}

const CAMPOS_POR_TIPO: Record<TipoReferencia, { campo: keyof Referencia; rotulo: string; placeholder?: string }[]> = {
  livro: [
    { campo: 'autor', rotulo: 'Autor(es)', placeholder: 'Sobrenome, Nome (separe vários com ;)' },
    { campo: 'titulo', rotulo: 'Título' },
    { campo: 'subtitulo', rotulo: 'Subtítulo (opcional)' },
    { campo: 'edicao', rotulo: 'Edição', placeholder: 'Ex.: 2' },
    { campo: 'local', rotulo: 'Local', placeholder: 'Ex.: São Paulo' },
    { campo: 'editora', rotulo: 'Editora', placeholder: 'Ex.: Callis Editora' },
    { campo: 'ano', rotulo: 'Ano', placeholder: 'Ex.: 2010' },
  ],
  artigo: [
    { campo: 'autor', rotulo: 'Autor(es)', placeholder: 'Sobrenome, Nome (separe vários com ;)' },
    { campo: 'titulo', rotulo: 'Título do artigo' },
    { campo: 'revista', rotulo: 'Nome da revista' },
    { campo: 'volume', rotulo: 'Volume', placeholder: 'Ex.: 3' },
    { campo: 'numero', rotulo: 'Número', placeholder: 'Ex.: 2' },
    { campo: 'paginas', rotulo: 'Páginas', placeholder: 'Ex.: 15-22' },
    { campo: 'ano', rotulo: 'Ano', placeholder: 'Ex.: 2015' },
  ],
  site: [
    { campo: 'autor', rotulo: 'Autor (opcional)', placeholder: 'Sobrenome, Nome' },
    { campo: 'titulo', rotulo: 'Título' },
    { campo: 'nomeSite', rotulo: 'Nome do site', placeholder: 'Ex.: Nova Escola' },
    { campo: 'ano', rotulo: 'Ano (opcional)' },
    { campo: 'url', rotulo: 'URL', placeholder: 'https://…' },
    { campo: 'acesso', rotulo: 'Acesso em', placeholder: 'Ex.: 27 set. 2026' },
  ],
  documento: [
    { campo: 'entidade', rotulo: 'Entidade', placeholder: 'Ex.: BRASIL' },
    { campo: 'orgao', rotulo: 'Órgão (opcional)', placeholder: 'Ex.: Ministério da Educação' },
    { campo: 'titulo', rotulo: 'Título' },
    { campo: 'local', rotulo: 'Local', placeholder: 'Ex.: Brasília' },
    { campo: 'editora', rotulo: 'Editora/órgão', placeholder: 'Ex.: MEC' },
    { campo: 'ano', rotulo: 'Ano', placeholder: 'Ex.: 2018' },
  ],
};

export default function ReferenciasEditor({
  referencias,
  incluirRefBNCC,
  onChange,
  onChangeBNCC,
}: {
  referencias: Referencia[];
  incluirRefBNCC: boolean;
  onChange: (referencias: Referencia[]) => void;
  onChangeBNCC: (incluir: boolean) => void;
}) {
  const [tipo, setTipo] = useState<TipoReferencia>('livro');

  function atualizar(id: string, campo: keyof Referencia, valor: string) {
    onChange(referencias.map((r) => (r.id === id ? { ...r, [campo]: valor } : r)));
  }

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-mel-suave/60 p-3 ring-1 ring-linha">
        <input
          type="checkbox"
          checked={incluirRefBNCC}
          onChange={(e) => onChangeBNCC(e.target.checked)}
          className="mt-0.5 h-4.5 w-4.5 shrink-0 cursor-pointer accent-caneta"
        />
        <span className="text-sm text-tinta">
          Incluir a referência da BNCC automaticamente:{' '}
          <span className="italic">
            <Segmentos segs={referenciaABNT(REFERENCIA_BNCC)} />
          </span>
        </span>
      </label>

      {referencias.map((r) => (
        <div key={r.id} className="rounded-xl bg-papel-alto ring-1 ring-linha">
          <div className="flex items-center justify-between border-b border-dashed border-linha px-3 py-2">
            <select
              value={r.tipo}
              onChange={(e) => atualizar(r.id, 'tipo', e.target.value)}
              className="cursor-pointer rounded-lg border border-linha-forte bg-papel-alto px-2 py-1.5 text-sm text-tinta"
              aria-label="Tipo de referência"
            >
              {TIPOS_REFERENCIA.map((t) => (
                <option key={t.valor} value={t.valor}>
                  {t.rotulo}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onChange(referencias.filter((x) => x.id !== r.id))}
              aria-label="Remover referência"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-tinta-suave hover:bg-mel-suave hover:text-caneta-escura"
            >
              ×
            </button>
          </div>
          <div className="grid gap-2.5 p-3 sm:grid-cols-2">
            {CAMPOS_POR_TIPO[r.tipo].map(({ campo, rotulo, placeholder }) => (
              <div key={String(campo)}>
                <label className={labelCx}>{rotulo}</label>
                <input
                  value={String(r[campo] ?? '')}
                  onChange={(e) => atualizar(r.id, campo, e.target.value)}
                  placeholder={placeholder}
                  className={inputCx}
                />
              </div>
            ))}
          </div>
          <p className="border-t border-dashed border-linha bg-papel px-3 py-2.5 text-sm text-tinta">
            <Segmentos segs={referenciaABNT(r)} />
          </p>
        </div>
      ))}

      <div className="flex gap-2">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoReferencia)}
          className={inputCx}
          aria-label="Tipo de nova referência"
        >
          {TIPOS_REFERENCIA.map((t) => (
            <option key={t.valor} value={t.valor}>
              {t.rotulo}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onChange([...referencias, novaReferencia(tipo)])}
          className="shrink-0 cursor-pointer rounded-xl bg-caneta px-4 py-2.5 text-sm font-bold text-papel-alto hover:bg-caneta-escura transition-colors duration-200"
        >
          Adicionar referência
        </button>
      </div>
    </div>
  );
}
