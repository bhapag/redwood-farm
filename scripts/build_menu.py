"""Build src/data/menu.json from the owner's Excel menu.

Prices come from RED_Wood_Restaurant_Menu.xlsx (row order).
Display spelling, veg marks, sections and notes come from the live
menu page (owner-approved), matched item by item in the same order.
The script stops if counts or any price disagree.
"""
import json, re, sys, html as H
import openpyxl

XLSX = "data/RED_Wood_Restaurant_Menu.xlsx"
LIVE = "data/old-live-menu.html"  # owner-approved spellings and veg marks, from branch backup/live-2026-11-17

def num(v):
    if v is None or v == "": return None
    return int(round(float(v)))

wb = openpyxl.load_workbook(XLSX, data_only=True)
ws = wb.active
xl = []
for name, half, full in ws.iter_rows(min_row=2, values_only=True):
    if name is None: continue
    if half is None and full is None: continue  # heading row
    xl.append({"xname": str(name).strip(), "half": num(half), "full": num(full)})

src = open(LIVE, encoding="utf8").read()
main = src[src.find("<main>"):src.find('<section id="parties"')]
cats = []
for sec in re.finditer(r'<section id="([^"]+)"><h2>(.*?)</h2>(.*?)</section>', main, re.S):
    cid, cname, body = sec.group(1), H.unescape(sec.group(2)), sec.group(3)
    cat = {"id": cid, "name": cname, "note": None, "groups": []}
    tokens = re.finditer(r'<p class="sn">(.*?)</p>|<h3 class="sub">(.*?)(?:<span class="hf">.*?</span></span>)?</h3>|<ul>(.*?)</ul>', body, re.S)
    pending = None
    for t in tokens:
        if t.group(1) is not None:
            cat["note"] = H.unescape(t.group(1)); continue
        if t.group(2) is not None:
            pending = H.unescape(t.group(2)); continue
        items = []
        for li in re.finditer(r'<li><span class="d (v|nv)"[^>]*></span><span class="dn">(.*?)</span>(<span class="p h">(.*?)</span>)?<span class="p">(.*?)</span></li>', t.group(3)):
            raw = li.group(2)
            dm = re.search(r"<small>(.*?)</small>", raw)
            nm = H.unescape(re.sub(r"\s*<small>.*?</small>", "", raw)).strip()
            items.append({"name": nm, "desc": H.unescape(dm.group(1)) if dm else None, "veg": li.group(1) == "v",
                          "half_live": num(li.group(4)) if li.group(4) else None,
                          "full_live": num(li.group(5))})
        cat["groups"].append({"name": pending, "items": items})
        pending = None
    cats.append(cat)

flat = [it for c in cats for g in c["groups"] for it in g["items"]]
if len(flat) != len(xl):
    sys.exit(f"count mismatch: live {len(flat)} vs xlsx {len(xl)}")
bad = 0
for it, x in zip(flat, xl):
    it["half"], it["full"] = x["half"], x["full"]
    if (it.pop("half_live"), it.pop("full_live")) != (x["half"], x["full"]):
        bad += 1; print("price differs:", it["name"], x)
    if it["name"] != x["xname"]: it["xlsx_name"] = x["xname"]
if bad: sys.exit(f"{bad} price mismatches")
json.dump({"source": "RED_Wood_Restaurant_Menu.xlsx", "count": len(flat), "categories": cats},
          open("src/data/menu.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
renamed = sum(1 for i in flat if "xlsx_name" in i)
print(f"ok: {len(flat)} items, {len(cats)} categories, {renamed} spelling fixes, 0 price mismatches")
