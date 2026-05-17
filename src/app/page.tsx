// Layout: intro copy + photo upload; social buttons + site CTA below.
import { IntroSection } from "@/components/IntroSection";
import { SocialButtons } from "@/components/SocialButtons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden">
      <IntroSection />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-3 py-6 sm:gap-8 sm:px-4 md:py-10">
        <SocialButtons />
      </div>
    </main>
  );
}
