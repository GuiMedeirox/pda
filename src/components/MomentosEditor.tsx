'use client';

import type { Momento } from '@/lib/types';
import { novoId } from '@/lib/types';
import { BotaoAcao, inputCx } from './ui';

export default function MomentosEditor({
  momentos,
  onChange,
}: {
  momentos: Momento[];
  onChange: (momentos: Momento[]) => void;
}) {
  function atualizar(id: string, campo: 'objetivo' | 'descricao', valor: string) {
    onChange(momentos.map((m) => (m.id === id ? { ...m, [campo]: valor } : m)));
  }

  function mover(indice: number, direcao: -1 | 1) {
    const alvo = indice + direcao;
    if (alvo < 0 || alvo >= momentos.length) return;
    const copia = [...momentos];
    [copia[indice], copia[alvo]] = [copia[alvo], copia[indice]];
    onChange(copia);
  }

  function remover(id: string) {
    onChange(momentos.filter((m) => m.id !== id));
  }

  function adicionar() {
    onChange([...momentos, { id: novoId(), objetivo: '', descricao: '' }]);
  }

  return (
    <div className="space-y-3">
      {momentos.map((m, i) => (
        <div key={m.id} className="rounded-xl bg-papel p-4 ring-1 ring-linha">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-mel px-3 py-1 text-xs font-bold text-papel-alto">
              {i + 1}º momento
            </span>
            <div className="flex gap-1.5">
              <BotaoAcao titulo="Mover para cima" onClick={() => mover(i, -1)} desabilitado={i === 0}>
                ↑
              </BotaoAcao>
              <BotaoAcao
                titulo="Mover para baixo"
                onClick={() => mover(i, 1)}
                desabilitado={i === momentos.length - 1}
              >
                ↓
              </BotaoAcao>
              <BotaoAcao titulo="Remover momento" onClick={() => remover(m.id)}>
                ×
              </BotaoAcao>
            </div>
          </div>
          <div className="space-y-2">
            <input
              value={m.objetivo}
              onChange={(e) => atualizar(m.id, 'objetivo', e.target.value)}
              placeholder="Objetivo do momento (ex.: Acolhida em roda)"
              className={inputCx}
            />
            <textarea
              value={m.descricao}
              onChange={(e) => atualizar(m.id, 'descricao', e.target.value)}
              placeholder="Descreva como esse momento vai acontecer…"
              rows={3}
              className={`${inputCx} resize-y`}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={adicionar}
        className="w-full cursor-pointer rounded-xl border-2 border-dashed border-caneta/40 py-3 text-sm font-bold text-caneta hover:border-caneta hover:bg-mel-suave transition-colors duration-200"
      >
        + Adicionar momento
      </button>
    </div>
  );
}
