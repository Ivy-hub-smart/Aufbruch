"""Pip und Pippin – animierter 1-Minuten-Film (20 Szenen x 3 s, 25 fps, 1280x720).
Figuren: freigestellte Ausschnitte aus den Referenzblättern (cutout.py).
Hintergründe, Bewegungen, Partikel, Untertitel und Musik werden hier erzeugt."""
import json, math, pathlib, random, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance

D = pathlib.Path(__file__).parent
W, H, FPS, SEC = 1280, 720, 25, 3
N = 20
FIG = {p.stem: Image.open(p).convert("RGBA") for p in (D / "figuren").glob("*.png")}
SCENES = json.loads((D.parent / "prompts.json").read_text(encoding="utf-8"))
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
F_SUB = ImageFont.truetype(FONT_B, 34)
F_BIG = ImageFont.truetype(FONT_B, 72)
F_BUB = ImageFont.truetype(FONT_B, 30)
rnd = random.Random(7)

# ---------------------------------------------------------------- Hilfen
def lerp(a, b, t): return a + (b - a) * t
def ease(t): t = max(0.0, min(1.0, t)); return t * t * (3 - 2 * t)
def lerpc(c1, c2, t): return tuple(int(lerp(a, b, t)) for a, b in zip(c1, c2))

def grad(w, h, top, bottom):
    a = np.linspace(0, 1, h)[:, None, None]
    arr = (np.array(top)[None, None] * (1 - a) + np.array(bottom)[None, None] * a)
    return Image.fromarray(np.repeat(arr, w, 1).astype(np.uint8), "RGB")

_cache = {}
def sprite(name, h, flip=False, rot=0, dark=0.0, squash=1.0):
    key = (name, int(h / 3) * 3, flip, int(round(rot)), round(dark, 1), round(squash, 2))
    if key not in _cache:
        im = FIG[name]
        hh = max(4, key[1]); ww = max(4, int(im.width * hh / im.height / key[5]))
        hh = max(4, int(hh * key[5]))
        im = im.resize((ww, hh), Image.LANCZOS)
        if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
        if key[4] > 0:
            a = im.getchannel("A")
            im = ImageEnhance.Brightness(im.convert("RGB")).enhance(1 - key[4]).convert("RGBA"); im.putalpha(a)
        if key[3]: im = im.rotate(key[3], resample=Image.BICUBIC, expand=True)
        _cache[key] = im
    return _cache[key]

def put(frame, name, cx, by, h, shadow=True, **kw):
    """Figur mit Fusspunkt (cx, by) und Höhe h einsetzen."""
    s = sprite(name, h, **kw)
    if shadow:
        sh = Image.new("RGBA", (int(s.width * 0.8), max(6, int(h * 0.08))), (0, 0, 0, 0))
        ImageDraw.Draw(sh).ellipse((0, 0, sh.width - 1, sh.height - 1), fill=(0, 0, 0, 70))
        frame.alpha_composite(sh.filter(ImageFilter.GaussianBlur(4)), (int(cx - sh.width / 2), int(by - sh.height / 2)))
    frame.alpha_composite(s, (int(cx - s.width / 2), int(by - s.height)))

def hop(t, freq=3.0, amp=14):
    return -abs(math.sin(t * math.pi * freq)) * amp

def bubble(frame, text, x, y, alpha=1.0):
    d = ImageDraw.Draw(frame)
    w = d.textlength(text, font=F_BUB) + 40
    a = int(255 * alpha)
    d.rounded_rectangle((x, y, x + w, y + 60), 28, fill=(255, 255, 255, a), outline=(60, 60, 60, a), width=3)
    d.polygon([(x + 40, y + 58), (x + 60, y + 58), (x + 30, y + 90)], fill=(255, 255, 255, a))
    d.text((x + 20, y + 13), text, font=F_BUB, fill=(40, 40, 40, a))

def heart(d, x, y, s, col):
    d.ellipse((x - s, y - s, x, y), fill=col); d.ellipse((x, y - s, x + s, y), fill=col)
    d.polygon([(x - s, y - s * 0.4), (x + s, y - s * 0.4), (x, y + s)], fill=col)

def star(d, x, y, r, col):
    pts = []
    for i in range(10):
        a = math.pi / 5 * i - math.pi / 2; rr = r if i % 2 == 0 else r * 0.45
        pts.append((x + rr * math.cos(a), y + rr * math.sin(a)))
    d.polygon(pts, fill=col)

