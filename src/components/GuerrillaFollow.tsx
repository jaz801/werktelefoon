// Bug fix: PhotoCard moved to ShareContentGrid (left column in #share-content).
// Bug fix: N/A — guerrilla follow + werkveranderaar challenge block under intro copy.
import Image from "next/image";
import { OutlineButton } from "./OutlineButton";

const ANIQUE_LINKEDIN_URL = "https://www.linkedin.com/in/aniquewijnhoud/";

export function GuerrillaFollow() {
  return (
    <section className="mt-10 border-t border-black/10 pt-10">
      <h2 className="font-[family-name:var(--font-newake)] text-2xl uppercase tracking-wide text-[var(--text)] sm:text-3xl">
        VOLG DE GUERILLA
      </h2>
      <p className="mt-3 font-[family-name:var(--font-indivisible)] text-base font-semibold sm:text-lg">
        Daar deel ik 2 keer per dag updates.
      </p>

      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
        <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36">
          <Image
            src="/werktelefoon-anique.png"
            alt="Anique Wijnhoud met de Werktelefoon"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 112px, 144px"
          />
        </div>
        <p
          className="font-[family-name:var(--font-handwritten)] text-3xl leading-none text-[var(--text)] sm:text-4xl md:text-5xl"
          aria-label="Anique Wijnhoud"
        >
          Anique Wijnhoud
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <OutlineButton
          href={ANIQUE_LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-md font-[family-name:var(--font-indivisible)] sm:w-auto"
        >
          Volg mij op Linkedin
        </OutlineButton>
      </div>

      <h2 className="mt-10 font-[family-name:var(--font-newake)] text-2xl uppercase tracking-wide text-[var(--text)] sm:text-3xl">
        WERKVERANDERAAR CHALLENGE
      </h2>
      <p className="mt-3 font-[family-name:var(--font-indivisible)] text-base font-semibold leading-relaxed sm:text-lg">
        De 10 werkenden en organisaties die - zodra 100.000 werkveranderaars zich
        hebben aangesloten - de meeste mensen in beweging hebben gebracht, krijgen
        levenslang de titel van Founding Partner van De Werktelefoon.
      </p>

    </section>
  );
}
