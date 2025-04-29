import Link from 'next/link';

export const metadata = {
  title: 'Loja | Lorena Jacob',
  description: 'E-books, cursos e materiais terapêuticos para desenvolvimento infantil, autismo e TDAH.'
};

export default function LojaPage() {
  // Dados mockados para os produtos
  // Estes dados eventualmente virão do Supabase
  const produtos = [
    {
      id: 1,
      slug: 'guia-pratico-autismo',
      nome: 'Guia Prático: Sinais de Autismo',
      descricao: 'E-book com orientações para identificar sinais precoces de TEA e estratégias iniciais de intervenção.',
      preco: 39.90,
      categoria: 'E-book',
      imagem: '/placeholder-produto-1.jpg',
      destaque: true
    },
    {
      id: 2,
      slug: 'curso-tdah-em-casa',
      nome: 'Curso: TDAH na Rotina Familiar',
      descricao: 'Curso online com 10 módulos de estratégias práticas para pais ajudarem seus filhos com TDAH em casa.',
      preco: 149.90,
      categoria: 'Curso',
      imagem: '/placeholder-produto-2.jpg',
      destaque: true
    },
    {
      id: 3,
      slug: 'kit-atividades-sensoriais',
      nome: 'Kit de Atividades Sensoriais',
      descricao: 'Material digital com 50 atividades sensoriais para estimulação de crianças com autismo ou atrasos no desenvolvimento.',
      preco: 59.90,
      categoria: 'Material Digital',
      imagem: '/placeholder-produto-3.jpg',
      destaque: false
    },
    {
      id: 4,
      slug: 'guia-alimentacao-tdah',
      nome: 'Guia de Alimentação para Crianças com TDAH',
      descricao: 'E-book com orientações nutricionais, receitas e dicas de alimentação que podem auxiliar no controle dos sintomas do TDAH.',
      preco: 45.90,
      categoria: 'E-book',
      imagem: '/placeholder-produto-4.jpg',
      destaque: false
    },
    {
      id: 5,
      slug: 'planejador-rotina-visual',
      nome: 'Planejador de Rotina Visual',
      descricao: 'Kit digital com templates para criar rotinas visuais para crianças com autismo ou dificuldades na organização temporal.',
      preco: 37.90,
      categoria: 'Material Digital',
      imagem: '/placeholder-produto-5.jpg',
      destaque: true
    },
    {
      id: 6,
      slug: 'minicurso-comunicacao-alternativa',
      nome: 'Minicurso: Introdução à Comunicação Alternativa',
      descricao: 'Curso introdutório para pais e educadores sobre métodos de comunicação alternativa para crianças não-verbais.',
      preco: 89.90,
      categoria: 'Curso',
      imagem: '/placeholder-produto-6.jpg',
      destaque: false
    },
    {
      id: 7,
      slug: 'audiobook-desenvolvimento-emocional',
      nome: 'Audiobook: Desenvolvimento Emocional na Infância',
      descricao: 'Audiobook com estratégias para ajudar no desenvolvimento da inteligência emocional de crianças típicas e atípicas.',
      preco: 29.90,
      categoria: 'Audiobook',
      imagem: '/placeholder-produto-7.jpg',
      destaque: false
    },
    {
      id: 8,
      slug: 'jogo-habilidades-sociais',
      nome: 'Jogo Digital: Desenvolvendo Habilidades Sociais',
      descricao: 'Jogo digital em PDF para imprimir, com atividades lúdicas que estimulam o desenvolvimento de habilidades sociais.',
      preco: 42.90,
      categoria: 'Material Digital',
      imagem: '/placeholder-produto-8.jpg',
      destaque: true
    }
  ];

  // Categorias da loja
  const categorias = [
    { nome: 'E-books', slug: 'ebooks' },
    { nome: 'Cursos', slug: 'cursos' },
    { nome: 'Materiais Digitais', slug: 'materiais-digitais' },
    { nome: 'Audiobooks', slug: 'audiobooks' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-purple-800 mb-2">Loja</h1>
      <p className="text-gray-600 mb-8 text-lg">
        E-books, cursos e materiais para ajudar no desenvolvimento do seu filho.
      </p>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar com filtros */}
        <div className="md:w-1/4">
          {/* Categorias */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li className="border-b border-gray-100 pb-2">
                <Link href="/loja" className="text-purple-700 font-medium">
                  Todos os Produtos
                </Link>
              </li>
              {categorias.map((categoria) => (
                <li key={categoria.slug} className="border-b border-gray-100 pb-2">
                  <Link href={`/loja/categorias/${categoria.slug}`} className="text-gray-700 hover:text-purple-700">
                    {categoria.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Filtro de preço */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">Faixa de Preço</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="preco1" className="mr-2" />
                <label htmlFor="preco1" className="text-gray-700">Até R$ 30,00</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="preco2" className="mr-2" />
                <label htmlFor="preco2" className="text-gray-700">R$ 30,00 - R$ 50,00</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="preco3" className="mr-2" />
                <label htmlFor="preco3" className="text-gray-700">R$ 50,00 - R$ 100,00</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="preco4" className="mr-2" />
                <label htmlFor="preco4" className="text-gray-700">Acima de R$ 100,00</label>
              </div>
            </div>
          </div>
          
          {/* Banner promocional */}
          <div className="bg-purple-700 text-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Kit Completo</h3>
            <p className="text-sm mb-4">
              Adquira o kit completo de materiais para autismo com 30% de desconto!
            </p>
            <Link 
              href="/loja/kit-completo-autismo" 
              className="bg-white text-purple-800 px-4 py-2 rounded-md font-medium text-sm inline-block hover:bg-purple-100 transition"
            >
              Ver Oferta
            </Link>
          </div>
        </div>
        
        {/* Lista de Produtos */}
        <div className="md:w-3/4">
          {/* Controles de ordenação */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-600">
              Mostrando {produtos.length} produtos
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Ordenar por:</span>
              <select className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="relevancia">Relevância</option>
                <option value="menor-preco">Menor Preço</option>
                <option value="maior-preco">Maior Preço</option>
                <option value="novidades">Novidades</option>
              </select>
            </div>
          </div>
          
          {/* Grid de produtos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div key={produto.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition">
                {/* Imagem do produto */}
                <Link href={`/loja/${produto.slug}`}>
                  <div className="h-48 bg-purple-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-purple-700 font-medium">
                      Imagem do Produto
                    </div>
                    {produto.destaque && (
                      <div className="absolute top-2 left-2 bg-purple-700 text-white text-xs px-2 py-1 rounded">
                        Destaque
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-4">
                  <span className="text-xs text-purple-600 font-medium">{produto.categoria}</span>
                  <h3 className="font-semibold mt-1 mb-2">
                    <Link href={`/loja/${produto.slug}`} className="hover:text-purple-700">
                      {produto.nome}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {produto.descricao}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-purple-800 font-bold">R$ {produto.preco.toFixed(2).replace('.', ',')}</span>
                    <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition">
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Paginação */}
          <div className="flex justify-center mt-12">
            <nav className="inline-flex">
              <a href="#" className="px-4 py-2 border border-gray-300 bg-white text-purple-700 rounded-l-md hover:bg-gray-50">
                Anterior
              </a>
              <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-purple-700 text-white hover:bg-purple-800">
                1
              </a>
              <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-purple-700 hover:bg-gray-50">
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
      </div>
    </div>
  );
}