# ---------------------------------------------------------------- Hintergründe (2x gezeichnet, dann verkleinert)
S2 = 2
def canvas(top, bottom):
    return grad(W * S2, H * S2, top, bottom).convert("RGBA")

def finish(img): return img.resize((W, H), Image.LANCZOS)

HOUSE_COLS = [(240, 170, 150), (250, 220, 150), (170, 210, 220), (200, 230, 180), (240, 200, 210), (230, 190, 140)]
ROOF_COLS = [(170, 70, 60), (140, 80, 70), (120, 60, 60), (90, 90, 110)]

def houses(d, base, n, hmin, hmax, seed, x0=0, x1=None, windows_lit=False):
    r = random.Random(seed); x1 = x1 or W * S2; x = x0
    while x < x1:
        w = r.randint(140, 230); h = r.randint(hmin, hmax); c = r.choice(HOUSE_COLS)
        d.rectangle((x, base - h, x + w, base), fill=c)
        d.polygon([(x - 12, base - h), (x + w / 2, base - h - w * 0.45), (x + w + 12, base - h)], fill=r.choice(ROOF_COLS))
        for wy in range(base - h + 30, base - 50, 70):
            for wx in range(x + 22, x + w - 40, 60):
                d.rectangle((wx, wy, wx + 30, wy + 38), fill=(255, 225, 120) if windows_lit else (110, 150, 190))
        x += w + r.randint(4, 20)

def oak(d, x, base, s=1.0, col=(70, 140, 60)):
    d.polygon([(x - 50 * s, base), (x - 30 * s, base - 380 * s), (x + 30 * s, base - 380 * s), (x + 50 * s, base)], fill=(110, 75, 50))
    d.line((x, base - 300 * s, x + 200 * s, base - 470 * s), fill=(110, 75, 50), width=int(34 * s))
    d.line((x, base - 330 * s, x - 190 * s, base - 460 * s), fill=(110, 75, 50), width=int(30 * s))
    r = random.Random(3)
    for _ in range(26):
        cx = x + r.uniform(-330, 330) * s; cy = base - r.uniform(420, 720) * s; rr = r.uniform(110, 170) * s
        cc = lerpc(col, (110, 180, 80), r.random())
        d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=cc)

def meadow(d, y, col=(120, 190, 90), flowers=True, seed=1):
    d.rectangle((0, y, W * S2, H * S2), fill=col)
    if flowers:
        r = random.Random(seed)
        for _ in range(260):
            fx, fy = r.uniform(0, W * S2), r.uniform(y + 20, H * S2)
            rr = 5 + (fy - y) / 90
            d.ellipse((fx - rr, fy - rr, fx + rr, fy + rr), fill=(255, 255, 255))
            d.ellipse((fx - rr / 2.5, fy - rr / 2.5, fx + rr / 2.5, fy + rr / 2.5), fill=(250, 210, 60))

def bg_town(sun_y):
    img = canvas((120, 170, 230), (255, 200, 150)); d = ImageDraw.Draw(img)
    d.ellipse((1700, sun_y, 1940, sun_y + 240), fill=(255, 230, 140))
    d.ellipse((-300, 1000, 1500, 1700), fill=(120, 180, 100)); d.ellipse((900, 950, 3000, 1800), fill=(100, 165, 90))
    d.rectangle((1180, 520, 1260, 1050), fill=(230, 220, 200)); d.polygon([(1160, 520), (1220, 360), (1280, 520)], fill=(150, 70, 60))
    houses(d, 1150, 0, 260, 420, 11)
    d.rectangle((0, 1150, W * S2, H * S2), fill=(160, 150, 140))
    return img

