// Bug fix: share link uses campaign rebrand URL, not window.location (localhost in dev).
// Bug fix: guerrilla → guerilla in all share copy and hashtags (brand spelling).
// Update: IG/TikTok/Snap, LinkedIn en Slack/Teams copy-paste teksten (guerilla-campagne).
// Update: rebrand link → https://rebrand.ly/werktelefoon (all channels + kopieer-link knop).
// Update: “guerilla campagne” formulering (WhatsApp, LinkedIn, Slack/Teams).
// Bug fix: WhatsApp open — web.whatsapp.com on desktop; whatsapp:// on mobile portrait (native app only).
// Update: campagne-copy — eerlijk op werk, €1,99 community, 100k naar overheid, socials-narratief.
// Update: WhatsApp — persoonlijke vraag-copy met {NAAM}, guerilla-campagne en 100k werkveranderaars.
// Update: Slack — zelfde copy als WhatsApp; LinkedIn/IG/TikTok/Snap — werkvloer-narratief + hashtags.
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

function buildSocialShareCopy(siteUrl: string): string {
  return `1 op de 3 werknemers durft zich niet uit te spreken of problemen aan te kaarten op de werkvloer.

Veel mensen zwijgen uit angst voor hun baan of promotie en delen dit ook niet met vrienden of familie uit schaamte.

En dat terwijl je vanaf je 20e tot je pensioen de meeste tijd met collega's doorbrengt. Dat kan anders.

Daarom openen we deze week De Werktelefoon: een onafhankelijke, anonieme hulplijn die je advies en handvatten geeft. In welke fase van je carrière je ook zit.

Om deze hulplijn van de grond te krijgen en zichtbaar te maken voor iedereen die in stilte worstelt, hebben we een flinke beweging nodig. Samen met 100.000 werkveranderaars kleuren we deze week de socials.

Geloof jij ook dat werk veiliger kan?

Deel dit bericht met 1 of 2 mensen in je netwerk. Op onze website vind je kant-en-klare content om direct te delen: ${siteUrl}

Laten we de werkvloer samen veiliger maken!`;
}

function buildInstagramTikTokSnapCopy(siteUrl: string): string {
  return `${buildSocialShareCopy(siteUrl)}

${SOCIAL_HASHTAGS}`;
}

function buildWhatsAppCopy(siteUrl: string): string {
  return `Hey {NAAM}!

Hoe gaat het met je?

Zou je mij kunnen helpen?

Een vriendin van mij, voert een guerrilla-campagne op alle socials, waarbij ik aan de website heb meegewerkt. We openen de lijnen van De Werktelefoon: een onafhankelijke en anonieme hulplijn waar iedereen die werkt altijd terecht kan voor advies.

Dit initiatief is helaas hard nodig.

Maar liefst 40% van de werkenden in Nederland ervaart de psychologische veiligheid als negatief en 1 op de 3 werknemers durft zich niet uit te spreken. Miss nog cijfers over mentale gezondheid?

Om deze hulplijn écht succesvol van de grond te krijgen en zichtbaar te maken voor iedereen die in stilte worstelt, willen we in 7 dagen 100.000 werkveranderaars binnenhalen. Ons doel is om samen een landelijke beweging te starten en de socials te kleuren.

Als ook jij gelooft dat werk veiliger en anders kan, hebben we jouw netwerk nodig om deze impact te maken.

Als jij dit initiatief kunt delen met 1 of 2 personen, of misschien in een groep, help je ons enorm. Om het jou zo makkelijk mogelijk te maken, vind je op de website alles wat je nodig hebt.

${siteUrl}

Alvast super bedankt!`;
}

export function getWhatsAppShareMessage(siteUrl: string): string {
  return buildWhatsAppCopy(siteUrl);
}

export function getLinkedInShareMessage(siteUrl: string): string {
  return buildSocialShareCopy(siteUrl);
}

export function getInstagramShareMessage(siteUrl: string): string {
  return buildInstagramTikTokSnapCopy(siteUrl);
}

export const getTikTokShareMessage = getInstagramShareMessage;

export function getSnapchatShareMessage(siteUrl: string): string {
  return buildInstagramTikTokSnapCopy(siteUrl);
}

export function getSlackTeamsShareMessage(siteUrl: string): string {
  return buildWhatsAppCopy(siteUrl);
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
