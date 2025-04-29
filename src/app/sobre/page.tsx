import Image from 'next/image';

export const metadata = {
  title: 'Sobre | Lorena Jacob',
  description: 'Conheça mais sobre Lorena Jacob, terapeuta infantil especializada em autismo, TDAH e desenvolvimento infantil.'
};

export default function SobrePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-purple-800 mb-6">Sobre Mim</h1>
      
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/3">
          {/* Placeholder para foto - substituir pela imagem real */}
          <div className="w-full aspect-[3/4] bg-purple-200 rounded-lg flex items-center justify-center">
            <span className="text-purple-800 font-medium">Foto de Lorena Jacob</span>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">Lorena Jacob</h2>
          <p className="text-gray-700 mb-4">
            Olá! Sou Lorena Jacob, terapeuta infantil com formação especializada em desenvolvimento, autismo e TDAH. Minha jornada na área da terapia infantil começou há mais de 10 anos, quando percebi minha paixão por ajudar crianças a alcançarem seu potencial máximo.
          </p>
          <p className="text-gray-700 mb-4">
            Possuo formação em Psicologia pela Universidade Federal de [Nome da Universidade], com especialização em Neuropsicologia Infantil e Transtornos do Neurodesenvolvimento. Ao longo da minha carreira, trabalhei em diversas instituições de referência, adquirindo uma vasta experiência no tratamento de crianças com necessidades especiais.
          </p>
          <p className="text-gray-700 mb-4">
            Minha abordagem de terapia é baseada na crença de que cada criança é única e deve ser tratada com um plano personalizado que respeite seu próprio ritmo e necessidades específicas. Trabalho em estreita colaboração com as famílias, pois acredito que o envolvimento dos pais é fundamental para o sucesso do tratamento.
          </p>
          
          <div className="mt-6 border-l-4 border-purple-500 pl-4 italic text-gray-600">
            "Meu objetivo é criar um ambiente acolhedor onde cada criança possa se sentir segura para explorar, aprender e superar seus desafios."
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-purple-800 mb-6">Minha Formação e Experiência</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Formação Acadêmica</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Bacharelado em Psicologia - Universidade Federal de [Nome]</li>
              <li>Especialização em Neuropsicologia Infantil - Instituto [Nome]</li>
              <li>Mestrado em Transtornos do Neurodesenvolvimento - Universidade de [Nome]</li>
              <li>Certificação em Terapia ABA (Análise do Comportamento Aplicada)</li>
              <li>Formação em Intervenção Precoce para TEA</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Experiência Profissional</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Terapeuta sênior na Clínica [Nome] (2018-presente)</li>
              <li>Coordenadora de intervenção precoce no Instituto [Nome] (2015-2018)</li>
              <li>Psicóloga infantil no Centro de Reabilitação [Nome] (2012-2015)</li>
              <li>Consultora em inclusão escolar para crianças com TEA</li>
              <li>Palestrante em conferências nacionais sobre desenvolvimento infantil</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-purple-800 mb-6">Abordagem Terapêutica</h2>
        
        <p className="text-gray-700 mb-4">
          Minha metodologia de trabalho é multidisciplinar e personalizada, integrando diferentes técnicas terapêuticas baseadas em evidências científicas. Acredito na importância de uma avaliação completa antes de iniciar qualquer intervenção, para entender as necessidades específicas de cada criança.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Autismo (TEA)</h3>
            <p className="text-gray-700">
              Intervenções focadas no desenvolvimento de habilidades sociais, comunicação, redução de comportamentos desafiadores e promoção da autonomia, usando métodos como ABA, TEACCH e DIR/Floortime.
            </p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">TDAH</h3>
            <p className="text-gray-700">
              Estratégias para melhorar a atenção, controle de impulsos e funções executivas, combinando terapia comportamental, treinamento parental e técnicas de autorregulação emocional.
            </p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Desenvolvimento Infantil</h3>
            <p className="text-gray-700">
              Acompanhamento do desenvolvimento típico e atípico, com estímulos adequados para cada fase e identificação precoce de atrasos ou dificuldades no desenvolvimento.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-purple-700 text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Vamos trabalhar juntos pelo desenvolvimento do seu filho</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Se você busca atendimento personalizado e baseado em evidências para seu filho, entre em contato para agendar uma consulta inicial.
        </p>
        <a href="/contato" className="inline-block bg-white text-purple-800 px-6 py-3 rounded-md font-medium hover:bg-purple-100 transition">
          Agende uma Consulta
        </a>
      </div>
    </div>
  );
}
