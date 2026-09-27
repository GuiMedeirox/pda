# Gerador de Plano de Aula

Aplicação Next.js para professores montarem **planos de aula em PDF** no formato do modelo Word:
título centralizado, seções em negrito, texto justificado em Times 12pt, momentos de metodologia
numerados ("Primeiro Momento: …") e referências no padrão ABNT.

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000), preencha as seções e clique em **Gerar PDF**
(o download sai com o nome `plano-de-aula-<titulo>.pdf`). O rascunho é salvo automaticamente no
navegador (localStorage).

## Publicar na Vercel (grátis)

Não precisa de nenhuma configuração — o app é 100% client-side, sem variáveis de ambiente nem
banco de dados, então roda no plano free da Vercel sem custo:

1. Suba o projeto para um repositório no GitHub;
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório;
3. A Vercel detecta o Next.js sozinha — só clicar em **Deploy**.

Ou, pela linha de comando: `npx vercel` (na primeira vez ele pede login e cria o projeto).

## O que o PDF traz

1. **PLANO DE AULA** + título da aula entre aspas (centralizados, em negrito)
2. **Dados gerais** (opcionais): Tema, Duração, Faixa Etária, Conteúdo
3. **Campo de Experiência**: derivado automaticamente das habilidades selecionadas
4. **Habilidades (BNCC)**: cada habilidade como parágrafo `(EI03TS02) descrição`
5. **Objetivos**: texto livre do professor (vários parágrafos)
6. **Metodologia**: momentos com numeração automática — cabeçalho em negrito-itálico
   (`Primeiro Momento: Acolhida`, `Quarto Momento:` …) + descrição justificada
7. **Recursos Didáticos**: lista com marcadores
8. **Avaliação**: texto longo
9. **Referências (opcional)**: formatadas no padrão ABNT NBR 6023 (título em negrito), com
   opção de incluir automaticamente a referência da BNCC. Se não houver referências, a seção
   não aparece no PDF.

Seções deixadas em branco simplesmente não aparecem no PDF.

## Habilidades da BNCC

O dataset em `src/lib/bncc-ei.json` cobre as **93 habilidades da Educação Infantil** (códigos
EI01–EI03 × 5 campos de experiências), com códigos e textos conferidos contra o documento
oficial da BNCC (MEC). É possível filtrar por faixa etária e campo de experiências, buscar por
texto e **adicionar habilidades manualmente** (ex.: Ensino Fundamental) em
"Adicionar habilidade manualmente".

## Visual

Direção "caderno de planejamento": papel creme pautado, tinta quente, terracota como cor de
ação e notas manuscritas (Caveat) nos avisos. Tipografia: **Fraunces** (títulos) +
**Nunito Sans** (interface) + **Caveat** (anotações), todas via `next/font`. Ícones:
[lucide-react](https://lucide.dev). Animações de entrada discretas com suporte a
`prefers-reduced-motion`.

## Estrutura

```
src/
  app/            página única (formulário) + layout
  components/     editores por seção (habilidades, momentos, recursos, referências)
  lib/
    bncc-ei.json  dataset das habilidades da BNCC (Educação Infantil)
    bncc.ts       acesso ao dataset + campos de experiências derivados
    pdf.ts        gerador do PDF (jsPDF): quebra de página, justificação, bullets
    abnt.ts       formatação ABNT das referências (retorna segmentos c/ negrito)
    ordinais.ts   "Primeiro", "Segundo", "Décimo Terceiro"…
    types.ts      tipos do plano
scripts/
  gerar-amostra.ts  gera `amostra/plano-de-aula-amostra.pdf` com o conteúdo do plano modelo
                    (npx tsx scripts/gerar-amostra.ts)
```
