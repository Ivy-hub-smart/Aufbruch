"""Klang zum Earth-Zoom nach Bern vor das Bundeshaus (eigene Synthese, lizenzfrei).

python3 bern-sound.py public/bern-sound.wav

0–3.2 s    Weltraum-Klangteppich, Rauschen steigt an
2.6–3.8 s  Whoosh durch die Wolken
3.3–7 s    Höhenwind im Sinkflug
7.15 s     sanfter Aufschlag, warmer Akkord in F-Dur
7.3 s      die Wasserspiele auf dem Bundesplatz rauschen auf
7.6 s      Kirchenglocken aus der Altstadt (Münster), Tauben flattern
8.0–12 s   Alphorn-Ruf (nur Naturtöne), Glöckchen, wenn Jean den Hut zieht (9.3 s)
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = 12.0
n = int(SR * DUR)
t = np.arange(n) / SR
rng = np.random.default_rng(1848)
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
    if i >= n:
        return
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
for k in range(25):
    add(ton(2200 + rng.random() * 3000, 1.2, att=0.004, dec=0.35), 0.3 + rng.random() * 2.8, pan=rng.random() * 1.6 - 0.8, gain=0.015)

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

# --- Höhenwind im Sinkflug ---
wind = onepole(rng.standard_normal(n), 350 + 500 * np.sin(t * 1.1) ** 2)
wind *= smooth(3.2, 3.8, t) * (1 - smooth(6.6, 7.6, t)) * (0.65 + 0.35 * np.sin(t * 1.7))
add(wind * 0.32, pan=-0.3)
add(np.roll(wind, 800) * 0.32, pan=0.3)

# --- Spannung: Rückwärts-Becken in den Aufschlag ---
rev = onepole(rng.standard_normal(n), 6000) - onepole(rng.standard_normal(n), 1500)
rev *= smooth(5.9, 7.12, t) ** 3 * (t < 7.15)
add(rev * 0.3)

# --- Aufschlag: weicher Sub-Boom ---
tt = np.arange(int(2.5 * SR)) / SR
boom = np.sin(2 * np.pi * (38 * tt + 30 * (1 - np.exp(-tt * 9)) / 9)) * np.exp(-tt * 2.4)
add(boom * 0.7, 7.15)
add(onepole(rng.standard_normal(len(tt)), 700) * np.exp(-tt * 7) * 0.5, 7.15)

# --- Warmer Akkord: F-Dur ---
akk = smooth(7.1, 8.0, t) * (1 - smooth(11.3, 12.0, t)) * 0.65
for f, g in [(87.31, 0.45), (174.61, 0.3), (220.0, 0.24), (261.63, 0.22), (349.23, 0.12)]:
    for d, p in [(-0.8, -0.5), (0.8, 0.5)]:
        ph = rng.random() * 6
        v = np.sin(2 * np.pi * (f + d) * t + ph) + 0.35 * np.sin(2 * np.pi * 2 * (f + d) * t + ph)
        add(v * akk * g * 0.12, pan=p)

# --- Wasserspiele: Plätschern und Rauschen der 26 Düsen ---
wasser = onepole(rng.standard_normal(n), 5000) - onepole(rng.standard_normal(n), 900)
wasser *= smooth(7.3, 8.0, t) * (1 - smooth(11.4, 12.0, t)) * (0.75 + 0.25 * np.sin(t * 2.2))
add(wasser * 0.2, pan=-0.25)
add(np.roll(wasser, 1500) * 0.2, pan=0.25)
for k in range(140):  # einzelne Tropfen
    zeit = 7.4 + rng.random() * 4.4
    f0 = 900 + rng.random() * 2200
    tt = np.arange(int(0.05 * SR)) / SR
    tropf = np.sin(2 * np.pi * (f0 + 4000 * tt) * tt) * np.exp(-tt * 90)
    add(tropf, zeit, pan=rng.random() * 1.4 - 0.7, gain=0.025)


# --- Kirchenglocken (unharmonische Teiltöne wie bei echten Glocken) ---
def glocke(f, dauer=4.0):
    tt = np.arange(int(dauer * SR)) / SR
    teile = [(0.5, 0.5, 2.2), (1.0, 1.0, 1.4), (1.19, 0.6, 1.1), (1.5, 0.45, 0.9), (2.0, 0.4, 0.7), (2.52, 0.25, 0.5), (3.0, 0.15, 0.4)]
    s = sum(a * np.sin(2 * np.pi * f * m * tt + rng.random() * 6) * np.exp(-tt / d) for m, a, d in teile)
    s *= 1 + 0.15 * np.sin(2 * np.pi * 2.3 * tt)  # Schwebung
    return s * np.minimum(1, tt / 0.003)


for k, (zeit, f) in enumerate([(7.6, 349.23), (8.35, 293.66), (9.1, 261.63), (9.85, 349.23), (10.6, 293.66), (11.3, 261.63)]):
    add(glocke(f), zeit, pan=-0.55, gain=0.075)

# --- Tauben flattern auf ---
for k in range(10):
    zeit = 7.35 + k * 0.07 + rng.random() * 0.04
    tt = np.arange(int(0.07 * SR)) / SR
    flap = onepole(rng.standard_normal(len(tt)), 2500) * np.sin(np.pi * tt / 0.07) ** 2
    add(flap, zeit, pan=0.3 + rng.random() * 0.4, gain=0.15 * (1 - k / 12))


# --- Alphorn in F: Naturtöne (8.–12. Oberton klingen typisch "alphornig") ---
def alphorn(f, dauer):
    tt = np.arange(int(dauer * SR)) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 4.8 * tt) * smooth(0.25, 0.6, tt)
    ph = np.cumsum(f * vib) / SR
    s = sum(a * np.sin(2 * np.pi * m * ph) for m, a in [(1, 1.0), (2, 0.55), (3, 0.3), (4, 0.16), (5, 0.08), (6, 0.04)])
    huelle = smooth(0, 0.09, tt) * (1 - smooth(dauer - 0.25, dauer, tt))
    atem = onepole(rng.standard_normal(len(tt)), 1800) * 0.04 * smooth(0, 0.05, tt)
    return (s * huelle + atem) * (0.85 + 0.15 * smooth(0, 0.3, tt))


GRUND = 43.65  # tiefes F
phrase = [(6, 0.35), (8, 0.35), (9, 0.35), (10, 0.7), (8, 0.35), (11, 0.5), (10, 0.35), (8, 0.9)]
zeit = 8.0
for ober, l in phrase:
    add(alphorn(GRUND * ober, l + 0.25), zeit, pan=0.35, gain=0.1)
    add(alphorn(GRUND * ober, l + 0.25), zeit + 0.32, pan=-0.6, gain=0.025)  # Echo von den Bergen
    zeit += l

# --- Glöckchen, wenn Jean den Hut zieht ---
for zeit, f, p in [(9.3, 1396.91, -0.2), (9.42, 1760.0, 0.1), (9.54, 2093.0, 0.3), (10.0, 2793.83, 0.0)]:
    add(ton(f, 2.0, obert=(1.0, 2.76, 5.4), amp=(1.0, 0.4, 0.15), att=0.003, dec=0.9), zeit, pan=p, gain=0.05)

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

out = sys.argv[1] if len(sys.argv) > 1 else "bern-sound.wav"
data = (np.stack([L, R], axis=1) * 32767).astype(np.int16)
with wave.open(out, "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes(data.tobytes())
print("geschrieben:", out)
