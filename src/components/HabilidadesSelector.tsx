'use client';

import { useMemo, useState } from 'react';
import { CAMPOS_EXPERIENCIA, GRUPOS_ETARIOS, HABILIDADES_BNCC, nomeCampo } from '@/lib/bncc';
import type { Habilidade } from '@/lib/types';
import { ChipRemovivel, inputCx } from './ui';

function semAcento(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function HabilidadesSelector({
  selecionadas,
  onChange,
}: {
  selecionadas: Habilidade[];
  onChange: (habilidades: Habilidade[]) => void;
}) {
  const [grupo, setGrupo] = useState('todas');
  const [campo, setCampo] = useState('todos');
  const [busca, setBusca] = useState('');
  const [codManual, setCodManual] = useState('');
  const [descManual, setDescManual] = useState('');

  const codigosSelecionados = useMemo(
    () => new Set(selecionadas.map((h) => h.codigo.toUpperCase())),
    [selecionadas],
  );

  const filtradas = useMemo(() => {
    const b = semAcento(busca.trim());
    return HABILIDADES_BNCC.filter(
      (h) =>
        (grupo === 'todas' || h.grupo === grupo) &&
        (campo === 'todos' || h.campo === campo) &&
        (!b || semAcento(h.codigo + ' ' + h.descricao).includes(b)),
    );
  }, [grupo, campo, busca]);

  const agrupadas = useMemo(() => {
    const mapa = new Map<string, typeof filtradas>();
    for (const h of filtradas) {
      const lista = mapa.get(h.campo) ?? [];
      lista.push(h);
      mapa.set(h.campo, lista);
    }
    return mapa;
  }, [filtradas]);

  function alternar(h: Habilidade) {
    if (codigosSelecionados.has(h.codigo.toUpperCase())) {
      onChange(selecionadas.filter((s) => s.codigo.toUpperCase() !== h.codigo.toUpperCase()));
    } else {
      onChange([...selecionadas, { codigo: h.codigo, descricao: h.descricao }]);
    }
  }

  function adicionarManual() {
    const codigo = codManual.trim().toUpperCase();
    if (!codigo) return;
    if (codigosSelecionados.has(codigo)) return;
    const existente = HABILIDADES_BNCC.find((h) => h.codigo === codigo);
    onChange([
      ...selecionadas,
      { codigo, descricao: existente?.descricao ?? descManual.trim() },
    ]);
    setCodManual('');
    setDescManual('');
  }

  return (
    <div className="space-y-4">
      {selecionadas.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-xl bg-mel-suave/60 p-3 ring-1 ring-linha">
          {selecionadas.map((h) => (
            <ChipRemovivel
              key={h.codigo}
              onRemover={() => alternar(h)}
              ariaRemover={`Remover habilidade ${h.codigo}`}
            >
              {h.codigo}
            </ChipRemovivel>
          ))}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-3">
        <select value={grupo} onChange={(e) => setGrupo(e.target.value)} className={inputCx} aria-label="Faixa etária">
          <option value="todas">Todas as faixas etárias</option>
          {GRUPOS_ETARIOS.map((g) => (
            <option key={g.sigla} value={g.sigla}>
              {g.curto}
            </option>
          ))}
        </select>
        <select value={campo} onChange={(e) => setCampo(e.target.value)} className={inputCx} aria-label="Campo de experiências">
          <option value="todos">Todos os campos de experiências</option>
          {CAMPOS_EXPERIENCIA.map((c) => (
            <option key={c.sigla} value={c.sigla}>
              {c.nome}
            </option>
          ))}
        </select>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por código ou texto…"
          className={inputCx}
          type="search"
        />
      </div>

      <div className="max-h-96 space-y-4 overflow-y-auto rounded-xl p-3 ring-1 ring-linha">
        {agrupadas.size === 0 && (
          <p className="py-6 text-center text-sm text-tinta-suave">Nenhuma habilidade encontrada.</p>
        )}
        {[...agrupadas.entries()].map(([sigla, lista]) => (
          <div key={sigla}>
            <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-tinta-suave">
              {nomeCampo(sigla)}
            </h3>
            <ul className="space-y-1">
              {lista.map((h) => (
                <li key={h.codigo}>
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 hover:bg-papel">
                    <input
                      type="checkbox"
                      checked={codigosSelecionados.has(h.codigo.toUpperCase())}
                      onChange={() => alternar(h)}
                      className="mt-0.5 h-4.5 w-4.5 shrink-0 cursor-pointer accent-caneta"
                    />
                    <span className="text-sm text-tinta">
                      <span className="font-bold">({h.codigo})</span> {h.descricao}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <details className="rounded-xl ring-1 ring-linha">
        <summary className="cursor-pointer px-3 py-2.5 text-sm font-bold text-caneta hover:bg-mel-suave">
          + Adicionar habilidade manualmente (outros anos, Ensino Fundamental…)
        </summary>
        <div className="space-y-2 border-t border-linha p-3">
          <div className="grid gap-2 sm:grid-cols-[180px_1fr_auto]">
            <input
              value={codManual}
              onChange={(e) => setCodManual(e.target.value)}
              placeholder="Ex.: EF01MA01"
              className={inputCx}
            />
            <input
              value={descManual}
              onChange={(e) => setDescManual(e.target.value)}
              placeholder="Descrição da habilidade (opcional se o código for da Educação Infantil)"
              className={inputCx}
            />
            <button
              type="button"
              onClick={adicionarManual}
              className="cursor-pointer rounded-xl bg-caneta px-4 py-2.5 text-sm font-bold text-papel-alto hover:bg-caneta-escura transition-colors duration-200"
            >
              Adicionar
            </button>
          </div>
        </div>
      </details>
    </div>
  );
}
