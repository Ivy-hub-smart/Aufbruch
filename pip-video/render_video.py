"""Rendert das 1-Minuten-Video: 20 Bilder x 3 s, sanfter Zoom pro Bild.
Liegt bilder/NN.jpg|png (NN = 01..20) vor, wird das echte Bild verwendet,
sonst eine Storyboard-Karte (Ausschnitte aus pip-/pippin-referenz.jpg + Szenentext)."""
import json, pathlib, subprocess, textwrap
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance

D = pathlib.Path(__file__).parent
W, H, FPS, SEC = 1920, 1080, 25, 3
scenes = json.loads((D / "prompts.json").read_text(encoding="utf-8"))
REFS = {"pip": Image.open(D / "pip-referenz.jpg").convert("RGB"),
        "pippin": Image.open(D / "pippin-referenz.jpg").convert("RGB")}
# Ausschnitte aus den Referenzblättern (relativ)
CROPS = {"pip": [(0.30, 0.10, 0.70, 0.95), (0.03, 0.13, 0.22, 0.38), (0.03, 0.40, 0.22, 0.66),
                 (0.04, 0.68, 0.23, 0.93), (0.74, 0.53, 0.95, 0.96)],
         "pippin": [(0.03, 0.17, 0.37, 0.80), (0.69, 0.10, 0.91, 0.42), (0.67, 0.41, 0.93, 0.84)]}

def crop(who, k):
    ref = REFS[who]; x0, y0, x1, y1 = CROPS[who][k % len(CROPS[who])]
    return ref.crop((int(x0 * ref.width), int(y0 * ref.height), int(x1 * ref.width), int(y1 * ref.height)))

FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
f_big, f_mid, f_small = ImageFont.truetype(FB, 64), ImageFont.truetype(FR, 44), ImageFont.truetype(FR, 30)

def cover(img):
    s = max(W / img.width, H / img.height)
    img = img.resize((int(img.width * s) + 1, int(img.height * s) + 1), Image.LANCZOS)
    l, t = (img.width - W) // 2, (img.height - H) // 2
    return img.crop((l, t, l + W, t + H))

def card(sc):
    who, k = sc.get("figuren", "pip"), sc["nr"]
    parts = [crop("pip", 0), crop("pippin", 0)] if who in ("beide", "none") else [crop(who, k)]
    bg = ImageEnhance.Brightness(cover(parts[-1]).filter(ImageFilter.GaussianBlur(28))).enhance(0.45)
    if who == "none":
        parts = [p.resize((p.width // 2, p.height // 2)) for p in parts]
    box = (760 // len(parts), 760)
    x = 120
    for p in parts:
        p = p.copy(); p.thumbnail(box)
        bg.paste(p, (x, (H - p.height) // 2)); x += p.width + 20
    d = ImageDraw.Draw(bg)
    x = 960
    d.text((x, 200), f"Szene {sc['nr']:02d}  ·  {sc['start']}–{sc['ende']}", font=f_small, fill=(255, 210, 120))
    y = 260
    for line in textwrap.wrap(sc["szene"], 22):
        d.text((x, y), line, font=f_big, fill="white"); y += 80
    if sc["sprecher"]:
        y += 30
        for line in textwrap.wrap("„" + sc["sprecher"].strip("„“") + "“", 32):
            d.text((x, y), line, font=f_mid, fill=(170, 230, 230)); y += 56
    d.text((x, H - 90), "Storyboard – Platzhalter für generiertes Bild", font=f_small, fill=(200, 200, 200))
    return bg

def subtitle(img, text):
    if not text:
        return img
    d = ImageDraw.Draw(img)
    lines = textwrap.wrap(text, 50)
    y = H - 70 - 56 * len(lines)
    for line in lines:
        w = d.textlength(line, font=f_mid)
        d.text(((W - w) / 2, y), line, font=f_mid, fill="white", stroke_width=3, stroke_fill="black"); y += 56
    return img

frames = D / "build" / "frames"; clips = D / "build" / "clips"
frames.mkdir(parents=True, exist_ok=True); clips.mkdir(parents=True, exist_ok=True)
lst, real = [], 0
for sc in scenes:
    n = f"{sc['nr']:02d}"
    src = next((p for p in (D / "bilder" / f"{n}.{e}" for e in ("jpg", "jpeg", "png", "webp")) if p.exists()), None)
    if src:
        real += 1
        img = subtitle(cover(Image.open(src).convert("RGB")), sc["sprecher"])
    else:
        img = card(sc)
    fp = frames / f"{n}.png"; img.save(fp)
    cp = clips / f"{n}.mp4"
    zin = sc["nr"] % 2  # abwechselnd rein-/rauszoomen
    z = "1+0.0012*on" if zin else "1.09-0.0012*on"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", str(fp), "-vf",
                    f"scale=3840:-1,zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={FPS*SEC}:s={W}x{H}:fps={FPS},format=yuv420p",
                    "-frames:v", str(FPS * SEC), "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", str(cp)], check=True)
    lst.append(f"file '{cp}'")
(D / "build" / "list.txt").write_text("\n".join(lst))
out = D / "pip_und_pippin.mp4"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(D / "build" / "list.txt"),
                "-c", "copy", "-movflags", "+faststart", str(out)], check=True)
print(f"fertig: {out}  (echte Bilder: {real}/{len(scenes)})")
