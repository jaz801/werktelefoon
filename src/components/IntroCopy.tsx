// Bug fix: intro copy — socials campaign narrative; 5% + 100.000 in Newake display; Ik ben erbij CTA.
// Recurring: Indivisible is single-weight — font-bold on stats does not stand out; use Newake + scale.
// Update: netwerk-CTA + ease-zin; “content” onderstreept, scroll naar #share-content.
// Update: “hoeveel procent dit jaar” + Werktelefoon-tagline; copy gedeeld met shareMessages.
import { ContentScrollLink } from "./ContentScrollLink";
import { GuerillaFollow } from "./GuerillaFollow";
import { ReadMoreButton } from "./ReadMoreButton";
import {
  BELIEF_CTA_COPY,
  CAMPAIGN_AFTER_STAT,
  CAMPAIGN_BEFORE_STAT,
  NETWORK_ASK_LINE_1,
  NETWORK_ASK_LINE_2,
  OPENING_BEFORE_STAT,
  OPENING_STAT_LEAD,
  POSSIBILITY_COPY,
  WERKTELEFOON_TAGLINE,
} from "@/lib/shareMessages";

const introStatClass =
  "font-[family-name:var(--font-newake)] text-[1.45em] font-normal leading-none tracking-wide sm:text-[1.55em] md:text-[1.65em]";

export function IntroCopy() {
  return (
    <div
      id="intro-copy"
      className="relative z-10 mx-auto w-full max-w-2xl px-3 pb-6 pt-8 text-center font-[family-name:var(--font-indivisible)] text-base font-semibold leading-relaxed text-[var(--text)] sm:max-w-3xl sm:px-4 sm:pt-12 sm:text-lg md:pt-14 md:text-xl lg:max-w-4xl"
    >
      <p>
        {OPENING_BEFORE_STAT} {OPENING_STAT_LEAD}{" "}
        <span className={introStatClass}>5%</span>.
      </p>
      <p className="mt-3">{POSSIBILITY_COPY}</p>
      <p className="mt-3">
        {CAMPAIGN_BEFORE_STAT}{" "}
        <span className={introStatClass}>100.000</span> {CAMPAIGN_AFTER_STAT}{" "}
        {WERKTELEFOON_TAGLINE}
      </p>
      <p className="mt-3">{BELIEF_CTA_COPY}</p>
      <p className="mt-3">{NETWORK_ASK_LINE_1}</p>
      <p className="mt-3">{NETWORK_ASK_LINE_2}</p>
      <p className="mt-3">
        Om het jou zo makkelijk mogelijk te maken hebben we op de website
        voorgeschreven berichten en <ContentScrollLink /> gemaakt.
      </p>
      <ReadMoreButton />
      <GuerillaFollow />
    </div>
  );
}
