// Bug fix: mobile portrait — doneer CTA under logo; sm+ keeps logo centered with CTA top-right.
// Logo links to werktelefoon.nl; donate CTA.
import Image from "next/image";
import { OutlineButton } from "./OutlineButton";

const SITE_URL = "https://www.werktelefoon.nl/";
const CHECKOUT_URL =
  "https://werktelefoonbywerklef.plugandpay.com/checkout/help-mee";

export function Header() {
  return (
    <header className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-3 py-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-2 sm:px-4 sm:py-6">
      <div aria-hidden className="hidden min-w-0 sm:block" />
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block justify-self-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--text)]"
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
      <div className="flex w-full justify-center sm:min-w-0 sm:justify-end">
        <OutlineButton
          id="donate-cta"
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3 text-base sm:px-5 sm:text-lg"
        >
          doneer €1,99
        </OutlineButton>
      </div>
    </header>
  );
}
