// Bug fix: N/A — hero with two circular portraits and photo upload card.
import Image from "next/image";
import { PhotoCard } from "./PhotoCard";

export function HeroSection() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-4 md:flex-row md:items-start md:justify-center">
      <div className="flex shrink-0 items-center gap-4 md:gap-6">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-black sm:h-40 sm:w-40">
          <Image
            src="/jasperwerktelefoon.png"
            alt="Jasper werktelefoon"
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-black sm:h-40 sm:w-40">
          <Image
            src="/werktelefoon2.jpg"
            alt="Werktelefoon 2"
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>
      </div>
      <PhotoCard />
    </section>
  );
}
