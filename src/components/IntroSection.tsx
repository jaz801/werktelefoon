// Header + intro copy; L-shaped arrow from text up to doneer CTA.
import { DonateArrow } from "./DonateArrow";
import { Header } from "./Header";
import { IntroCopy } from "./IntroCopy";

export function IntroSection() {
  return (
    <div
      id="intro-section"
      className="relative mx-auto w-full max-w-6xl overflow-x-hidden px-3 pb-2 sm:px-4"
    >
      <Header />
      <IntroCopy />
      <DonateArrow />
    </div>
  );
}
