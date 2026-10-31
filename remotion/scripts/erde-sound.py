"""Klang zum Earth-Zoom auf die Luxusvilla (eigene Synthese, lizenzfrei).

python3 erde-sound.py public/erde-sound.wav

0–3.2 s   tiefer Weltraum-Klangteppich, Rauschen steigt an
2.6–3.8 s Whoosh durch die Wolken
3.3–7 s   Wind im Sinkflug, Spannung
7.15 s    sanfter Aufschlag, warmer Akkord: die Villa leuchtet auf
7.15–8.6  Glöckchen, wenn Fenster, Garten, Palmen und Dach angehen
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = 10.0
n = int(SR * DUR)
t = np.arange(n) / SR
rng = np.random.default_rng(4373)
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


# --- Weltraum-Teppich: D-Moll, leicht verstimmte Stimmen ---
huelle = smooth(0, 1.5, t) * (1 - smooth(3.0, 4.0, t) * 0.6) * (1 - smooth(6.6, 7.3, t) * 0.7)
for f, g in [(73.42, 0.5), (110.0, 0.35), (146.83, 0.25), (174.61, 0.18), (220.0, 0.1)]:
    for d, p in [(-0.6, -0.6), (0.6, 0.6)]:
        v = np.sin(2 * np.pi * (f + d) * t + rng.random() * 6) + 0.3 * np.sin(2 * np.pi * 2 * (f + d) * t)
        add(v * huelle * g * 0.12, pan=p)

# --- Rauschen, das bis in die Wolken ansteigt ---
weiss = rng.standard_normal(n)
steig = onepole(weiss, 200 + 5000 * smooth(0.5, 3.2, t) ** 2)
steig *= smooth(0.3, 3.15, t) ** 2 * (1 - smooth(3.2, 3.9, t))
add(steig * 0.22, pan=-0.2)
add(np.roll(steig, 300) * 0.22, pan=0.2)

# --- Whoosh durch die Wolken (Stereo-Schwenk) ---
w = onepole(rng.standard_normal(n), 400 + 3500 * np.exp(-((t - 3.2) / 0.35) ** 2))
w *= np.exp(-((t - 3.2) / 0.32) ** 2)
pan = np.tanh((t - 3.2) * 4)
L += w * np.sqrt(0.5 * (1 - pan)) * 0.9
R += w * np.sqrt(0.5 * (1 + pan)) * 0.9

# --- Wind im Sinkflug ---
wind = onepole(rng.standard_normal(n), 300 + 250 * np.sin(t * 1.3) ** 2)
wind *= smooth(3.2, 3.8, t) * (1 - smooth(6.4, 7.4, t)) * (0.7 + 0.3 * np.sin(t * 2.1))
add(wind * 0.35, pan=-0.3)
add(np.roll(wind, 800) * 0.35, pan=0.3)

# --- Spannung: Rückwärts-Becken in den Aufschlag ---
rev = onepole(rng.standard_normal(n), 6000) - onepole(rng.standard_normal(n), 1500)
rev *= smooth(5.9, 7.12, t) ** 3 * (t < 7.15)
add(rev * 0.35)

# --- Aufschlag: Sub-Boom ---
tt = np.arange(int(2.5 * SR)) / SR
boom = np.sin(2 * np.pi * (34 * tt + 30 * (1 - np.exp(-tt * 9)) / 9)) * np.exp(-tt * 2.2)
add(boom * 0.8, 7.15)
add(onepole(rng.standard_normal(len(tt)), 900) * np.exp(-tt * 9) * 0.6, 7.15)

# --- Warmer Akkord: D-Dur, schwillt nach dem Aufschlag an ---
akk = smooth(7.1, 8.2, t) * (1 - smooth(9.4, 10.0, t))
for f, g in [(73.42, 0.45), (146.83, 0.3), (185.0, 0.24), (220.0, 0.22), (293.66, 0.16), (369.99, 0.1)]:
    for d, p in [(-0.8, -0.5), (0.8, 0.5)]:
        ph = rng.random() * 6
        v = np.sin(2 * np.pi * (f + d) * t + ph) + 0.35 * np.sin(2 * np.pi * 2 * (f + d) * t + ph) + 0.12 * np.sin(2 * np.pi * 3 * (f + d) * t)
        add(v * akk * g * 0.13, pan=p)

# --- Glöckchen beim Einschalten der Lichter ---
glocke = dict(obert=(1.0, 2.76, 5.4, 8.93), amp=(1.0, 0.45, 0.22, 0.1), att=0.003, dec=1.1)
for zeit, f, p in [(7.15, 1174.66, -0.3), (7.45, 1479.98, 0.3), (7.8, 1760.0, -0.5), (8.0, 1479.98, 0.5),
                   (8.15, 2349.32, 0.0), (8.35, 1760.0, -0.2), (8.5, 2959.96, 0.3)]:
    add(ton(f, 3.0, **glocke), zeit, pan=p, gain=0.09)
# kleines Funkeln dazwischen
for k in range(18):
    zeit = 7.8 + k * 0.045
    add(ton(3000 + rng.random() * 2500, 0.5, att=0.002, dec=0.12), zeit, pan=rng.random() * 1.6 - 0.8, gain=0.025)

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
fade = smooth(0, 0.3, t) * (1 - smooth(9.5, 10.0, t))
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * 0.89, R / peak * 0.89

out = sys.argv[1] if len(sys.argv) > 1 else "erde-sound.wav"
data = (np.stack([L, R], axis=1) * 32767).astype(np.int16)
with wave.open(out, "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes(data.tobytes())
print("geschrieben:", out)
