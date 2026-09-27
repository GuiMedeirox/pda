import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export const inputCx =
  'w-full rounded-xl border border-linha bg-papel-alto px-3.5 py-2.5 text-[15px] text-tinta ' +
  'placeholder:text-tinta-suave/60 cursor-text ' +
  'focus:border-caneta focus:outline-none focus:ring-3 focus:ring-caneta/15 ' +
  'transition-[border-color,box-shadow] duration-200';

export const labelCx = 'mb-1.5 block text-sm font-semibold text-tinta';

export function Section({
  numero,
  titulo,
  descricao,
  icone: Icone,
  atrasoMs = 0,
  children,
}: {
  numero: number;
  titulo: string;
  descricao?: string;
  icone: LucideIcon;
  atrasoMs?: number;
  children: ReactNode;
}) {
  return (
    <section
      className="entrada overflow-hidden rounded-2xl bg-papel-alto shadow-[0_2px_14px_rgba(120,90,40,0.10)] ring-1 ring-linha"
      style={{ animationDelay: `${atrasoMs}ms` }}
    >
      <div className="flex items-center gap-3 border-b border-dashed border-linha-forte bg-mel-suave/60 px-5 py-4 sm:px-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-caneta text-papel-alto shadow-[0_2px_0_rgba(154,52,18,0.35)]">
          <Icone className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold tracking-tight text-tinta">
            <span className="text-caneta">{numero}. </span>
            {titulo}
          </h2>
          {descricao && (
            <p className="font-nota text-[19px] leading-tight text-tinta-suave">{descricao}</p>
          )}
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function ChipRemovivel({
  children,
  onRemover,
  ariaRemover,
}: {
  children: ReactNode;
  onRemover: () => void;
  ariaRemover?: string;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-mel-suave py-1 pl-3 pr-1.5 text-sm font-bold text-caneta-escura ring-1 ring-caneta/25">
      <span className="truncate">{children}</span>
      <button
        type="button"
        onClick={onRemover}
        aria-label={ariaRemover ?? 'Remover'}
        className="flex h-5.5 w-5.5 shrink-0 cursor-pointer items-center justify-center rounded-full text-caneta-escura/70 hover:bg-caneta/15 hover:text-caneta-escura"
      >
        ×
      </button>
    </span>
  );
}

export function BotaoAcao({
  children,
  onClick,
  titulo,
  desabilitado,
}: {
  children: ReactNode;
  onClick: () => void;
  titulo: string;
  desabilitado?: boolean;
}) {
  return (
    <button
      type="button"
      title={titulo}
      aria-label={titulo}
      onClick={onClick}
      disabled={desabilitado}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-tinta-suave ring-1 ring-linha-forte bg-papel-alto cursor-pointer hover:bg-papel hover:text-tinta disabled:cursor-default disabled:opacity-40 transition-colors duration-150"
    >
      {children}
    </button>
  );
}

export const botaoPrimarioCx =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-caneta px-5 py-2.5 ' +
  'text-sm font-bold text-papel-alto shadow-[0_2px_0_var(--caneta-escura)] ' +
  'hover:bg-caneta-escura hover:shadow-[0_1px_0_var(--caneta-escura)] ' +
  'active:translate-y-px focus:outline-none focus-visible:ring-3 focus-visible:ring-caneta/40 ' +
  'transition-all duration-200';

export const botaoAddCx =
  'cursor-pointer rounded-xl border-2 border-dashed border-caneta/40 bg-transparent px-4 py-2.5 ' +
  'text-sm font-bold text-caneta hover:border-caneta hover:bg-mel-suave transition-colors duration-200';
