// Bug fix: animated underline on "content" + smooth scroll to #share-content on click.
// Update: intro content-zin — onderstreept woord content, klik scrollt naar #share-content.
"use client";

export const SHARE_CONTENT_SECTION_ID = "share-content";

export function ContentScrollLink() {
  const scrollToContent = () => {
    document.getElementById(SHARE_CONTENT_SECTION_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToContent}
      className="content-scroll-link relative inline cursor-pointer border-0 bg-transparent p-0 font-[family-name:var(--font-indivisible)] font-inherit text-inherit"
      aria-label="Ga naar de content om te delen op social media"
    >
      content
    </button>
  );
}
