// Bug fix: PhotoCard moved to ShareContentGrid (left column in #share-content).
// Bug fix: Anique subtitle + challenge copy; scroll target #read-more for Lees verder.
// Bug fix: Anique photo updated to anique-foto.png (replaces anique-werktelefoon.png).
// Bug fix: renamed GuerrillaFollow → GuerillaFollow (brand spelling: Guerilla, not Guerrilla).
import Image from "next/image";
import { ContentScrollLink } from "./ContentScrollLink";
import { OutlineButton } from "./OutlineButton";
import { READ_MORE_SECTION_ID } from "./ReadMoreButton";

const ANIQUE_LINKEDIN_URL = "https://www.linkedin.com/in/aniquewijnhoud/";

export function GuerillaFollow() {
  return (
    <section
      id={READ_MORE_SECTION_ID}
      className="mt-10 scroll-mt-8 border-t border-black/10 pt-10 sm:scroll-mt-10"
    >
      <h2 className="font-[family-name:var(--font-newake)] text-2xl uppercase tracking-wide text-[var(--text)] sm:text-3xl">
        VOLG DE GUERILLA
      </h2>
      <p className="mt-3 font-[family-name:var(--font-indivisible)] text-base font-semibold sm:text-lg">
        Daar deel ik 2 keer per dag updates.
      </p>

      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
        <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36">
          <Image
            src="/anique-foto.png"
            alt="Anique Wijnhoud met de Werktelefoon"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 112px, 144px"
          />
        </div>
        <div className="text-center sm:text-left">
          <p
            className="font-[family-name:var(--font-handwritten)] text-3xl leading-none text-[var(--text)] sm:text-4xl md:text-5xl"
            aria-label="Anique Wijnhoud"
          >
            Anique Wijnhoud
          </p>
          <p className="mt-2 font-[family-name:var(--font-indivisible)] text-base font-semibold text-[var(--text)] sm:text-lg">
            Initiatiefnemer De Werktelefoon
          </p>
        </div>
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
        Je zet samen met ons de lijnen open door dit met één of twee mensen of in
        een groep te delen.
      </p>
      <p className="mt-3 font-[family-name:var(--font-indivisible)] text-base font-semibold leading-relaxed sm:text-lg">
        Om het jou makkelijk te maken hebben we <ContentScrollLink />, afbeeldingen
        en posters voor je klaarstaan die je op social media kunt delen.
      </p>
      <p className="mt-3 font-[family-name:var(--font-indivisible)] text-base font-semibold leading-relaxed sm:text-lg">
        De 10 werkenden en organisaties die - zodra 100.000 werkveranderaars zich
        hebben aangesloten - de meeste mensen in beweging hebben gebracht, krijgen
        levenslang de titel van Founding Partner van De Werktelefoon.
      </p>
    </section>
  );
}