def bg_room(night=False):
    wall, floor = ((70, 75, 120), (70, 55, 50)) if night else ((250, 225, 190), (190, 140, 100))
    img = canvas(wall, lerpc(wall, (0, 0, 0), 0.1)); d = ImageDraw.Draw(img)
    d.rectangle((0, 1050, W * S2, H * S2), fill=floor)
    for x in range(0, W * S2, 160): d.line((x, 1050, x - 200, H * S2), fill=lerpc(floor, (0, 0, 0), 0.15), width=4)
    d.rectangle((1600, 200, 2300, 820), fill=(20, 30, 70) if night else (150, 200, 245))
    if night:
        d.ellipse((1980, 280, 2150, 450), fill=(250, 245, 210))
        for i in range(30):
            r = random.Random(i); star(d, r.uniform(1620, 2280), r.uniform(220, 800), 8, (255, 250, 200))
    else:
        d.ellipse((1680, 280, 1900, 380), fill=(255, 255, 255)); d.ellipse((1800, 250, 2050, 380), fill=(255, 255, 255))
    d.rectangle((1600, 200, 2300, 820), outline=(250, 250, 250), width=24); d.line((1950, 200, 1950, 820), fill=(250, 250, 250), width=18)
    d.line((1600, 510, 2300, 510), fill=(250, 250, 250), width=18)
    d.rectangle((300, 300, 600, 650), fill=(220, 120, 110) if not night else (90, 70, 100))  # Bild an der Wand
    d.rectangle((330, 330, 570, 620), fill=(255, 240, 200) if not night else (120, 110, 140))
    d.ellipse((800, 1140, 1760, 1400), fill=(150, 60, 60) if not night else (90, 40, 50))  # Körbchen
    d.ellipse((860, 1160, 1700, 1340), fill=(200, 90, 80) if not night else (120, 60, 70))
    return img

def bg_window():
    img = canvas((150, 200, 245), (230, 240, 250)); d = ImageDraw.Draw(img)
    houses(d, 1300, 0, 300, 500, 5)
    d.rectangle((0, 0, W * S2, 140), fill=(250, 225, 190)); d.rectangle((0, 1300, W * S2, H * S2), fill=(250, 225, 190))
    d.rectangle((0, 0, 200, H * S2), fill=(250, 225, 190)); d.rectangle((W * S2 - 200, 0, W * S2, H * S2), fill=(250, 225, 190))
    d.rectangle((200, 140, W * S2 - 200, 1300), outline=(255, 255, 255), width=40)
    d.line((W, 140, W, 1300), fill=(255, 255, 255), width=30)
    d.rectangle((150, 1260, W * S2 - 150, 1340), fill=(240, 240, 240))
    return img

def bg_sparkle():
    img = canvas((255, 220, 150), (250, 160, 120)); d = ImageDraw.Draw(img)
    for i in range(24):
        a = i / 24 * 2 * math.pi
        d.polygon([(W, H), (W + 2400 * math.cos(a), H + 2400 * math.sin(a)), (W + 2400 * math.cos(a + 0.12), H + 2400 * math.sin(a + 0.12))], fill=(255, 235, 180))
    return img

def bg_door():
    img = canvas((150, 200, 245), (220, 235, 250)); d = ImageDraw.Draw(img)
    d.rectangle((0, 0, 1500, 1150), fill=(245, 200, 160))
    d.rectangle((300, 200, 900, 1150), fill=(60, 110, 170)); d.rectangle((340, 240, 860, 1110), outline=(40, 80, 140), width=10)
    d.ellipse((780, 650, 820, 690), fill=(230, 190, 80))
    d.rounded_rectangle((470, 880, 730, 1150), 20, fill=(40, 70, 110))
    d.rectangle((0, 1150, W * S2, H * S2), fill=(160, 150, 140))
    d.ellipse((1700, 900, 2300, 1250), fill=(90, 160, 80)); meadow(d, 1150, (120, 190, 90), seed=4)
    d.rectangle((0, 1150, 1500, H * S2), fill=(175, 165, 150))
    return img

def bg_street(w_mult=2):
    img = grad(W * S2 * w_mult, H * S2, (140, 190, 240), (230, 240, 250)).convert("RGBA"); d = ImageDraw.Draw(img)
    houses(d, 1100, 0, 450, 700, 9, x1=W * S2 * w_mult)
    d.rectangle((0, 1100, W * S2 * w_mult, H * S2), fill=(170, 160, 150))
    r = random.Random(2)
    for y in range(1110, H * S2, 40):
        for x in range(r.randint(-40, 0), W * S2 * w_mult, 70):
            d.ellipse((x, y, x + 62, y + 34), fill=lerpc((150, 140, 130), (190, 180, 170), r.random()))
    return img

