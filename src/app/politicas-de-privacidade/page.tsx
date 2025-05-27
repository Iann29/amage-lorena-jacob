import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Lorena Jacob - Terapeuta Infantil',
  description: 'Política de Privacidade do site de Lorena Jacob. Saiba como coletamos, usamos e protegemos suas informações pessoais.',
};

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Política de Privacidade
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <p className="text-gray-600 mb-6">
              <strong>Última atualização:</strong> Janeiro de 2025
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              A sua privacidade é importante para nós. É política do site Lorena Jacob - Terapeuta Infantil 
              respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site 
              lorenajacob.com.br, e outros sites que possuímos e operamos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Informações que Coletamos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Coletamos informações pessoais que você nos fornece diretamente, tais como:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Número de telefone</li>
              <li>Informações de perfil (quando você cria uma conta)</li>
              <li>Mensagens enviadas através de formulários de contato</li>
              <li>Comentários em posts do blog</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Como Usamos suas Informações</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Responder às suas perguntas e solicitações</li>
              <li>Enviar atualizações sobre nossos serviços (com seu consentimento)</li>
              <li>Processar transações e pagamentos</li>
              <li>Personalizar sua experiência no site</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Compartilhamento de Informações</h2>
            <p className="text-gray-700 leading-relaxed">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
              <li>Com seu consentimento explícito</li>
              <li>Para cumprir obrigações legais</li>
              <li>Com prestadores de serviços que nos auxiliam a operar o site (sob acordos de confidencialidade)</li>
              <li>Para proteger nossos direitos, privacidade, segurança ou propriedade</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Segurança dos Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas de segurança apropriadas para proteger suas informações pessoais contra 
              acesso não autorizado, alteração, divulgação ou destruição. Utilizamos criptografia SSL para 
              proteger dados sensíveis durante a transmissão e armazenamos informações em servidores seguros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Utilizamos cookies para melhorar sua experiência em nosso site. Cookies são pequenos arquivos 
              de texto armazenados em seu dispositivo que nos ajudam a lembrar suas preferências e entender 
              como você usa nosso site. Você pode configurar seu navegador para recusar cookies, mas isso 
              pode afetar algumas funcionalidades do site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Seus Direitos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Acessar suas informações pessoais</li>
              <li>Corrigir dados incorretos ou desatualizados</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar seu consentimento para uso de dados</li>
              <li>Solicitar a portabilidade de seus dados</li>
              <li>Ser informado sobre com quem compartilhamos seus dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Menores de Idade</h2>
            <p className="text-gray-700 leading-relaxed">
              Nosso site não é direcionado a menores de 18 anos. Não coletamos intencionalmente informações 
              pessoais de menores de idade. Se você é pai ou responsável e acredita que seu filho forneceu 
              informações pessoais, entre em contato conosco para que possamos removê-las.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Alterações nesta Política</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre 
              quaisquer mudanças publicando a nova política nesta página e atualizando a data de 
              "Última atualização".
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Contato</h2>
            <p className="text-gray-700 leading-relaxed">
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados, 
              entre em contato conosco:
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700">
                <strong>Lorena Jacob - Terapeuta Infantil</strong><br />
                E-mail: contato@lorenajacob.com.br<br />
                WhatsApp: <a href="https://wa.me/message/FDF46FODEQMTL1" className="text-blue-600 hover:underline">Clique aqui</a>
              </p>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm text-center">
              Ao utilizar nosso site, você concorda com nossa Política de Privacidade.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}