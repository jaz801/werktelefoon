// Bug fix: share link uses campaign rebrand URL, not window.location (localhost in dev).
// Bug fix: guerrilla → guerilla in all share copy and hashtags (brand spelling).
// Update: IG/TikTok/Snap, LinkedIn en Slack/Teams copy-paste teksten (guerilla-campagne).
// Update: netwerk/content-zinnen in LinkedIn + Slack; €1,99-regels uit alle share-teksten.
// Update: IG/TikTok/Snap — expliciet dat 100k alleen lukt als iedereen deelt in ieders netwerk.
// Update: zachtere netwerk-CTA — delen met 1–2 mensen.
// Update: rebrand link → https://rebrand.ly/werktelefoon (all channels + kopieer-link knop).
// Update: “guerilla campagne” formulering (WhatsApp, LinkedIn, Slack/Teams).
// Bug fix: WhatsApp open — web.whatsapp.com on desktop; whatsapp:// on mobile portrait (native app only).
// Update: ease-zin (kant-en-klare content) in alle share-teksten.
// Update: campagne-copy — veiligheid op werk, anonieme hulplijn, socials-narratief (geen guerilla-framing).
// Share copy for social buttons; site URL injected at runtime where noted.

/** Link shown in share modals and appended to copied messages. */
export const SHARE_SITE_URL = "https://rebrand.ly/werktelefoon";

const SOCIAL_HASHTAGS =
  "#werktelefoon #guerillacampagne #takeover #werkveranderaars #werkveranderaar";

export const OPENING_COPY = "Hoe veilig voel jij je écht op je werk?";

export const SILENCE_COPY =
  "Veel mensen zwijgen bij HR uit angst voor hun baan of promotie, maar delen dit uit schaamte ook niet met vrienden of familie.";

export const COLLEAGUES_COPY =
  "En dat terwijl je vanaf je 20e tot je pensioen de meeste tijd doorbrengt met collega's.";

export const LAUNCH_COPY =
  "Deze week openen we De Werktelefoon: een onafhankelijke, anonieme hulplijn die je actief advies geeft om dit op te lossen.";

export const CAMPAIGN_BEFORE_STAT = "Samen met";

export const CAMPAIGN_AFTER_STAT = "werkveranderaars kleuren we de socials.";

export const BELIEF_CTA_COPY = "Geloof jij dat werk veiliger kan?";

export const NETWORK_ASK_LINE_1 = "Deel dit bericht met 1 of 2 mensen.";

export const SHARE_EASE_COPY =
  "Op onze website vind je kant-en-klare content.";

export const CLOSING_COPY = "Laten we de werkvloer samen veiliger maken.";

export const CORE_CAMPAIGN = `${CAMPAIGN_BEFORE_STAT} 100.000 ${CAMPAIGN_AFTER_STAT}`;

const CORE_NARRATIVE = `${OPENING_COPY}

${SILENCE_COPY}

${COLLEAGUES_COPY}

${LAUNCH_COPY}

${CORE_CAMPAIGN}

${BELIEF_CTA_COPY}`;

const NETWORK_ASK_COPY = `${NETWORK_ASK_LINE_1}

${SHARE_EASE_COPY}

${CLOSING_COPY}`;

const INSTAGRAM_TIKTOK_SNAP_COPY = `${CORE_NARRATIVE}

${NETWORK_ASK_COPY}

Link in bio 👉 De Werktelefoon

${SOCIAL_HASHTAGS}`;

const WHATSAPP_COPY = `Hey!

${CORE_NARRATIVE}

${NETWORK_ASK_COPY}`;

const SLACK_TEAMS_COPY = `Hey, ken jij De Werktelefoon al?

${CORE_NARRATIVE}

${NETWORK_ASK_COPY}`;

export function getWhatsAppShareMessage(siteUrl: string): string {
  return `${WHATSAPP_COPY}\n\n${siteUrl}`;
}

export function getLinkedInShareMessage(siteUrl: string): string {
  return `${CORE_NARRATIVE}

${NETWORK_ASK_COPY}

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