def bg_market():
    img = canvas((150, 200, 245), (230, 240, 250)); d = ImageDraw.Draw(img)
    houses(d, 900, 0, 300, 480, 21)
    d.rectangle((0, 900, W * S2, H * S2), fill=(180, 170, 155))
    for i, x in enumerate(range(-100, W * S2, 700)):
        c = [(220, 70, 70), (60, 140, 200), (240, 170, 50), (80, 170, 100)][i % 4]
        for k in range(8):
            d.rectangle((x + k * 75, 620, x + k * 75 + 75, 720), fill=c if k % 2 == 0 else (255, 255, 255))
        d.rectangle((x + 20, 720, x + 40, 1100), fill=(120, 90, 60)); d.rectangle((x + 560, 720, x + 580, 1100), fill=(120, 90, 60))
        d.rectangle((x + 20, 950, x + 580, 1010), fill=(150, 110, 70))
        r = random.Random(i)
        for _ in range(40):
            fx, fy = x + r.uniform(40, 560), r.uniform(900, 950)
            d.ellipse((fx - 18, fy - 18, fx + 18, fy + 18), fill=r.choice([(230, 50, 40), (250, 160, 30), (250, 220, 60), (120, 190, 60)]))
    return img

def crates(d):
    for i, (x, y) in enumerate([(1300, 1200), (1560, 1200), (1430, 1020)]):
        d.rectangle((x, y, x + 250, y + 180), fill=(180, 130, 80), outline=(130, 90, 50), width=8)
        for k in range(3): d.line((x, y + 45 + k * 45, x + 250, y + 45 + k * 45), fill=(140, 100, 60), width=6)
        r = random.Random(i)
        for _ in range(9):
            fx = x + r.uniform(30, 220); d.ellipse((fx - 26, y - 30, fx + 26, y + 22), fill=r.choice([(230, 50, 40), (250, 160, 30), (120, 190, 60)]))

def bg_park(tree_x=1900, s=1.0):
    img = canvas((120, 180, 240), (220, 240, 250)); d = ImageDraw.Draw(img)
    d.ellipse((-400, 700, 1600, 1300), fill=(110, 175, 90)); d.ellipse((1000, 650, 3200, 1300), fill=(100, 165, 85))
    meadow(d, 1000, seed=8)
    d.ellipse((200, 1080, 1000, 1240), fill=(100, 170, 220)); d.ellipse((260, 1100, 940, 1220), fill=(130, 190, 235))
    oak(d, tree_x, 1150, s)
    return img

def bg_oak_close():
    img = canvas((120, 180, 240), (200, 230, 250)); d = ImageDraw.Draw(img)
    meadow(d, 1250, seed=3)
    d.polygon([(1000, H * S2), (1120, 0), (1500, 0), (1600, H * S2)], fill=(110, 75, 50))
    for y in range(100, 1400, 120): d.arc((1150, y, 1450, y + 90), 200, 340, fill=(90, 60, 40), width=8)
    d.line((1350, 420, 2560, 250), fill=(110, 75, 50), width=70)
    r = random.Random(5)
    for _ in range(40):
        cx, cy, rr = r.uniform(-100, 2700), r.uniform(-200, 250), r.uniform(150, 260)
        d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=lerpc((60, 130, 55), (110, 180, 80), r.random()))
    return img

def bg_sunset():
    img = canvas((90, 70, 140), (255, 150, 80)); d = ImageDraw.Draw(img)
    d.ellipse((1100, 700, 1500, 1100), fill=(255, 210, 120))
    d.ellipse((-600, 1050, 3200, 2400), fill=(60, 40, 60))
    return img

def leaves_pile(d, x, y, w, h, seed=0, explode=0.0):
    r = random.Random(seed)
    for _ in range(int(w * h / 90)):
        a = r.uniform(0, 2 * math.pi); rr = r.random() ** 0.5
        px, py = x + math.cos(a) * w / 2 * rr, y - abs(math.sin(a)) * h * rr
        if explode:
            px += math.cos(a) * explode * r.uniform(100, 300); py -= explode * r.uniform(100, 350) - explode ** 2 * 300
        c = r.choice([(200, 90, 40), (230, 150, 40), (180, 60, 40), (240, 190, 60), (120, 150, 50)])
        d.ellipse((px - 9, py - 6, px + 9, py + 6), fill=c)

# ---------------------------------------------------------------- Szenen (t = 0..1 innerhalb der Szene)
BG = {}
def bg(key, fn, *a):
    if key not in BG: BG[key] = finish(fn(*a)) if fn is not bg_street else fn(*a).resize((W * 2, H), Image.LANCZOS)
    return BG[key].copy()

