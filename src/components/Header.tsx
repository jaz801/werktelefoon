// Bug fix: removed Ik doe mee donate CTA from header (Lees verder + share flow below intro).
// Bug fix: mobile portrait — logo too large; clamp width + tighter gap/padding below sm.
// Logo links to werktelefoon.nl.
import Image from "next/image";

const SITE_URL = "https://www.werktelefoon.nl/";

export function Header() {
  return (
    <header className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-4 overflow-visible px-3 py-3 max-sm:portrait:gap-3 max-sm:portrait:pt-2 sm:px-4 sm:py-6">
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
    </header>
  );
}
