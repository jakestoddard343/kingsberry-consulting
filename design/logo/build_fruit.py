#!/usr/bin/env python3
"""
Builds two botanical berry marks:

  lingonberry — a sprig of glossy spheres with broad oval leaves
  blackberry  — a dense drupelet cluster with a sepal crown

Both are stylised down to logo weight rather than drawn realistically: enough
form to be recognisable at 132px, enough silhouette to survive at 16px.
"""

import math
import pathlib

HERE = pathlib.Path(__file__).parent

METALS = {
    "chrome": {
        "a": "#ffffff", "b": "#c2cfe6", "c": "#7d90ae", "d": "#5a6b88",
        "leaf": ("#dfe8f5", "#8ea1bf"), "stem": "#8ea1bf",
    },
    "gold": {
        "a": "#fffbe8", "b": "#eccb74", "c": "#b8862a", "d": "#8a6018",
        "leaf": ("#f6e6a6", "#a8791f"), "stem": "#a8791f",
    },
    "violet": {
        "a": "#ffffff", "b": "#b6a8ff", "c": "#6a4fd8", "d": "#3f2f9c",
        "leaf": ("#bff7e4", "#22c39a"), "stem": "#7a68d8",
    },
    # Ruby reads closest to a real lingonberry.
    "ruby": {
        "a": "#fff0f2", "b": "#f4657f", "c": "#c9203f", "d": "#8e0c26",
        "leaf": ("#8ee5a8", "#2e9c52"), "stem": "#4f8f3a",
    },
    # Near-black with a violet cast, the way blackberries actually photograph.
    "noir": {
        "a": "#c9b8ff", "b": "#6b53b8", "c": "#2e2154", "d": "#150e2c",
        "leaf": ("#7fe0a6", "#28935a"), "stem": "#4a7a3c",
    },
}


def sphere(cx, cy, r, m, idx):
    """A berry: radial body, rim shadow, and a hard specular dot."""
    gid = f"sph-{idx}"
    return f"""
    <radialGradient id="{gid}" cx="0.34" cy="0.28" r="0.82">
      <stop offset="0%" stop-color="{m['a']}"/>
      <stop offset="34%" stop-color="{m['b']}"/>
      <stop offset="76%" stop-color="{m['c']}"/>
      <stop offset="100%" stop-color="{m['d']}"/>
    </radialGradient>""", f"""
    <g>
      <circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#{gid})"/>
      <ellipse cx="{cx - r * 0.3:.2f}" cy="{cy - r * 0.36:.2f}"
               rx="{r * 0.26:.2f}" ry="{r * 0.19:.2f}"
               fill="#ffffff" opacity="0.85"
               transform="rotate(-28 {cx - r * 0.3:.2f} {cy - r * 0.36:.2f})"/>
    </g>"""


def build_lingonberry(finish):
    m = METALS[finish]
    # Back pair first so the front berry overlaps them.
    berries = [(34, 52, 15), (68, 50, 15), (50, 72, 18)]
    defs, body = [], []
    for i, (cx, cy, r) in enumerate(berries):
        d, g = sphere(cx, cy, r, m, f"{finish}-lg-{i}")
        defs.append(d)
        body.append(g)

    leaf_a, leaf_b = m["leaf"]
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="Kingsberry lingonberry mark">
  <defs>
    <linearGradient id="lg-{finish}-leaf" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{leaf_a}"/>
      <stop offset="100%" stop-color="{leaf_b}"/>
    </linearGradient>{''.join(defs)}
  </defs>

  <!-- Woody stem arcing in from the upper left, the way a sprig hangs -->
  <path d="M14 10 C 30 16, 40 24, 48 36" fill="none" stroke="{m['stem']}"
        stroke-width="4" stroke-linecap="round"/>
  <path d="M30 18 C 36 24, 40 28, 42 34" fill="none" stroke="{m['stem']}"
        stroke-width="3" stroke-linecap="round" opacity="0.75"/>

  <!-- Broad oval leaves with a centre vein -->
  <g fill="url(#lg-{finish}-leaf)">
    <path d="M12 30 C 12 18, 24 10, 38 13 C 40 26, 30 36, 15 35 Z"/>
    <path d="M56 12 C 68 4, 84 8, 88 20 C 78 30, 62 28, 56 16 Z"/>
  </g>
  <g stroke="#ffffff" stroke-width="1.2" opacity="0.4" fill="none" stroke-linecap="round">
    <path d="M14 33 C 22 28, 30 22, 37 14"/>
    <path d="M58 14 C 66 16, 76 20, 86 20"/>
  </g>

  {''.join(body)}

  <!-- Calyx dimple: the small five-point crown at a lingonberry's base -->
  <g fill="{m['d']}" opacity="0.5">
    <circle cx="50" cy="88" r="3.4"/>
  </g>
</svg>
"""


def drupelet_grid():
    """
    Hex-packed drupelets in a blackberry silhouette: an elongated dome that
    tapers toward the base. Rows alternate offset so the packing reads dense.
    """
    rows = [
        (34, 5, 8.2), (48, 6, 8.4), (62, 5, 8.2), (75, 4, 7.6), (86, 3, 6.8),
    ]
    out = []
    for y, n, r in rows:
        span = (n - 1) * (r * 1.72)
        for i in range(n):
            x = 50 - span / 2 + i * (r * 1.72)
            out.append((x, y, r))
    return out


def build_blackberry(finish):
    m = METALS[finish]
    defs, body = [], []
    for i, (cx, cy, r) in enumerate(drupelet_grid()):
        d, g = sphere(cx, cy, r, m, f"{finish}-bb-{i}")
        defs.append(d)
        body.append(g)

    leaf_a, leaf_b = m["leaf"]
    # Sepals fan out from under the crown of the cluster.
    sepals = []
    for ang, ln in [(-176, 20), (-146, 17), (-34, 17), (-4, 20)]:
        a = math.radians(ang)
        tx, ty = 50 + ln * math.cos(a), 30 + ln * math.sin(a)
        px, py = -math.sin(a) * 4.6, math.cos(a) * 4.6
        sepals.append(
            f'<path d="M50 30 Q{50 + (tx - 50) * 0.5 + px:.1f} '
            f'{30 + (ty - 30) * 0.5 + py:.1f} {tx:.1f} {ty:.1f} '
            f'Q{50 + (tx - 50) * 0.5 - px:.1f} {30 + (ty - 30) * 0.5 - py:.1f} 50 30 Z"/>'
        )

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="Kingsberry blackberry mark">
  <defs>
    <linearGradient id="bb-{finish}-leaf" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{leaf_a}"/>
      <stop offset="100%" stop-color="{leaf_b}"/>
    </linearGradient>{''.join(defs)}
  </defs>

  <path d="M50 30 V14" stroke="{m['stem']}" stroke-width="4" stroke-linecap="round"/>
  <g fill="url(#bb-{finish}-leaf)">
    {''.join(sepals)}
  </g>

  {''.join(body)}
</svg>
"""


if __name__ == "__main__":
    for finish in ("ruby", "chrome", "violet"):
        p = HERE / f"option-7-lingonberry-{finish}.svg"
        p.write_text(build_lingonberry(finish))
        print("wrote", p.name)
    for finish in ("noir", "chrome", "violet"):
        p = HERE / f"option-8-blackberry-{finish}.svg"
        p.write_text(build_blackberry(finish))
        print("wrote", p.name)