PARTS = [(rnd.uniform(0, W), rnd.uniform(0, H), rnd.uniform(0.6, 1.4), rnd.random()) for _ in range(60)]

def s01(t):
    img = finish(bg_town(lerp(1000, 380, ease(t))))
    d = ImageDraw.Draw(img); a = int(255 * ease((t - 0.3) * 3))
    txt = "Pip und Pippin"; w = d.textlength(txt, font=F_BIG)
    d.text(((W - w) / 2, 140), txt, font=F_BIG, fill=(255, 255, 255, a), stroke_width=5, stroke_fill=(120, 60, 40, a))
    return img
def s02(t):
    img = bg("room", bg_room); d = ImageDraw.Draw(img)
    br = 1 + 0.03 * math.sin(t * 2 * math.pi * 2)
    put(img, "pip_back", 640, 670, 230 * br, shadow=False)
    for i in range(3):
        k = (t * 1.5 + i / 3) % 1
        d.text((700 + k * 80 + i * 10, 420 - k * 160), "z", font=ImageFont.truetype(FONT_B, int(30 + 25 * k)), fill=(90, 90, 160, int(255 * (1 - k))))
    return img
def s03(t):
    img = bg("window", bg_window)
    tap = math.sin(t * math.pi * 8) * 10
    put(img, "pippin_face", 640 + tap, 600, 330 + 15 * ease(t), shadow=False)
    if (t * 4) % 1 < 0.5: bubble(img, "Tock, tock!", 820, 160)
    return img
def s04(t):
    img = bg("spark", bg_sparkle); d = ImageDraw.Draw(img)
    for i in range(10):
        a = i / 10 * 2 * math.pi + t * 2; r = 300 + 20 * math.sin(t * 10 + i)
        star(d, 640 + r * math.cos(a), 380 + r * math.sin(a) * 0.7, 14 + 6 * math.sin(t * 12 + i), (255, 255, 255))
    put(img, "pip_face2", 640, 640, lerp(380, 470, ease(t)), shadow=False, rot=6 * math.sin(t * math.pi * 6))
    return img
def s05(t):
    img = bg("door", bg_door)
    x = lerp(300, 520, ease(t / 0.7))
    put(img, "pip_front", x, 610 + hop(t, 2, 8), 220, flip=True)
    put(img, "pippin_front", 950, 620 + hop(t, 1.5, 6), 250)
    return img
def s06(t):
    st = bg("street", bg_street)
    off = int(lerp(0, W, t)); img = st.crop((off, 0, off + W, H)).convert("RGBA")
    put(img, "pippin_side", 520, 670 + hop(t, 4, 14), 210)
    put(img, "pip_side", 780, 680 + hop(t + 0.15, 4, 16), 200)
    return img
def s07(t):
    if "market" not in BG:
        im = bg_market(); crates(ImageDraw.Draw(im)); BG["market"] = finish(im)
    img = BG["market"].copy()
    put(img, "pippin_side", 760, 515, 200, shadow=False, rot=8 * math.sin(t * math.pi * 4))
    put(img, "pip_face2", 330, 690 + hop(t, 3, 10), 230, shadow=False)
    return img
def s08(t):
    img = bg("park", bg_park)
    x = lerp(-150, 520, ease(t))
    put(img, "pippin_side", x + 130, 640 + hop(t, 4, 10), 150)
    put(img, "pip_side", x, 650 + hop(t + 0.1, 4, 10), 145)
    return img
def windleaves(img, t, n=60, speed=1.0):
    d = ImageDraw.Draw(img)
    for (x, y, s, ph) in PARTS[:n]:
        px = (x + t * 900 * speed * s) % (W + 100) - 50; py = (y + 60 * math.sin(t * 8 + ph * 6)) % H
        d.ellipse((px - 10 * s, py - 6 * s, px + 10 * s, py + 6 * s), fill=(110 + int(ph * 120), 150, 50))
def s09(t):
    img = bg("park", bg_park)
    k = ease(t)
    put(img, "pippin_side", lerp(400, 900, k), lerp(650, 260, ease((t - 0.35) / 0.65)), 140, rot=lerp(0, 35, ease((t - 0.35) * 3)))
    windleaves(img, t, 60, 1.4)
    return img
def s10(t):
    img = bg("oakc", bg_oak_close)
    put(img, "pippin_front", 980, 230, 170, shadow=False, rot=6 * math.sin(t * math.pi * 3))
    windleaves(img, t, 15, 0.4)
    return img
