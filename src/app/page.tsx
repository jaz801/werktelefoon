// Bug fix: N/A — main landing page composing header, hero, and social buttons.
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SocialButtons } from "@/components/SocialButtons";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <SocialButtons />
    </main>
  );
}
