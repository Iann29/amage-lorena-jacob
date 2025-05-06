// mockData.ts

// Dados mockados para uso durante o desenvolvimento
// Estrutura espelhando o que será implementado no Supabase

// Categorias do blog (somente as usadas pelo post selecionado)
export const blogCategorias = [
  { id: 3, nome: 'Desenvolvimento Infantil', slug: 'desenvolvimento-infantil', quantidade: 15 },
  { id: 4, nome: 'Educação Especial', slug: 'educacao-especial', quantidade: 6 },
];

// Usuários para autoria de posts e comentários (somente os usados pelo post selecionado e seus comentários)
export const usuarios = [
  { 
    id: 1, 
    nome: 'Lorena Jacob', 
    avatar_url: 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db//profile-photo.webp',
    role: 'admin' 
  },
  { id: 2, nome: 'Ana Luiza Perez', avatar_url: 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/profile-pic/test.jpg', role: 'user' },
  { id: 3, nome: 'Marcio Mendes', avatar_url: null, role: 'user' },
];

// Post do blog "A importância de dizer não"
export const blogPosts = [
  {
    id: 1,
    titulo: 'A importância de dizer não',
    slug: 'a-importancia-de-dizer-nao',
    resumo: 'Educação positiva não é permitir tudo',
    conteudo: `<p>A busca por criar um ambiente amoroso para nossos filhos muitas vezes é confundida com permissividade. Chamamos isso de <strong style="color: #52A4DB;">educação positiva</strong>. No entanto, muitas vezes ela é mal interpretada como permissividade – como se educar com respeito significasse permitir tudo. Mas a verdade é que educar de forma positiva não exclui o <em style="color: #8651B4;">"não"</em>. Pelo contrário, saber colocá-lo é fundamental para o desenvolvimento saudável da criança.</p>

    <h2><span style="color: #0B5394;">O papel do "não" no desenvolvimento infantil</span></h2>
    <p>Ouvir um "não" pode gerar frustração momentânea, mas é exatamente essa experiência que ensina a criança a lidar com os limites da vida. É através do "não" que ela aprende sobre respeito, empatia, paciência e responsabilidade.</p>
    <p>Crianças que crescem sem limites claros podem se tornar ansiosas, inseguras e com dificuldades para lidar com a palavra "não" no futuro – seja em uma amizade, no trabalho ou em um relacionamento amoroso. São adultos que ficam mais expostos a frustrações e têm menos recursos emocionais para enfrentá-las.</p>

    <h2>Educação positiva não é ausência de autoridade</h2>
    <p>Educar de forma positiva é, sim, exercer autoridade – mas uma autoridade baseada no respeito, não no medo. Explicar em vez de simplesmente impor. Um "não" pode e deve ser dito com afeto, explicação e diálogo. Um "não" pode e deve ser dito com calma e respeito. Você não precisa gritar ou ameaçar seu filho para estabelecer um limite.</p>
    <p>Por exemplo, ao invés de simplesmente dizer "Não pode mexer aí!", você pode dizer "Eu sei que você está curioso, mas isso pode machucar. Vamos brincar com algo mais seguro?". "Eu sei que você está cansado, mas temos que escovar os dentes." Dessa forma, você valida o sentimento da criança se sente ouvida, mesmo diante da frustração.</p>

    <h2><span style="color: #8651B4;">Conclusão</span></h2>
    <p>Dizer "não" é uma das formas mais importantes de amar e proteger uma criança. A verdadeira educação positiva não confunde o equilíbrio com permissividade, nem amar com dar acesso ao mundo sem limites. Colocar limites com respeito é preparar nossos filhos para a vida, para o convívio com o outro e para o mundo real – onde nem tudo será como eles querem e tudo bem.</p>
    <p><em>Este é um texto de exemplo com <strong style="color: red;">cores</strong> aplicadas.</em></p>`,
    imagem_destaque_url: 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/blog-post/a-importancia-de-dizer-nao.png',
    created_at: '2025-04-20T14:30:00Z',
    updated_at: '2025-04-20T14:30:00Z',
    like_count: 24,
    visualizacoes: 156,
    author_id: 1,
    author: usuarios[0], // Lorena Jacob
    categorias: [
      blogCategorias.find(cat => cat.id === 3), // Desenvolvimento Infantil
      blogCategorias.find(cat => cat.id === 4)  // Educação Especial
    ].filter(Boolean) // Filtra nulos caso não encontre a categoria
  }
];

// Comentários relacionados ao post "A importância de dizer não"
export const blogComments = [
  {
    id: 1,
    post_id: 1, // ID do post "A importância de dizer não"
    user_id: 2,
    user: usuarios[1], // Ana Luiza Perez
    conteudo: 'Uauuuuu! Que conteúdo incrível. Muito enriquecedor e necessário. Obrigada Lorena!',
    created_at: '2025-04-22T10:15:00Z',
    like_count: 3,
    respostas: [
      {
        id: 101,
        comment_id: 1,
        user_id: 1,
        user: usuarios[0], // Lorena Jacob
        conteudo: 'Fico muito feliz que tenha gostado, Ana! Compartilhe com outras mães que possam se beneficiar desse conteúdo. Abraços!',
        created_at: '2025-04-22T11:30:00Z',
        like_count: 2
      }
    ]
  },
  {
    id: 2,
    post_id: 1, // ID do post "A importância de dizer não"
    user_id: 3,
    user: usuarios[2], // Marcio Mendes
    conteudo: 'Temos criado uma geração de filhos mimados pela falta de limites e uma geração de pais mimados. Essa é a verdade. Os pais hoje em dia se chateiam quando alguém diz NÃO FAÇA ISSO COM SEUS FILHOS. Excelente Lorena!',
    created_at: '2025-04-24T15:30:00Z',
    like_count: 5,
    respostas: [
      {
        id: 102,
        comment_id: 2,
        user_id: 1,
        user: usuarios[0], // Lorena Jacob
        conteudo: 'Obrigada pelo comentário, Márcio! Realmente precisamos resgatar a importância dos limites na educação das crianças. Às vezes dizer "não" é um ato de amor e cuidado.',
        created_at: '2025-04-24T16:45:00Z',
        like_count: 3
      },
      {
        id: 103,
        comment_id: 2,
        user_id: 2,
        user: usuarios[1], // Ana Luiza
        conteudo: 'Concordo totalmente! Criar filhos com limites é prepará-los para o mundo real.',
        created_at: '2025-04-24T17:30:00Z',
        like_count: 1
      }
    ]
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

// Função para filtrar posts por categoria (retornará apenas o post "A importância de dizer não" se a categoria bater)
export function getPostsByCategory(categorySlug: string) {
  return blogPosts.filter(post => 
    post.categorias.some(cat => cat && cat.slug === categorySlug)
  );
}

// Posts populares (baseados em visualizações)
export function getPopularPosts(limit: number = 5) {
  return [...blogPosts] // Retornará apenas o post único se for o único na lista
    .sort((a, b) => b.visualizacoes - a.visualizacoes)
    .slice(0, limit);
}