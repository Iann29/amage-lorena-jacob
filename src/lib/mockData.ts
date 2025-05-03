// Dados mockados para uso durante o desenvolvimento
// Estrutura espelhando o que será implementado no Supabase

// Categorias do blog
export const blogCategorias = [
  { id: 1, nome: 'Autismo', slug: 'autismo', quantidade: 10 },
  { id: 2, nome: 'TDAH', slug: 'tdah', quantidade: 8 },
  { id: 3, nome: 'Desenvolvimento Infantil', slug: 'desenvolvimento-infantil', quantidade: 15 },
  { id: 4, nome: 'Educação Especial', slug: 'educacao-especial', quantidade: 6 },
  { id: 5, nome: 'Terapias', slug: 'terapias', quantidade: 7 },
];

// Usuários para autoria de posts e comentários
export const usuarios = [
  { 
    id: 1, 
    nome: 'Lorena Jacob', 
    avatar_url: 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//profile-photo.webp',
    role: 'admin' 
  },
  { id: 2, nome: 'Ana Luiza Perez', avatar_url: null, role: 'user' },
  { id: 3, nome: 'Marcio Mendes', avatar_url: null, role: 'user' },
];

// Posts do blog
export const blogPosts = [
  {
    id: 1,
    titulo: 'A importância de dizer não',
    slug: 'a-importancia-de-dizer-nao',
    resumo: 'Educação positiva não é permitir tudo',
    cores: {
      textoPadrao: '#000000',   // Cor do texto normal
      tituloPrincipal: '#000000', // Cor do título do post
      titulosH2: [             // Cores para cada título H2, na ordem em que aparecem
        '#000000',             // Primeiro título (O papel do "não")
        '#000000',             // Segundo título (Educação positiva)
        '#8651B4'              // Terceiro título (Conclusão) - Roxo
      ]
    },
    conteudo: `<p>A busca por criar um ambiente amoroso para nossos filhos muitas vezes é confundida com permissividade. Chamamos isso de educação positiva. No entanto, muitas vezes ela é mal interpretada como permissividade – como se educar com respeito significasse permitir tudo. Mas a verdade é que educar de forma positiva não exclui o "não". Pelo contrário, saber colocá-lo é fundamental para o desenvolvimento saudável da criança.</p>

    <h2>O papel do "não" no desenvolvimento infantil</h2>
    <p>Ouvir um "não" pode gerar frustração momentânea, mas é exatamente essa experiência que ensina a criança a lidar com os limites da vida. É através do "não" que ela aprende sobre respeito, empatia, paciência e responsabilidade.</p>
    <p>Crianças que crescem sem limites claros podem se tornar ansiosas, inseguras e com dificuldades para lidar com a palavra "não" no futuro – seja em uma amizade, no trabalho ou em um relacionamento amoroso. São adultos que ficam mais expostos a frustrações e têm menos recursos emocionais para enfrentá-las.</p>

    <h2>Educação positiva não é ausência de autoridade</h2>
    <p>Educar de forma positiva é, sim, exercer autoridade – mas uma autoridade baseada no respeito, não no medo. Explicar em vez de simplesmente impor. Um "não" pode e deve ser dito com afeto, explicação e diálogo. Um "não" pode e deve ser dito com calma e respeito. Você não precisa gritar ou ameaçar seu filho para estabelecer um limite.</p>
    <p>Por exemplo, ao invés de simplesmente dizer "Não pode mexer aí!", você pode dizer "Eu sei que você está curioso, mas isso pode machucar. Vamos brincar com algo mais seguro?". "Eu sei que você está cansado, mas temos que escovar os dentes." Dessa forma, você valida o sentimento da criança se sente ouvida, mesmo diante da frustração.</p>

    <h2>Conclusão</h2>
    <p>Dizer "não" é uma das formas mais importantes de amar e proteger uma criança. A verdadeira educação positiva não confunde o equilíbrio com permissividade, nem amar com dar acesso ao mundo sem limites. Colocar limites com respeito é preparar nossos filhos para a vida, para o convívio com o outro e para o mundo real – onde nem tudo será como eles querem e tudo bem.</p>`,
    imagem_destaque_url: 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/blog-post/a-importancia-de-dizer-nao.png',
    created_at: '2025-04-20T14:30:00Z',
    updated_at: '2025-04-20T14:30:00Z',
    like_count: 24,
    visualizacoes: 156,
    author_id: 1,
    author: usuarios[0],
    categorias: [
      blogCategorias[2], // Desenvolvimento Infantil
      blogCategorias[3]  // Educação Especial
    ]
  },
  {
    id: 2,
    titulo: 'Sinais de alerta para o autismo na primeira infância',
    slug: 'sinais-de-alerta-para-o-autismo-na-primeira-infancia',
    resumo: 'Reconhecer os primeiros sinais de autismo pode fazer toda a diferença no desenvolvimento da criança. Saiba quais comportamentos observar e quando procurar ajuda profissional.',
    conteudo: `<p>Muitos pais se perguntam se certos comportamentos de seus filhos pequenos são apenas peculiaridades do desenvolvimento ou sinais de algo que merece atenção especializada. Quando se trata do Transtorno do Espectro Autista (TEA), a identificação precoce faz uma enorme diferença no prognóstico de desenvolvimento.</p>

    <h2>Principais sinais de alerta</h2>
    <p>Entre os 12 e 24 meses, alguns comportamentos podem indicar a necessidade de uma avaliação profissional:</p>
    <ul>
      <li>Pouco ou nenhum contato visual durante interações</li>
      <li>Não responder ao próprio nome aos 12 meses</li>
      <li>Não apontar para objetos de interesse aos 14 meses</li>
      <li>Não engajar em brincadeiras de faz-de-conta aos 18 meses</li>
      <li>Preferência por brincar sozinho</li>
      <li>Reações incomuns a estímulos sensoriais (sons, texturas, luzes)</li>
      <li>Ecolalia (repetição de palavras ou frases)</li>
      <li>Interesses restritos e comportamentos repetitivos</li>
      <li>Atraso na fala ou regressão das habilidades já adquiridas</li>
    </ul>

    <h2>Quando procurar ajuda</h2>
    <p>É importante enfatizar que a presença de um ou alguns desses sinais não significa necessariamente que a criança tenha autismo. O desenvolvimento infantil varia bastante entre indivíduos. No entanto, se você observar vários desses comportamentos ou tiver preocupações sobre o desenvolvimento de seu filho, é recomendável consultar um pediatra ou neuropediatra experiente.</p>

    <h2>Intervenção precoce</h2>
    <p>A intervenção precoce pode começar mesmo antes de um diagnóstico formal. Terapias como fonoaudiologia, terapia ocupacional e intervenções comportamentais aplicadas mais cedo têm demonstrado resultados significativamente melhores no desenvolvimento de crianças com TEA.</p>
    
    <h2>Conclusão</h2>
    <p>A identificação precoce dos sinais de autismo é crucial para o início da intervenção terapêutica, que pode significativamente melhorar o desenvolvimento e a qualidade de vida da criança. Se você tem preocupações, confie em sua intuição e busque uma avaliação profissional. Lembre-se: você é quem melhor conhece seu filho.</p>`,
    imagem_destaque_url: '/public/assets/blog-post-2.jpg',
    created_at: '2025-04-15T10:45:00Z',
    updated_at: '2025-04-15T10:45:00Z',
    like_count: 18,
    visualizacoes: 142,
    author_id: 1,
    author: usuarios[0],
    categorias: [
      blogCategorias[0], // Autismo
    ]
  },
  {
    id: 3,
    titulo: 'Estratégias para lidar com hiperatividade em casa',
    slug: 'estrategias-para-lidar-com-hiperatividade-em-casa',
    resumo: 'Descubra métodos práticos para ajudar crianças com TDAH a se organizarem, focarem e canalizarem sua energia de forma positiva no ambiente doméstico.',
    conteudo: `<p>Conviver com uma criança com TDAH (Transtorno do Déficit de Atenção com Hiperatividade) pode ser desafiador para toda a família. A boa notícia é que existem diversas estratégias que podem tornar o dia a dia mais tranquilo e funcional tanto para a criança quanto para os pais.</p>

    <h2>Criando um ambiente organizado</h2>
    <p>Crianças com TDAH se beneficiam enormemente de ambientes organizados e rotinas previsíveis:</p>
    <ul>
      <li>Crie uma rotina visual com imagens das atividades diárias</li>
      <li>Reduza distrações no ambiente de estudo (sem TV, celulares, tablets)</li>
      <li>Use códigos de cores para organizar materiais escolares e objetos pessoais</li>
      <li>Estabeleça um local fixo para itens importantes como mochilas e agendas</li>
      <li>Divida tarefas grandes em etapas menores e mais gerenciáveis</li>
    </ul>

    <h2>Canalizando a energia</h2>
    <p>A energia abundante das crianças com TDAH pode ser direcionada de forma positiva:</p>
    <ul>
      <li>Programe pausas para movimento entre atividades que exigem concentração</li>
      <li>Incentive a prática regular de esportes, especialmente atividades que exijam concentração e coordenação</li>
      <li>Permita o uso de objetos para manipulação (fidget toys) durante atividades estáticas</li>
      <li>Estabeleça momentos diários para atividade física intensiva</li>
    </ul>

    <h2>Comunicação efetiva</h2>
    <p>Adaptar a forma de comunicação pode fazer uma grande diferença:</p>
    <ul>
      <li>Use instruções claras, diretas e em etapas</li>
      <li>Mantenha contato visual ao dar orientações importantes</li>
      <li>Peça que a criança repita o que entendeu para confirmar a compreensão</li>
      <li>Evite dar múltiplos comandos simultaneamente</li>
      <li>Use reforço positivo e elogios específicos para comportamentos desejados</li>
    </ul>

    <h2>Conclusão</h2>
    <p>Lembre-se que o TDAH é uma condição neurobiológica, não resultado de falha na educação ou disciplina. Com estratégias adequadas, compreensão e muito amor, crianças com TDAH podem desenvolver todo seu potencial. A consistência e a paciência são fundamentais nesse processo.</p>`,
    imagem_destaque_url: '/public/assets/blog-post-3.jpg',
    created_at: '2025-04-10T09:15:00Z',
    updated_at: '2025-04-10T09:15:00Z',
    like_count: 15,
    visualizacoes: 98,
    author_id: 1,
    author: usuarios[0],
    categorias: [
      blogCategorias[1], // TDAH
    ]
  },
  {
    id: 4,
    titulo: 'Benefícios das atividades sensoriais para o desenvolvimento infantil',
    slug: 'beneficios-das-atividades-sensoriais-para-o-desenvolvimento-infantil',
    resumo: 'Descubra como brincadeiras que estimulam os sentidos contribuem para o desenvolvimento cognitivo, motor e social das crianças desde os primeiros anos de vida.',
    conteudo: `<p>As experiências sensoriais são fundamentais para o desenvolvimento cerebral infantil. Através delas, as crianças exploram e entendem o mundo ao seu redor, construindo conexões neurais essenciais para o aprendizado futuro.</p>

    <h2>O que são atividades sensoriais?</h2>
    <p>Atividades sensoriais são aquelas que estimulam um ou mais sentidos: tato, olfato, paladar, visão e audição. Também podem incluir o sistema vestibular (equilíbrio) e proprioceptivo (percepção corporal). Exemplos incluem caixas sensoriais, massinha caseira, pintura com os dedos, brincadeiras com água e areia, entre outros.</p>

    <h2>Benefícios para o desenvolvimento</h2>
    <h3>Desenvolvimento cognitivo</h3>
    <p>Quando uma criança manipula diferentes texturas ou experimenta novos sabores, seu cérebro está criando conexões importantes. Estas experiências ajudam a desenvolver:</p>
    <ul>
      <li>Capacidade de resolução de problemas</li>
      <li>Habilidades de classificação e categorização</li>
      <li>Vocabulário e linguagem descritiva</li>
      <li>Conceitos matemáticos como volume, tamanho e quantidade</li>
    </ul>

    <h3>Desenvolvimento motor</h3>
    <p>Atividades sensoriais também fortalecem:</p>
    <ul>
      <li>Coordenação motora fina (crucial para escrita)</li>
      <li>Coordenação olho-mão</li>
      <li>Controle e força muscular</li>
      <li>Planejamento motor e equilíbrio</li>
    </ul>

    <h3>Desenvolvimento emocional e social</h3>
    <p>Através de brincadeiras sensoriais, as crianças também:</p>
    <ul>
      <li>Aprendem a regular suas emoções</li>
      <li>Desenvolvem tolerância a diferentes estímulos</li>
      <li>Praticam habilidades sociais como compartilhar e revezar</li>
      <li>Ganham autoconfiança e independência</li>
    </ul>

    <h2>Conclusão</h2>
    <p>Incorporar atividades sensoriais na rotina diária de uma criança não precisa ser complicado ou caro. Materiais simples do dia a dia podem proporcionar ricas experiências de aprendizado. O importante é proporcionar um ambiente seguro para exploração livre e supervisionada, respeitando os interesses e limites de cada criança.</p>`,
    imagem_destaque_url: '/public/assets/blog-post-4.jpg',
    created_at: '2025-04-05T16:20:00Z',
    updated_at: '2025-04-05T16:20:00Z',
    like_count: 29,
    visualizacoes: 187,
    author_id: 1,
    author: usuarios[0],
    categorias: [
      blogCategorias[2], // Desenvolvimento Infantil
      blogCategorias[4]  // Terapias
    ]
  },
  {
    id: 5,
    titulo: 'Como preparar a escola para inclusão de crianças neurodivergentes',
    slug: 'como-preparar-a-escola-para-inclusao-de-criancas-neurodivergentes',
    resumo: 'Guia prático para escolas e professores implementarem estratégias eficazes de inclusão para alunos com autismo, TDAH e outros transtornos do neurodesenvolvimento.',
    conteudo: `<p>A inclusão escolar vai muito além de simplesmente aceitar a matrícula de crianças neurodivergentes. Trata-se de criar um ambiente onde todas as crianças possam aprender e se desenvolver de acordo com suas potencialidades, reconhecendo a diversidade como valor.</p>

    <h2>Formação continuada da equipe</h2>
    <p>O primeiro passo para uma inclusão efetiva é o investimento na formação de toda a equipe escolar:</p>
    <ul>
      <li>Proporcionar capacitação específica sobre transtornos do neurodesenvolvimento</li>
      <li>Criar espaços para compartilhamento de experiências entre educadores</li>
      <li>Estabelecer parcerias com profissionais especializados (psicólogos, terapeutas ocupacionais, fonoaudiólogos)</li>
      <li>Promover a conscientização sobre neurodiversidade entre todos os alunos e famílias</li>
    </ul>

    <h2>Adaptações no ambiente escolar</h2>
    <p>Pequenas modificações no ambiente podem fazer grande diferença:</p>
    <ul>
      <li>Criar espaços de descompressão para momentos de sobrecarga sensorial</li>
      <li>Reduzir estímulos visuais e sonoros excessivos em sala de aula</li>
      <li>Estabelecer rotinas previsíveis e utilizar suportes visuais</li>
      <li>Flexibilizar o uso de espaços alternativos para atividades específicas</li>
      <li>Disponibilizar ferramentas de regulação sensorial (fones de ouvido, objetos para manipulação)</li>
    </ul>

    <h2>Estratégias pedagógicas inclusivas</h2>
    <p>A adaptação pedagógica é fundamental para garantir o acesso ao aprendizado:</p>
    <ul>
      <li>Implementar o Desenho Universal para Aprendizagem (DUA)</li>
      <li>Desenvolver planos educacionais individualizados quando necessário</li>
      <li>Oferecer instruções claras, diretas e em múltiplos formatos</li>
      <li>Permitir formas alternativas de demonstração de conhecimento</li>
      <li>Adaptar avaliações considerando as especificidades de cada aluno</li>
      <li>Utilizar tecnologias assistivas e recursos de acessibilidade</li>
    </ul>

    <h2>Trabalho colaborativo</h2>
    <p>A inclusão efetiva depende de uma rede de apoio:</p>
    <ul>
      <li>Manter comunicação constante entre escola, família e profissionais externos</li>
      <li>Realizar reuniões periódicas para ajustes no planejamento</li>
      <li>Documentar estratégias bem-sucedidas para continuidade do trabalho</li>
      <li>Envolver toda a comunidade escolar no processo inclusivo</li>
    </ul>

    <h2>Conclusão</h2>
    <p>A verdadeira inclusão escolar beneficia não apenas os alunos neurodivergentes, mas toda a comunidade educativa, criando um ambiente onde a diversidade é valorizada e cada indivíduo pode desenvolver seu potencial único. Escolas verdadeiramente inclusivas formam cidadãos mais empáticos, respeitosos e preparados para um mundo diverso.</p>`,
    imagem_destaque_url: '/public/assets/blog-post-5.jpg',
    created_at: '2025-03-28T11:40:00Z',
    updated_at: '2025-03-28T11:40:00Z',
    like_count: 32,
    visualizacoes: 205,
    author_id: 1,
    author: usuarios[0],
    categorias: [
      blogCategorias[0], // Autismo
      blogCategorias[1], // TDAH
      blogCategorias[3]  // Educação Especial
    ]
  },
  {
    id: 6,
    titulo: 'A importância do brincar para o desenvolvimento neuropsicomotor',
    slug: 'a-importancia-do-brincar-para-o-desenvolvimento-neuropsicomotor',
    resumo: 'Saiba como diferentes tipos de brincadeiras impactam o desenvolvimento cerebral, a coordenação motora e as habilidades sociais das crianças em cada fase.',
    conteudo: `<p>Brincar não é apenas diversão – é o trabalho mais importante da infância. Através da brincadeira, as crianças desenvolvem habilidades fundamentais para toda a vida, desde a coordenação motora até funções executivas complexas no cérebro.</p>

    <h2>Desenvolvimento cerebral através da brincadeira</h2>
    <p>Quando uma criança brinca, seu cérebro está trabalhando intensamente:</p>
    <ul>
      <li>Conexões neurais são formadas e fortalecidas</li>
      <li>Áreas responsáveis por funções executivas (planejamento, controle de impulsos, memória de trabalho) são estimuladas</li>
      <li>Centros de processamento sensorial se desenvolvem</li>
      <li>A plasticidade cerebral é potencializada</li>
    </ul>
    <p>Estudos de neuroimagem mostram que crianças que têm amplas oportunidades de brincar livremente apresentam desenvolvimento mais robusto em áreas cerebrais associadas à linguagem, tomada de decisões e regulação emocional.</p>

    <h2>Desenvolvimento motor</h2>
    <p>Diferentes tipos de brincadeiras promovem o desenvolvimento de habilidades motoras específicas:</p>
    <h3>Motricidade grossa</h3>
    <p>Brincadeiras como correr, pular, escalar e dançar fortalecem grandes grupos musculares e desenvolvem:</p>
    <ul>
      <li>Equilíbrio e coordenação</li>
      <li>Consciência espacial</li>
      <li>Força e resistência física</li>
      <li>Integração bilateral (uso coordenado dos dois lados do corpo)</li>
    </ul>

    <h3>Motricidade fina</h3>
    <p>Atividades como desenhar, montar quebra-cabeças, brincar com blocos de encaixe e modelar massinha desenvolvem:</p>
    <ul>
      <li>Coordenação olho-mão</li>
      <li>Destreza digital</li>
      <li>Controle muscular preciso</li>
      <li>Bases para a escrita e outras habilidades acadêmicas</li>
    </ul>

    <h2>Desenvolvimento cognitivo e social</h2>
    <p>Além dos aspectos físicos, brincar também é fundamental para:</p>
    <ul>
      <li>Desenvolvimento da linguagem e comunicação</li>
      <li>Criatividade e resolução de problemas</li>
      <li>Compreensão de regras sociais e cooperação</li>
      <li>Regulação emocional e empatia</li>
      <li>Construção de autoestima e resiliência</li>
    </ul>

    <h2>Conclusão</h2>
    <p>Em um mundo cada vez mais digital e acadêmico, defender o tempo livre para brincar é essencial. Os benefícios neuropsicomotores do brincar não podem ser substituídos por aplicativos educativos ou atividades estruturadas. Crianças precisam de tempo não estruturado, espaço adequado e materiais diversificados para explorar, criar e se movimentar livremente. Como adultos, nosso papel é garantir estas oportunidades e, ocasionalmente, nos juntar à brincadeira, seguindo a liderança da criança.</p>`,
    imagem_destaque_url: '/public/assets/blog-post-6.jpg',
    created_at: '2025-03-20T14:10:00Z',
    updated_at: '2025-03-20T14:10:00Z',
    like_count: 41,
    visualizacoes: 234,
    author_id: 1,
    author: usuarios[0],
    categorias: [
      blogCategorias[2], // Desenvolvimento Infantil
      blogCategorias[4]  // Terapias
    ]
  }
];

