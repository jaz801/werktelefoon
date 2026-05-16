// Thin wrapper — use PlatformShareModal for WhatsApp share flow.
"use client";

import { PlatformShareModal } from "./PlatformShareModal";

type WhatsAppShareModalProps = {
  onClose: () => void;
};

export function WhatsAppShareModal({ onClose }: WhatsAppShareModalProps) {
  return <PlatformShareModal platform="whatsapp" onClose={onClose} />;
}
