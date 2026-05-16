// Bug fix: Snapchat + Print modals; link copy for IG/TikTok/Snapchat.
"use client";

import { useState } from "react";
import { OutlineButton } from "./OutlineButton";
import { PlatformShareModal, type SharePlatform } from "./PlatformShareModal";
import { PrintShareModal } from "./PrintShareModal";

const PLATFORMS = [
  "WhatsApp",
  "LinkedIn",
  "Slack/Teams",
  "Instagram",
  "Snapchat",
  "TikTok",
  "Print",
] as const;

const PLATFORM_MODAL: Partial<Record<(typeof PLATFORMS)[number], SharePlatform>> =
  {
    WhatsApp: "whatsapp",
    LinkedIn: "linkedin",
    "Slack/Teams": "slack",
    Instagram: "instagram",
    Snapchat: "snapchat",
    TikTok: "tiktok",
  };

export function SocialButtons() {
  const [openPlatform, setOpenPlatform] = useState<SharePlatform | null>(null);
  const [printOpen, setPrintOpen] = useState(false);

  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-2 px-4 pb-2 sm:flex sm:flex-wrap sm:justify-center md:gap-3 lg:pb-4">
        {PLATFORMS.map((label) => {
          const modalKey = PLATFORM_MODAL[label];
          const isPrint = label === "Print";
          return (
            <OutlineButton
              key={label}
              className="w-full px-2 text-base sm:w-auto sm:shrink-0 sm:px-4"
              onClick={
                isPrint
                  ? () => setPrintOpen(true)
                  : modalKey
                    ? () => setOpenPlatform(modalKey)
                    : undefined
              }
            >
              {label}
            </OutlineButton>
          );
        })}
      </section>
      {openPlatform ? (
        <PlatformShareModal
          platform={openPlatform}
          onClose={() => setOpenPlatform(null)}
        />
      ) : null}
      {printOpen ? (
        <PrintShareModal onClose={() => setPrintOpen(false)} />
      ) : null}
    </>
  );
}
