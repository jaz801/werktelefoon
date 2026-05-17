// Bug fix: overflow visible for header + intro layout.
// Header + intro copy (donate CTA removed from header).
import { Header } from "./Header";
import { IntroCopy } from "./IntroCopy";

export function IntroSection() {
  return (
    <div
      id="intro-section"
      className="relative mx-auto w-full max-w-6xl overflow-visible px-3 pb-2 sm:px-4"
    >
      <Header />
      <IntroCopy />
    </div>
  );
}
