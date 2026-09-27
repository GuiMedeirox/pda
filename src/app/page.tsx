'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BookMarked,
  ClipboardCheck,
  FileDown,
  Heart,
  Library,
  ListOrdered,
  NotebookPen,
  Paperclip,
  PencilLine,
  Target,
} from 'lucide-react';
import HabilidadesSelector from '@/components/HabilidadesSelector';
import MomentosEditor from '@/components/MomentosEditor';
import RecursosEditor from '@/components/RecursosEditor';
import ReferenciasEditor from '@/components/ReferenciasEditor';
import { botaoPrimarioCx, inputCx, labelCx, Section } from '@/components/ui';
import { baixarPdfPlanoDeAula } from '@/lib/pdf';
import { planoVazio, type PlanoDeAula } from '@/lib/types';

const CHAVE_RASCUNHO = 'plano-de-aula-rascunho-v1';

export default function Home() {
  const [plano, setPlano] = useState<PlanoDeAula>(planoVazio);
  const [pronto, setPronto] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [erroTitulo, setErroTitulo] = useState(false);
  const refTitulo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(CHAVE_RASCUNHO);
      if (bruto) setPlano({ ...planoVazio(), ...JSON.parse(bruto) });
    } catch {
      // rascunho corrompido: começa vazio
    }
    setPronto(true);
  }, []);

  useEffect(() => {
    if (pronto) localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(plano));
  }, [plano, pronto]);

  function atualizar<K extends keyof PlanoDeAula>(campo: K, valor: PlanoDeAula[K]) {
    setPlano((p) => ({ ...p, [campo]: valor }));
  }

  function gerar() {
    if (!plano.titulo.trim()) {
      setErroTitulo(true);
      refTitulo.current?.focus();
      return;
    }
    setErroTitulo(false);
    setGerando(true);
    // deixa o botão pintar o estado antes da geração síncrona do PDF
    setTimeout(() => {
      baixarPdfPlanoDeAula(plano);
      setGerando(false);
    }, 30);
  }

  const botaoGerar = (classes: string) => (
    <button type="button" onClick={gerar} className={classes} disabled={gerando}>
      <FileDown className="h-4.5 w-4.5" aria-hidden />
      {gerando ? 'Gerando…' : 'Gerar PDF'}
    </button>
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-dashed border-linha-forte bg-papel/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-caneta text-papel-alto shadow-[0_2px_0_var(--caneta-escura)]">
              <NotebookPen className="h-5.5 w-5.5" aria-hidden />
            </span>
            <div>
              <h1 className="font-display text-lg font-bold leading-tight text-tinta">
                Gerador de Plano de Aula
              </h1>
              <p className="font-nota text-lg leading-none text-caneta-escura/80">
                preenche aqui e o PDF sai prontinho
              </p>
            </div>
          </div>
          <div className="hidden sm:block">{botaoGerar(botaoPrimarioCx)}</div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 pb-16">
        {erroTitulo && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800 ring-1 ring-red-200">
            Ops, falta o título da aula — escreve ali na primeira caixa.
          </p>
        )}

        <Section
          numero={1}
          titulo="Título e dados gerais"
          descricao="o título vai no topo do PDF, entre aspas"
          icone={PencilLine}
          atrasoMs={0}
        >
          <div className="space-y-4">
            <div>
              <label className={labelCx}>Título da aula *</label>
              <input
                ref={refTitulo}
                value={plano.titulo}
                onChange={(e) => {
                  atualizar('titulo', e.target.value);
                  if (e.target.value.trim()) setErroTitulo(false);
                }}
                placeholder="Ex.: Aprendendo sobre o grande e o pequeno"
                className={`${inputCx} text-base font-semibold`}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCx}>Tema</label>
                <input
                  value={plano.tema}
                  onChange={(e) => atualizar('tema', e.target.value)}
                  placeholder="Ex.: Grandezas e medidas"
                  className={inputCx}
                />
              </div>
              <div>
                <label className={labelCx}>Duração</label>
                <input
                  value={plano.duracao}
                  onChange={(e) => atualizar('duracao', e.target.value)}
                  placeholder="Ex.: 5 horas"
                  className={inputCx}
                />
              </div>
              <div>
                <label className={labelCx}>Faixa etária</label>
                <input
                  value={plano.faixaEtaria}
                  onChange={(e) => atualizar('faixaEtaria', e.target.value)}
                  placeholder="Ex.: 4-5 anos (Pré-escola)"
                  className={inputCx}
                />
              </div>
              <div>
                <label className={labelCx}>Conteúdo</label>
                <input
                  value={plano.conteudo}
                  onChange={(e) => atualizar('conteudo', e.target.value)}
                  placeholder="Ex.: Tamanhos"
                  className={inputCx}
                />
              </div>
            </div>
          </div>
        </Section>

        <Section
          numero={2}
          titulo="Habilidades (BNCC)"
          descricao="marca as habilidades e os campos de experiências saem no PDF sozinhos"
          icone={BookMarked}
          atrasoMs={70}
        >
          <HabilidadesSelector
            selecionadas={plano.habilidades}
            onChange={(habilidades) => atualizar('habilidades', habilidades)}
          />
        </Section>

        <Section
          numero={3}
          titulo="Objetivos"
          descricao="escreve à vontade o que você espera dessa aula"
          icone={Target}
          atrasoMs={140}
        >
          <textarea
            value={plano.objetivos}
            onChange={(e) => atualizar('objetivos', e.target.value)}
            placeholder="Ex.: Levar as crianças a explorar, comparar e classificar objetos do cotidiano…"
            rows={6}
            className={`${inputCx} resize-y leading-relaxed`}
          />
        </Section>

        <Section
          numero={4}
          titulo="Metodologia"
          descricao="divide a aula em momentos — a numeração é automática"
          icone={ListOrdered}
          atrasoMs={210}
        >
          <MomentosEditor momentos={plano.momentos} onChange={(momentos) => atualizar('momentos', momentos)} />
        </Section>

        <Section
          numero={5}
          titulo="Recursos didáticos"
          descricao="tudo o que você vai precisar pra aula"
          icone={Paperclip}
          atrasoMs={280}
        >
          <RecursosEditor recursos={plano.recursos} onChange={(recursos) => atualizar('recursos', recursos)} />
        </Section>

        <Section
          numero={6}
          titulo="Avaliação"
          descricao="como o aprendizado vai ser acompanhado"
          icone={ClipboardCheck}
          atrasoMs={350}
        >
          <textarea
            value={plano.avaliacao}
            onChange={(e) => atualizar('avaliacao', e.target.value)}
            placeholder="Ex.: A avaliação será contínua e processual, acompanhando…"
            rows={6}
            className={`${inputCx} resize-y leading-relaxed`}
          />
        </Section>

        <Section
          numero={7}
          titulo="Referências (opcional)"
          descricao="formatinhas no padrão ABNT — se não tiver, tudo bem"
          icone={Library}
          atrasoMs={420}
        >
          <ReferenciasEditor
            referencias={plano.referencias}
            incluirRefBNCC={plano.incluirRefBNCC}
            onChange={(referencias) => atualizar('referencias', referencias)}
            onChangeBNCC={(incluirRefBNCC) => atualizar('incluirRefBNCC', incluirRefBNCC)}
          />
        </Section>

        <div className="flex flex-col items-center gap-3 pt-2">
          {botaoGerar(`${botaoPrimarioCx} px-10 py-3.5 text-base`)}
          <p className="font-nota text-xl text-tinta-suave">depois é só imprimir e brilhar</p>
        </div>

        <footer className="flex items-center justify-center gap-1.5 pt-6 text-xs text-tinta-suave/80">
          feito com
          <Heart className="h-3.5 w-3.5 fill-caneta/70 text-caneta/70" aria-hidden />
          para professoras criativas
        </footer>
      </main>

      {/* botão fixo no rodapé em telas pequenas */}
      <div className="sticky bottom-0 z-10 border-t border-dashed border-linha-forte bg-papel/90 p-3 backdrop-blur sm:hidden">
        {botaoGerar(`${botaoPrimarioCx} w-full py-3 text-base`)}
      </div>
    </div>
  );
}
