// Hero: Jasper circle + Anique ring example (PNG as exported, no image processing).
import Image from "next/image";
import { PhotoCard } from "./PhotoCard";

export function HeroSection() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-6 px-1 sm:gap-8 md:flex-row md:items-start lg:items-center">
      <div className="flex shrink-0 items-center justify-center gap-3 sm:gap-4 md:gap-6">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-black sm:h-32 sm:w-32 md:h-40 md:w-40">
          <Image
            src="/jasperwerktelefoon.png"
            alt="Jasper werktelefoon"
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>
        <div className="relative h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40">
          <Image
            src="/werktelefoon-anique.png"
            alt="Werktelefoon voorbeeld met ring"
            fill
            className="object-contain"
            sizes="160px"
            priority
            unoptimized
          />
        </div>
      </div>
      <PhotoCard />
    </section>
  );
}
