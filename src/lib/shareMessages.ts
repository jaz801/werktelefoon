// Bug fix: share link uses campaign rebrand URL, not window.location (localhost in dev).
// Bug fix: guerrilla → guerilla in all share copy and hashtags (brand spelling).
// Update: IG/TikTok/Snap, LinkedIn en Slack/Teams copy-paste teksten (guerilla-campagne).
// Update: rebrand link → https://rebrand.ly/werktelefoon (all channels + kopieer-link knop).
// Update: “guerilla campagne” formulering (WhatsApp, LinkedIn, Slack/Teams).
// Bug fix: WhatsApp open — web.whatsapp.com on desktop; whatsapp:// on mobile portrait (native app only).
// Update: campagne-copy — eerlijk op werk, €1,99 community, 100k naar overheid, socials-narratief.
// Share copy for social buttons; site URL injected at runtime where noted.

/** Link shown in share modals and appended to copied messages. */
export const SHARE_SITE_URL = "https://rebrand.ly/werktelefoon";

const SOCIAL_HASHTAGS =
  "#werktelefoon #guerillacampagne #takeover #werkveranderaars #werkveranderaar";

export const BRAND_TITLE = "De Werktelefoon";

export const OPENING_COPY = "Hoe gaat het écht met je op het werk?";

export const WORK_STRUGGLES_COPY =
  "Je salaris zit je dwars maar je durft het niet te zeggen. Je ervaart stress maar noemt het gewoon druk. Je kan jezelf niet zijn maar doet alsof het gaat.";

export const SILENCE_COPY =
  "De meeste mensen zwijgen. Uit schaamte. Of uit angst voor hun baan.";

export const LAUNCH_COPY =
  "Daarom openen we De Werktelefoon. Een onafhankelijke, anonieme plek waar je eerlijk terecht kunt. Voordat het te laat is.";

export const COMMUNITY_COPY =
  "Voor €1,99 word je onderdeel van de Werkveranderaar community. Jij bent er als eerste bij en helpt bepalen hoe de Werktelefoon eruitziet voor de rest van Nederland.";

export const MOVEMENT_BEFORE_STAT = "Met";

export const MOVEMENT_AFTER_STAT =
  "werkveranderaars hebben we genoeg om de lijnen echt open te gooien én naar de overheid te gaan. Zonder investeerders.";

export const BELIEF_CTA_COPY = "Geloof jij dat werk écht anders kan?";

export const NETWORK_ASK_COPY =
  "Deel dit met 1 of 2 mensen. Link op onze website.";

export const CLOSING_COPY = "Laten we het samen mogelijk maken.";

export const CORE_MOVEMENT = `${MOVEMENT_BEFORE_STAT} 100.000 ${MOVEMENT_AFTER_STAT}`;

const CORE_NARRATIVE = `${BRAND_TITLE}

${OPENING_COPY}

${WORK_STRUGGLES_COPY}

${SILENCE_COPY}

${LAUNCH_COPY}

${COMMUNITY_COPY}

${CORE_MOVEMENT}

${BELIEF_CTA_COPY}`;

const SHARE_ASK_COPY = `${NETWORK_ASK_COPY}

${CLOSING_COPY}`;

const INSTAGRAM_TIKTOK_SNAP_COPY = `${CORE_NARRATIVE}

${SHARE_ASK_COPY}

Link in bio 👉 De Werktelefoon

${SOCIAL_HASHTAGS}`;

const WHATSAPP_COPY = `Hey!

${CORE_NARRATIVE}

${SHARE_ASK_COPY}`;

const SLACK_TEAMS_COPY = `Hey, ken jij De Werktelefoon al?

${CORE_NARRATIVE}

${SHARE_ASK_COPY}`;

export function getWhatsAppShareMessage(siteUrl: string): string {
  return `${WHATSAPP_COPY}\n\n${siteUrl}`;
}

export function getLinkedInShareMessage(siteUrl: string): string {
  return `${CORE_NARRATIVE}

${SHARE_ASK_COPY}

${siteUrl}`;
}

export function getInstagramShareMessage(_siteUrl: string): string {
  return INSTAGRAM_TIKTOK_SNAP_COPY;
}

export const getTikTokShareMessage = getInstagramShareMessage;

export function getSnapchatShareMessage(_siteUrl: string): string {
  return INSTAGRAM_TIKTOK_SNAP_COPY;
}

export function getSlackTeamsShareMessage(siteUrl: string): string {
  return `${SLACK_TEAMS_COPY}\n\n${siteUrl}`;
}

export const WHATSAPP_WEB_URL = "https://web.whatsapp.com/";
export const WHATSAPP_APP_URL = "whatsapp://";

function isMobilePortraitViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(
    "(max-width: 768px) and (orientation: portrait)",
  ).matches;
}

/** Desktop: web client in new tab; mobile portrait: native app via custom URL scheme. */
export function openWhatsApp(): void {
  if (typeof window === "undefined") return;
  if (isMobilePortraitViewport()) {
    window.location.href = WHATSAPP_APP_URL;
    return;
  }
  window.open(WHATSAPP_WEB_URL, "_blank", "noopener,noreferrer");
}
export const LINKEDIN_WEB_URL = "https://www.linkedin.com/feed/";
export const INSTAGRAM_WEB_URL = "https://www.instagram.com/";
export const TIKTOK_WEB_URL = "https://www.tiktok.com/";
export const SNAPCHAT_WEB_URL = "https://www.snapchat.com/";
export const SLACK_WEB_URL = "https://app.slack.com/client";
export const TEAMS_WEB_URL = "https://teams.microsoft.com/";
