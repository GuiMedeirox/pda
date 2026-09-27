'use client';

import { useState } from 'react';
import type { Recurso } from '@/lib/types';
import { novoId } from '@/lib/types';
import { inputCx } from './ui';

export default function RecursosEditor({
  recursos,
  onChange,
}: {
  recursos: Recurso[];
  onChange: (recursos: Recurso[]) => void;
}) {
  const [texto, setTexto] = useState('');

  function adicionar() {
    const t = texto.trim();
    if (!t) return;
    onChange([...recursos, { id: novoId(), texto: t }]);
    setTexto('');
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              adicionar();
            }
          }}
          placeholder="Ex.: Brinquedos de diferentes tamanhos"
          className={inputCx}
        />
        <button
          type="button"
          onClick={adicionar}
          className="shrink-0 cursor-pointer rounded-xl bg-caneta px-4 py-2.5 text-sm font-bold text-papel-alto hover:bg-caneta-escura transition-colors duration-200"
        >
          Adicionar
        </button>
      </div>
      {recursos.length > 0 && (
        <ul className="divide-y divide-linha rounded-xl bg-papel-alto ring-1 ring-linha">
          {recursos.map((r) => (
            <li key={r.id} className="flex items-center gap-2 px-3 py-2.5">
              <span className="text-mel">•</span>
              <span className="flex-1 text-sm text-tinta">{r.texto}</span>
              <button
                type="button"
                onClick={() => onChange(recursos.filter((x) => x.id !== r.id))}
                aria-label={`Remover recurso ${r.texto}`}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-tinta-suave hover:bg-mel-suave hover:text-caneta-escura"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
