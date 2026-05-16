// Bug fix: N/A — centered logo with donate CTA top-right.
import Image from "next/image";
import { OutlineButton } from "./OutlineButton";

const CHECKOUT_URL =
  "https://werktelefoonbywerklef.plugandpay.com/checkout/help-mee";

export function Header() {
  return (
    <header className="relative mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-6">
      <Image
        src="/logo.svg"
        alt="De Werktelefoon"
        width={280}
        height={96}
        priority
        className="h-auto w-[min(280px,70vw)]"
      />
      <OutlineButton
        href={CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 top-6 font-[family-name:var(--font-indivisible)]"
      >
        doneer €1,99
      </OutlineButton>
    </header>
  );
}
