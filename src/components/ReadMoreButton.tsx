// Bug fix: intro "Ik ben erbij" opens Plug&Pay checkout (was Lees verder / #read-more scroll).
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
        aria-label="Ik ben erbij en word werkveranderaar"
      >
        Ik ben erbij →
      </OutlineButton>
    </div>
  );
}
