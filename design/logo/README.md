# Logo directions

Four berry marks for Kingsberry. None is wired into the site yet — `app/icon.svg`
and the nav still use the placeholder "K" tile.

Open `preview.html` in a browser to compare them on dark and light, at favicon
sizes, and locked up in the nav.

| File | Direction | Notes |
| --- | --- | --- |
| `option-1-node-berry.svg` | Node Berry | Drupelets spaced so the links between them read; two nodes accented as "live". |
| `option-2-crown-berry.svg` | Crown Berry | King + berry, literally. Boldest silhouette, best small-size legibility. |
| `option-3-monogram-berry.svg` | Monogram Berry | Solid berry with the K masked out, so it works on any background. |
| `option-4-funnel-berry.svg` | Funnel Berry | Cluster tapers like a funnel; a detached mint drupelet is the converted lead. |

All four are 100×100 viewBox, no external references, and safe to inline.

## Adopting one

1. Copy the chosen SVG over `app/icon.svg` (Next.js serves it as the favicon).
2. Replace the gradient "K" tile in `components/Nav.tsx` and `components/Footer.tsx`
   with an inline copy of the mark.
3. The gradient IDs are prefixed per option (`nb-`, `cb-`, `mb-`, `fb-`). If the
   mark is inlined more than once on a page, the IDs must be made unique per
   instance or the first definition wins for all of them.
