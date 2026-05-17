// Bug fix: spelling/grammar pass on intro copy (Dank je wel, creëren, kunt, etc.).
// Bug fix: "content" link scrolls to share section with animated underline.
// Bug fix: layout — PhotoCard under challenge; Wat is de Werktelefoon moved below social row.
// Bug fix: intro copy updated — werkend Nederland tone, liefde doorgeven, singular je/jou.
// Intro copy above the hero images — thanks + ask to pass the word.
import { ContentScrollLink } from "./ContentScrollLink";
import { GuerrillaFollow } from "./GuerrillaFollow";

export function IntroCopy() {
  return (
    <div
      id="intro-copy"
      className="relative z-10 mx-auto w-full max-w-2xl px-3 pb-6 pt-8 text-center font-[family-name:var(--font-indivisible)] text-base font-semibold leading-relaxed text-[var(--text)] sm:max-w-3xl sm:px-4 sm:pt-12 sm:text-lg md:pt-14 md:text-xl lg:max-w-4xl"
    >
      <p>
        Dank je wel dat je werkend Nederland wilt helpen. Zonder jou komen we er niet.
      </p>
      <p className="mt-3">
        Om zoveel mogelijk momentum te creëren vragen we je om de liefde deze week
        zoveel mogelijk door te geven.
      </p>
      <p className="mt-3">
        Geweldig als je een bericht kunt sturen naar één of twee personen of in een
        groep.
      </p>
      <p className="mt-3">
        Kan werkend Nederland op jou rekenen?
      </p>
      <p className="mt-3">
        Om het jou makkelijk te maken hebben we <ContentScrollLink />, berichten,
        posts, een plaatje en video voor je klaarstaan die je op social media kunt
        delen.
      </p>
      <GuerrillaFollow />
    </div>
  );
}
