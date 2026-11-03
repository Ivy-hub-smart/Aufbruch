"""Klang zum Earth-Zoom auf den Weihnachtsmann (eigene Synthese, lizenzfrei).

python3 santa-sound.py public/santa-sound.wav

0–3.2 s    Weltraum-Klangteppich mit Glitzern (Nordlicht), Rauschen steigt an
2.6–3.8 s  Whoosh durch die Wolken
3.3–7 s    Winterwind im Sinkflug, Schlittenglöckchen kommen näher
7.15 s     sanfter Aufschlag, warmer Akkord: die Hütte leuchtet auf
7.25 s     "Ho! Ho! Ho!" (Formant-Synthese)
7.6–12 s   "Jingle Bells" (Refrain, gemeinfrei, 1857) als Glockenspiel,
           dazu Schlittenglöckchen im Takt und Glöckchen, wenn die Lichter angehen
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = 12.0
n = int(SR * DUR)
t = np.arange(n) / SR
rng = np.random.default_rng(2412)
L = np.zeros(n)
R = np.zeros(n)


def smooth(a, b, x):
    y = np.clip((x - a) / (b - a), 0, 1)
    return y * y * (3 - 2 * y)


def onepole(x, cutoff):
    """Tiefpass mit zeitlich veränderlicher Grenzfrequenz (Array oder Zahl)."""
    c = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = 1 - np.exp(-2 * np.pi * c / SR)
    y = np.empty_like(x)
    s = 0.0
    for i in range(len(x)):
        s += a[i] * (x[i] - s)
        y[i] = s
    return y


def add(sig, start=0.0, pan=0.0, gain=1.0):
    i = int(start * SR)
    end = min(n, i + len(sig))
    s = sig[: end - i] * gain
    L[i:end] += s * np.sqrt(0.5 * (1 - pan))
    R[i:end] += s * np.sqrt(0.5 * (1 + pan))


def ton(f, dauer, obert=(1.0,), amp=(1.0,), att=0.01, dec=1.0):
    tt = np.arange(int(dauer * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * f * o * tt) for o, a in zip(obert, amp))
    return s * np.minimum(1, tt / att) * np.exp(-tt / dec)



# --- Weltraum-Teppich: F-Dur-Fläche, leicht verstimmt ---
huelle = smooth(0, 1.5, t) * (1 - smooth(3.0, 4.0, t) * 0.6) * (1 - smooth(6.6, 7.3, t) * 0.75)
for f, g in [(87.31, 0.5), (130.81, 0.35), (174.61, 0.25), (220.0, 0.18), (261.63, 0.1)]:
    for d, p in [(-0.6, -0.6), (0.6, 0.6)]:
        v = np.sin(2 * np.pi * (f + d) * t + rng.random() * 6) + 0.3 * np.sin(2 * np.pi * 2 * (f + d) * t)
        add(v * huelle * g * 0.12, pan=p)

# --- Glitzern (Nordlicht über der Erde) ---
for k in range(40):
    zeit = 0.3 + rng.random() * 2.8
    add(ton(2200 + rng.random() * 3500, 1.2, att=0.004, dec=0.35), zeit, pan=rng.random() * 1.6 - 0.8, gain=0.018)

# --- Rauschen, das bis in die Wolken ansteigt ---
weiss = rng.standard_normal(n)
steig = onepole(weiss, 200 + 5000 * smooth(0.5, 3.2, t) ** 2)
steig *= smooth(0.3, 3.15, t) ** 2 * (1 - smooth(3.2, 3.9, t))
add(steig * 0.22, pan=-0.2)
add(np.roll(steig, 300) * 0.22, pan=0.2)

# --- Whoosh durch die Wolken ---
w = onepole(rng.standard_normal(n), 400 + 3500 * np.exp(-((t - 3.2) / 0.35) ** 2))
w *= np.exp(-((t - 3.2) / 0.32) ** 2)
pan = np.tanh((t - 3.2) * 4)
L += w * np.sqrt(0.5 * (1 - pan)) * 0.9
R += w * np.sqrt(0.5 * (1 + pan)) * 0.9

# --- Winterwind im Sinkflug ---
wind = onepole(rng.standard_normal(n), 350 + 400 * np.sin(t * 1.1) ** 2)
wind *= smooth(3.2, 3.8, t) * (1 - smooth(6.6, 7.6, t)) * (0.65 + 0.35 * np.sin(t * 1.7))
add(wind * 0.35, pan=-0.3)
add(np.roll(wind, 800) * 0.35, pan=0.3)


# --- Schlittenglöckchen: kurzes metallisches Klingeln ---
def schelle(laut=1.0):
    d = 0.35
    tt = np.arange(int(d * SR)) / SR
    s = np.zeros_like(tt)
    for k in range(3):  # mehrere Schellen gleichzeitig, leicht versetzt
        o = int(rng.random() * 0.012 * SR)
        f0 = 3800 + rng.random() * 1800
        seg = sum(a * np.sin(2 * np.pi * f0 * m * tt + rng.random() * 6) for m, a in [(1, 1), (1.47, 0.6), (2.09, 0.4), (2.56, 0.25)])
        seg *= np.exp(-tt * (14 + rng.random() * 8))
        s[o:] += seg[: len(s) - o]
    rausch = onepole(rng.standard_normal(len(tt)), 9000) - onepole(rng.standard_normal(len(tt)), 3000)
    s += rausch * np.exp(-tt * 40) * 0.8
    return s * laut


# kommen im Sinkflug näher (unregelmässig, leise)
z = 4.0
while z < 7.1:
    add(schelle(0.04 + 0.1 * smooth(4.0, 7.0, z)), z, pan=np.sin(z * 2) * 0.5)
    z += 0.17 + rng.random() * 0.06

# --- Spannung: Rückwärts-Becken in den Aufschlag ---
rev = onepole(rng.standard_normal(n), 6000) - onepole(rng.standard_normal(n), 1500)
rev *= smooth(5.9, 7.12, t) ** 3 * (t < 7.15)
add(rev * 0.3)

# --- Aufschlag: weicher Sub-Boom (wie in Schnee) ---
tt = np.arange(int(2.5 * SR)) / SR
boom = np.sin(2 * np.pi * (38 * tt + 30 * (1 - np.exp(-tt * 9)) / 9)) * np.exp(-tt * 2.4)
add(boom * 0.7, 7.15)
add(onepole(rng.standard_normal(len(tt)), 700) * np.exp(-tt * 7) * 0.5, 7.15)

# --- Warmer Akkord: C-Dur ---
akk = smooth(7.1, 8.0, t) * (1 - smooth(11.3, 12.0, t)) * 0.75
for f, g in [(65.41, 0.45), (130.81, 0.3), (164.81, 0.24), (196.0, 0.22), (261.63, 0.14)]:
    for d, p in [(-0.8, -0.5), (0.8, 0.5)]:
        ph = rng.random() * 6
        v = np.sin(2 * np.pi * (f + d) * t + ph) + 0.35 * np.sin(2 * np.pi * 2 * (f + d) * t + ph)
        add(v * akk * g * 0.12, pan=p)


# --- "Ho! Ho! Ho!": Stimmimpulse durch Vokal-Formanten (o) ---
def resonator(x, f, bw):
    r = np.exp(-np.pi * bw / SR)
    a1, a2 = -2 * r * np.cos(2 * np.pi * f / SR), r * r
    y = np.zeros_like(x)
    y1 = y2 = 0.0
    g = 1 - r
    for i in range(len(x)):
        y0 = g * x[i] - a1 * y1 - a2 * y2
        y[i] = y0
        y2, y1 = y1, y0
    return y


def ho(f0, dauer=0.3):
    tt = np.arange(int(dauer * SR)) / SR
    f = f0 * (1.06 - 0.12 * tt / dauer)
    ph = np.cumsum(f) / SR
    puls = (ph % 1.0) * 2 - 1 - 0.0
    puls = np.sign(np.sin(2 * np.pi * ph)) * 0.2 + puls * 0.8
    stimme = smooth(0.04, 0.07, tt) * (1 - smooth(dauer * 0.6, dauer, tt))
    hauch = onepole(rng.standard_normal(len(tt)), 2500) * (1 - smooth(0.0, 0.07, tt)) * smooth(0, 0.01, tt) * 0.5
    q = puls * stimme + hauch
    v = resonator(q, 450, 80) * 1.0 + resonator(q, 800, 90) * 0.6 + resonator(q, 2600, 160) * 0.12
    return v * (1 + 0.1 * np.sin(2 * np.pi * 5 * tt))


hoho = np.concatenate([ho(118), np.zeros(int(0.03 * SR)), ho(112), np.zeros(int(0.03 * SR)), ho(104, 0.42)])
hoho /= np.abs(hoho).max()
add(hoho * 0.55, 7.25, pan=0.0)

# --- Jingle Bells (Refrain) als Glockenspiel, 200 BPM ---
glsp = dict(obert=(1.0, 2.76, 5.4, 8.93), amp=(1.0, 0.4, 0.18, 0.08), att=0.002, dec=0.9)
E, G, C, D, F = 659.25, 783.99, 523.25, 587.33, 698.46
q = 60 / 200
melodie = [(E, 1), (E, 1), (E, 2), (E, 1), (E, 1), (E, 2), (E, 1), (G, 1), (C, 1.5), (D, 0.5), (E, 4)]
zeit = 7.75
schlaege = []
for f, l in melodie:
    add(ton(f, 2.5, **glsp), zeit, pan=0.15, gain=0.12)
    add(ton(f * 2, 1.5, **glsp), zeit, pan=-0.15, gain=0.03)
    zeit += l * q
# Begleitung: Bass und Akkord-Tupfer
for k, (bass, akk3) in enumerate([(130.81, (261.63, 329.63, 392.0))] * 4 + [(98.0, (246.94, 293.66, 392.0))] * 1 + [(130.81, (261.63, 329.63, 392.0))] * 2):
    z0 = 7.75 + k * 2 * q
    add(ton(bass, 1.0, obert=(1, 2, 3), amp=(1, 0.3, 0.1), att=0.01, dec=0.5), z0, gain=0.12)
    for f in akk3:
        add(ton(f, 0.6, obert=(1, 2), amp=(1, 0.2), att=0.005, dec=0.25), z0 + q, pan=rng.random() - 0.5, gain=0.035)
# Schlittenglöckchen im Achteltakt
z = 7.75
while z < 11.6:
    add(schelle(0.11 if int(round((z - 7.75) / (q / 2))) % 2 == 0 else 0.06), z, pan=0.35)
    z += q / 2

# --- Glöckchen, wenn die Lichter angehen ---
for zeit, f, p in [(7.15, 1567.98, -0.3), (7.45, 2093.0, 0.4), (7.8, 1760.0, -0.5), (8.1, 2349.32, 0.5), (8.5, 3135.96, 0.0)]:
    add(ton(f, 2.0, obert=(1.0, 2.76, 5.4), amp=(1.0, 0.4, 0.15), att=0.003, dec=0.9), zeit, pan=p, gain=0.05)
for k in range(16):
    add(ton(3000 + rng.random() * 2500, 0.5, att=0.002, dec=0.12), 7.45 + k * 0.05, pan=rng.random() * 1.6 - 0.8, gain=0.02)

# --- Hall (Faltung mit abklingendem Rauschen) ---
ir_len = int(2.4 * SR)
ir_t = np.arange(ir_len) / SR
for kanal in (0, 1):
    ir = rng.standard_normal(ir_len) * np.exp(-ir_t * 2.6)
    ir = onepole(ir, 5000)
    ir /= np.sqrt((ir ** 2).sum())
    x = L if kanal == 0 else R
    m = 1 << int(np.ceil(np.log2(n + ir_len)))
    nass = np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(ir, m), m)[:n]
    if kanal == 0:
        L = x + nass * 0.35
    else:
        R = x + nass * 0.35

# Ein- und Ausblenden, normalisieren
fade = smooth(0, 0.3, t) * (1 - smooth(11.4, 12.0, t))
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * 0.89, R / peak * 0.89

out = sys.argv[1] if len(sys.argv) > 1 else "santa-sound.wav"
data = (np.stack([L, R], axis=1) * 32767).astype(np.int16)
with wave.open(out, "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes(data.tobytes())
print("geschrieben:", out)
