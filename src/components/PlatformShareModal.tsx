// Bug fix: LinkedIn — Banner + GIF download; IG/TikTok/Snap/WA — visual + clip on message step.
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getInstagramShareMessage,
  getLinkedInShareMessage,
  getSlackTeamsShareMessage,
  getSnapchatShareMessage,
  getTikTokShareMessage,
  getWhatsAppShareMessage,
  SHARE_SITE_URL,
  INSTAGRAM_WEB_URL,
  LINKEDIN_WEB_URL,
  SLACK_WEB_URL,
  SNAPCHAT_WEB_URL,
  TEAMS_WEB_URL,
  TIKTOK_WEB_URL,
  WHATSAPP_WEB_URL,
} from "@/lib/shareMessages";
import type { ShareVisualFormat } from "@/lib/shareVisualExport";
import { OutlineButton } from "./OutlineButton";
import { ShareBannerPanel } from "./ShareBannerPanel";
import { ShareClipPanel } from "./ShareClipPanel";
import { ShareGifPanel } from "./ShareGifPanel";
import { ShareVisualPanel } from "./ShareVisualPanel";

export type SharePlatform =
  | "whatsapp"
  | "linkedin"
  | "instagram"
  | "tiktok"
  | "snapchat"
  | "slack";

type PlatformShareModalProps = {
  platform: SharePlatform;
  onClose: () => void;
};

type ModalStep = "message" | "visual" | "clip" | "banner" | "gif";

type OpenAction = { label: string; url: string };

type PlatformConfig = {
  title: string;
  visualTitle: string;
  openActions: OpenAction[];
  hasVisual: boolean;
  hasClip: boolean;
  hasBanner: boolean;
  hasGif: boolean;
  showLinkField: boolean;
  visualFormat?: ShareVisualFormat;
  textareaRows: number;
  getMessage: (siteUrl: string) => string;
};

const PLATFORM_CONFIG: Record<SharePlatform, PlatformConfig> = {
  whatsapp: {
    title: "Deel via WhatsApp",
    visualTitle: "Download visual",
    openActions: [{ label: "Open WhatsApp", url: WHATSAPP_WEB_URL }],
    hasVisual: true,
    hasClip: true,
    hasBanner: false,
    hasGif: false,
    showLinkField: false,
    visualFormat: "whatsapp",
    textareaRows: 9,
    getMessage: getWhatsAppShareMessage,
  },
  linkedin: {
    title: "Deel via LinkedIn",
    visualTitle: "Download visual",
    openActions: [{ label: "Open LinkedIn", url: LINKEDIN_WEB_URL }],
    hasVisual: true,
    hasClip: true,
    hasBanner: true,
    hasGif: true,
    showLinkField: false,
    visualFormat: "linkedin",
    textareaRows: 14,
    getMessage: getLinkedInShareMessage,
  },
  instagram: {
    title: "Deel via Instagram",
    visualTitle: "Download visual",
    openActions: [{ label: "Open Instagram", url: INSTAGRAM_WEB_URL }],
    hasVisual: true,
    hasClip: true,
    hasBanner: false,
    hasGif: false,
    showLinkField: true,
    visualFormat: "instagram",
    textareaRows: 10,
    getMessage: getInstagramShareMessage,
  },
  tiktok: {
    title: "Deel via TikTok",
    visualTitle: "Download visual",
    openActions: [{ label: "Open TikTok", url: TIKTOK_WEB_URL }],
    hasVisual: true,
    hasClip: true,
    hasBanner: false,
    hasGif: false,
    showLinkField: true,
    visualFormat: "tiktok",
    textareaRows: 10,
    getMessage: getTikTokShareMessage,
  },
  snapchat: {
    title: "Deel via Snapchat",
    visualTitle: "Download visual",
    openActions: [{ label: "Open Snapchat", url: SNAPCHAT_WEB_URL }],
    hasVisual: true,
    hasClip: true,
    hasBanner: false,
    hasGif: false,
    showLinkField: true,
    visualFormat: "instagram",
    textareaRows: 10,
    getMessage: getSnapchatShareMessage,
  },
  slack: {
    title: "Deel via Slack / Teams",
    visualTitle: "Download visual",
    openActions: [
      { label: "Open Slack", url: SLACK_WEB_URL },
      { label: "Open Teams", url: TEAMS_WEB_URL },
    ],
    hasVisual: false,
    hasClip: false,
    hasBanner: false,
    hasGif: false,
    showLinkField: false,
    textareaRows: 9,
    getMessage: getSlackTeamsShareMessage,
  },
};

function getShareDownloadGridClass(config: PlatformConfig): string {
  const count =
    1 +
    (config.hasClip ? 1 : 0) +
    (config.hasBanner ? 1 : 0) +
    (config.hasGif ? 1 : 0);
  if (count >= 4) return "grid-cols-2 sm:grid-cols-4";
  if (count === 3) return "grid-cols-3";
  if (count === 2) return "grid-cols-2";
  return "grid-cols-1";
}