// Comentários
export const blogComments = [
  {
    id: 1,
    post_id: 1,
    user_id: 2,
    user: usuarios[1],
    conteudo: 'Uauuuuu! Que conteúdo incrível. Muito enriquecedor e necessário. Obrigada Lorena!',
    created_at: '2025-04-22T10:15:00Z',
    like_count: 3
  },
  {
    id: 2,
    post_id: 1,
    user_id: 3,
    user: usuarios[2],
    conteudo: 'Temos criado uma geração de filhos mimados pela falta de limites e uma geração de pais mimados. Essa é a verdade. Os pais hoje em dia se chateiam quando alguém diz NÃO FAÇA ISSO COM SEUS FILHOS. Excelente Lorena!',
    created_at: '2025-04-24T15:30:00Z',
    like_count: 5
  },
  {
    id: 3,
    post_id: 3,
    user_id: 2,
    user: usuarios[1],
    conteudo: 'Essas dicas são exatamente o que eu precisava para ajudar meu filho. Estamos implementando a rotina visual e já vemos resultados positivos. Obrigada!',
    created_at: '2025-04-12T09:45:00Z',
    like_count: 2
  },
  {
    id: 4,
    post_id: 4,
    user_id: 3,
    user: usuarios[2],
    conteudo: 'Comecei a fazer mais atividades sensoriais com minha filha depois de ler este artigo. Ela tem adorado a caixa sensorial com arroz e pequenos objetos. A concentração dela melhorou muito!',
    created_at: '2025-04-07T14:20:00Z',
    like_count: 1
  },
  {
    id: 5,
    post_id: 2,
    user_id: 2,
    user: usuarios[1],
    conteudo: 'Este artigo me ajudou a entender alguns comportamentos do meu sobrinho. Vou compartilhar com minha irmã para que ela possa conversar com o pediatra. Informação é tudo!',
    created_at: '2025-04-16T11:05:00Z',
    like_count: 4
  }
];

// Função para filtrar comentários por post
export function getCommentsByPostId(postId: number) {
  return blogComments.filter(comment => comment.post_id === postId);
}

// Função para encontrar um post pelo slug
export function getPostBySlug(slug: string) {
  return blogPosts.find(post => post.slug === slug);
}

// Função para filtrar posts por categoria
export function getPostsByCategory(categorySlug: string) {
  return blogPosts.filter(post => 
    post.categorias.some(cat => cat.slug === categorySlug)
  );
}

// Posts populares (baseados em visualizações)
export function getPopularPosts(limit: number = 5) {
  return [...blogPosts]
    .sort((a, b) => b.visualizacoes - a.visualizacoes)
    .slice(0, limit);
}
