// Bug fix: header stacks on mobile so donate CTA does not overlap logo.
// Logo links to werktelefoon.nl; donate CTA top-right on md+.
import Image from "next/image";
import { OutlineButton } from "./OutlineButton";

const SITE_URL = "https://www.werktelefoon.nl/";
const CHECKOUT_URL =
  "https://werktelefoonbywerklef.plugandpay.com/checkout/help-mee";

export function Header() {
  return (
    <header className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-4 sm:py-6 md:block">
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--text)]"
        aria-label="Ga naar De Werktelefoon website"
      >
        <Image
          src="/logo.svg"
          alt="De Werktelefoon"
          width={280}
          height={96}
          priority
          className="h-auto w-[min(280px,70vw)]"
        />
      </a>
      <OutlineButton
        id="donate-cta"
        href={CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-xs font-[family-name:var(--font-indivisible)] text-base sm:max-w-sm md:absolute md:right-4 md:top-6 md:w-auto"
      >
        doneer €1,99
      </OutlineButton>
    </header>
  );
}
