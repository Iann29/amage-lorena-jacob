"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

const Footer = () => {
  const router = useRouter();
  usePathname();
  const anoAtual = new Date().getFullYear();
  
  // A lógica de exibição/ocultação do Footer foi movida para o template.tsx principal

  // Animações para os elementos do footer - variáveis removidas pois não estão sendo utilizadas
  // const containerVariants = { ... };
  // const itemVariants = { ... };

  return (
    <footer className="bg-white">
      {/* Seção do menu principal com a logo */}
      <div className="container mx-auto pt-9 pb-5">
        <div className="pb-6 relative">
          {/* Container com linhas de grid */}
          <div className="md:grid md:grid-cols-12 px-6 md:px-0">
            {/* Coluna da esquerda para a logo */}
            <div className="md:col-span-3 lg:col-span-4 relative">
              {/* Logo posicionada absolutamente para centralização perfeita */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex justify-center mb-10 md:mb-0 w-full md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-y-1/2 md:-translate-x-1/2"
              >
                <Link href="/" className="block">
                  <Image 
                    src="/logos/logo1.webp" 
                    alt="Lorena Jacob - Terapeuta Infantil" 
                    width={320} 
                    height={64}
                    priority
                    style={{ width: 'clamp(180px, 20vw, 280px)', height: 'auto' }}
                    className="max-w-none"
                  />
                </Link>
              </motion.div>
            </div>

            {/* Separador vertical */}
            <div className="hidden md:block md:col-span-1 relative h-full">
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-0.5 h-56 bg-[#D9D9D9]"></div>
            </div>
            
            {/* Menu com os 4 itens */}
            <div className="flex flex-col md:flex-row md:justify-end md:col-span-8 lg:col-span-7 space-x-0 md:space-x-10 lg:space-x-16 pl-0">
              {/* Início */}
              <div className="mb-8 md:mb-0 md:w-auto" style={{maxWidth: "200px"}}>
                <h3 className="text-[#07B1E4] text-xl font-semibold font-['Poppins'] mb-7 h-[38px] flex items-center">
                  <span className="cursor-pointer hover:opacity-80 transition-opacity duration-200" onClick={() => router.push('/')}>
                    Início
                  </span>
                </h3>
                <ul className="text-[#6E6B46] space-y-3 text-xs font-['Poppins']">
                  <li>
                    <Link href="/#suporte" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-start">
                      <span className="mr-2 mt-0.5">•</span> <span className="text-black group-hover:text-[#52A4DB] transition-colors duration-200">Suporte personalizado para o desenvolvimento infantil</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#treinamento" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-start">
                      <span className="mr-2 mt-0.5">•</span> <span className="text-black group-hover:text-[#52A4DB] transition-colors duration-200">Treinamento para Pais e Educadores</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#palestras" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-center">
                      <span className="mr-2">•</span> <span className="text-black group-hover:text-[#52A4DB] transition-colors duration-200">Palestras & Consultorias</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#ebook" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-center">
                      <span className="mr-2">•</span> <span className="text-black group-hover:text-[#52A4DB] transition-colors duration-200">E-book Rotina Diária</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#depoimentos" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-center">
                      <span className="mr-2">•</span> <span className="text-black group-hover:text-[#52A4DB] transition-colors duration-200">Depoimentos</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Sobre mim */}
              <div className="mb-8 md:mb-0 md:w-auto" style={{maxWidth: "200px"}}>
                <h3 className="text-[#07B1E4] text-xl font-semibold font-['Poppins'] mb-7 h-[38px] flex items-center">
                  <span className="cursor-pointer hover:opacity-80 transition-opacity duration-200" onClick={() => router.push('/sobre')}>
                    Sobre mim
                  </span>
                </h3>
                <ul className="text-[#6E6B46] space-y-3 text-xs font-['Poppins']">
                  <li>
                    <Link href="/sobre" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-center">
                      <span className="mr-2">•</span> <span className="text-black group-hover:text-[#52A4DB] transition-colors duration-200">Lorena Jacob, Terapeuta infantil</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/sobre#portfolio" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-center">
                      <span className="mr-2">•</span> <span className="text-black group-hover:text-[#52A4DB] transition-colors duration-200">Meu portfólio</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Blog */}
              <div className="mb-8 md:mb-0 md:w-auto" style={{maxWidth: "200px"}}>
                <h3 className="text-[#07B1E4] text-xl font-semibold font-['Poppins'] mb-7 h-[38px] flex items-center">
                  <span className="cursor-pointer hover:opacity-80 transition-opacity duration-200" onClick={() => router.push('/blog')}>
                    Blog
                  </span>
                </h3>
                <ul className="text-[#6E6B46] space-y-3 text-xs font-['Poppins']">
                  <li>
                    <Link href="/blog/categoria/dicas" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-center">
                      <span className="mr-2">•</span> <span className="text-black group-hover:text-[#52A4DB] transition-colors duration-200">Dicas para estimular o desenvolvimento infantil</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog/categoria/rotina" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-center">
                      <span className="mr-2">•</span> <span className="text-black group-hover:text-[#52A4DB] transition-colors duration-200">Como criar uma rotina estruturada para crianças</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Loja */}
              <div className="mb-8 md:mb-0 md:w-auto" style={{maxWidth: "200px"}}>
                <h3 className="mb-7 h-[38px] flex items-center">
                  <span className="text-white text-xl font-semibold font-['Poppins'] px-6 py-1 rounded-md bg-[#52a4db] cursor-pointer hover:opacity-90 transition-opacity duration-200" onClick={() => router.push('/loja')}>
                    Loja
                  </span>
                </h3>
                <ul className="text-[#6E6B46] space-y-3 text-xs font-['Poppins']">
                  <li>
                    <Link href="/loja/brinquedos-sensoriais" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-center">
                      <span className="mr-2">•</span> <span className="text-black group-hover:text-[#52A4DB] transition-colors duration-200">Brinquedos sensoriais</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/loja/jogos" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-center">
                      <span className="mr-2">•</span> <span className="text-black hover:text-[#52A4DB] transition-colors duration-200">Jogos</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/loja/brinquedos-montessorianos" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-center">
                      <span className="mr-2">•</span> <span className="text-black hover:text-[#52A4DB] transition-colors duration-200">Brinquedos Montessorianos</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/loja/pecs" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-center">
                      <span className="mr-2">•</span> <span className="text-black group-hover:text-[#52A4DB] transition-colors duration-200">PECS & Comunicação Alternativa</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/loja/ebooks" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-center">
                      <span className="mr-2">•</span> <span className="text-black hover:text-[#52A4DB] transition-colors duration-200">E-BOOKS</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/loja/material-pedagogico" prefetch={false} className="group hover:text-[#52A4DB] transition-colors duration-200 flex items-center">
                      <span className="mr-2">•</span> <span className="text-black group-hover:text-[#52A4DB] transition-colors duration-200">Materiais Pedagógicos</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de redes sociais e pagamentos */}
      <div className="bg-[#CFCFCF] py-3">
        <div className="container mx-auto px-6 md:px-0">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Siga-me nas redes */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center mb-4 md:mb-0"
            >
              <div className="mr-6 md:mr-8">
                <div className="text-center md:text-left">
                  <span className="text-white text-2xl font-extrabold font-['Poppins'] leading-normal">SIGA-ME</span>
                  <span className="text-white text-2xl font-medium font-['Poppins'] leading-normal ml-2">NAS REDES</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <motion.a 
                  href="https://www.facebook.com/profile.php?id=61573695501036"
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#FFFFFF" className="bi bi-facebook" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </motion.a>
                <motion.a 
                  href="https://www.instagram.com/lorenajacob.st/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#FFFFFF" className="bi bi-instagram" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </motion.a>
              </div>
            </motion.div>

            {/* Formas de pagamento */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="text-center mb-2 justify-center">
                <span className="text-white text-xl font-normal font-['Poppins'] leading-snug">FORMAS DE</span>
                <span className="text-white text-xl font-extrabold font-['Poppins'] leading-snug"> PAGAMENTO</span>
              </div>
              <div className="flex space-x-3">
                <Image src="/assets/pix-icon.png" alt="PIX" width={60} height={30} className="h-[30px] w-auto" />
                <Image src="/assets/boleto-icon.png" alt="Boleto" width={60} height={30} className="h-[30px] w-auto" />
                <Image src="/assets/visa-icon.png" alt="Visa" width={60} height={30} className="h-[30px] w-auto" />
                <Image src="/assets/mastercard-icon.png" alt="Mastercard" width={60} height={30} className="h-[30px] w-auto" />
                <Image src="/assets/mercadopago-icon.png" alt="Mercado Pago" width={80} height={30} className="h-[30px] w-auto" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Termos e Copyright */}
      <div className="container mx-auto py-4 px-6 md:px-0 text-center">
        <div className="flex flex-col items-center justify-center text-xs text-[#6E6B46] font-['Poppins']">
          <div className="flex justify-center space-x-8 mb-2">
            <Link href="/termos-de-uso" prefetch={false} className="hover:text-[#52A4DB] transition-colors duration-200">
              Termos de Uso
            </Link>
            <Link href="/politicas-de-privacidade" prefetch={false} className="hover:text-[#52A4DB] transition-colors duration-200">
              Políticas de Privacidade
            </Link>
          </div>
          <div className="text-center">
            <p className="text-[#6E6B46] font-bold">
              ©{anoAtual} <span className="mx-2">•</span> Lorena Jacob <span className="mx-2">•</span> Todos os Direitos Reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
