// Bug fix: intro copy — socials campaign narrative; 5% + 100.000 in Newake display; Ik ben erbij CTA.
// Recurring: Indivisible is single-weight — font-bold on stats does not stand out; use Newake + scale.
// Update: netwerk-CTA (zelfde copy als share-berichten) i.p.v. oude content-zinnen.
import { GuerillaFollow } from "./GuerillaFollow";
import { ReadMoreButton } from "./ReadMoreButton";
import { NETWORK_ASK_LINE_1, NETWORK_ASK_LINE_2 } from "@/lib/shareMessages";

const introStatClass =
  "font-[family-name:var(--font-newake)] text-[1.45em] font-normal leading-none tracking-wide sm:text-[1.55em] md:text-[1.65em]";

export function IntroCopy() {
  return (
    <div
      id="intro-copy"
      className="relative z-10 mx-auto w-full max-w-2xl px-3 pb-6 pt-8 text-center font-[family-name:var(--font-indivisible)] text-base font-semibold leading-relaxed text-[var(--text)] sm:max-w-3xl sm:px-4 sm:pt-12 sm:text-lg md:pt-14 md:text-xl lg:max-w-4xl"
    >
      <p>
        Wanneer voelde je je voor het laatst écht goed op je werk? De meeste
        mensen komen niet verder dan <span className={introStatClass}>5%</span>.
      </p>
      <p className="mt-3">
        Moet je nagaan wat er voor onszelf, organisaties en de wereld mogelijk is
        als we dit percentage samen verhogen.
      </p>
      <p className="mt-3">
        Daarom kleuren we deze week de socials. In 7 dagen zetten we samen met{" "}
        <span className={introStatClass}>100.000</span> werkveranderaars de
        lijnen
        van De Werktelefoon open.
      </p>
      <p className="mt-3">
        Als ook jij gelooft dat werk anders kan, wil je hier bij zijn!
      </p>
      <p className="mt-3">{NETWORK_ASK_LINE_1}</p>
      <p className="mt-3">{NETWORK_ASK_LINE_2}</p>
      <ReadMoreButton />
      <GuerillaFollow />
    </div>
  );
}
