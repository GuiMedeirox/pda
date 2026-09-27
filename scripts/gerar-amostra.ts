/* Gera um PDF de amostra com o conteúdo do plano de referência (uso de QA / demonstração).
 * Executar com: npx tsx scripts/gerar-amostra.ts
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { gerarPdfPlanoDeAula } from '../src/lib/pdf';
import { HABILIDADES_BNCC } from '../src/lib/bncc';
import { novaReferencia, type PlanoDeAula } from '../src/lib/types';

const h = (codigo: string) => {
  const achada = HABILIDADES_BNCC.find((x) => x.codigo === codigo);
  if (!achada) throw new Error(`Habilidade ${codigo} não encontrada no dataset`);
  return { codigo: achada.codigo, descricao: achada.descricao };
};

const refLivro = { ...novaReferencia('livro'), id: 'amostra-livro' };
refLivro.autor = 'Jeong, Hae-Wang';
refLivro.titulo = 'Sopa de Bruxa: Partes do Corpo como Instrumentos de Medida';
refLivro.edicao = '2';
refLivro.local = 'São Paulo';
refLivro.editora = 'Callis Editora';
refLivro.ano = '2010';

const plano: PlanoDeAula = {
  titulo: 'Aprendendo sobre o grande e o pequeno',
  tema: 'Grandezas e medidas',
  duracao: '5 horas',
  faixaEtaria: '4-5 anos (Pré-escola)',
  conteudo: 'Tamanhos',
  habilidades: [h('EI03TS02'), h('EI03ET01'), h('EI03ET05')],
  objetivos: [
    'Levar as crianças a explorar, comparar e classificar objetos do cotidiano com base no tamanho (grande e pequeno), desenvolvendo a capacidade de observar, descrever semelhanças e diferenças entre os objetos.',
    'Perceber, em brincadeiras orais, que algumas palavras começam com sons parecidos, reconhecer e comparar formas e tamanhos de objetos concretos, agrupar objetos por uma característica observável e compartilhar oralmente uma descoberta.',
  ].join('\n'),
  momentos: [
    {
      id: '1',
      objetivo: 'Acolhida',
      descricao:
        'As crianças irão sentar em roda e irão fazer o momento de conhecimento com a professora, logo após irão identificar o dia da semana, a data e relembrar os combinados.',
    },
    {
      id: '2',
      objetivo: 'Explorar os objetos',
      descricao:
        'Será feito um momento de conversa e apresentados objetos grandes e pequenos. Será dado um tempo para olhar e tocar, perguntando: “O que vocês percebem? Qual parece maior? Que forma vocês notam?”, será registrado as respostas faladas, gestos e apontamentos, sem exigir nomeação correta.',
    },
    {
      id: '3',
      objetivo: 'Cantiga sobre o tamanho',
      descricao:
        'Será apresentada uma música “Maior ou menor” - Batucada, eles poderão cantar e dançar e logo em seguida irão descrever objetos grandes e pequenos que tem pela sala de aula.',
    },
    {
      id: '4',
      objetivo: '',
      descricao:
        'Após a conversa, propor a brincadeira “Caça ao Tesouro dos Tamanhos”. Utilizando objetos reais, como brinquedos de tamanhos variados, as crianças deverão procurar objetos que estarão espalhados ou escondidos pelo pátio da escola. Em seguida, realizar a comparação e classificação desses objetos, distinguindo entre os que são “grandes” e “pequenos”, observando suas diferenças. Durante a atividade, as crianças poderão observar, tocar, comparar e classificar os objetos, fixando post-its para identificar aqueles que são pequenos e os que são grandes, promovendo uma aprendizagem lúdica e significativa sobre noções de tamanho.',
    },
    {
      id: '5',
      objetivo: 'Charada divertida',
      descricao:
        'Com as crianças sentadas em círculo, realizar um momento divertido por meio da charada com perguntas lúdicas, retomando e explorando o tema “grande e pequeno”:\nMaçã – “Sou redondinha, sou pequena, sou gostosa de comer e posso ser vermelha, verde ou amarela. O que sou?”;\nElefante – “Eu sou enorme, moro na floresta e tenho uma tromba comprida. O que eu sou?”;\nCarro – “Tenho quatro rodas, sou grande, e levo pessoas de um lugar para outro. O que eu sou?”;\nCopo – “Sou feito de vidro ou plástico, sou pequeno, e seguro líquidos para você beber. O que sou?”.',
    },
    {
      id: '6',
      objetivo: 'Produção final por meio do desenho individual',
      descricao:
        'Para encerrar a oficina, cada criança será convidada a realizar um desenho individual representando o que aprendeu sobre o tema “grande e pequeno”. Serão disponibilizadas folhas de papel, lápis de cor, giz de cera, canetinhas e outros materiais de desenho para que possam expressar livremente suas ideias e percepções. As crianças poderão desenhar objetos, animais, pessoas ou elementos da natureza que considerem grandes e pequenos, demonstrando, por meio da arte, sua compreensão sobre o conceito trabalhado.',
    },
    {
      id: '7',
      objetivo: 'Exposição em mural',
      descricao:
        'Após a conclusão dos desenhos, as crianças irão confeccionar um cartaz coletivo intitulado “O Mundo do Grande e do Pequeno”. Será feita uma exposição na sala de aula, permitindo que as produções sejam apreciadas pelos colegas. A professora acompanhará o processo, incentivando que cada criança explique o que desenhou e por que escolheu representar aqueles elementos, valorizando suas interpretações e formas de expressão.',
    },
  ],
  recursos: [
    { id: 'r1', texto: 'Brinquedos e objetos de diferentes tamanhos;' },
    { id: 'r2', texto: 'Materiais de desenho e pintura: folhas de papel, lápis de cor, giz de cera, canetinhas;' },
    { id: 'r3', texto: 'Materiais de artes para o mural: cartolina, cola.' },
    { id: 'r4', texto: 'Post it para a brincadeira “Caça ao Tesouro dos Tamanhos”;' },
  ],
  avaliacao:
    'A avaliação será contínua e processual, acompanhando atentamente o desenvolvimento de cada criança por meio de observações realizadas durante atividades coletivas e individuais. Serão considerados a participação nas propostas, o envolvimento nas brincadeiras, o esforço empregado e a capacidade de expressar suas compreensões. Espera-se que, por meio das atividades, a criança amplie sua compreensão sobre as noções de tamanho, medida e comparação, utilizando diferentes linguagens para comunicar suas descobertas. Ao participar de conversas, classificações e medições, demonstra observar o mundo com maior atenção, reconhecendo diferenças de proporção entre objetos, pessoas e situações do cotidiano. Além disso, será valorizada a capacidade de usar o corpo como instrumento de medida, estabelecendo relações entre quantidades e dimensões. Também se observará o desenvolvimento da cooperação e do respeito nas atividades coletivas, reconhecendo o trabalho em grupo, a valorização das produções próprias e das dos colegas, de forma a favorecer aprendizagens significativas e integradas.',
  referencias: [refLivro],
  incluirRefBNCC: true,
};

const pasta = join(__dirname, '..', 'amostra');
mkdirSync(pasta, { recursive: true });
const pdf = gerarPdfPlanoDeAula(plano);
const destino = join(pasta, 'plano-de-aula-amostra.pdf');
writeFileSync(destino, Buffer.from(pdf.output('arraybuffer')));
console.log('PDF gerado em:', destino);
