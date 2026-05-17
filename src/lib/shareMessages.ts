// Bug fix: share link uses campaign rebrand URL, not window.location (localhost in dev).
// Update: IG/TikTok/Snap, LinkedIn en Slack/Teams copy-paste teksten (guerrilla-campagne).
// Share copy for social buttons; site URL injected at runtime where noted.

/** Link shown in share modals and appended to copied messages. */
export const SHARE_SITE_URL = "https://rebrand.ly/nf3lt1y";

const GUERRILLA_URL = "www.werktelefoon.nl/guerilla";

const SOCIAL_HASHTAGS =
  "#werktelefoon #guerrillacampagne #takeover #werkveranderaars #werkveranderaar";

const INSTAGRAM_TIKTOK_SNAP_COPY = `Wanneer voelde jij je voor het laatst écht goed op je werk?
De meeste mensen komen niet verder dan 5%.

Deze week nemen we LinkedIn over. In 7 dagen. Met 100.000 Werkveranderaars. Voor €1,99 doe jij mee.

Link in bio 👉 De Werktelefoon

${SOCIAL_HASHTAGS}`;

const WHATSAPP_SLACK_COPY = `Hey,
een vriendin van mij neemt deze week LinkedIn over met een guerrillacampagne om de Werktelefoon landelijk LIVE te krijgen.
Je kunt mij helpen door dit bericht te delen in één of meerdere van je groepen op WhatsApp, Slack en Teams.`;

const SLACK_TEAMS_COPY = `Hey, ken jij de Werktelefoon al?

Deze week nemen we LinkedIn over om in 7 dagen met 100.000 werkveranderaars de lijnen van De Werktelefoon open te zetten.

Wanneer voelde jij je voor het laatst écht goed op je werk? De meeste mensen komen niet verder dan 5%.

Kan werkend Nederland op jou rekenen? Doe mee voor €1,99.

${GUERRILLA_URL}`;

export function getWhatsAppShareMessage(siteUrl: string): string {
  return `${WHATSAPP_SLACK_COPY}\n${siteUrl}`;
}

export function getLinkedInShareMessage(_siteUrl: string): string {
  return `Wanneer voelde jij je dit jaar voor het laatst écht goed op je werk?
De meeste mensen komen niet verder dan 5%.

Daarom doe ik deze week mee aan de guerrilla van De Werktelefoon.
In 7 dagen willen we met 100.000 werkveranderaars de lijnen open zetten.

Voor €1,99 doe jij mee. Minder dan een kop koffie.
Kan werkend Nederland op jou rekenen?

${GUERRILLA_URL}`;
}

export function getInstagramShareMessage(_siteUrl: string): string {
  return INSTAGRAM_TIKTOK_SNAP_COPY;
}

export const getTikTokShareMessage = getInstagramShareMessage;

export function getSnapchatShareMessage(_siteUrl: string): string {
  return INSTAGRAM_TIKTOK_SNAP_COPY;
}

export function getSlackTeamsShareMessage(_siteUrl: string): string {
  return SLACK_TEAMS_COPY;
}

export const WHATSAPP_WEB_URL = "https://web.whatsapp.com/";
export const LINKEDIN_WEB_URL = "https://www.linkedin.com/feed/";
export const INSTAGRAM_WEB_URL = "https://www.instagram.com/";
export const TIKTOK_WEB_URL = "https://www.tiktok.com/";
export const SNAPCHAT_WEB_URL = "https://www.snapchat.com/";
export const SLACK_WEB_URL = "https://app.slack.com/client";
export const TEAMS_WEB_URL = "https://teams.microsoft.com/";
