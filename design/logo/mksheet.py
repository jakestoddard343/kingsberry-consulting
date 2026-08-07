#!/usr/bin/env python3
"""Rebuilds preview-2.html from whatever SVGs are currently on disk."""
import re, pathlib

GROUPS = [
    ("06", "Lettering Berry",
     "The word is the mark. KINGS / BERRY — the same 5/5 break the reference uses — each letter arched and squashed, then the whole thing clipped to a berry silhouette so the outer letters take its curve.",
     ["option-6-lettering-chrome.svg", "option-6-lettering-gold.svg", "option-6-lettering-violet.svg"],
     ["Chrome", "Gold", "Violet"]),
    ("05", "Swirl Berry",
     "Spiral-skinned fruit with a curling stem. Heavy outline keeps the silhouette when the swirls get too small to resolve.",
     ["option-5-swirl-berry-chrome.svg", "option-5-swirl-berry-gold.svg", "option-5-swirl-berry-violet.svg"],
     ["Chrome", "Gold", "Violet"]),
    ("07", "Lingonberry",
     "A sprig: glossy spheres, broad oval leaves, woody stem. The most botanical of the set.",
     ["option-7-lingonberry-ruby.svg", "option-7-lingonberry-chrome.svg", "option-7-lingonberry-violet.svg"],
     ["Ruby", "Chrome", "Violet"]),
    ("08", "Blackberry",
     "Hex-packed drupelets tapering to a point, with a sepal crown. Noir is the true-to-life one.",
     ["option-8-blackberry-noir.svg", "option-8-blackberry-chrome.svg", "option-8-blackberry-violet.svg"],
     ["Noir", "Chrome", "Violet"]),
]


def inline(fn, px, uniq):
    svg = pathlib.Path(fn).read_text().split("?>")[-1].strip()
    inner = re.sub(r"^<svg[^>]*>", "", svg).replace("</svg>", "").strip()
    # Namespace gradient/clip ids so repeated instances do not collide.
    for old in set(re.findall(r'id="([^"]+)"', inner)):
        inner = inner.replace(f'id="{old}"', f'id="{old}-{uniq}"')
        inner = inner.replace(f"url(#{old})", f"url(#{old}-{uniq})")
    return f'<svg viewBox="0 0 100 100" width="{px}" height="{px}">{inner}</svg>'


cards = []
for gi, (num, name, desc, files, labels) in enumerate(GROUPS):
    fins = []
    for fi, (f, lab) in enumerate(zip(files, labels)):
        u = f"g{gi}f{fi}"
        fins.append(
            f'<div class="fin"><div class="big">{inline(f, 130, u + "a")}</div>'
            f'<div class="strip">{inline(f, 44, u + "b")}'
            f'<span class="tiny">{inline(f, 28, u + "c")}{inline(f, 20, u + "d")}{inline(f, 16, u + "e")}</span></div>'
            f'<div class="fname">{lab}</div></div>'
        )
    cards.append(
        f'<section class="card"><header><span class="num">{num}</span><h2>{name}</h2>'
        f'<p>{desc}</p></header><div class="fins">{"".join(fins)}</div></section>'
    )

html = """<!doctype html><html><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#04060d;color:#e9eeff;font-family:Inter,system-ui,sans-serif;padding:42px 38px 50px;width:1240px}
h1{font-size:29px;font-weight:600;letter-spacing:-.03em}
.sub{color:rgba(233,238,255,.5);font-size:14.5px;margin:8px 0 34px;max-width:860px;line-height:1.55}
.card{border:1px solid rgba(255,255,255,.09);border-radius:18px;padding:24px 26px;margin-bottom:16px;background:rgba(255,255,255,.022)}
header{margin-bottom:18px}
.num{font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.2em;color:#4f6bff}
h2{font-size:20px;font-weight:600;letter-spacing:-.02em;margin-top:5px}
header p{color:rgba(233,238,255,.55);font-size:13px;margin-top:5px;max-width:740px;line-height:1.5}
.fins{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.fin{border:1px solid rgba(255,255,255,.08);border-radius:13px;overflow:hidden;background:#080b16}
.big{display:grid;place-items:center;padding:18px;min-height:170px}
.strip{display:flex;align-items:center;justify-content:center;gap:22px;background:#f4f6fc;padding:14px}
.tiny{display:flex;align-items:flex-end;gap:12px}
.fname{font-family:ui-monospace,monospace;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:rgba(233,238,255,.4);padding:9px 12px;text-align:center}
</style></head><body>
<h1>Kingsberry — four more directions, metallic</h1>
<p class="sub">Each large on dark, then on white at 44px beside 28 / 20 / 16px. The white strip is the honest test: a chrome gradient tuned for a dark page washes out badly on light.</p>
""" + "".join(cards) + "</body></html>"

pathlib.Path("preview-2.html").write_text(html)
print("preview-2.html rebuilt")
