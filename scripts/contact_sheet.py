"""Tile viewport screenshots into one contact sheet per device/page.
Usage: python scripts/contact_sheet.py <shotsDir> [thumbWidth] [perRow]
"""
import pathlib, sys
from PIL import Image, ImageDraw

root = pathlib.Path(sys.argv[1])
tw = int(sys.argv[2]) if len(sys.argv) > 2 else 220
per = int(sys.argv[3]) if len(sys.argv) > 3 else 8
for d in sorted(p for p in root.glob('*/*') if p.is_dir()):
    frames = sorted(d.glob('*.jpg'))
    if not frames:
        continue
    ims = [Image.open(f) for f in frames]
    th = int(ims[0].height * tw / ims[0].width)
    rows = (len(ims) + per - 1) // per
    sheet = Image.new('RGB', (per * (tw + 6) + 6, rows * (th + 22) + 6), 'white')
    dr = ImageDraw.Draw(sheet)
    for i, im in enumerate(ims):
        x, y = 6 + (i % per) * (tw + 6), 6 + (i // per) * (th + 22)
        sheet.paste(im.resize((tw, th)), (x, y + 16))
        dr.text((x, y + 2), f'{d.parent.name}/{d.name} #{i}', fill='black')
    out = root / f'sheet_{d.parent.name}_{d.name}.jpg'
    sheet.save(out, quality=72)
    print(out)
