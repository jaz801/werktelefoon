// Bug fix: share link uses campaign rebrand URL, not window.location (localhost in dev).
// Share copy for social buttons; site URL injected at runtime where noted.

/** Link shown in share modals and appended to copied messages. */
export const SHARE_SITE_URL = "https://rebrand.ly/nf3lt1y";
const SOCIAL_HASHTAG_COPY = `Hey,
een vriendin van mij neemt deze week LinkedIn over met een guerrillacampagne om @Werktelefoon landelijk LIVE te krijgen.
Je kunt mij helpen door dit bericht te delen in één of meerdere van je groepen op WhatsApp, Slack en Teams. #werktelefoon #guerrillacampagne #takeover #werkveranderaars #werkveranderaar`;

const WHATSAPP_SLACK_COPY = `Hey,
een vriendin van mij neemt deze week LinkedIn over met een guerrillacampagne om de Werktelefoon landelijk LIVE te krijgen.
Je kunt mij helpen door dit bericht te delen in één of meerdere van je groepen op WhatsApp, Slack en Teams.`;

export function getWhatsAppShareMessage(siteUrl: string): string {
  return `${WHATSAPP_SLACK_COPY}\n${siteUrl}`;
}

export function getLinkedInShareMessage(siteUrl: string): string {
  return `Bijna 1 op de 6 werknemers geeft aan stressvol werk te hebben.
Geef werkend Nederland steun en help mee om de Werktelefoon landelijk LIVE te krijgen.

Hoe kun je meehelpen?

Deel dit bericht in je netwerk en doneer.

Het doel is heel Nederland over te nemen met een guerrillacampagne. Als je dit bericht kunt delen met één of twee personen of in een groep, ben je een held/heldin!

${siteUrl}`;
}

export function getInstagramShareMessage(siteUrl: string): string {
  return `${SOCIAL_HASHTAG_COPY}\n\n${siteUrl}`;
}

export const getTikTokShareMessage = getInstagramShareMessage;

export function getSnapchatShareMessage(siteUrl: string): string {
  return `${SOCIAL_HASHTAG_COPY}\n\n${siteUrl}`;
}

export function getSlackTeamsShareMessage(siteUrl: string): string {
  return `${WHATSAPP_SLACK_COPY}\n${siteUrl}`;
}

export const WHATSAPP_WEB_URL = "https://web.whatsapp.com/";
export const LINKEDIN_WEB_URL = "https://www.linkedin.com/feed/";
export const INSTAGRAM_WEB_URL = "https://www.instagram.com/";
export const TIKTOK_WEB_URL = "https://www.tiktok.com/";
export const SNAPCHAT_WEB_URL = "https://www.snapchat.com/";
export const SLACK_WEB_URL = "https://app.slack.com/client";
export const TEAMS_WEB_URL = "https://teams.microsoft.com/";
