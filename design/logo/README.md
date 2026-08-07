# Logo directions

Eight berry marks for Kingsberry. None is wired into the site yet — `app/icon.svg`
and the nav still use the placeholder "K" tile.

Open `preview.html` (directions 1–4) and `preview-2.html` (5–8) in a browser to
compare them on dark and light, at favicon sizes, and in the nav lockup.

## Directions

| File | Direction | Notes |
| --- | --- | --- |
| `option-1-node-berry.svg` | Node Berry | Drupelets spaced so the links between them read; two nodes accented as "live". |
| `option-2-crown-berry.svg` | Crown Berry | King + berry, literally. Boldest silhouette, best small-size legibility. |
| `option-3-monogram-berry.svg` | Monogram Berry | Solid berry with the K masked out, so it works on any background. |
| `option-4-funnel-berry.svg` | Funnel Berry | Cluster tapers like a funnel; a detached mint drupelet is the converted lead. |
| `option-5-swirl-berry-*.svg` | Swirl Berry | Spiral-skinned fruit with a curling stem. Chrome / gold / violet. |
| `option-6-lettering-*.svg` | Lettering Berry | The word set inside a berry silhouette. Chrome / gold / violet. |
| `option-7-lingonberry-*.svg` | Lingonberry | Glossy sprig with broad oval leaves. Ruby / chrome / violet. |
| `option-8-blackberry-*.svg` | Blackberry | Hex-packed drupelets with a sepal crown. Noir / chrome / violet. |

All are 100×100 viewBox, self-contained, and safe to inline.

## Regenerating

Directions 1–4 are hand-authored SVG. The rest are generated:

```
python3 build_swirl.py       # option 5
python3 build_lettering.py   # option 6  (needs fontTools)
python3 build_fruit.py       # options 7 and 8
python3 mksheet.py           # rebuilds preview-2.html from whatever is on disk
```

`mksheet.py` reads the SVGs off disk, so rebuild a mark *and* rerun it — editing
one without the other silently shows stale art.

`build_lettering.py` converts glyphs to outlines, so the output SVG carries no
font dependency. It needs `fonts/BagelFatOne.ttf` (SIL Open Font License, which
permits the outlines being used in a logo) and `pip install fonttools`.

## Known trade-offs

- **Chrome washes out on white.** The gradient is tuned for a dark page; on the
  light strip in the previews it nearly disappears. A light-background variant
  would need its own darker ramp.
- **The lettering mark is not a favicon.** It is illegible below roughly 40px.
  If it wins, it needs a simplified companion glyph for the tab icon.
- **Metallic gradients do not print or embroider.** Any of these going onto
  physical collateral needs a flat single-colour version drawn from the
  silhouette.

## Adopting one

1. Copy the chosen SVG over `app/icon.svg` (Next.js serves it as the favicon).
2. Replace the gradient "K" tile in `components/Nav.tsx` and `components/Footer.tsx`
   with an inline copy of the mark.
3. Gradient and clip-path IDs are prefixed per option. If a mark is inlined more
   than once on a page, those IDs must be made unique per instance or the first
   definition wins for every copy.
