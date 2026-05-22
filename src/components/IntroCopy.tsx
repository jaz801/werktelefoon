// Bug fix: intro copy — socials campaign narrative; 100.000 in Newake display; Ik ben erbij CTA.
// Recurring: Indivisible is single-weight — font-bold on stats does not stand out; use Newake + scale.
// Update: eerlijk-op-werk narrative + €1,99 community; copy gedeeld met shareMessages.
import { GuerillaFollow } from "./GuerillaFollow";
import { ReadMoreButton } from "./ReadMoreButton";
import {
  BELIEF_CTA_COPY,
  CLOSING_COPY,
  COMMUNITY_COPY,
  LAUNCH_COPY,
  MOVEMENT_AFTER_STAT,
  MOVEMENT_BEFORE_STAT,
  NETWORK_ASK_COPY,
  OPENING_COPY,
  SILENCE_COPY,
  WORK_STRUGGLES_COPY,
} from "@/lib/shareMessages";

const introStatClass =
  "font-[family-name:var(--font-newake)] text-[1.45em] font-normal leading-none tracking-wide sm:text-[1.55em] md:text-[1.65em]";

export function IntroCopy() {
  return (
    <div
      id="intro-copy"
      className="relative z-10 mx-auto w-full max-w-2xl px-3 pb-6 pt-8 text-center font-[family-name:var(--font-indivisible)] text-base font-semibold leading-relaxed text-[var(--text)] sm:max-w-3xl sm:px-4 sm:pt-12 sm:text-lg md:pt-14 md:text-xl lg:max-w-4xl"
    >
      <p>{OPENING_COPY}</p>
      <p className="mt-3">{WORK_STRUGGLES_COPY}</p>
      <p className="mt-3">{SILENCE_COPY}</p>
      <p className="mt-3">{LAUNCH_COPY}</p>
      <p className="mt-3">{COMMUNITY_COPY}</p>
      <p className="mt-3">
        {MOVEMENT_BEFORE_STAT}{" "}
        <span className={introStatClass}>100.000</span> {MOVEMENT_AFTER_STAT}
      </p>
      <p className="mt-3">{BELIEF_CTA_COPY}</p>
      <p className="mt-3">{NETWORK_ASK_COPY}</p>
      <p className="mt-3">{CLOSING_COPY}</p>
      <ReadMoreButton />
      <GuerillaFollow />
    </div>
  );
}