def s11(t):
    img = bg("oakc", bg_oak_close)
    z = lerp(1.4, 1.9, ease(t)); cw, ch = W / z, H / z
    cx = min(max(980, cw / 2), W - cw / 2); cy = min(max(160, ch / 2), H - ch / 2)
    crop = img.crop((int(cx - cw / 2), int(cy - ch / 2), int(cx + cw / 2), int(cy + ch / 2))).resize((W, H), Image.LANCZOS)
    put(crop, "pippin_front", 640 + 4 * math.sin(t * 60), 640, 420, shadow=False)
    if t > 0.25: bubble(crop, "Miau! Hilfe!", 820, 120, ease((t - 0.25) * 4))
    return crop
def s12(t):
    img = bg("oakc", bg_oak_close)
    nudge = 25 * max(0, math.sin(t * math.pi * 4))
    put(img, "pip_side", 760 - nudge, 690, 220)
    return img
def s13(t):
    img = bg("park2", bg_park, 1050, 1.25); d = ImageDraw.Draw(img)
    for i in range(6):
        star(d, 640 + 260 * math.cos(i + t * 3), 300 + 180 * math.sin(i + t * 3), 12, (255, 240, 150))
    put(img, "pip_front", 640, 700, lerp(380, 460, ease(t)))
    return img
def s14(t):
    img = bg("oakc", bg_oak_close); d = ImageDraw.Draw(img)
    x = lerp(150, 480, ease(t))
    leaves_pile(d, x + 170, 690, lerp(120, 300, ease(t)), lerp(40, 110, ease(t)), seed=1)
    put(img, "pip_side", x, 690 + hop(t, 3, 6), 180)
    return img
def s15(t):
    img = bg("oakc", bg_oak_close); d = ImageDraw.Draw(img)
    leaves_pile(d, 650, 700, 300, 110, seed=1)
    put(img, "pip_front", 650, 640 + hop(t, 2.5, 18), 230, shadow=False)
    bubble(img, "Spring, Pippin!", 720, 330)
    return img
def s16(t):
    img = bg("oakc", bg_oak_close); d = ImageDraw.Draw(img)
    leaves_pile(d, 650, 700, 300, 110, seed=1)
    put(img, "pip_front", 520, 650, 200, shadow=False)
    k = ease(t)
    x = lerp(980, 680, k); y = lerp(230, 640, t ** 2) - math.sin(t * math.pi) * 120
    put(img, "pippin_front", x, y, 170, shadow=False, rot=lerp(0, -30, k))
    return img
def s17(t):
    img = bg("oakc", bg_oak_close); d = ImageDraw.Draw(img)
    put(img, "pip_face2", 520, 690 + hop(t, 3, 8), 200, shadow=False)
    put(img, "pippin_face", 780, 690 + hop(t + 0.2, 3, 8), 190, shadow=False)
    leaves_pile(d, 650, 720, 360, 80, seed=2)
    leaves_pile(d, 650, 680, 300, 90, seed=3, explode=ease(t * 1.4))
    return img
def s18(t):
    img = bg("park", bg_park); d = ImageDraw.Draw(img)
    k = ease(t / 0.6)
    put(img, "pip_front", lerp(380, 560, k), 680, 300, flip=True)
    put(img, "pippin_front", lerp(900, 730, k), 685, 310)
    for i in range(7):
        q = (t * 1.2 + i / 7) % 1
        heart(d, 520 + i * 40 + 30 * math.sin(q * 6 + i), 380 - q * 300, 18, (240, 80, 110, int(255 * (1 - q))))
    return img
def s19(t):
    img = bg("sunset", bg_sunset)
    put(img, "pip_side", 560, 560, 150, shadow=False, dark=0.9)
    put(img, "pippin_side", 720, 555, 160, shadow=False, dark=0.9, flip=True)
    o = Image.new("RGBA", (W, H), (40, 20, 60, int(90 * t))); img.alpha_composite(o)
    return img
def s20(t):
    img = bg("night", bg_room, True); d = ImageDraw.Draw(img)
    br = 1 + 0.03 * math.sin(t * 2 * math.pi * 1.5)
    put(img, "pippin_back", 720, 660, 200 * br, shadow=False, dark=0.35)
    put(img, "pip_back", 570, 670, 220 * br, shadow=False, dark=0.35)
    for i in range(3):
        k = (t * 1.2 + i / 3) % 1
        d.text((760 + k * 70, 380 - k * 140), "z", font=ImageFont.truetype(FONT_B, int(28 + 22 * k)), fill=(200, 200, 255, int(255 * (1 - k))))
    if t > 0.6: img.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, int(255 * ease((t - 0.6) / 0.4)))))
    return img

