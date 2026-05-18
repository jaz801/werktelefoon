// Bug fix: share section — upload left, fanned pink / yellow / blue (video) cards right.
// Bug fix: #share-content scroll target for animated "content" link in intro copy.
// Bug fix: SiteFooter at bottom with contact details and social links.
import { IntroSection } from "@/components/IntroSection";
import { ShareContentGrid } from "@/components/ShareContentGrid";
import { SiteFooter } from "@/components/SiteFooter";
import { SocialButtons } from "@/components/SocialButtons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden">
      <IntroSection />
      <section
        id="share-content"
        className="flex w-full scroll-mt-6 flex-col items-center justify-center gap-8 px-3 py-6 sm:scroll-mt-8 sm:px-4 md:py-10"
      >
        <ShareContentGrid />
        <SocialButtons />
      </section>
      <SiteFooter />
    </main>
  );
}
