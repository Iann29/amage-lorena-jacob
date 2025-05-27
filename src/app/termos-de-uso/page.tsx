import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso | Lorena Jacob - Terapeuta Infantil',
  description: 'Termos de Uso do site de Lorena Jacob. Conheça as regras e condições para utilização de nossos serviços.',
};

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Termos de Uso
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <p className="text-gray-600 mb-6">
              <strong>Última atualização:</strong> Janeiro de 2025
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Bem-vindo ao site de Lorena Jacob - Terapeuta Infantil. Ao acessar e usar este site, 
              você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. 
              Se você não concordar com qualquer parte destes termos, não deverá usar nosso site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Ao acessar e utilizar este site, você aceita e concorda em estar vinculado aos presentes 
              Termos de Uso, nossa Política de Privacidade e todas as leis e regulamentos aplicáveis. 
              Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Uso do Site</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Você pode usar este site apenas para fins legais e de acordo com estes Termos. Você concorda em não usar o site:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>De qualquer forma que viole qualquer lei ou regulamento aplicável</li>
              <li>Para transmitir ou obter o envio de qualquer material publicitário ou promocional não solicitado</li>
              <li>Para se passar por outra pessoa ou entidade</li>
              <li>Para interferir ou interromper o funcionamento do site</li>
              <li>Para coletar informações pessoais de outros usuários</li>
              <li>Para prejudicar menores de qualquer forma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Conteúdo e Propriedade Intelectual</h2>
            <p className="text-gray-700 leading-relaxed">
              Todo o conteúdo presente neste site, incluindo textos, imagens, gráficos, logotipos, 
              ícones, vídeos, áudios e software, é propriedade de Lorena Jacob ou de seus licenciadores 
              e está protegido por leis de direitos autorais e propriedade intelectual. Você não pode 
              reproduzir, distribuir, modificar ou criar trabalhos derivados deste conteúdo sem 
              autorização prévia por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Conta de Usuário</h2>
            <p className="text-gray-700 leading-relaxed">
              Ao criar uma conta em nosso site, você é responsável por:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
              <li>Fornecer informações verdadeiras, precisas e completas</li>
              <li>Manter a confidencialidade de sua senha</li>
              <li>Todas as atividades que ocorram em sua conta</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
              <li>Não compartilhar suas credenciais de acesso com terceiros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Produtos e Serviços</h2>
            <p className="text-gray-700 leading-relaxed">
              Os produtos e serviços oferecidos neste site estão sujeitos à disponibilidade. 
              Reservamo-nos o direito de:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
              <li>Modificar ou descontinuar qualquer produto ou serviço a qualquer momento</li>
              <li>Limitar a quantidade de produtos ou serviços oferecidos</li>
              <li>Recusar serviço a qualquer pessoa por qualquer motivo</li>
              <li>Corrigir erros em descrições, preços ou disponibilidade</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Pagamentos e Cancelamentos</h2>
            <p className="text-gray-700 leading-relaxed">
              Para compras realizadas através do site:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
              <li>Você concorda em fornecer informações de pagamento atuais e válidas</li>
              <li>Os preços estão sujeitos a alterações sem aviso prévio</li>
              <li>Todos os pagamentos devem ser feitos na moeda brasileira (Real)</li>
              <li>Políticas de cancelamento e reembolso serão informadas no momento da compra</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Links para Terceiros</h2>
            <p className="text-gray-700 leading-relaxed">
              Nosso site pode conter links para sites de terceiros. Não somos responsáveis pelo 
              conteúdo, políticas de privacidade ou práticas desses sites. O uso de sites de 
              terceiros é por sua conta e risco.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Isenção de Responsabilidade</h2>
            <p className="text-gray-700 leading-relaxed">
              As informações contidas neste site são fornecidas apenas para fins informativos e 
              educacionais. Não devem ser consideradas como aconselhamento médico, diagnóstico ou 
              tratamento. Sempre consulte um profissional de saúde qualificado para questões 
              relacionadas à saúde e desenvolvimento infantil.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 leading-relaxed">
              Em nenhuma circunstância Lorena Jacob ou seus afiliados serão responsáveis por 
              quaisquer danos diretos, indiretos, incidentais, especiais ou consequentes 
              decorrentes do uso ou incapacidade de usar este site ou seus serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">10. Indemnização</h2>
            <p className="text-gray-700 leading-relaxed">
              Você concorda em defender, indenizar e isentar Lorena Jacob de qualquer reclamação, 
              dano, obrigação, perda, responsabilidade, custo ou dívida, e despesas decorrentes 
              de seu uso do site ou violação destes Termos de Uso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">11. Modificações dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
              As alterações entrarão em vigor imediatamente após a publicação no site. 
              É sua responsabilidade revisar periodicamente os termos atualizados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">12. Lei Aplicável</h2>
            <p className="text-gray-700 leading-relaxed">
              Estes Termos de Uso são regidos e interpretados de acordo com as leis do Brasil. 
              Qualquer disputa relacionada a estes termos será resolvida exclusivamente nos 
              tribunais competentes do Brasil.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">13. Contato</h2>
            <p className="text-gray-700 leading-relaxed">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
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
              Ao continuar a usar este site, você reconhece que leu, compreendeu e concorda 
              em estar vinculado a estes Termos de Uso.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}