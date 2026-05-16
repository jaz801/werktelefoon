// Bug fix: WhatsApp + werktelefoon CTAs; responsive padding for mobile/tablet/desktop.
// Intro copy above the hero images — thanks + ask to pass the word.
import { IntroActions } from "./IntroActions";

export function IntroCopy() {
  return (
    <div
      id="intro-copy"
      className="relative z-10 mx-auto w-full max-w-2xl px-3 pb-6 pt-8 text-center font-[family-name:var(--font-indivisible)] text-base font-semibold leading-relaxed text-[var(--text)] sm:max-w-xl sm:px-4 sm:pr-14 sm:pt-12 sm:text-lg md:pr-16 md:pt-14 md:text-xl"
    >
      <p>
        Dankjewel, dat je ons wilt helpen zonder jullie komen we er niet.
      </p>
      <p className="mt-3">
        Om zoveel mogelijk momemtum te creeeren vragen we jullie om het vuur door te
        geven.
      </p>
      <p className="mt-3">
        Als je een bericht kan sturen naar 1/2 personen of in een groep, ben je
        held/heldin!
      </p>
      <IntroActions />
    </div>
  );
}
