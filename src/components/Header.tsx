// Bug fix: mobile portrait — Ik doe mee CTA nudged 30px down (max-sm:portrait:mt-[30px]).
// Bug fix: mobile portrait — logo too large; clamp width + tighter gap/padding below sm.
// Bug fix: donate CTA footnote tooltip below button; room on mobile portrait (DonateCta).
// Logo links to werktelefoon.nl; donate CTA.
import Image from "next/image";
import { DonateCta } from "./DonateCta";

const SITE_URL = "https://www.werktelefoon.nl/";

export function Header() {
  return (
    <header className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-4 overflow-visible px-3 py-3 max-sm:portrait:gap-3 max-sm:portrait:pb-20 max-sm:portrait:pt-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-2 sm:px-4 sm:py-6">
      <div aria-hidden className="hidden min-w-0 sm:block" />
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block max-w-full justify-self-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--text)]"
        aria-label="Ga naar De Werktelefoon website"
      >
        <Image
          src="/logo.svg"
          alt="De Werktelefoon"
          width={280}
          height={96}
          priority
          className="h-auto w-[clamp(140px,48vw,200px)] max-sm:portrait:w-[clamp(130px,44vw,180px)] sm:w-[min(280px,70vw)]"
        />
      </a>
      <div className="flex w-full justify-center overflow-visible max-sm:portrait:mt-[30px] sm:mt-0 sm:min-w-0 sm:justify-end sm:pb-0">
        <DonateCta />
      </div>
    </header>
  );
}
