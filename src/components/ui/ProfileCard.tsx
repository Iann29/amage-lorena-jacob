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
      className={`bg-[#FFFAEB] rounded-2xl shadow-md overflow-hidden max-w-xs ${className}`}
    >
      {/* -------- topo -------- */}
      <div className="flex flex-col items-center py-8 px-6">
        {/* foto */}
        <div className="mb-6 rounded-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${firstName} ${lastName}`}
            width={160}
            height={160}
            className="object-cover w-40 h-40"
            priority
          />
        </div>

        {/* nome */}
        <h2
          className="text-[#7A6D49] text-3xl leading-tight mb-3 text-center font-poppins"
        >
          <span className="block font-bold">{firstName}</span>
          <span className="block font-medium">{lastName}</span>
        </h2>

        {/* sublinhado */}
        <div className="h-1 w-16 bg-[#00D3C7] mb-6" />

        {/* título */}
        <p
          className="uppercase text-[#7A6D49] text-sm tracking-[0.36em] mb-1 text-center font-poppins"
        >
          {title}
        </p>
      </div>

      {/* -------- rodapé -------- */}
      <div className="bg-white w-full flex items-center justify-center space-x-2 py-4 border-t border-gray-100">
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
