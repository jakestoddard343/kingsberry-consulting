#!/usr/bin/env python3
"""
Generates the swirl berry mark.

Original artwork. The visual language it borrows — a plump fruit whose skin is
covered in spirals, topped by a curling stem — is a broad motif, not a copy of
any particular fruit from the series that inspired it.

Spirals are emitted as sampled Archimedean curves rather than hand-authored
beziers so the winding stays even and the density is tunable in one place.
"""

import math
import pathlib

W = H = 100

# Berry silhouette: plump, with a shallow dip where the stem meets the body.
BODY = (
    "M50 97 C 20 90, 7 68, 12 46 C 17 27, 33 17, 50 21 "
    "C 67 17, 83 27, 88 46 C 93 68, 80 90, 50 97 Z"
)

FINISHES = {
    "chrome": [
        (0.00, "#ffffff"), (0.16, "#c3d0e6"), (0.34, "#ffffff"),
        (0.50, "#8496b4"), (0.66, "#e8f0fb"), (0.84, "#6d7f9e"), (1.00, "#cdd8ec"),
    ],
    "gold": [
        (0.00, "#fff6d6"), (0.16, "#e6bd5c"), (0.34, "#fffbe9"),
        (0.50, "#b8862a"), (0.66, "#f7dd94"), (0.84, "#9a6b1c"), (1.00, "#e9c469"),
    ],
    "violet": [
        (0.00, "#ffffff"), (0.16, "#a9b7ff"), (0.34, "#f2f4ff"),
        (0.50, "#5b52c9"), (0.66, "#c9a4ff"), (0.84, "#4a3f9e"), (1.00, "#a58bff"),
    ],
}


def spiral(cx, cy, turns=2.05, r_max=9.0, phase=0.0, steps=64, sign=1):
    """Archimedean spiral, sampled and joined with a smooth polyline."""
    pts = []
    total = turns * 2 * math.pi
    for i in range(steps + 1):
        t = total * i / steps
        r = r_max * (t / total)
        a = sign * t + phase
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    d = f"M{pts[0][0]:.2f} {pts[0][1]:.2f}"
    # Quadratic smoothing through midpoints keeps the curve from faceting.
    for i in range(1, len(pts) - 1):
        mx = (pts[i][0] + pts[i + 1][0]) / 2
        my = (pts[i][1] + pts[i + 1][1]) / 2
        d += f" Q{pts[i][0]:.2f} {pts[i][1]:.2f} {mx:.2f} {my:.2f}"
    d += f" L{pts[-1][0]:.2f} {pts[-1][1]:.2f}"
    return d


# Hand-placed so the spirals sit inside the silhouette and read as skin texture.
SPIRALS = [
    (28, 40, 8.2, 1), (50, 34, 7.4, -1), (72, 41, 8.2, -1),
    (18, 58, 7.6, -1), (39, 55, 8.6, -1), (61, 55, 8.6, 1), (82, 58, 7.6, 1),
    (28, 74, 8.0, 1), (50, 74, 8.4, -1), (72, 74, 8.0, -1),
    (39, 89, 6.4, -1), (61, 89, 6.4, 1),
]


def build(finish: str) -> str:
    stops = "".join(
        f'<stop offset="{o * 100:.0f}%" stop-color="{c}"/>' for o, c in FINISHES[finish]
    )
    ink = {"chrome": "#1b2437", "gold": "#3a2a08", "violet": "#1a1440"}[finish]
    stem = {"chrome": "#7d8ca8", "gold": "#8a6a1e", "violet": "#6b5cc4"}[finish]
    leaf = {"chrome": "#34e5b0", "gold": "#7bbf4a", "violet": "#34e5b0"}[finish]

    swirls = "".join(
        f'<path d="{spiral(cx, cy, r_max=r, sign=s)}"/>' for cx, cy, r, s in SPIRALS
    )

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="Kingsberry swirl berry mark">
  <defs>
    <linearGradient id="sw-{finish}-body" x1="0.12" y1="0" x2="0.88" y2="1">{stops}</linearGradient>
    <clipPath id="sw-{finish}-clip"><path d="{BODY}"/></clipPath>
  </defs>

  <!-- Curling stem and leaf -->
  <g fill="none" stroke="{stem}" stroke-width="4.2" stroke-linecap="round">
    <path d="M50 24 C 50 15, 55 7, 64 6 C 72 5, 76 11, 72 15 C 69 18, 64 16, 66 12"/>
  </g>
  <path d="M48 24 C 40 20, 30 15, 22 14 C 25 22, 35 26, 47 26 Z" fill="{leaf}"/>

  <!-- Body -->
  <path d="{BODY}" fill="url(#sw-{finish}-body)" stroke="{ink}" stroke-width="3"/>

  <!-- Skin: spirals clipped to the body so none break the silhouette -->
  <g clip-path="url(#sw-{finish}-clip)" fill="none" stroke="{ink}"
     stroke-width="2.6" stroke-linecap="round" opacity="0.92">
    {swirls}
  </g>

  <!-- Specular sweep -->
  <path d="M24 34 C 30 24, 44 20, 52 23 C 42 26, 32 32, 27 42 Z"
        fill="#ffffff" opacity="0.35" clip-path="url(#sw-{finish}-clip)"/>
</svg>
"""


if __name__ == "__main__":
    here = pathlib.Path(__file__).parent
    for finish in FINISHES:
        out = here / f"option-5-swirl-berry-{finish}.svg"
        out.write_text(build(finish))
        print("wrote", out.name)
