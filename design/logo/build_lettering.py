#!/usr/bin/env python3
"""
Builds the "Kingsberry" lettering mark — the word set inside a berry silhouette,
in the shape-filling display style.

Glyphs are converted to outlines rather than left as <text>, so the SVG carries
no font dependency and renders identically everywhere.

The word splits KINGS / BERRY, which is the same 5/5 break the reference uses.
Each line is scaled to its band, then every letter is individually arched and
squashed so the run follows the silhouette instead of sitting on a flat
baseline — that curve is what sells the hand-lettered look.
"""

import pathlib

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.misc.transform import Identity

HERE = pathlib.Path(__file__).parent
FONT = HERE / "fonts" / "BagelFatOne.ttf"

# Berry silhouette: wide shoulders, shallow heart dip, rounded base.
BODY = (
    "M50 98 C 30 94, 14 78, 11 58 C 8.5 41, 18 28, 32 27 "
    "C 39 26.5, 45 29, 50 33 C 55 29, 61 26.5, 68 27 "
    "C 82 28, 91.5 41, 89 58 C 86 78, 70 94, 50 98 Z"
)

FINISHES = {
    "chrome": {
        "stops": [
            (0.00, "#ffffff"), (0.14, "#c6d3e8"), (0.30, "#ffffff"),
            (0.48, "#7f92b1"), (0.62, "#eaf1fc"), (0.80, "#67799a"), (1.00, "#c2cfe6"),
        ],
        "leaf": ["#e8f0fb", "#8fa2c0"],
        "ink": "#0b1020",
    },
    "gold": {
        "stops": [
            (0.00, "#fff8dd"), (0.14, "#e9c266"), (0.30, "#fffcec"),
            (0.48, "#b4821f"), (0.62, "#f8e09b"), (0.80, "#94661a"), (1.00, "#edcb74"),
        ],
        "leaf": ["#f7e6a8", "#a8791f"],
        "ink": "#241804",
    },
    "violet": {
        "stops": [
            (0.00, "#ffffff"), (0.14, "#aab8ff"), (0.30, "#f4f6ff"),
            (0.48, "#5348c6"), (0.62, "#cfaaff"), (0.80, "#463c99"), (1.00, "#a78dff"),
        ],
        "leaf": ["#bff7e4", "#22c39a"],
        "ink": "#0a0820",
    },
}


def letter_paths(font, text, tracking=-0.03):
    """Outline + placement for each glyph, in font units on a y-up baseline."""
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upem = font["head"].unitsPerEm

    out, x = [], 0.0
    for ch in text:
        name = cmap[ord(ch)]
        g = glyphs[name]

        pen = SVGPathPen(glyphs, ntos=lambda v: f"{v:.1f}")
        g.draw(pen)

        bounds = BoundsPen(glyphs)
        g.draw(bounds)

        out.append({"d": pen.getCommands(), "x": x, "bounds": bounds.bounds})
        x += g.width + tracking * upem
    return out, x


def build_line(font, text, cx, top, target_w, target_h, arch, squash):
    """
    Fit a word to a band and bend it.

    `top` is the y of the band's cap line — the transform below flips the y-up
    font space, which lands the glyph's own top edge on it.

    `arch` moves the outer letters down (positive) or up (negative);
    `squash` shortens them. Together they trace the silhouette's curve.
    """
    letters, total_w = letter_paths(font, text)

    xs = [l["bounds"][0] + l["x"] for l in letters if l["bounds"]]
    ys0 = [l["bounds"][1] for l in letters if l["bounds"]]
    ys1 = [l["bounds"][3] for l in letters if l["bounds"]]
    x0 = min(xs)
    x1 = max(l["bounds"][2] + l["x"] for l in letters if l["bounds"])
    y0, y1 = min(ys0), max(ys1)

    sx = target_w / (x1 - x0)
    sy = target_h / (y1 - y0)

    parts = []
    for l in letters:
        if not l["bounds"]:
            continue
        # Glyph centre in the fitted, y-down coordinate space.
        gcx = ((l["bounds"][0] + l["bounds"][2]) / 2 + l["x"] - x0) * sx - target_w / 2
        u = gcx / (target_w / 2)

        dy = arch * u * u
        ls = 1 - squash * u * u

        # font units -> y-down page units, then place under the letter's own warp
        base = (
            f"translate({cx:.3f} {top + dy:.3f}) "
            f"scale({sx:.5f} {-sy * ls:.5f}) "
            f"translate({-x0 - target_w / 2 / sx:.3f} {-y1:.3f})"
        )
        parts.append(f'<path transform="{base} translate({l["x"]:.1f} 0)" d="{l["d"]}"/>')
    return "\n    ".join(parts)


def calyx(fill_a, fill_b):
    """Splayed leafy crown over the shoulders of the berry."""
    petals = [
        ("M50 32 C 39 33, 26 31, 17 25 C 26 34, 37 38, 49 37 Z", fill_a),
        ("M50 31 C 42 30, 33 25, 27 17 C 30 28, 38 35, 49 36 Z", fill_b),
        ("M50 31 C 45 26, 42 18, 42 10 C 47 17, 51 24, 51 32 Z", fill_a),
        ("M50 31 C 55 26, 58 18, 58 10 C 53 17, 49 24, 49 32 Z", fill_b),
        ("M50 31 C 58 30, 67 25, 73 17 C 70 28, 62 35, 51 36 Z", fill_a),
        ("M50 32 C 61 33, 74 31, 83 25 C 74 34, 63 38, 51 37 Z", fill_b),
    ]
    return "\n    ".join(f'<path d="{d}" fill="{f}"/>' for d, f in petals)


def build(finish):
    spec = FINISHES[finish]
    font = TTFont(FONT)

    stops = "".join(
        f'<stop offset="{o * 100:.0f}%" stop-color="{c}"/>' for o, c in spec["stops"]
    )

    # Upper band sits on the wide shoulders; lower band follows the taper.
    kings = build_line(font, "KINGS", 50, 33, 80, 27, arch=2.4, squash=0.10)
    berry = build_line(font, "BERRY", 50, 62, 76, 29, arch=2.4, squash=0.13)

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="Kingsberry lettering berry mark">
  <defs>
    <linearGradient id="lt-{finish}" x1="0.1" y1="0" x2="0.9" y2="1">{stops}</linearGradient>
    <clipPath id="lt-{finish}-clip"><path d="{BODY}"/></clipPath>
  </defs>

  <g>
    {calyx(*spec["leaf"])}
  </g>

  <!-- The word is the mark: letters are the berry, cut from a single fill. -->
  <g fill="url(#lt-{finish})" clip-path="url(#lt-{finish}-clip)">
    {kings}
    {berry}
  </g>
</svg>
"""


if __name__ == "__main__":
    for finish in FINISHES:
        out = HERE / f"option-6-lettering-{finish}.svg"
        out.write_text(build(finish))
        print("wrote", out.name)
