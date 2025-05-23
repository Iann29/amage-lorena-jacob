import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] text-center px-4">
      <div className="max-w-md">
        <svg
          className="mx-auto mb-8 opacity-75 text-[#00796B]"
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
        <h1 className="text-5xl md:text-6xl font-bold text-[#00796B] mb-6" style={{ fontFamily: 'var(--font-museo-sans)' }}>
          Oops! 404
        </h1>
        <p className="text-xl md:text-2xl text-[#004D40] mb-4" style={{ fontFamily: 'var(--font-museo-sans)' }}>
          Parece que a página que você está procurando não existe ou foi movida.
        </p>
        <p className="text-md text-[#004D40] mb-10">
          Não se preocupe, acontece! Que tal tentar um dos links abaixo ou voltar para o início?
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
          <Link
            href="/"
            className="inline-block bg-[#00796B] hover:bg-[#004D40] text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 ease-in-out text-lg"
            style={{ fontFamily: 'var(--font-museo-sans)' }}
          >
            Voltar para o Início
          </Link>
          <Link
            href="/blog"
            className="inline-block bg-transparent hover:bg-[#A7D8DE] text-[#00796B] hover:text-[#004D40] font-semibold py-3 px-8 rounded-lg border-2 border-[#00796B] shadow-md transition-all duration-300 ease-in-out text-lg"
            style={{ fontFamily: 'var(--font-museo-sans)' }}
          >
            Ver o Blog
          </Link>
        </div>
        <p className="mt-12 text-sm text-[#004D40] opacity-80">
          Se você acredita que isso é um erro, por favor, entre em contato.
        </p>
      </div>
    </div>
  );
} 