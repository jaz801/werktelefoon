# Donate arrow (`DonateArrow`)

Curved arrow + blue ball animation from intro copy to the **Ik doe mee!*** button (`#donate-cta`).

## Intended shape (do not regress)

```
intro text          right gutter              button
    |                    |                      |
    |    [copy]          |                      [CTA]
    |                    |---- horizontal ----->|
    |                    |     rounded corner |
    |                    |        vertical    ↑ arrowhead
```

1. **Start** — immediately **to the right** of `#intro-copy` (`introRect.right + GUTTER_OFFSET`). Never `introRect.left - offset` (that draws through the text).
2. **Horizontal leg** — straight out in the margin beside the text (same `y` as start).
3. **Corner** — quadratic curve (`Q`), not a sharp angle.
4. **Vertical leg** — straight up to just below the button (`donateRect.bottom + GAP_BELOW_BUTTON`).
5. **Arrowhead** — points **up** into the CTA (`markerEnd`, `orient="auto"`).

Reference path (desktop, button to the right of start):

```svg
M xStart yStart
L xVert-r yStart
Q xVert yStart, xVert yStart-r
L xVert yEnd
```

## Layout variants

| Layout | Path builder | Why |
|--------|----------------|-----|
| Button **right** of gutter start (`xVert >= xStart + 12`) | `buildHorizontalThenUp` | Standard L beside text |
| Button **left** of gutter start (e.g. centered CTA on mobile) | `buildGutterUpThenAcross` | Vertical leg in right margin only, then horizontal to CTA — **no line across text** |

## Common mistakes (caused regressions)

- **Mirroring both `xStart` and `xVert`** with `sectionWidth - x` — vertical leg leaves the button; arrow disappears or points wrong.
- **Flipping only `xStart` to the left** (`intro.left - GUTTER`) — horizontal segment crosses centered copy.
- **Ending path at button center on a horizontal tangent** — arrowhead points sideways; end at `yEnd` below button with a vertical last segment.
- **`overflow-x-hidden` on `#intro-section`** — can clip the donate tooltip; use `overflow-visible` on the section header area.

## Related files

| File | Role |
|------|------|
| `src/components/DonateArrow.tsx` | Path geometry + SVG |
| `src/components/IntroSection.tsx` | Host; must allow overflow for tooltip |
| `src/components/IntroCopy.tsx` | `sm:pr-14` / `md:pr-16` reserves **right** gutter |
| `src/components/DonateCta.tsx` | CTA + hover footnote below button |
| `src/components/Header.tsx` | `max-sm:portrait:pb-20` space for tooltip on mobile |

## Donate CTA tooltip

- Footnote appears **below** the button on hover/focus/active.
- On `sm+`, tooltip aligns to **`right: 0`** of the CTA wrapper so it is not cut off on the right edge of the viewport.
- On mobile portrait, tooltip stays **centered** under the button with `max-width: calc(100dvw - 2rem)`.

## Before changing anchors

1. Resize desktop + mobile portrait in DevTools.
2. Confirm the path never crosses `#intro-copy`.
3. Confirm arrowhead points at `#donate-cta`.
4. Confirm tooltip is fully readable on hover.
