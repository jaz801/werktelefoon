// Bug fix: intro copy — LinkedIn takeover narrative + Lees verder opens checkout.
// Bug fix: removed inline content link; share copy lives in GuerrillaFollow challenge block.
import { GuerrillaFollow } from "./GuerrillaFollow";
import { ReadMoreButton } from "./ReadMoreButton";

export function IntroCopy() {
  return (
    <div
      id="intro-copy"
      className="relative z-10 mx-auto w-full max-w-2xl px-3 pb-6 pt-8 text-center font-[family-name:var(--font-indivisible)] text-base font-semibold leading-relaxed text-[var(--text)] sm:max-w-3xl sm:px-4 sm:pt-12 sm:text-lg md:pt-14 md:text-xl lg:max-w-4xl"
    >
      <p>Wanneer voelde je je voor het laatst écht goed op je werk?</p>
      <p className="mt-3">De meeste mensen komen niet verder dan 5%.</p>
      <p className="mt-3">
        In 2030 valt 1 op de 4 werkenden om. Onder jongeren is dit al realiteit.
      </p>
      <p className="mt-3">
        Daarom nemen we deze week LinkedIn over. In 7 dagen zetten we samen met
        100.000 werkveranderaars de lijnen van De Werktelefoon open. Voor €1,99
        doe jij mee.
      </p>
      <ReadMoreButton />
      <GuerrillaFollow />
    </div>
  );
}
