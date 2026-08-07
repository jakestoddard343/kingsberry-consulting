import re, pathlib, sys
files = sys.argv[1:] or ["option-6-lettering-chrome.svg","option-6-lettering-gold.svg","option-6-lettering-violet.svg"]
labels = [pathlib.Path(f).stem.split("-")[-1].title() for f in files]
def inline(fn, px, uniq):
    svg = pathlib.Path(fn).read_text().split("?>")[-1].strip()
    inner = re.sub(r'^<svg[^>]*>', '', svg).replace('</svg>','').strip()
    for old in set(re.findall(r'id="([^"]+)"', inner)):
        inner = inner.replace(f'id="{old}"', f'id="{old}-{uniq}"').replace(f'url(#{old})', f'url(#{old}-{uniq})')
    return f'<svg viewBox="0 0 100 100" width="{px}" height="{px}">{inner}</svg>'
cells = "".join(
    f'<div class="c"><div class="d">{inline(f,220,f"a{i}")}</div>'
    f'<div class="w">{inline(f,150,f"b{i}")}<span class="t">{inline(f,40,f"c{i}")}{inline(f,24,f"d{i}")}{inline(f,16,f"e{i}")}</span></div>'
    f'<div class="l">{labels[i]}</div></div>'
    for i,f in enumerate(files))
pathlib.Path("check.html").write_text(
  '<body style="margin:0;background:#080b16;display:flex;gap:22px;padding:24px;font-family:ui-monospace,monospace">'
  '<style>.c{text-align:center}.d{padding:8px}.w{background:#f4f6fc;border-radius:10px;padding:14px;display:flex;'
  'align-items:center;justify-content:center;gap:18px}.t{display:flex;align-items:flex-end;gap:12px}'
  '.l{color:#8090b0;font-size:11px;letter-spacing:.16em;margin-top:10px}</style>' + cells + '</body>')
print("check.html rebuilt from", ", ".join(files))
