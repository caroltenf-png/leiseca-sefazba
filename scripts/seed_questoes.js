#!/usr/bin/env node
// seed_questoes.js — insere questões reais FGV no Supabase
// Uso: SUPABASE_URL=https://xxx.supabase.co SUPABASE_KEY=sb_service_... node seed_questoes.js

const SUPABASE_URL = process.env.SUPABASE_URL || "https://aitjobeyandnopaflubf.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY; // service_role key obrigatória

if (!SUPABASE_KEY) {
  console.error("❌  Defina SUPABASE_KEY com a service_role key");
  process.exit(1);
}

const QUESTOES = [
  // ── DIREITO CONSTITUCIONAL ──────────────────────────────────
  {
    disciplina: "Direito Constitucional", tema: "Normas programáticas — eficácia", dificuldade: "Médio",
    enunciado: "Maria e Joana, estudiosas do Direito Constitucional, travaram intenso debate a respeito da força normativa das normas programáticas, concluindo corretamente, ao fim, que normas dessa natureza",
    alternativas: { A: "somente terão força normativa após sua integração pela legislação infraconstitucional.", B: "somente adquirem eficácia após sua integração pela legislação infraconstitucional, não ostentando, até então, a natureza de verdadeiras normas.", C: "somente podem ser utilizadas no controle de constitucionalidade quando inexistir norma de eficácia plena como paradigma.", D: "a exemplo de qualquer norma de eficácia contida, não ensejam o surgimento de posições jurídicas definitivas.", E: "possuem eficácia, mas de modo limitado, devendo direcionar a interpretação dos demais comandos da ordem jurídica, além de revogar as normas infraconstitucionais preexistentes incompatíveis." },
    gabarito: "E", fundamentacao: "CF/88, art. 5º; José Afonso da Silva — classificação das normas constitucionais",
    explicacao_gabarito: "As normas programáticas têm eficácia mínima desde a promulgação: revogam normas anteriores incompatíveis, vinculam o legislador e servem como parâmetro de controle de constitucionalidade.",
    explicacao_distratores: { A: "Incorreta — normas programáticas já têm eficácia desde a promulgação, mesmo sem regulamentação.", B: "Incorreta — toda norma constitucional tem natureza normativa (José Afonso da Silva).", C: "Incorreta — normas programáticas podem ser parâmetro de controle normalmente.", D: "Incorreta — confunde normas programáticas com normas de eficácia contida.", E: "Correta." },
    dica_prova: "FGV adora essa distinção: norma programática ≠ sem eficácia. Toda norma constitucional É norma, com eficácia mínima.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Constitucional", tema: "Habeas data vs Mandado de Segurança", dificuldade: "Médio",
    enunciado: "João, pessoa com deficiência, solicitou retificação de seus dados em cadastro municipal que o impedia de participar de programas assistenciais. O Diretor negou por escrito, alegando que não atende requerimentos de pessoas não filiadas ao partido do Prefeito. Após recurso hierárquico mantido pelo Prefeito, João consultou advogado sobre a ação constitucional cabível, havendo prova pré-constituída da ilegalidade. O advogado respondeu corretamente que a ação é:",
    alternativas: { A: "o mandado de segurança ou o habeas data, conforme a livre escolha de João.", B: "o mandado de segurança.", C: "o direito de petição.", D: "o habeas data.", E: "a reclamação." },
    gabarito: "B", fundamentacao: "CF/88, art. 5º, LXIX (MS) e LXXII (HD)",
    explicacao_gabarito: "Direito líquido e certo violado por ato ilegal de autoridade, com prova pré-constituída — requisitos típicos do MS. HD serve apenas para acesso/retificação de dados pessoais em banco de dados, não para garantir acesso a serviço público.",
    explicacao_distratores: { A: "Incorreta — HD e MS não são fungíveis.", B: "Correta.", C: "Incorreta — direito de petição não é ação judicial.", D: "Incorreta — HD tem cabimento restrito a dados pessoais em bancos de dados públicos.", E: "Incorreta — reclamação preserva competência ou autoridade de decisão STF/STJ." },
    dica_prova: "HD = acesso a dados SOBRE o impetrante em banco de dados de caráter público. MS = direito líquido e certo + ato ilegal + prova pré-constituída.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Constitucional", tema: "Foro por prerrogativa — aposentadoria", dificuldade: "Difícil",
    enunciado: "João, Juiz de Direito, causou lesões corporais gravíssimas ao vizinho em briga pessoal. Já preenchia os requisitos para aposentadoria voluntária. Sobre o foro por prerrogativa de função, João será processado e julgado:",
    alternativas: { A: "por um Juiz de Direito.", B: "pelo Tribunal de Justiça.", C: "pelo Tribunal de Justiça, e mesmo que se aposente, o processo permanece no Tribunal.", D: "pelo Juiz de Direito ou pelo Tribunal de Justiça, conforme deliberado por este órgão.", E: "pelo Tribunal de Justiça, mas, caso se aposente no curso do processo, será encaminhado a um Juiz de Direito." },
    gabarito: "E", fundamentacao: "STF, AP 937 QO (2018) — foro especial só para crimes no exercício e em razão do cargo",
    explicacao_gabarito: "AP 937 QO: foro especial aplica-se apenas a crimes cometidos no exercício do cargo e em razão dele. Briga com vizinho é crime pessoal. Enquanto na ativa: TJ competente. Se aposentar: desloca para 1ª instância.",
    explicacao_distratores: { A: "Incorreta — enquanto juiz ativo, TJ é competente.", B: "Incorreta — omite o deslocamento na aposentadoria.", C: "Incorreta — AP 937 QO determina o deslocamento quando cessa o cargo.", D: "Incorreta — não existe essa discricionariedade.", E: "Correta." },
    dica_prova: "AP 937 QO (2018): foro = crime NO EXERCÍCIO + EM RAZÃO do cargo. Crime pessoal → TJ enquanto ativo, 1ª instância após aposentadoria.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Constitucional", tema: "Regime previdenciário — comissionados e temporários", dificuldade: "Médio",
    enunciado: "Maria foi convidada para integrar a Administração Pública direta do Município Beta, para desempenhar trabalho temporário ou ocupar cargo em comissão (sem concurso). Sobre o regime previdenciário após a EC 103/2019:",
    alternativas: { A: "Regime próprio se temporária; regime geral se cargo em comissão.", B: "Regime próprio se cargo em comissão; regime geral se temporária.", C: "Regime próprio em ambos os casos, se o Município criou RPPS até a EC 103/2019.", D: "Regime próprio ou geral, conforme a opção de Maria no momento da nomeação.", E: "Regime geral em ambos os casos, o que não poderia ser excepcionado pelo Município Beta." },
    gabarito: "E", fundamentacao: "CF/88, art. 40, §13 (EC 103/2019)",
    explicacao_gabarito: "Art. 40, §13 CF: aplica-se o RGPS ao servidor ocupante exclusivamente de cargo em comissão de livre nomeação/exoneração e ao trabalhador em regime especial temporário. RGPS obrigatório, sem exceção.",
    explicacao_distratores: { A: "Incorreta — inverte: ambos seguem RGPS.", B: "Incorreta — mesma inversão.", C: "Incorreta — EC 103/2019 definiu RGPS para esses casos, independentemente de RPPS existente.", D: "Incorreta — não há opção; regime é imposto constitucionalmente.", E: "Correta." },
    dica_prova: "EC 103/2019 fechou a questão: comissionados e temporários = RGPS sempre. Sem opção, sem exceção municipal.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Constitucional", tema: "Depósito prévio em recurso administrativo — Súmula Vinculante 21", dificuldade: "Médio",
    enunciado: "Lei estadual condicionou a admissibilidade de recurso administrativo (em processos com multa) ao depósito prévio de 50% do valor da penalidade. A Associação dos Comerciantes consultou advogado sobre a compatibilidade com a CF. O advogado respondeu corretamente que o diploma é:",
    alternativas: { A: "inconstitucional, pois processos administrativos não podem resultar em penalidades aos administrados.", B: "constitucional, caso tenha assegurado a possibilidade de substituição do depósito por arrolamento de bens.", C: "constitucional, pois compete aos Estados legislar sobre processo administrativo estadual.", D: "inconstitucional, na medida em que o depósito prévio afronta a gratuidade inerente ao direito de petição.", E: "constitucional, pois compete ao Estado instituir taxas pelos serviços que presta." },
    gabarito: "D", fundamentacao: "Súmula Vinculante 21 do STF",
    explicacao_gabarito: "SV 21: é inconstitucional a exigência de depósito ou arrolamento prévios de dinheiro ou bens para admissibilidade de recurso administrativo. Viola o direito de petição (art. 5º, XXXIV) e o devido processo legal.",
    explicacao_distratores: { A: "Incorreta — processos administrativos podem aplicar penalidades; o problema é o depósito.", B: "Incorreta — a SV 21 proíbe tanto depósito quanto arrolamento.", C: "Incorreta — competência não torna a medida constitucional.", D: "Correta — SV 21.", E: "Incorreta — confunde com taxa." },
    dica_prova: "SV 21: qualquer percentual de depósito ou arrolamento prévio para recorrer administrativamente = inconstitucional. 10%, 30%, 50% — tanto faz.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Constitucional", tema: "CNJ — competência do STF", dificuldade: "Difícil",
    enunciado: "Após sofrer sanção disciplinar do CNJ, Maria, Juíza Federal, ingressou com ação visando anular a decisão. O foro competente é:",
    alternativas: { A: "um Juiz Federal, mas apenas se Maria interpuser mandado de segurança.", B: "o STF, mas apenas se Maria interpuser mandado de segurança.", C: "um Juiz Federal, qualquer que seja a ação proposta.", D: "o STF, qualquer que seja a ação ajuizada por Maria.", E: "o STJ, que por imposição constitucional aprecia decisões disciplinares do CNJ." },
    gabarito: "D", fundamentacao: "CF/88, art. 102, I, r",
    explicacao_gabarito: "STF tem competência originária para julgar ações contra atos do CNJ (art. 102, I, r, CF). A competência não se restringe ao MS — qualquer ação que conteste decisão do CNJ deve ser ajuizada no STF.",
    explicacao_distratores: { A: "Incorreta — STF, não juiz federal; e não se limita ao MS.", B: "Incorreta — correta a referência ao STF, mas errada a restrição ao MS.", C: "Incorreta — STF, não juiz federal.", D: "Correta — art. 102, I, r: qualquer ação.", E: "Incorreta — STJ não tem essa competência constitucional." },
    dica_prova: "CNJ = órgão do Judiciário (art. 92 CF). Ações contra CNJ → STF (art. 102, I, r). Não importa o tipo de ação.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Constitucional", tema: "Teto remuneratório — acumulação com pensão", dificuldade: "Difícil",
    enunciado: "João, Auditor Fiscal, faleceu. Sua esposa Maria, também servidora estadual, pretende acumular sua remuneração com a pensão por morte. Sobre o teto constitucional (art. 37, XI, CF), conforme STF:",
    alternativas: { A: "incide sobre o somatório da remuneração de Maria com a pensão de João.", B: "incide isoladamente sobre a remuneração de Maria e a pensão de João.", C: "incide isoladamente, mas Maria deve escolher apenas uma das fontes de renda.", D: "incide sobre o somatório somente quando Maria se aposentar.", E: "incide isoladamente enquanto ativa; após aposentadoria não poderá acumular." },
    gabarito: "A", fundamentacao: "STF, Tema 737 (RE 602.381)",
    explicacao_gabarito: "Tema 737 STF: o teto incide sobre o SOMATÓRIO de remuneração e pensão. O valor global percebido não pode superar o subsídio de Ministro do STF.",
    explicacao_distratores: { A: "Correta — teto sobre o total (soma), Tema 737.", B: "Incorreta — não é sobre cada parcela isoladamente.", C: "Incorreta — pode acumular, mas o total fica limitado ao teto.", D: "Incorreta — aplica-se desde já.", E: "Incorreta — não há proibição de acumular; o teto incide sobre o total." },
    dica_prova: "Tema 737 STF: teto = sobre o TOTAL (remuneração + pensão somadas). Acumular é permitido, mas o conjunto não pode ultrapassar o teto.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Constitucional", tema: "TCU — controle de aposentadoria", dificuldade: "Médio",
    enunciado: "O órgão competente da União expediu o ato de concessão de aposentadoria voluntária de João, servidor público efetivo. O ato foi submetido a registro no TCU. Sobre o controle exercido pelo TCU nessa situação:",
    alternativas: { A: "Trata-se de controle interno, pois o TCU integra o Poder Executivo Federal como órgão auxiliar.", B: "Trata-se de controle externo, e o TCU pode negar o registro por verificar ilegalidade, observado o contraditório.", C: "Trata-se de controle externo, mas o TCU está vinculado ao ato, não podendo recusar o registro.", D: "Trata-se de controle prévio exercido pelo Poder Legislativo por meio do TCU.", E: "Trata-se de controle concomitante e o TCU pode suspender preventivamente o pagamento." },
    gabarito: "B", fundamentacao: "CF/88, art. 71, III; STF, MS 25.116",
    explicacao_gabarito: "TCU exerce controle externo (art. 71 CF). Controle de aposentadoria é posterior. STF (MS 25.116): TCU pode negar o registro por ilegalidade, mas deve assegurar contraditório ao servidor (especialmente após 5 anos).",
    explicacao_distratores: { A: "Incorreta — TCU é órgão auxiliar do Congresso (controle externo).", B: "Correta.", C: "Incorreta — pode recusar por ilegalidade.", D: "Incorreta — controle é posterior, não prévio.", E: "Incorreta — não age preventivamente sem análise do mérito." },
    dica_prova: "TCU = controle externo (Congresso). Aposentadoria: controle posterior. Pode negar o registro, mas com contraditório (MS 25.116 STF).",
    origem: "fgv_real", prova_referencia: "FGV · CGU 2022"
  },
  // ── DIREITO TRIBUTÁRIO ──────────────────────────────────────
  {
    disciplina: "Direito Tributário", tema: "Domicílio tributário — recusa pela autoridade", dificuldade: "Médio",
    enunciado: "Sociedade empresária alterou sua sede para cidade extremamente distante, acessível apenas de barco em mais de um dia, mas manteve filiais na Capital. A sociedade impugnou autuações nas filiais alegando que não eram seu domicílio tributário. Sobre o domicílio tributário:",
    alternativas: { A: "Assiste razão à sociedade, pois a Receita não pode discriminar a sede da empresa.", B: "A Receita só pode autuar em outros endereços após 3 tentativas de encontrar os responsáveis.", C: "A Receita está errada, não podendo atribuir à sociedade sua falta de estrutura.", D: "Não assiste razão à sociedade, pois a Receita pode, ao seu arbítrio, escolher qual o domicílio tributário.", E: "Não assiste razão à sociedade, pois a autoridade pode recusar o domicílio eleito quando impossibilite ou dificulte a arrecadação ou a fiscalização do tributo." },
    gabarito: "E", fundamentacao: "CTN, art. 127, §2º",
    explicacao_gabarito: "Art. 127, §2º CTN: a autoridade administrativa pode recusar o domicílio eleito quando este impossibilite ou dificulte a arrecadação ou a fiscalização do tributo.",
    explicacao_distratores: { A: "Incorreta — Receita tem exatamente o poder de recusar domicílio que dificulte a fiscalização.", B: "Incorreta — CTN não exige tentativas prévias.", C: "Incorreta — a mudança de sede para local inacessível é estratégia do contribuinte.", D: "Incorreta — a recusa exige fundamento: impossibilidade ou dificuldade de fiscalização.", E: "Correta — art. 127, §2º CTN." },
    dica_prova: "Art. 127 CTN: regra = domicílio eleito pelo contribuinte. Exceção = recusa quando impossibilite/dificulte arrecadação ou fiscalização. Mudança estratégica de sede = hipótese clássica.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Tributário", tema: "Responsabilidade tributária — alienação judicial em falência", dificuldade: "Médio",
    enunciado: "A pessoa jurídica Espectro, em processo de falência, foi alienada judicialmente para a Ômega, que manteve o mesmo nome e lojas. Em relação aos tributos devidos pela Espectro:",
    alternativas: { A: "Ômega responderá integralmente, por ter adquirido o fundo de comércio e os estabelecimentos.", B: "Ômega responderá subsidiariamente com o alienante.", C: "Ômega só responderá se o alienante não continuar no mesmo ramo de comércio.", D: "Ômega não responderá, por ter havido alienação judicial em processo de falência.", E: "Ômega não responderá, mesmo que um de seus sócios seja sócio da Espectro." },
    gabarito: "D", fundamentacao: "CTN, art. 133, §1º, I",
    explicacao_gabarito: "Art. 133, §1º, I CTN: o adquirente não responde pelos tributos quando a alienação ocorre judicialmente em processo de falência. Exceção (§2º): se o adquirente for sócio do falido ou parente.",
    explicacao_distratores: { A: "Incorreta — a regra geral do art. 133 tem exceção expressa para alienação em falência.", B: "Incorreta — em falência não há responsabilidade subsidiária do adquirente.", C: "Incorreta — a exceção independe de o alienante continuar no ramo.", D: "Correta — art. 133, §1º, I.", E: "Incorreta — se sócio do falido, responde (art. 133, §2º). A alternativa diz que não responderia mesmo sendo sócio, o que é falso." },
    dica_prova: "Pegadinha: art. 133 CTN diz que adquirente responde. MAS §1º, I: EXCEÇÃO para alienação judicial em FALÊNCIA. §2º: sócio do falido responde sim.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Tributário", tema: "IPVA — alíquota mínima e diferenciação", dificuldade: "Médio",
    enunciado: "Sobre o IPVA, assinale a afirmativa correta:",
    alternativas: { A: "A alíquota mínima será fixada pelo Senado Federal.", B: "A alíquota máxima será fixada pelo Senado Federal e a mínima por cada Estado.", C: "Não pode ter alíquota diferenciada em razão do tipo e da utilização do veículo.", D: "A diferença entre alíquota mínima e máxima não pode exceder 100%.", E: "As alíquotas máximas e mínimas serão fixadas pelo próprio Estado." },
    gabarito: "A", fundamentacao: "CF/88, art. 155, §6º, I e II (EC 42/2003)",
    explicacao_gabarito: "Art. 155, §6º, I: IPVA terá alíquotas mínimas fixadas pelo Senado Federal. O §6º, II permite alíquotas diferenciadas por tipo e utilização do veículo.",
    explicacao_distratores: { A: "Correta — Senado Federal fixa as alíquotas MÍNIMAS do IPVA.", B: "Incorreta — Senado fixa o mínimo, não o máximo.", C: "Incorreta — §6º, II expressamente permite diferenciação.", D: "Incorreta — não há limite percentual na CF.", E: "Incorreta — o mínimo é fixado pelo Senado." },
    dica_prova: "IPVA: Senado = alíquota MÍNIMA (não máxima). Estados podem cobrar acima. PODEM diferenciar por tipo/utilização.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Tributário", tema: "Integração da legislação tributária — art. 108 CTN", dificuldade: "Médio",
    enunciado: "Na ausência de disposição expressa, a autoridade competente para aplicar a legislação tributária utilizará, sucessivamente:",
    alternativas: { A: "Analogia, equidade, princípios gerais de Direito Público e princípios gerais de Direito Tributário.", B: "Princípios gerais de Direito Tributário, analogia, princípios gerais de Direito Público e equidade.", C: "Analogia, princípios gerais de Direito Público, princípios gerais de Direito Tributário e equidade.", D: "Equidade, analogia, princípios gerais de Direito Tributário e princípios gerais de Direito Público.", E: "Analogia, princípios gerais de Direito Tributário, princípios gerais de Direito Público e equidade." },
    gabarito: "E", fundamentacao: "CTN, art. 108",
    explicacao_gabarito: "Art. 108 CTN: I — analogia; II — princípios gerais de Direito Tributário; III — princípios gerais de Direito Público; IV — equidade. Mnemônico: A-T-P-E.",
    explicacao_distratores: { A: "Incorreta — coloca equidade antes dos princípios gerais.", B: "Incorreta — coloca Tributário antes da analogia.", C: "Incorreta — coloca Público antes do Tributário.", D: "Incorreta — equidade primeiro, sendo ela a última.", E: "Correta — A-T-P-E." },
    dica_prova: "Mnemônico: A-T-P-E (Analogia → Tributário → Público → Equidade). Equidade é sempre a ÚLTIMA.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Tributário", tema: "ITCMD — competência por tipo de bem", dificuldade: "Médio",
    enunciado: "José Sena consulta a Receita Estadual do Amazonas após inventário sobre ITCMD. Sobre a competência para instituição do imposto, é correto afirmar que:",
    alternativas: { A: "relativamente a bens imóveis e respectivos direitos, compete ao Estado da situação do bem ou ao Distrito Federal.", B: "relativamente a bens móveis, títulos e créditos, compete ao Estado da situação do bem.", C: "relativamente a bens imóveis, compete ao Estado do domicílio do doador.", D: "relativamente a bens imóveis, compete ao Estado em que se processar o inventário ou onde tiver domicílio o doador.", E: "terá competência regulada por lei ordinária se o doador tiver domicílio no exterior." },
    gabarito: "A", fundamentacao: "CF/88, art. 155, §1º, I",
    explicacao_gabarito: "Art. 155, §1º, I CF: ITCMD relativo a bens imóveis compete ao Estado da situação do bem (lex situs) ou ao DF. Para bens móveis: Estado onde se processa o inventário ou tem domicílio o doador (§1º, II).",
    explicacao_distratores: { A: "Correta — bens imóveis: Estado da situação (lex rei sitae).", B: "Incorreta — bens móveis competem ao Estado do inventário/domicílio do doador.", C: "Incorreta — imóveis seguem a situação do bem, não o domicílio do doador.", D: "Incorreta — essa regra é para bens MÓVEIS, não imóveis.", E: "Incorreta — bens no exterior exigem lei complementar (§1º, III, b CF), não ordinária." },
    dica_prova: "ITCMD: bens IMÓVEIS → Estado da situação (lex rei sitae). Bens MÓVEIS → Estado do inventário ou domicílio do doador. Confundir esses critérios é a pegadinha clássica.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Tributário", tema: "ICMS — não incidência operações interestaduais petróleo/energia", dificuldade: "Médio",
    enunciado: "Sobre o ICMS, é correto afirmar que NÃO incide sobre:",
    alternativas: { A: "as operações interestaduais relativas à energia elétrica e ao petróleo, inclusive lubrificantes e combustíveis, quando destinados à industrialização ou à comercialização.", B: "as operações interestaduais relativas à energia elétrica e ao petróleo destinados a qualquer fim.", C: "o fornecimento de mercadorias com prestação de serviços sujeitos ao ISS, em todos os casos.", D: "a prestação de serviços de transporte interestadual e intermunicipal, por qualquer via.", E: "as operações com ato cooperativo praticado pelas cooperativas." },
    gabarito: "A", fundamentacao: "CF/88, art. 155, §2º, X, b",
    explicacao_gabarito: "Art. 155, §2º, X, b CF: ICMS não incide sobre operações interestaduais com petróleo (inclusive derivados) e energia elétrica, APENAS quando destinados à industrialização ou comercialização. Para consumo final no destino: incide.",
    explicacao_distratores: { A: "Correta — não incidência apenas para industrialização/comercialização.", B: "Incorreta — a não incidência não é para qualquer fim.", C: "Incorreta — há casos em que ICMS incide mesmo com ISS.", D: "Incorreta — transporte interestadual/intermunicipal é fato gerador do ICMS.", E: "Incorreta." },
    dica_prova: "Art. 155, §2º, X, b: energia e petróleo interestadual → não incide ICMS SOMENTE para industrialização/comercialização. Para consumo final no destino → incide.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Tributário", tema: "ICMS — contribuinte na importação sem habitualidade", dificuldade: "Médio",
    enunciado: "Aluísio importou uma guitarra do exterior para sua coleção particular, sem fins comerciais. Sobre a cobrança de ICMS:",
    alternativas: { A: "O imposto não pode ser cobrado, uma vez provada a falta de intuito comercial.", B: "O imposto pode ser cobrado, porque a Receita não tem certeza de que nunca usará para fins comerciais.", C: "O imposto não pode ser cobrado, pois não aufere renda com o instrumento.", D: "O imposto pode ser cobrado, pois é contribuinte, mesmo sem habitualidade ou intuito comercial, quem importa bens do exterior.", E: "O imposto não pode ser cobrado, desde que ele se comprometa a permanecer com o instrumento por cinco anos." },
    gabarito: "D", fundamentacao: "CF/88, art. 155, §2º, IX, a; LC 87/96, art. 4º, parágrafo único, I; SV 48",
    explicacao_gabarito: "CF e LC 87/96 definem que é contribuinte do ICMS qualquer pessoa que importe do exterior, qualquer que seja a finalidade. SV 48 confirma a incidência na importação por pessoa física para uso próprio.",
    explicacao_distratores: { A: "Incorreta — falta de intuito comercial é irrelevante para o ICMS na importação.", B: "Incorreta — a fundamentação está errada; incide independentemente de incerteza futura.", C: "Incorreta — ausência de renda não isenta do ICMS na importação.", D: "Correta — contribuinte do ICMS = qualquer importador.", E: "Incorreta — não existe essa regra." },
    dica_prova: "SV 48: ICMS incide na importação por pessoa física para uso próprio. Contribuinte = qualquer importador, sem habitualidade. Questão clássica em toda prova de Auditor Fiscal.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Tributário", tema: "IRPJ vs CSLL — destinação da receita", dificuldade: "Médio",
    enunciado: "Sobre as diferenças entre o IRPJ e a CSLL, assinale a opção correta:",
    alternativas: { A: "O IRPJ pode ser apurado pelo lucro real e presumido; a CSLL apenas pelo lucro real.", B: "A destinação da CSLL é para a Seguridade Social, enquanto a do IRPJ pode ser utilizada para qualquer despesa do Fisco, após repartição constitucional.", C: "A arrecadação do IRPJ é toda da União; a da CSLL é dividida com os Estados e Municípios.", D: "A arrecadação do IRPJ é repartida com Estados e Municípios; a da CSLL, só com os Estados.", E: "Quem paga um tributo fica dispensado do outro, para evitar bis in idem." },
    gabarito: "B", fundamentacao: "CF/88, art. 195, I, c; CTN, art. 43; Lei 9.430/1996",
    explicacao_gabarito: "CSLL é contribuição social com receita vinculada à Seguridade Social (art. 195, I, c CF). IRPJ é imposto com destinação mais flexível após as repartições constitucionais com FPE e FPM.",
    explicacao_distratores: { A: "Incorreta — ambos admitem lucro real, presumido e arbitrado.", B: "Correta.", C: "Incorreta — IRPJ é repartido com FPE e FPM; CSLL não é repartida.", D: "Incorreta — CSLL não é repartida com nenhum ente.", E: "Incorreta — são tributos independentes." },
    dica_prova: "CSLL = contribuição social = receita VINCULADA à Seguridade. IRPJ = imposto = receita desvinculada (exceto repartição constitucional).",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Tributário", tema: "Contribuição de Melhoria — pressupostos", dificuldade: "Fácil",
    enunciado: "Município aprovou lei para cobrar tributo dos moradores de bairros próximos a novas estações de metrô, para custear as obras considerando a valorização dos imóveis. O tributo é:",
    alternativas: { A: "Contribuição Social.", B: "CIDE.", C: "Imposto sobre Grandes Fortunas.", D: "Empréstimo Compulsório.", E: "Contribuição de Melhoria." },
    gabarito: "E", fundamentacao: "CF/88, art. 145, III; CTN, arts. 81-82",
    explicacao_gabarito: "Contribuição de Melhoria: cobrada em razão de obra pública de que decorra valorização imobiliária. Pressupostos: obra pública + valorização. Duplo limite: custo da obra e valorização individual.",
    explicacao_distratores: { A: "Incorreta — contribuição social financia a Seguridade Social.", B: "Incorreta — CIDE intervém no domínio econômico.", C: "Incorreta — IGF incide sobre grandes patrimônios.", D: "Incorreta — empréstimo compulsório exige LC e circunstâncias excepcionais.", E: "Correta." },
    dica_prova: "Contribuição de Melhoria = OBRA PÚBLICA + VALORIZAÇÃO IMOBILIÁRIA. Duplo limite: total da obra e valorização individual de cada imóvel.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Tributário", tema: "Obrigação tributária — art. 113 CTN e denúncia espontânea", dificuldade: "Médio",
    enunciado: "Sobre o CTN, analise: I. A obrigação tributária principal surge com a ocorrência do fato gerador e tem por objeto o pagamento de tributo ou penalidade pecuniária. II. O crédito tributário regularmente constituído somente se modifica ou extingue nas hipóteses previstas no CTN, sendo vedada qualquer suspensão. III. A denúncia espontânea da infração, acompanhada do pagamento do tributo e dos juros de mora, exclui a responsabilidade por infrações tributárias. Está correto:",
    alternativas: { A: "I, apenas.", B: "III, apenas.", C: "I e III.", D: "II e III.", E: "I, II e III." },
    gabarito: "C", fundamentacao: "CTN, arts. 113, §1º; 138; 151",
    explicacao_gabarito: "Item I correto (art. 113, §1º). Item III correto (art. 138). Item II incorreto: CTN prevê expressamente hipóteses de SUSPENSÃO do crédito tributário (art. 151 — MODERECOPA).",
    explicacao_distratores: { A: "Parcialmente correto.", B: "Parcialmente correto.", C: "Correta — I e III corretos; II errado pois há suspensão no art. 151.", D: "Incorreta — II está errado.", E: "Incorreta — II está errado." },
    dica_prova: "Art. 138 CTN: denúncia espontânea exclui a MULTA (responsabilidade por infrações), mas não dispensa juros de mora. Parcelamento posterior não é denúncia espontânea (Súmula 360 STJ).",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-ES 2021"
  },
  {
    disciplina: "Direito Tributário", tema: "Anterioridade anual e nonagesimal — IPI", dificuldade: "Médio",
    enunciado: "Analise: I. O princípio da anterioridade anual veda a cobrança de tributo no mesmo exercício financeiro em que publicada a lei que o instituiu ou aumentou. II. O princípio da noventena exige que entre a publicação da lei e a cobrança transcorram no mínimo 90 dias, sendo aplicável a todos os tributos sem exceção. III. O IPI está sujeito apenas à anterioridade nonagesimal, dispensada a anterioridade anual. Está correto somente:",
    alternativas: { A: "I.", B: "II.", C: "III.", D: "I e III.", E: "I, II e III." },
    gabarito: "D", fundamentacao: "CF/88, art. 150, III, b e c; art. 150, §1º",
    explicacao_gabarito: "I correto (art. 150, III, b). III correto — IPI sujeito apenas à noventena (art. 150, §1º). II incorreto — há exceções à noventena (IR, empréstimo compulsório guerra/calamidade, base de cálculo do IPTU e IPVA).",
    explicacao_distratores: { A: "Parcialmente correto.", B: "Incorreta — há exceções à noventena.", C: "Parcialmente correto.", D: "Correta — I e III corretos; II errado.", E: "Incorreta — II está errado." },
    dica_prova: "IPI: exceção à anterioridade ANUAL, mas sujeito à noventena. IR: exceção à noventena, mas sujeito à anterioridade anual. Estude a tabela das exceções.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-PR 2025"
  },
  // ── DIREITO ADMINISTRATIVO ────────────────────────────────────
  {
    disciplina: "Direito Administrativo", tema: "Delegação de competência — atos privativos", dificuldade: "Médio",
    enunciado: "João, Secretário de Fazenda, deseja delegar sua competência para José, Auditor Fiscal, para praticar ato de competência privativa de João (que não é edição de ato normativo nem decisão de recurso hierárquico). A legislação do Estado tem o mesmo teor da Lei 9.784/99. A delegação é:",
    alternativas: { A: "lícita, diante da inexistência de vedação legal de delegação de competência para prática de ato de competência privativa.", B: "ilícita, haja vista que apenas atos administrativos enunciativos podem ser objeto de delegação.", C: "ilícita, porque a legislação de regência veda expressamente a delegação de competência para prática de ato de competência privativa do agente.", D: "ilícita, pois a legislação veda expressamente a delegação de competência para prática de todos os atos administrativos.", E: "lícita, eis que, apesar da vedação legal, João pode justificar o ato para atendimento ao interesse público." },
    gabarito: "C", fundamentacao: "Lei 9.784/99, art. 13, III",
    explicacao_gabarito: "Art. 13, III da Lei 9.784/99: não podem ser objeto de delegação as matérias de competência exclusiva do órgão ou autoridade.",
    explicacao_distratores: { A: "Incorreta — há vedação legal expressa.", B: "Incorreta — a vedação não se limita a atos enunciativos.", C: "Correta — art. 13, III.", D: "Incorreta — a lei permite delegação de atos em geral; veda apenas normativos, recursos e competência exclusiva.", E: "Incorreta — interesse público não autoriza violar vedação legal expressa." },
    dica_prova: "Lei 9.784/99, art. 13: NÃO delegáveis: (I) atos normativos; (II) decisão de recursos; (III) competência EXCLUSIVA. Competência privativa = exclusiva = não delegável.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Administrativo", tema: "Intranscendência subjetiva das sanções — LRF", dificuldade: "Difícil",
    enunciado: "A Assembleia Legislativa do Estado Alfa descumpriu os limites de gastos com pessoal. A União proibiu o Estado de realizar operações de crédito e receber transferências federais com base na LRF. Conforme STF:",
    alternativas: { A: "A União agiu corretamente, pois o Estado (pelo Executivo) é a pessoa jurídica a que pertence o Legislativo estadual.", B: "A União agiu corretamente, pois o Governador deveria ter sustado os atos do Legislativo que afrontaram a LRF.", C: "A União agiu corretamente, com base nos princípios da transcendência subjetiva das sanções e da unidade institucional.", D: "A União agiu incorretamente, por violação ao princípio da intranscendência subjetiva das sanções, pois o Executivo não tem competência para intervir na esfera do Legislativo.", E: "A União agiu incorretamente, por violação ao princípio da continuidade dos serviços públicos." },
    gabarito: "D", fundamentacao: "STF — princípio da intranscendência subjetiva das sanções",
    explicacao_gabarito: "STF: é vedado punir o Poder Executivo estadual por descumprimento de limites ocorrido no âmbito do Poder Legislativo estadual, que possui autonomia institucional.",
    explicacao_distratores: { A: "Incorreta — STF rejeitou esse argumento quando há autonomia dos Poderes.", B: "Incorreta — Executivo não tem competência de controle sobre o Legislativo.", C: "Incorreta — STF aplicou exatamente o oposto: INtranscendência.", D: "Correta — princípio da intranscendência.", E: "Incorreta — não é o fundamento principal." },
    dica_prova: "Intranscendência subjetiva: sanção só atinge quem praticou o ato. Legislativo descumpriu → Executivo não pode sofrer as consequências.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Administrativo", tema: "Nova Lei de Licitações — dispensa vs inexigibilidade", dificuldade: "Médio",
    enunciado: "De acordo com a Lei 14.133/2021, é DISPENSÁVEL (e não inexigível) a licitação para:",
    alternativas: { A: "objetos que devam ou possam ser contratados por meio de credenciamento.", B: "aquisição ou locação de imóvel cujas características de instalações e de localização tornem necessária sua escolha.", C: "aquisição de materiais que só possam ser fornecidos por produtor, empresa ou representante comercial exclusivos.", D: "contratação de profissional do setor artístico consagrado pela crítica especializada.", E: "contratação de profissional técnico de notória especialização para composição de comissão de avaliação." },
    gabarito: "B", fundamentacao: "Lei 14.133/2021, art. 75, VIII",
    explicacao_gabarito: "Art. 75, VIII: é dispensável a licitação para aquisição ou locação de imóvel cujas características de instalações e localização tornem necessária sua escolha. As demais são casos de inexigibilidade (art. 74).",
    explicacao_distratores: { A: "Incorreta — credenciamento é contratação direta.", B: "Correta — art. 75, VIII.", C: "Incorreta — fornecedor exclusivo = inexigibilidade (art. 74, I).", D: "Incorreta — profissional artístico = inexigibilidade (art. 74, III).", E: "Incorreta — notória especialização = inexigibilidade (art. 74, III)." },
    dica_prova: "Dispensa = competição POSSÍVEL mas dispensada. Inexigibilidade = competição IMPOSSÍVEL (exclusividade, notória especialização, artístico). Imóvel específico = DISPENSA.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Direito Administrativo", tema: "Improbidade administrativa — dolo específico pós-Lei 14.230/21", dificuldade: "Médio",
    enunciado: "Sobre improbidade administrativa, conforme a Lei 8.429/1992 com as alterações da Lei 14.230/2021:",
    alternativas: { A: "As sanções por improbidade podem ser cumuladas com sanções penais e administrativas sem qualquer limitação constitucional.", B: "Para configuração de ato de improbidade, basta a prova de irregularidade formal na conduta do agente.", C: "Após a Lei 14.230/2021, somente o dolo específico configura improbidade, afastando-se a responsabilidade por culpa.", D: "A ação de improbidade pode ser proposta por qualquer pessoa do povo, pelo MP ou pela pessoa jurídica interessada.", E: "A prescrição da ação de improbidade é de 5 anos para qualquer agente público, contados do término do mandato." },
    gabarito: "C", fundamentacao: "Lei 8.429/1992, art. 1º, §2º (Lei 14.230/2021); STF, Tema 1.199",
    explicacao_gabarito: "Lei 14.230/2021 exige dolo ESPECÍFICO. STF confirmou no Tema 1.199. Culpa completamente afastada. Somente o MP tem legitimidade ativa (art. 17). Prescrição: 8 anos após o fato lesivo.",
    explicacao_distratores: { A: "Parcialmente correta mas incompleta.", B: "Incorreta — mera irregularidade formal sem dolo não configura improbidade.", C: "Correta.", D: "Incorreta — somente o MP (art. 17).", E: "Incorreta — prescrição passou para 8 anos (art. 23, I)." },
    dica_prova: "Reforma LIA (Lei 14.230/2021): (1) dolo ESPECÍFICO obrigatório; (2) só MP pode propor; (3) prescrição = 8 anos do fato. FGV adora cobrar essas três mudanças.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-ES 2021"
  },
  {
    disciplina: "Direito Administrativo", tema: "Responsabilidade civil do Estado — conduta comissiva", dificuldade: "Médio",
    enunciado: "Sobre a responsabilidade civil do Estado, assinale a afirmativa correta à luz da CF e da jurisprudência:",
    alternativas: { A: "A responsabilidade do Estado é sempre objetiva, inclusive nos casos de omissão estatal, independentemente de qualquer requisito adicional.", B: "A responsabilidade objetiva do Estado exige apenas a prova do nexo causal entre a conduta comissiva estatal e o dano sofrido pelo particular.", C: "Nas condutas omissivas estatais, aplica-se a teoria subjetiva, exigindo-se prova de culpa ou dolo do agente público.", D: "A responsabilidade do Estado por atos judiciais é sempre objetiva.", E: "O Estado não responde por danos causados por seus agentes em atividades fora do horário de serviço." },
    gabarito: "B", fundamentacao: "CF/88, art. 37, §6º",
    explicacao_gabarito: "Art. 37, §6º CF: responsabilidade objetiva nas condutas comissivas. Basta prova do dano e do nexo causal — prescinde de culpa ou dolo.",
    explicacao_distratores: { A: "Incorreta — nas omissões genéricas, parte da jurisprudência aplica teoria subjetiva.", B: "Correta — conduta comissiva: dano + nexo causal.", C: "Parcialmente correta para omissões genéricas, mas não é regra absoluta.", D: "Incorreta — atos judiciais têm objetividade apenas em casos específicos.", E: "Incorreta — se agente usava bem público e há nexo com atividade estatal, Estado responde." },
    dica_prova: "Art. 37, §6º CF: condutas COMISSIVAS = responsabilidade OBJETIVA (dano + nexo). Condutas OMISSIVAS = divergência: omissão específica → objetiva; omissão genérica → subjetiva.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-ES 2021"
  },
  // ── CONTABILIDADE ─────────────────────────────────────────────
  {
    disciplina: "Contabilidade Geral", tema: "CPC 00 — Relatórios financeiros para fins gerais", dificuldade: "Médio",
    enunciado: "De acordo com o CPC 00 (R2) — Estrutura Conceitual para Relatório Financeiro, em relação aos relatórios financeiros para fins gerais, assinale a afirmativa correta:",
    alternativas: { A: "Destinam-se a apresentar o valor da entidade que reportam.", B: "Baseiam-se em representações exatas e precisas do que se propõem a apresentar.", C: "São completos, de modo que os usuários não precisam considerar informações de outras fontes.", D: "Incluem informações adicionais que são úteis a um subconjunto específico de principais usuários.", E: "Não são do interesse da administração da entidade, pois esta obtém internamente as informações que precisa." },
    gabarito: "D", fundamentacao: "CPC 00 (R2), item 1.9",
    explicacao_gabarito: "CPC 00: os relatórios financeiros para fins gerais não se destinam a apresentar o valor da entidade, são baseados em estimativas (não representações exatas) e podem incluir informações adicionais úteis a subconjuntos específicos dos principais usuários.",
    explicacao_distratores: { A: "Incorreta — não apresentam o valor da entidade (isso é papel de laudos de avaliação).", B: "Incorreta — são baseados em estimativas.", C: "Incorreta — os usuários precisam de outras fontes complementares.", D: "Correta — item 1.9: podem incluir informações adicionais úteis a subconjunto específico.", E: "Incorreta — a administração também se beneficia." },
    dica_prova: "CPC 00: o que o relatório NÃO faz: (1) não apresenta valor da entidade; (2) não é baseado em dados exatos (usa estimativas); (3) não é completo — usuário precisa de outras fontes.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Contabilidade Geral", tema: "Propriedade para investimento — critério de mensuração", dificuldade: "Médio",
    enunciado: "Sociedade que presta serviços de auditoria possui um terreno mantido para valorização de capital a longo prazo. Em relação à mensuração do terreno no balanço patrimonial:",
    alternativas: { A: "Deve usar o método do custo.", B: "Deve usar o método do valor justo.", C: "Deve usar o método do custo de reposição.", D: "Deve escolher entre o método do valor justo e o método do custo.", E: "Deve escolher entre o método do valor justo e o método do valor presente." },
    gabarito: "D", fundamentacao: "CPC 28 — Propriedade para Investimento",
    explicacao_gabarito: "CPC 28: terreno mantido para valorização de capital é propriedade para investimento. A entidade pode escolher entre o modelo de valor justo e o modelo de custo, devendo aplicar a política consistentemente.",
    explicacao_distratores: { A: "Incorreta — custo é uma das opções, não a única.", B: "Incorreta — valor justo é uma das opções, não a única.", C: "Incorreta — custo de reposição não é modelo previsto no CPC 28.", D: "Correta — CPC 28: escolha entre valor justo e custo.", E: "Incorreta — valor presente não é opção para PPI no CPC 28." },
    dica_prova: "CPC 28: PPI = imóvel mantido para auferir aluguel ou valorização. Modelos: (1) valor justo ou (2) custo. Política deve ser consistente para todas as PPIs.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Contabilidade Geral", tema: "Ações em tesouraria — custos de transação", dificuldade: "Médio",
    enunciado: "Sociedade adquiriu ações de emissão própria para mantê-las em tesouraria por R$100.000, incorrendo em custos de transação de R$15.000. A contabilização correta é:",
    alternativas: { A: "D- Capital Social R$115.000; C- Ações em tesouraria R$115.000.", B: "D- Ações em tesouraria R$115.000; C- Caixa R$115.000.", C: "D- Despesas R$115.000; C- Capital Social R$115.000.", D: "D- Ações em tesouraria R$100.000; D- Despesas R$15.000; C- Caixa R$115.000.", E: "D- Despesas R$15.000; D- Capital Social R$100.000; C- Caixa R$115.000." },
    gabarito: "B", fundamentacao: "CPC 08 (R1) — Custos de Transação e Prêmios na Emissão de Títulos e Valores Mobiliários",
    explicacao_gabarito: "Na recompra de ações próprias, os custos de transação integram o valor das ações em tesouraria (redutora do PL). Total R$115.000 debitado em Ações em Tesouraria. Não há reconhecimento de despesa.",
    explicacao_distratores: { A: "Incorreta — Capital Social não é debitado.", B: "Correta.", C: "Incorreta — não há despesa.", D: "Incorreta — custos de transação não são despesa.", E: "Incorreta — Capital Social não é debitado; custos não são despesa." },
    dica_prova: "CPC 08: ações em tesouraria = redutora do PL. Custos de transação na recompra = integram o valor das ações em tesouraria (não despesa). D - Ações em Tesouraria R$115k / C - Caixa R$115k.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Contabilidade Geral", tema: "Custeio por absorção vs variável — uso contábil e tributário", dificuldade: "Fácil",
    enunciado: "O critério de custeio utilizado, respectivamente, pela Contabilidade Financeira para elaboração de demonstrações contábeis e pela Contabilidade Tributária para cálculo de impostos é:",
    alternativas: { A: "Custeio Variável e Custeio Padrão.", B: "Custeio Padrão e Custeio Padrão.", C: "Custeio Variável e Custeio Variável.", D: "Custeio por Absorção e Custeio Variável.", E: "Custeio por Absorção e Custeio por Absorção." },
    gabarito: "E", fundamentacao: "NBC TG; RIR — Regulamento do Imposto de Renda",
    explicacao_gabarito: "Tanto para fins contábeis (NBC TG/CPC) quanto para fins tributários (IRPJ/CSLL), o critério exigido é o Custeio por Absorção. Custeio Variável não é aceito para nenhuma das duas finalidades.",
    explicacao_distratores: { A: "Incorreta — Custeio Variável não é aceito.", B: "Incorreta — Custeio Padrão não é o método exigido.", C: "Incorreta.", D: "Incorreta — Custeio Variável não é aceito para fins tributários.", E: "Correta." },
    dica_prova: "Regra de ouro: Absorção para TUDO (financeira + fiscal). Custeio Variável = apenas ferramenta GERENCIAL.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Contabilidade Geral", tema: "Margem de segurança", dificuldade: "Médio",
    enunciado: "Fábrica produz e vende bicicletas a R$1.000 cada, com custos variáveis de R$400/un. Custos fixos mensais: R$90.000. Despesas fixas mensais: R$30.000. Em dezembro produziu e vendeu 240 bicicletas. A margem de segurança é:",
    alternativas: { A: "16,67%.", B: "20,00%.", C: "25,00%.", D: "37,50%.", E: "40,00%." },
    gabarito: "C", fundamentacao: "Análise de Custo-Volume-Lucro (CVL)",
    explicacao_gabarito: "PE = R$120.000 / R$600 = 200 un. MS em receita = (R$240.000 - R$200.000) / R$160.000 = 25%.",
    explicacao_distratores: { A: "Seria a MS em unidades: (240-200)/240 = 16,67%.", B: "Incorreta.", C: "Correta — MS em receita: (240k-200k)/160k = 25%.", D: "Incorreta.", E: "Incorreta." },
    dica_prova: "MS pode ser em UNIDADES (16,67%) ou em RECEITA (25%). FGV costuma pedir em receita. PE = custos fixos totais / MC unitária.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Contabilidade Geral", tema: "Mudança de política contábil vs retificação de erro — CPC 23", dificuldade: "Difícil",
    enunciado: "Sociedade mudou o critério de avaliação de estoque de PEPS para CMPm (mudança de política contábil). Também foi constatado que a conta Caixa não havia considerado uma compra de estoques (erro). Os efeitos devem ser contabilizados, respectivamente, na:",
    alternativas: { A: "DRE e DRE.", B: "DRE e Demonstração dos Resultados Abrangentes.", C: "DRE e DMPL.", D: "DMPL e DMPL.", E: "DMPL e DRE." },
    gabarito: "E", fundamentacao: "CPC 23 — Políticas Contábeis, Mudança de Estimativa e Retificação de Erro",
    explicacao_gabarito: "CPC 23: mudança de política contábil → ajuste retroativo na DMPL (saldo de abertura dos lucros acumulados). Retificação de erro de período anterior → DRE do período de reconhecimento.",
    explicacao_distratores: { A: "Incorreta — mudança de política não vai para DRE.", B: "Incorreta.", C: "Incorreta — inverte a ordem.", D: "Incorreta — retificação de erro vai para DRE.", E: "Correta — mudança de política → DMPL; retificação de erro → DRE." },
    dica_prova: "CPC 23: mudança de POLÍTICA = DMPL (retroativo). Mudança de ESTIMATIVA = DRE prospectivo. ERRO = DRE (ou DMPL se material). FGV adora cobrar essa distinção.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  // ── AUDITORIA ─────────────────────────────────────────────────
  {
    disciplina: "Auditoria", tema: "Amostragem em auditoria — NBC TA 530", dificuldade: "Médio",
    enunciado: "Com base na NBC TA 530 — Amostragem em Auditoria, assinale a afirmativa correta:",
    alternativas: { A: "Na definição da amostra, o auditor deve determinar o tamanho suficiente para eliminar o risco de amostragem.", B: "Ao definir uma amostra, o auditor deve considerar a finalidade do procedimento de auditoria e o orçamento planejado.", C: "A decisão quanto ao uso de abordagem estatística ou não estatística é baseada no tamanho da amostra.", D: "O auditor deve selecionar itens de forma que as unidades mais representativas tenham mais chance de serem selecionadas.", E: "Quanto menor o risco de amostragem que o auditor está disposto a aceitar, maior deve ser o tamanho da amostra." },
    gabarito: "E", fundamentacao: "NBC TA 530, item 7",
    explicacao_gabarito: "NBC TA 530: tamanho da amostra é determinado pelo risco de amostragem tolerado. Quanto menor o risco tolerado (maior confiança exigida), maior a amostra necessária.",
    explicacao_distratores: { A: "Incorreta — risco de amostragem NUNCA pode ser eliminado.", B: "Incorreta — orçamento não é critério da NBC TA 530.", C: "Incorreta — decisão entre estatística e não estatística depende de julgamento profissional.", D: "Incorreta — seleção deve ser aleatória, com igual chance para cada unidade.", E: "Correta." },
    dica_prova: "Risco de amostragem: nunca se elimina, apenas se reduz. Para reduzir, aumenta a amostra. Distingue auditoria de censo.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Auditoria", tema: "Evidência de auditoria — suficiente e apropriada", dificuldade: "Fácil",
    enunciado: "De acordo com a NBC TA 500 (R1) — Evidência de Auditoria, o auditor deve definir e executar procedimentos com o objetivo de obter evidência de auditoria:",
    alternativas: { A: "inédita e relevante.", B: "tempestiva e relevante.", C: "neutra e livre de erros.", D: "apropriada e suficiente.", E: "completa e verificável." },
    gabarito: "D", fundamentacao: "NBC TA 500 (R1), item 6",
    explicacao_gabarito: "NBC TA 500 (R1): o auditor deve obter evidência SUFICIENTE (quantidade) e APROPRIADA (qualidade = relevância + confiabilidade).",
    explicacao_distratores: { A: "Incorreta — inédita não é atributo.", B: "Incorreta.", C: "Incorreta — neutro e livre de erros são atributos da confiabilidade, não o binômio central.", D: "Correta — suficiente + apropriada.", E: "Incorreta." },
    dica_prova: "NBC TA 500: SUFICIENTE (quantidade) + APROPRIADA (qualidade). O auditor calibra a quantidade com base na qualidade disponível.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Auditoria", tema: "Procedimentos analíticos — investigação de flutuações", dificuldade: "Médio",
    enunciado: "De acordo com a NBC TA 520, se os procedimentos analíticos identificam flutuações ou relações inconsistentes com outras informações relevantes, o auditor deve examinar essas diferenças mediante:",
    alternativas: { A: "indagação à administração e obtenção de evidência de auditoria apropriada para as respostas da administração.", B: "avaliação das informações obtidas por meio de estudos das relações plausíveis entre os dados e os valores esperados.", C: "verificação de procedimentos e controles originalmente realizados como parte do controle interno.", D: "revisão do trabalho executado, reaplicação dos procedimentos e investigação das flutuações.", E: "obtenção de confirmação externa como resposta escrita de terceiro ao auditor." },
    gabarito: "A", fundamentacao: "NBC TA 520, item 7",
    explicacao_gabarito: "NBC TA 520, item 7: diferenças inexplicadas → primeiro passo: indagar à administração e obter evidência adequada para corroborar as respostas.",
    explicacao_distratores: { A: "Correta — primeiro passo: indagação à administração.", B: "Incorreta — fase de planejamento, não de investigação de diferenças.", C: "Incorreta.", D: "Incorreta.", E: "Incorreta — confirmação externa é procedimento adicional, não o primeiro passo." },
    dica_prova: "NBC TA 520: diferenças inexplicadas → (1) indagar administração; (2) obter evidência para corroborar as respostas; (3) outros procedimentos se necessário.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Auditoria", tema: "Componentes do risco de auditoria", dificuldade: "Médio",
    enunciado: "Sobre os componentes do risco de auditoria, assinale a afirmativa correta:",
    alternativas: { A: "O risco inerente é aquele que remanesce após a consideração dos controles internos estabelecidos pela administração.", B: "O risco de controle é a suscetibilidade de uma afirmação a uma distorção material, antes da consideração de quaisquer controles.", C: "O risco de detecção é aquele resultante de o auditor não detectar uma distorção que exista em uma afirmação e que poderia ser material.", D: "O risco de auditoria é a soma aritmética do risco inerente, do risco de controle e do risco de detecção.", E: "O auditor pode reduzir o risco inerente ao mínimo por meio de procedimentos de controle adequados." },
    gabarito: "C", fundamentacao: "NBC TA 200 — Objetivos Gerais do Auditor Independente",
    explicacao_gabarito: "NBC TA 200: Risco de Detecção = risco de que os procedimentos do auditor não detectem uma distorção existente e material. RA = RI × RC × RD (multiplicativo). O auditor controla apenas o RD.",
    explicacao_distratores: { A: "Incorreta — define risco de controle residual, não RI. RI é ANTES dos controles.", B: "Incorreta — descreve o Risco INERENTE.", C: "Correta.", D: "Incorreta — RA = RI × RC × RD (multiplicativo, não aditivo).", E: "Incorreta — auditor não controla RI; controla apenas RD." },
    dica_prova: "RI × RC × RD = RA. Auditor controla APENAS o RD. RI = antes dos controles. RC = falha dos controles internos. RD = falha do auditor.",
    origem: "fgv_real", prova_referencia: "FGV · CGU 2022"
  },
  {
    disciplina: "Auditoria", tema: "DVA no relatório do auditor — outros assuntos", dificuldade: "Médio",
    enunciado: "No relatório do auditor independente, a Demonstração do Valor Adicionado (DVA) deve ser mencionada no parágrafo de Outros Assuntos. O motivo é:",
    alternativas: { A: "por ter obrigatoriedade recente no Brasil.", B: "por não ser obrigatória de acordo com as normas internacionais de contabilidade.", C: "Demonstração do Resultado Abrangente, por ter obrigatoriedade recente no Brasil.", D: "Demonstração do Resultado Abrangente, por poder ser apresentada em conjunto com outras demonstrações.", E: "Demonstração dos Fluxos de Caixa, por ter substituído a DOAR." },
    gabarito: "B", fundamentacao: "NBC TA 700; Lei 11.638/2007",
    explicacao_gabarito: "DVA é obrigatória no Brasil para companhias abertas (Lei 11.638/07), mas não exigida pelas IFRS. O auditor menciona no parágrafo de Outros Assuntos para informar usuários internacionais que é exigência local.",
    explicacao_distratores: { A: "Incorreta — DVA está na lei desde 2007.", B: "Correta.", C: "Incorreta — é sobre a DVA, não sobre a DRA.", D: "Incorreta.", E: "Incorreta — é sobre a DVA; e a DFC substitui a DOAR, mas não é esse o motivo." },
    dica_prova: "DVA: obrigatória no Brasil (Lei 11.638/07) mas NÃO nas IFRS. Parágrafo de Outros Assuntos informa usuários internacionais que é exigência local.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Auditoria", tema: "Auditoria do ativo imobilizado — vida útil e valor residual", dificuldade: "Médio",
    enunciado: "Ao realizar a auditoria do ativo imobilizado, o fator que deve receber maior atenção do auditor independente por influenciar o cálculo do resultado é:",
    alternativas: { A: "Qual é a procedência do ativo.", B: "Como é utilizado o caixa gerado com o seu uso.", C: "Se os ativos foram comprados novos ou usados.", D: "Como são estimados a vida útil e o valor residual.", E: "Qual foi o modo de pagamento utilizado na compra do ativo." },
    gabarito: "D", fundamentacao: "CPC 27 — Ativo Imobilizado; NBC TA",
    explicacao_gabarito: "Vida útil e valor residual são os parâmetros fundamentais para o cálculo da depreciação (CPC 27). Depreciação = (Custo − Valor Residual) / Vida Útil. Estimativas incorretas afetam diretamente o resultado — principal risco de distorção material.",
    explicacao_distratores: { A: "Incorreta — procedência não afeta diretamente o resultado.", B: "Incorreta.", C: "Incorreta — novo ou usado afeta o custo inicial, mas não é o fator principal.", D: "Correta.", E: "Incorreta." },
    dica_prova: "No imobilizado, o principal risco de distorção = DEPRECIAÇÃO: vida útil e valor residual são estimativas subjetivas. Auditor deve questionar a razoabilidade e verificar se são revisadas periodicamente.",
    origem: "fgv_real", prova_referencia: "FGV · SEFAZ-AM 2022"
  },
  {
    disciplina: "Auditoria", tema: "Planejamento de auditoria — NBC TA 300", dificuldade: "Médio",
    enunciado: "Sobre planejamento de auditoria (NBC TA 300), assinale a afirmativa correta:",
    alternativas: { A: "O planejamento deve ser realizado exclusivamente antes do início dos trabalhos de campo, não admitindo revisões posteriores.", B: "A materialidade definida no planejamento é imutável, devendo ser mantida até a emissão do relatório final.", C: "O auditor deve estabelecer uma estratégia geral de auditoria que defina o escopo, a época e a direção da auditoria, servindo de base para o plano de auditoria.", D: "O planejamento é dispensável em auditorias recorrentes de um mesmo cliente.", E: "A compreensão da entidade é etapa realizada exclusivamente em novas auditorias." },
    gabarito: "C", fundamentacao: "NBC TA 300, item 7",
    explicacao_gabarito: "NBC TA 300, item 7: o auditor deve estabelecer uma estratégia geral de auditoria que define o escopo, a época e a direção, servindo como base para o desenvolvimento do plano de auditoria detalhado.",
    explicacao_distratores: { A: "Incorreta — planejamento é dinâmico; pode ser revisado.", B: "Incorreta — materialidade pode ser ajustada.", C: "Correta.", D: "Incorreta — planejamento é sempre necessário.", E: "Incorreta — compreensão da entidade é renovada a cada ciclo." },
    dica_prova: "NBC TA 300: estratégia geral (macro: escopo, época, direção) → base para o plano detalhado (micro: natureza, época, extensão dos procedimentos). Processo contínuo e iterativo.",
    origem: "fgv_real", prova_referencia: "FGV · CGU 2022"
  }
];

async function seed() {
  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };

  console.log(`\n🌱 Iniciando seed de ${QUESTOES.length} questões FGV reais...\n`);

  // Insert in batches of 10
  const BATCH = 10;
  let ok = 0, err = 0;

  for (let i = 0; i < QUESTOES.length; i += BATCH) {
    const batch = QUESTOES.slice(i, i + BATCH);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cache_questoes`, {
      method: "POST",
      headers,
      body: JSON.stringify(batch)
    });

    if (res.ok) {
      ok += batch.length;
      const disc = [...new Set(batch.map(q => q.disciplina))].join(", ");
      console.log(`  ✅ Batch ${Math.floor(i/BATCH)+1}: ${batch.length} questões → ${disc}`);
    } else {
      err += batch.length;
      const text = await res.text();
      console.log(`  ❌ Batch ${Math.floor(i/BATCH)+1}: ${res.status} — ${text.slice(0, 200)}`);
    }
  }

  console.log(`\n📊 Resultado: ${ok} inseridas, ${err} erros`);

  // Count by discipline
  for (const disc of ["Direito Constitucional","Direito Tributário","Direito Administrativo","Contabilidade Geral","Auditoria"]) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cache_questoes?disciplina=eq.${encodeURIComponent(disc)}&select=count`,
      { headers: { ...headers, "Prefer": "count=exact" } }
    );
    const count = res.headers.get("content-range")?.split("/")[1] || "?";
    console.log(`  ${disc}: ${count} questões no banco`);
  }
}

seed().catch(console.error);
