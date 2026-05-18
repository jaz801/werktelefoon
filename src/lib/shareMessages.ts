// Bug fix: share link uses campaign rebrand URL, not window.location (localhost in dev).
// Bug fix: guerrilla → guerilla in all share copy and hashtags (brand spelling).
// Update: IG/TikTok/Snap, LinkedIn en Slack/Teams copy-paste teksten (guerilla-campagne).
// Update: netwerk/content-zinnen in LinkedIn + Slack; €1,99-regels uit alle share-teksten.
// Update: IG/TikTok/Snap — expliciet dat 100k alleen lukt als iedereen deelt in ieders netwerk.
// Update: zachtere netwerk-CTA — jouw netwerk nodig, delen met 1–2 personen of in groep.
// Update: rebrand link → https://rebrand.ly/werktelefoon (all channels + kopieer-link knop).
// Update: “guerilla campagne” formulering (WhatsApp, LinkedIn, Slack/Teams).
// Bug fix: WhatsApp open — web.whatsapp.com on desktop; whatsapp:// on mobile portrait (native app only).
// Update: ease-zin (voorgeschreven berichten + content) in alle share-teksten.
// Update: campagne-copy — “hoeveel procent dit jaar”, Werktelefoon-tagline, socials-narratief (geen guerilla-framing).
// Share copy for social buttons; site URL injected at runtime where noted.

/** Link shown in share modals and appended to copied messages. */
export const SHARE_SITE_URL = "https://rebrand.ly/werktelefoon";

const SOCIAL_HASHTAGS =
  "#werktelefoon #guerillacampagne #takeover #werkveranderaars #werkveranderaar";

export const OPENING_BEFORE_STAT =
  "Hoeveel procent van de tijd voelde je je dit jaar écht goed op je werk?";

export const OPENING_STAT_LEAD = "De meeste mensen komen niet verder dan";

export const POSSIBILITY_COPY =
  "Moet je nagaan wat er voor onszelf, organisaties en de wereld mogelijk is als we dit percentage samen verhogen.";

export const CAMPAIGN_BEFORE_STAT =
  "Daarom kleuren we deze week de socials. In 7 dagen zetten we samen met";

export const CAMPAIGN_AFTER_STAT =
  "werkveranderaars de lijnen van De Werktelefoon open.";

export const WERKTELEFOON_TAGLINE =
  "De Werktelefoon is een onafhankelijke plek voor iedereen die werkt, waar je altijd terecht kan.";

export const BELIEF_CTA_COPY =
  "Als ook jij gelooft dat werk anders kan, wil je hier bij zijn.";

export const CORE_OPENING = `${OPENING_BEFORE_STAT} ${OPENING_STAT_LEAD} 5%.`;

export const CORE_CAMPAIGN = `${CAMPAIGN_BEFORE_STAT} 100.000 ${CAMPAIGN_AFTER_STAT} ${WERKTELEFOON_TAGLINE}`;

const CORE_NARRATIVE = `${CORE_OPENING}

${POSSIBILITY_COPY}

${CORE_CAMPAIGN}

${BELIEF_CTA_COPY}`;

export const NETWORK_ASK_LINE_1 =
  "Om dit te halen hebben we jouw netwerk nodig.";

export const NETWORK_ASK_LINE_2 =
  "Als jij dit kunt delen met 1 of 2 personen, of in een groep, help je ons enorm.";

export const SHARE_EASE_COPY =
  "Om het jou zo makkelijk mogelijk te maken hebben we op de website voorgeschreven berichten en content gemaakt.";

const NETWORK_ASK_COPY = `${NETWORK_ASK_LINE_1}

${NETWORK_ASK_LINE_2}

${SHARE_EASE_COPY}`;

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
