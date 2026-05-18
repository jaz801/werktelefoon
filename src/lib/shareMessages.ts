// Bug fix: share link uses campaign rebrand URL, not window.location (localhost in dev).
// Bug fix: guerrilla → guerilla in all share copy and hashtags (brand spelling).
// Update: IG/TikTok/Snap, LinkedIn en Slack/Teams copy-paste teksten (guerilla-campagne).
// Update: netwerk/content-zinnen in LinkedIn + Slack; €1,99-regels uit alle share-teksten.
// Update: IG/TikTok/Snap — expliciet dat 100k alleen lukt als iedereen deelt in ieders netwerk.
// Update: zachtere netwerk-CTA — jouw netwerk nodig, delen met 1–2 personen of in groep.
// Update: rebrand link → https://rebrand.ly/werktelefoon (all channels + kopieer-link knop).
// Update: “guerilla campagne” formulering (WhatsApp, LinkedIn, Slack/Teams).
// Bug fix: WhatsApp open link — web.whatsapp.com on desktop; wa.me on mobile portrait (native app).
// Update: ease-zin (voorgeschreven berichten + content) in alle share-teksten.
// Share copy for social buttons; site URL injected at runtime where noted.

/** Link shown in share modals and appended to copied messages. */
export const SHARE_SITE_URL = "https://rebrand.ly/werktelefoon";

const SOCIAL_HASHTAGS =
  "#werktelefoon #guerillacampagne #takeover #werkveranderaars #werkveranderaar";

export const NETWORK_ASK_LINE_1 =
  "Om dit te halen hebben we jouw netwerk nodig.";

export const NETWORK_ASK_LINE_2 =
  "Als jij dit kunt delen met 1 of 2 personen, of in een groep, help je ons enorm.";

export const SHARE_EASE_COPY =
  "Om het jou zo makkelijk mogelijk te maken hebben we op de website voorgeschreven berichten en content gemaakt.";

const NETWORK_ASK_COPY = `${NETWORK_ASK_LINE_1}

${NETWORK_ASK_LINE_2}

${SHARE_EASE_COPY}`;

const INSTAGRAM_TIKTOK_SNAP_COPY = `Wanneer voelde jij je voor het laatst écht goed op je werk?

De meeste mensen haken af bij 5%.

Deze week kleuren we de socials. In 7 dagen zetten 100.000 werkveranderaars de lijnen van De Werktelefoon open.

${NETWORK_ASK_COPY}

Link in bio 👉 De Werktelefoon

${SOCIAL_HASHTAGS}`;

const WHATSAPP_COPY = `Hey!

Deze week doen we een guerilla campagne voor de Werktelefoon: in 7 dagen willen 100.000 werkveranderaars de lijnen openzetten.

${NETWORK_ASK_COPY}`;

const SLACK_TEAMS_COPY = `Hey, ken jij De Werktelefoon al?

Deze week doen we een guerilla campagne voor De Werktelefoon: in 7 dagen willen 100.000 werkveranderaars de lijnen openzetten.

Wanneer voelde jij je voor het laatst écht goed op je werk? De meeste mensen komen niet verder dan 5%.

${NETWORK_ASK_COPY}`;

export function getWhatsAppShareMessage(siteUrl: string): string {
  return `${WHATSAPP_COPY}\n\n${siteUrl}`;
}

export function getLinkedInShareMessage(siteUrl: string): string {
  return `Wanneer voelde jij je dit jaar voor het laatst écht goed op je werk?

De meeste mensen komen niet verder dan 5%.

Daarom doe ik deze week mee aan de guerilla campagne van De Werktelefoon. In 7 dagen willen 100.000 werkveranderaars de lijnen openzetten.

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
export const WHATSAPP_MOBILE_URL = "https://wa.me/";

/** Desktop / landscape: web client; mobile portrait: opens native WhatsApp app. */
export function getWhatsAppOpenUrl(): string {
  if (typeof window === "undefined") return WHATSAPP_WEB_URL;
  const mobilePortrait = window.matchMedia(
    "(max-width: 768px) and (orientation: portrait)",
  ).matches;
  return mobilePortrait ? WHATSAPP_MOBILE_URL : WHATSAPP_WEB_URL;
}
export const LINKEDIN_WEB_URL = "https://www.linkedin.com/feed/";
export const INSTAGRAM_WEB_URL = "https://www.instagram.com/";
export const TIKTOK_WEB_URL = "https://www.tiktok.com/";
export const SNAPCHAT_WEB_URL = "https://www.snapchat.com/";
export const SLACK_WEB_URL = "https://app.slack.com/client";
export const TEAMS_WEB_URL = "https://teams.microsoft.com/";