SCENE_FN = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20]

def subtitle(img, text, alpha):
    if not text or alpha <= 0: return
    d = ImageDraw.Draw(img); a = int(255 * alpha)
    w = d.textlength(text, font=F_SUB)
    d.text(((W - w) / 2, H - 70), text, font=F_SUB, fill=(255, 255, 255, a), stroke_width=3, stroke_fill=(0, 0, 0, a))

# ---------------------------------------------------------------- Musik (einfache Kinderlied-Melodie)
def music(path, seconds):
    sr = 44100; n = int(sr * seconds); out = np.zeros(n)
    bpm = 100; beat = 60 / bpm
    notes = {"C4": 261.6, "D4": 293.7, "E4": 329.6, "F4": 349.2, "G4": 392.0, "A4": 440.0, "B4": 493.9, "C5": 523.3, "D5": 587.3, "E5": 659.3}
    mel = ("E4 G4 C5 G4 A4 G4 E4 - F4 A4 C5 A4 G4 - - - E4 G4 C5 E5 D5 C5 A4 - G4 E4 D4 E4 C4 - - -").split()
    chords = [("C4", "E4", "G4"), ("F4", "A4", "C5"), ("C4", "E4", "G4"), ("G4", "B4", "D5")]
    t_axis = np.arange(n) / sr
    i, t0 = 0, 0.0
    while t0 < seconds:
        nm = mel[i % len(mel)]
        if nm != "-":
            s, e = int(t0 * sr), min(n, int((t0 + beat * 0.95) * sr)); tt = t_axis[s:e] - t0
            env = np.minimum(1, tt * 40) * np.exp(-tt * 3)
            out[s:e] += 0.22 * env * (np.sin(2 * np.pi * notes[nm] * tt) + 0.3 * np.sin(4 * np.pi * notes[nm] * tt))
        t0 += beat / 2 if i % 4 in (1, 3) and nm != "-" else beat / 2; i += 1
    bar = beat * 4; k = 0
    while k * bar < seconds:
        s, e = int(k * bar * sr), min(n, int((k + 1) * bar * sr)); tt = t_axis[s:e] - k * bar
        env = np.minimum(1, tt * 3) * np.minimum(1, (bar - tt) * 3)
        for nm in chords[k % 4]:
            out[s:e] += 0.05 * env * np.sin(np.pi * notes[nm] * tt)
        k += 1
    fade = np.minimum(1, np.minimum(t_axis / 1.0, (seconds - t_axis) / 2.5))
    out = out * fade; out /= max(1e-6, np.abs(out).max()) / 0.8
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((out * 32767).astype(np.int16).tobytes())

# ---------------------------------------------------------------- Render
def render_scene(i, t):
    img = SCENE_FN[i](t).convert("RGBA")
    if img.size != (W, H): img = img.resize((W, H))
    return img

def main():
    build = D / "build"; build.mkdir(exist_ok=True)
    wav = build / "musik.wav"; music(wav, N * SEC)
    out = D.parent / "pip_und_pippin.mp4"
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                           "-i", "-", "-i", str(wav), "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
                           "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", str(out)], stdin=subprocess.PIPE)
    XF = 6  # Überblendung in Frames
    per = FPS * SEC
    for f in range(N * per):
        i, k = divmod(f, per); t = k / per
        img = render_scene(i, t)
        if k >= per - XF and i + 1 < N:   # weich in die nächste Szene überblenden
            nxt = render_scene(i + 1, 0.0)
            img = Image.blend(img, nxt, (k - (per - XF) + 1) / (XF + 1))
        if i == 0 and k < 12:
            img = Image.blend(Image.new("RGBA", (W, H), (0, 0, 0, 255)), img, k / 12)
        vo = SCENES[i]["sprecher"]
        subtitle(img, vo, min(1, k / 6, (per - k) / 6))
        ff.stdin.write(img.convert("RGB").tobytes())
        if k == 0: print("Szene", i + 1, flush=True)
    ff.stdin.close(); ff.wait()
    print("fertig:", out)

if __name__ == "__main__":
    main()
