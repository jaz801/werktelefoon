// Bug fix: removed helper descriptions; link copy for IG/TikTok/Snapchat; Snapchat modal added.
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getInstagramShareMessage,
  getLinkedInShareMessage,
  getSlackTeamsShareMessage,
  getSnapchatShareMessage,
  getTikTokShareMessage,
  getWhatsAppShareMessage,
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

type ModalStep = "message" | "visual";

type OpenAction = { label: string; url: string };

type PlatformConfig = {
  title: string;
  visualTitle: string;
  openActions: OpenAction[];
  hasVisual: boolean;
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
    showLinkField: false,
    textareaRows: 9,
    getMessage: getSlackTeamsShareMessage,
  },
};

export function PlatformShareModal({
  platform,
  onClose,
}: PlatformShareModalProps) {
  const config = PLATFORM_CONFIG[platform];
  const [step, setStep] = useState<ModalStep>("message");
  const [siteUrl, setSiteUrl] = useState("");
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setSiteUrl(window.location.href);
  }, []);

  const message = useMemo(() => {
    if (!siteUrl) return "";
    return config.getMessage(siteUrl);
  }, [siteUrl, config]);

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
      if (step === "visual") setStep("message");
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, onClose]);

  const title = step === "message" ? config.title : config.visualTitle;
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
          step === "visual" ? "md:max-w-xl" : ""
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

            {config.showLinkField && siteUrl ? (
              <div className="flex flex-col gap-2">
                <label className="font-[family-name:var(--font-indivisible)] text-sm font-semibold text-[var(--text)]">
                  Link
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    readOnly
                    value={siteUrl}
                    className="min-w-0 flex-1 rounded-2xl border-2 border-black bg-white px-4 py-2 font-[family-name:var(--font-indivisible)] text-base text-[var(--text)] outline-none"
                  />
                  <OutlineButton
                    type="button"
                    onClick={() => void copyToClipboard(siteUrl, "link")}
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
                <OutlineButton
                  type="button"
                  onClick={() => setStep("visual")}
                  className="w-full"
                >
                  Download visual
                </OutlineButton>
              ) : null}
            </div>
          </>
        ) : config.visualFormat ? (
          <ShareVisualPanel
            format={config.visualFormat}
            onBack={() => setStep("message")}
          />
        ) : null}
      </div>
    </div>
  );
}
