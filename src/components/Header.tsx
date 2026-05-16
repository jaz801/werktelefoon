// Bug fix: logo centered via equal side columns; donate in right column (true horizontal center).
// Logo links to werktelefoon.nl; donate CTA top-right.
import Image from "next/image";
import { OutlineButton } from "./OutlineButton";

const SITE_URL = "https://www.werktelefoon.nl/";
const CHECKOUT_URL =
  "https://werktelefoonbywerklef.plugandpay.com/checkout/help-mee";

export function Header() {
  return (
    <header className="relative mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-4 sm:px-4 sm:py-6">
      <div aria-hidden className="min-w-0" />
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
      <div className="flex min-w-0 justify-end">
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