export function PlatformShareModal({
  platform,
  onClose,
}: PlatformShareModalProps) {
  const config = PLATFORM_CONFIG[platform];
  const [step, setStep] = useState<ModalStep>("message");
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const message = useMemo(
    () => config.getMessage(SHARE_SITE_URL),
    [config],
  );

  const copyToClipboard = useCallback(async (text: string, which: "text" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    if (which === "text") {
      setCopiedText(true);
      window.setTimeout(() => setCopiedText(false), 2000);
    } else {
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2000);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (
        step === "visual" ||
        step === "clip" ||
        step === "banner" ||
        step === "gif"
      )
        setStep("message");
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, onClose]);

  const title =
    step === "message"
      ? config.title
      : step === "clip"
        ? "Download clip"
        : step === "banner"
          ? "Download banner"
          : step === "gif"
            ? "Download GIF"
            : config.visualTitle;
  const dialogId = `${platform}-share-title`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={dialogId}
      onClick={onClose}
    >
      <div
        className={`flex max-h-[min(92dvh,90vh)] w-full max-w-[100vw] flex-col gap-4 overflow-y-auto rounded-t-3xl border-2 border-black bg-[var(--bg)] p-4 shadow-lg sm:max-h-[90vh] sm:max-w-lg sm:rounded-3xl sm:p-6 ${
          step === "visual" ||
          step === "clip" ||
          step === "banner" ||
          step === "gif"
            ? "md:max-w-xl"
            : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            id={dialogId}
            className="font-[family-name:var(--font-newake)] text-xl text-[var(--text)] sm:text-2xl"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="shrink-0 rounded-full border-2 border-black px-3 py-1 font-[family-name:var(--font-indivisible)] text-lg leading-none hover:bg-black/5"
          >
            ×
          </button>
        </div>

        {step === "message" ? (
          <>
            <textarea
              readOnly
              value={message}
              rows={config.textareaRows}
              className="w-full resize-none rounded-2xl border-2 border-black bg-white px-4 py-3 font-[family-name:var(--font-indivisible)] text-base leading-relaxed text-[var(--text)] outline-none focus:ring-2 focus:ring-black/20"
            />

            {config.showLinkField ? (
              <div className="flex flex-col gap-2">
                <label className="font-[family-name:var(--font-indivisible)] text-sm font-semibold text-[var(--text)]">
                  Link
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    readOnly
                    value={SHARE_SITE_URL}
                    className="min-w-0 flex-1 rounded-2xl border-2 border-black bg-white px-4 py-2 font-[family-name:var(--font-indivisible)] text-base text-[var(--text)] outline-none"
                  />
                  <OutlineButton
                    type="button"
                    onClick={() => void copyToClipboard(SHARE_SITE_URL, "link")}
                    className="shrink-0 whitespace-nowrap"
                  >
                    {copiedLink ? "Gekopieerd!" : "Kopieer link"}
                  </OutlineButton>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <OutlineButton
                type="button"
                onClick={() => void copyToClipboard(message, "text")}
                disabled={!message}
                className="w-full sm:flex-1"
              >
                {copiedText ? "Gekopieerd!" : "Kopieer tekst"}
              </OutlineButton>
              {config.openActions.map((action) => (
                <OutlineButton
                  key={action.url}
                  type="button"
                  onClick={() =>
                    window.open(action.url, "_blank", "noopener,noreferrer")
                  }
                  disabled={!message}
                  className="w-full sm:flex-1"
                >
                  {action.label}
                </OutlineButton>
              ))}
              {config.hasVisual && config.visualFormat ? (
                <div
                  className={`grid w-full gap-3 ${getShareDownloadGridClass(config)}`}
                >
                  <OutlineButton
                    type="button"
                    onClick={() => setStep("visual")}
                    className="w-full"
                  >
                    Download visual
                  </OutlineButton>
                  {config.hasClip ? (
                    <OutlineButton
                      type="button"
                      onClick={() => setStep("clip")}
                      className="w-full"
                    >
                      Download clip
                    </OutlineButton>
                  ) : null}
                  {config.hasBanner ? (
                    <OutlineButton
                      type="button"
                      onClick={() => setStep("banner")}
                      className="w-full"
                    >
                      Banner
                    </OutlineButton>
                  ) : null}
                  {config.hasGif ? (
                    <OutlineButton
                      type="button"
                      onClick={() => setStep("gif")}
                      className="w-full"
                    >
                      GIF
                    </OutlineButton>
                  ) : null}
                </div>
              ) : null}
            </div>
          </>
        ) : step === "clip" && config.visualFormat ? (
          <ShareClipPanel
            format={config.visualFormat}
            onBack={() => setStep("message")}
          />
        ) : step === "banner" ? (
          <ShareBannerPanel onBack={() => setStep("message")} />
        ) : step === "gif" ? (
          <ShareGifPanel onBack={() => setStep("message")} />
        ) : step === "visual" && config.visualFormat ? (
          <ShareVisualPanel
            format={config.visualFormat}
            onBack={() => setStep("message")}
          />
        ) : null}
      </div>
    </div>
  );
}
