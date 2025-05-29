"use client";
import Image from "next/image";

interface ProfileCardProps {
  imageUrl: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    handle?: string;
  };
  className?: string;
}

export default function ProfileCard({
  imageUrl,
  firstName = "Lorena",
  lastName = "Jacob",
  title = "TERAPEUTA INFANTIL",
  socialLinks = {
    facebook: "https://facebook.com/lorenajacob.st",
    instagram: "https://instagram.com/lorenajacob.st",
    handle: "@lorenajacob.st",
  },
  className = "",
}: ProfileCardProps) {
  return (
    <div
      className={`bg-[#F4F1E2] rounded-3xl shadow-lg overflow-hidden w-full max-w-[450px] md:w-[450px] ${className}`}
      style={{ position: 'relative', zIndex: 100 }}
    >
      {/* -------- topo -------- */}
      <div className="flex flex-col items-center py-6 md:py-8 px-8 md:px-16">
        {/* foto */}
        <div className="mb-3 rounded-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${firstName} ${lastName}`}
            width={220}
            height={220}
            className="object-cover w-40 h-40 md:w-56 md:h-56"
            priority
          />
        </div>

        {/* nome */}
        <h2
          className="text-[#5B472B] text-3xl md:text-4xl leading-none mb-4 text-center font-poppins"
        >
          <span className="block font-bold -mb-1">{firstName}</span>
          <span className="block font-medium">{lastName}</span>
        </h2>

        {/* sublinhado */}
        <div className="h-1.5 w-20 md:w-28 bg-[#00D3C7] mb-4" />

        {/* título */}
        <p
          className="uppercase text-[#7A6D49] text-sm md:text-base tracking-[0.2em] md:tracking-[0.36em] mb-0 text-center font-poppins"
        >
          {title}
        </p>
      </div>

      {/* -------- rodapé -------- */}
      <div className="bg-white w-full flex items-center justify-center space-x-3 py-3 md:py-4 border-t border-gray-100 mt-0">
        {socialLinks.facebook && (
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/assets/facebook-icon.svg"
              alt="Facebook"
              width={24}
              height={24}

            />
          </a>
        )}

        {socialLinks.instagram && (
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/assets/instagram-icon.svg"
              alt="Instagram"
              width={24}
              height={24}

            />
          </a>
        )}

        {socialLinks.handle && (
          <>
            <span className="text-[#6FB1CE] text-sm">/</span>
            <span className="text-[#6FB1CE] text-sm">
              {socialLinks.handle}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
