// Bug fix: N/A — six social platform outline buttons below hero.
import { OutlineButton } from "./OutlineButton";

const PLATFORMS = [
  "WhatsApp",
  "LinkedIn",
  "Slack/Teams",
  "Instagram",
  "Snapchat",
  "TikTok",
] as const;

export function SocialButtons() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-wrap justify-center gap-3 px-4 pb-16">
      {PLATFORMS.map((label) => (
        <OutlineButton key={label} className="min-w-[120px]">
          {label}
        </OutlineButton>
      ))}
    </section>
  );
}
