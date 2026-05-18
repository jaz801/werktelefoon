// Bug fix: social links use icon buttons (Instagram + LinkedIn) with correct profile URLs.
import Image from "next/image";
import Link from "next/link";

const SITE_URL = "https://www.werktelefoon.nl/";

const PHONE_DISPLAY = "085 – 124 7592";
const PHONE_HREF = "tel:+31851247592";
const EMAIL = "info@werktelefoon.nl";
const ADDRESS = "Gonnetstraat 26, 2011 KA Haarlem";

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/dewerktelefoon/",
    label: "Instagram",
    icon: "/footer/instagram.png",
  },
  {
    href: "https://www.linkedin.com/company/dewerktelefoon/",
    label: "LinkedIn",
    icon: "/footer/linkedin.png",
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full bg-[var(--green)] text-[var(--text)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-12">
        <Link
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--text)]"
          aria-label="Ga naar De Werktelefoon website"
        >
          <Image
            src="/logo.svg"
            alt="De Werktelefoon"
            width={200}
            height={69}
            className="h-auto w-[min(160px,40vw)] sm:w-[180px]"
          />
        </Link>

        <address className="flex flex-col items-start gap-1 not-italic sm:flex-1 sm:px-4">
          <Link
            href={PHONE_HREF}
            className="text-base font-semibold underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)]"
          >
            {PHONE_DISPLAY}
          </Link>
          <Link
            href={`mailto:${EMAIL}`}
            className="text-base font-semibold underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)]"
          >
            {EMAIL}
          </Link>
          <p className="text-base font-semibold">{ADDRESS}</p>
        </address>

        <nav aria-label="Social media" className="flex shrink-0 items-center gap-3 self-start sm:self-center">
          {SOCIAL_LINKS.map(({ href, label, icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} — De Werktelefoon`}
              className="relative block size-11 overflow-hidden rounded-full transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)] sm:size-12"
            >
              <Image
                src={icon}
                alt=""
                width={48}
                height={48}
                className="size-full object-cover"
              />
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
