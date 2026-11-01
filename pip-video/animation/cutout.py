"""Stellt Pip und Pippin aus den Referenzblättern frei (graue Fläche -> transparent)."""
import pathlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = pathlib.Path(__file__).parent
SRC = {"pip": D.parent / "pip-referenz.jpg", "pippin": D.parent / "pippin-referenz.jpg"}
BOX = {
    "pip_front": ("pip", (470, 115, 965, 705)), "pip_side": ("pip", (1065, 415, 1315, 705)),
    "pip_back": ("pip", (1090, 40, 1310, 338)), "pip_face1": ("pip", (45, 105, 285, 295)),
    "pip_face2": ("pip", (55, 310, 295, 505)), "pip_face3": ("pip", (75, 515, 310, 715)),
    "pippin_front": ("pippin", (55, 92, 520, 628)), "pippin_back": ("pippin", (570, 105, 910, 628)),
    "pippin_face": ("pippin", (960, 80, 1260, 305)), "pippin_side": ("pippin", (960, 318, 1305, 625)),
}
ERASE = {"pip_front": [(868, 115, 965, 300), (905, 395, 965, 480), (470, 688, 965, 705)],
         "pip_back": [(1090, 160, 1112, 200)]}
for name, (who, box) in BOX.items():
    im = Image.open(SRC[who]).convert("RGB").crop(box)
    if name == "pip_front":   # Pfeil "Expressive Eyes" auf dem Ohr wegretuschieren
        x0, y0 = box[0], box[1]
        band = (735 - x0, 222 - y0, 875 - x0, 280 - y0)
        reg = im.crop(band); med = reg.filter(ImageFilter.MedianFilter(9))
        r, m_ = np.asarray(reg).astype(int), np.asarray(med).astype(int)
        dark = (r.sum(-1) < m_.sum(-1) - 60)[..., None]
        im.paste(Image.fromarray(np.where(dark, m_, r).astype(np.uint8)), band[:2])
    hsv = np.asarray(im.convert("HSV")).astype(float)
    if who == "pip":
        fg = (hsv[..., 1] > 50) | (hsv[..., 2] < 60)
    else:              # Katze hat hellen Cremebauch -> niedrigere Sättigungsschwelle
        fg = (hsv[..., 1] > 26) | (hsv[..., 2] < 60)
    for (x0, y0, x1, y1) in ERASE.get(name, []):               # Beschriftungspfeile entfernen
        fg[max(0, y0 - box[1]):max(0, y1 - box[1]), max(0, x0 - box[0]):max(0, x1 - box[0])] = False
    m = Image.fromarray((fg * 255).astype(np.uint8))
    m = m.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))   # dünne Linien/Pfeile weg
    # Löcher (weisser Brustfleck, Augen) füllen: Hintergrund von aussen fluten
    w, h = m.size
    pad = Image.new("L", (w + 2, h + 2), 0); pad.paste(m, (1, 1)); pad = pad.copy()
    ImageDraw.floodfill(pad, (0, 0), 128)
    a = np.asarray(pad)[1:-1, 1:-1]
    mask = (a != 128)
    # alle grossen Komponenten behalten (Figur), kleine Reste (Text, Linien) verwerfen
    mm = Image.fromarray((mask * 255).astype(np.uint8)).copy()
    total, keep, val = mask.sum(), np.zeros_like(mask), 1
    while True:
        arr = np.asarray(mm)
        ys, xs = np.nonzero(arr == 255)
        if len(xs) == 0 or val > 250:
            break
        ImageDraw.floodfill(mm, (int(xs[0]), int(ys[0])), val)
        comp = np.asarray(mm) == val
        if comp.sum() > 0.04 * total:
            keep |= comp
        val += 1
    alpha = Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6))
    out = im.convert("RGBA"); out.putalpha(alpha)
    out = out.crop(out.getbbox())
    out.save(D / "figuren" / f"{name}.png")
    print(name, out.size)
