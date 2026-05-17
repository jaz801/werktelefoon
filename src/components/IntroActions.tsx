// Bug fix: layout — rendered below SocialButtons row (was under intro copy).
// Bug fix: removed Deel via WhatsApp from intro; only werktelefoon.nl CTA remains.
import { OutlineButton } from "./OutlineButton";

const WERKTELEFOON_URL = "https://www.werktelefoon.nl/";

export function IntroActions() {
  return (
    <div className="mt-6 flex justify-center px-4 pb-4">
      <OutlineButton
        href={WERKTELEFOON_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-md font-[family-name:var(--font-indivisible)] sm:w-auto"
      >
        Wat is de Werktelefoon?
      </OutlineButton>
    </div>
  );
}
