import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500 to-purple-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Lorena Jacob</h1>
            <h2 className="text-xl md:text-3xl font-semibold mb-6">Terapeuta Infantil Especializada</h2>
            <p className="text-lg mb-8">
              Ajudando crianças a desenvolverem seu potencial máximo através de terapias personalizadas para autismo, TDAH e outros transtornos do neurodesenvolvimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contato" 
                className="bg-white text-purple-800 px-6 py-3 rounded-md font-medium text-center hover:bg-purple-100 transition"
              >
                Agende uma Consulta
              </Link>
              <Link 
                href="/sobre" 
                className="border border-white text-white px-6 py-3 rounded-md font-medium text-center hover:bg-white/10 transition"
              >
                Conheça meu Trabalho
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* Imagem placeholder - substituir pela imagem real */}
            <div className="w-64 h-64 md:w-80 md:h-80 bg-purple-300 rounded-full flex items-center justify-center overflow-hidden">
              <span className="text-purple-800 font-bold text-xl">Imagem</span>
              {/* <Image src="/lorena-jacob.jpg" alt="Lorena Jacob" width={300} height={300} className="rounded-full" /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Especialidades Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-800">Minhas Especialidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Terapia para Autismo</h3>
              <p className="text-gray-600 text-center">
                Abordagem personalizada para crianças com Transtorno do Espectro Autista (TEA), focada no desenvolvimento de habilidades sociais e comunicativas.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Intervenção para TDAH</h3>
              <p className="text-gray-600 text-center">
                Estratégias eficazes para melhorar a concentração, controle de impulsos e organização em crianças com Transtorno de Déficit de Atenção e Hiperatividade.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Desenvolvimento Infantil</h3>
              <p className="text-gray-600 text-center">
                Acompanhamento e suporte para o desenvolvimento global de crianças, estimulando habilidades motoras, cognitivas e emocionais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-purple-800">Blog</h2>
            <Link href="/blog" className="text-purple-600 hover:text-purple-800 font-medium">Ver todos os artigos →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Posts do blog - Placeholder */}
            {[1, 2, 3].map((item) => (
              <article key={item} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                <div className="h-48 bg-purple-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-purple-700 font-medium">
                    Imagem do Post {item}
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-sm text-purple-600 font-medium">Desenvolvimento Infantil</span>
                  <h3 className="text-xl font-semibold mt-2 mb-3">Título do Artigo {item}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel egestas dolor, nec dignissim metus. Donec augue elit, rhoncus ac sodales id, porttitor vitae est.
                  </p>
                  <Link href={`/blog/artigo-exemplo-${item}`} className="text-purple-600 hover:text-purple-800 font-medium">
                    Ler mais →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-purple-800">Produtos em Destaque</h2>
            <Link href="/loja" className="text-purple-600 hover:text-purple-800 font-medium">Ver todos os produtos →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Produtos - Placeholder */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition">
                <div className="h-48 bg-purple-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-purple-700 font-medium">
                    Imagem do Produto {item}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Produto {item}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    Breve descrição do produto com algumas informações relevantes.
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-purple-800 font-bold">R$ {(item * 40) + 0.90}</span>
                    <Link href={`/loja/produto-${item}`} className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition">
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para transformar a vida do seu filho?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Entre em contato hoje mesmo para agendar uma consulta ou saber mais sobre meus serviços de terapia infantil.
          </p>
          <Link href="/contato" className="bg-white text-purple-800 px-8 py-3 rounded-md font-medium inline-block hover:bg-purple-100 transition">
            Fale Comigo
          </Link>
        </div>
      </section>
    </div>
  );
}
