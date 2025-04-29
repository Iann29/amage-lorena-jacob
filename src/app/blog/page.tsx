import Link from 'next/link';

export const metadata = {
  title: 'Blog | Lorena Jacob',
  description: 'Artigos, dicas e informações sobre desenvolvimento infantil, autismo, TDAH e educação especial.'
};

export default function BlogPage() {
  // Dados mockados para os posts do blog
  // Estes dados eventualmente virão do Supabase
  const posts = [
    {
      id: 1,
      slug: 'sinais-de-autismo-na-primeira-infancia',
      titulo: 'Sinais de Autismo na Primeira Infância: O Que Observar?',
      resumo: 'Descubra os principais sinais de alerta que podem indicar transtorno do espectro autista em bebês e crianças pequenas e quando procurar ajuda profissional.',
      categoria: 'Autismo',
      imagem: '/placeholder-post-1.jpg',
      data: '25/04/2025'
    },
    {
      id: 2,
      slug: 'estrategias-para-criancas-com-tdah-em-casa',
      titulo: 'Estratégias para Ajudar Crianças com TDAH em Casa',
      resumo: 'Conheça técnicas e abordagens práticas para auxiliar seu filho com TDAH a organizar suas tarefas, melhorar a concentração e lidar com a impulsividade no ambiente doméstico.',
      categoria: 'TDAH',
      imagem: '/placeholder-post-2.jpg',
      data: '18/04/2025'
    },
    {
      id: 3,
      slug: 'a-importancia-do-brincar-no-desenvolvimento',
      titulo: 'A Importância do Brincar no Desenvolvimento Infantil',
      resumo: 'Entenda por que as brincadeiras são fundamentais para o desenvolvimento cognitivo, emocional e social das crianças e como os pais podem estimular o brincar de forma saudável.',
      categoria: 'Desenvolvimento Infantil',
      imagem: '/placeholder-post-3.jpg',
      data: '10/04/2025'
    },
    {
      id: 4,
      slug: 'comunicacao-alternativa-para-criancas-autistas',
      titulo: 'Comunicação Alternativa para Crianças Autistas Não-verbais',
      resumo: 'Conheça os métodos de comunicação alternativa e aumentativa que podem ajudar crianças com autismo não-verbais a expressar suas necessidades e sentimentos.',
      categoria: 'Autismo',
      imagem: '/placeholder-post-4.jpg',
      data: '02/04/2025'
    },
    {
      id: 5,
      slug: 'desenvolvimento-emocional-na-infancia',
      titulo: 'Desenvolvimento Emocional na Infância: Bases para uma Vida Equilibrada',
      resumo: 'Saiba como ajudar seu filho a desenvolver inteligência emocional desde cedo e a importância dessa habilidade para o sucesso nas relações interpessoais ao longo da vida.',
      categoria: 'Desenvolvimento Infantil',
      imagem: '/placeholder-post-5.jpg',
      data: '25/03/2025'
    },
    {
      id: 6,
      slug: 'medicacao-para-tdah-mitos-e-verdades',
      titulo: 'Medicação para TDAH: Mitos e Verdades',
      resumo: 'Uma análise sobre os diferentes tratamentos medicamentosos para o TDAH, seus benefícios, efeitos colaterais e quando considerar essa opção para seu filho.',
      categoria: 'TDAH',
      imagem: '/placeholder-post-6.jpg',
      data: '15/03/2025'
    }
  ];

  // Categorias do blog
  const categorias = [
    { nome: 'Autismo', slug: 'autismo', quantidade: 10 },
    { nome: 'TDAH', slug: 'tdah', quantidade: 8 },
    { nome: 'Desenvolvimento Infantil', slug: 'desenvolvimento-infantil', quantidade: 15 },
    { nome: 'Educação Especial', slug: 'educacao-especial', quantidade: 6 },
    { nome: 'Terapias', slug: 'terapias', quantidade: 7 },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-purple-800 mb-2">Blog</h1>
      <p className="text-gray-600 mb-8 text-lg">
        Compartilhando conhecimento sobre desenvolvimento infantil, autismo, TDAH e mais.
      </p>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Lista de Posts */}
        <div className="md:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                {/* Placeholder para imagem do post */}
                <div className="h-48 bg-purple-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-purple-700 font-medium">
                    Imagem do Post
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-purple-600 font-medium">{post.categoria}</span>
                    <span className="text-xs text-gray-500">{post.data}</span>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-3">
                    <Link href={`/blog/${post.slug}`} className="hover:text-purple-700 transition">
                      {post.titulo}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.resumo}
                  </p>
                  
                  <Link href={`/blog/${post.slug}`} className="text-purple-600 hover:text-purple-800 font-medium">
                    Ler mais →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          
          {/* Paginação */}
          <div className="flex justify-center mt-12">
            <nav className="inline-flex">
              <a href="#" className="px-4 py-2 border border-gray-300 bg-white text-purple-700 rounded-l-md hover:bg-gray-50">
                Anterior
              </a>
              <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-purple-700 hover:bg-gray-50">
                1
              </a>
              <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-purple-700 text-white hover:bg-purple-800">
                2
              </a>
              <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-purple-700 hover:bg-gray-50">
                3
              </a>
              <a href="#" className="px-4 py-2 border border-gray-300 bg-white text-purple-700 rounded-r-md hover:bg-gray-50">
                Próxima
              </a>
            </nav>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="md:w-1/4">
          {/* Busca */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">Buscar no Blog</h3>
            <div className="flex">
              <input 
                type="text" 
                placeholder="O que você procura?" 
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="bg-purple-700 text-white px-4 py-2 rounded-r-md hover:bg-purple-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Categorias */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">Categorias</h3>
            <ul className="space-y-2">
              {categorias.map((categoria) => (
                <li key={categoria.slug} className="border-b border-gray-100 pb-2">
                  <Link href={`/blog/categorias/${categoria.slug}`} className="text-gray-700 hover:text-purple-700 flex justify-between">
                    <span>{categoria.nome}</span>
                    <span className="text-gray-500 text-sm">{categoria.quantidade}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Posts Populares */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">Posts Populares</h3>
            <ul className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <li key={post.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-purple-200 rounded flex-shrink-0 flex items-center justify-center text-purple-700 text-xs">
                    Imagem
                  </div>
                  <div>
                    <h4 className="font-medium leading-tight">
                      <Link href={`/blog/${post.slug}`} className="hover:text-purple-700">
                        {post.titulo.length > 40 ? post.titulo.substring(0, 40) + '...' : post.titulo}
                      </Link>
                    </h4>
                    <span className="text-xs text-gray-500">{post.data}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
            <h3 className="text-xl font-semibold text-purple-800 mb-3">Receba Novidades</h3>
            <p className="text-gray-600 text-sm mb-4">
              Inscreva-se para receber artigos, dicas e novidades sobre desenvolvimento infantil.
            </p>
            <form>
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="w-full bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition">
                Inscrever
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
