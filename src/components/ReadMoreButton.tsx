// Bug fix: intro "Lees verder" opens Plug&Pay checkout (was smooth-scroll to #read-more).
"use client";

import { OutlineButton } from "./OutlineButton";

export const READ_MORE_SECTION_ID = "read-more";

const CHECKOUT_URL =
  "https://werktelefoonbywerklef.plugandpay.com/checkout/help-mee";

export function ReadMoreButton() {
  return (
    <div className="mt-8 flex justify-center">
      <OutlineButton
        href={CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-md font-[family-name:var(--font-indivisible)] sm:w-auto"
        aria-label="Lees verder en word werkveranderaar"
      >
        Lees verder →
      </OutlineButton>
    </div>
  );
}
