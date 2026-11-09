"""Klang für das Reel „Dieser Prompt ist bares Geld“ (eigene Synthese, lizenzfrei).

python3 ki-prompt-sound.py public/ki-prompt-sound.wav

Unter dem Ukulele-Beat aus ki-beat.py (19 s, leiser): Tastatur-Klicks beim Tippen des
Prompts, „Senden“-Plopp, leise Ticks beim Schreiben der KI, ein Pop pro Nische,
kurzer Whoosh bei jedem Untertitel, Riser und Aufschlag vor dem Aufruf.
Die Zeiten müssen zu KI_PROMPT in src/KiPrompt.tsx passen.
"""
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np

SR = 44100
DUR = 19.0
n = int(SR * DUR)
rng = np.random.default_rng(1111)

PROMPT_VON, PROMPT_BIS = 1.0, 4.6
ANTWORT_VON = 5.6
NISCHEN = [ANTWORT_VON + 1.7 + i * 1.2 for i in range(5)]
UNTERTITEL = [0.0, 1.3, 2.8, 4.0, 5.6, 7.0, 8.4, 9.7, 11.1, 12.3, 13.6]
CTA = 15.0

# Beat aus ki-beat.py als Bett
tmp = os.path.join(tempfile.mkdtemp(), "bett.wav")
subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), "ki-beat.py"), "tipps", tmp, str(DUR)], check=True)
with wave.open(tmp) as w:
    bett = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2) / 32767.0
L = np.zeros(n)
R = np.zeros(n)
m = min(n, len(bett))
L[:m] += bett[:m, 0] * 0.45
R[:m] += bett[:m, 1] * 0.45


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= n:
        return
    s = sig[: n - i] * gain
    L[i : i + len(s)] += s * (1 - pan) / 2 * 2 ** 0.5
    R[i : i + len(s)] += s * (1 + pan) / 2 * 2 ** 0.5


def taste(hell=1.0):
    t = np.arange(int(0.05 * SR)) / SR
    knack = rng.standard_normal(len(t)) * np.exp(-t * 260)
    ton = np.sin(2 * np.pi * (1800 + 600 * hell) * t) * np.exp(-t * 400) * 0.4
    return (np.diff(knack, prepend=0) * 0.8 + ton) * 0.5


def plopp(f0=900, f1=300):
    t = np.arange(int(0.12 * SR)) / SR
    f = np.linspace(f0, f1, len(t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30) * 0.6


def whoosh(dauer=0.35, gain=1.0):
    t = np.arange(int(dauer * SR)) / SR
    rausch = rng.standard_normal(len(t))
    # einfacher Tiefpass, der sich öffnet
    out = np.zeros(len(t))
    a = np.linspace(0.05, 0.5, len(t))
    for i in range(1, len(t)):
        out[i] = out[i - 1] + a[i] * (rausch[i] - out[i - 1])
    hull = np.sin(np.pi * t / dauer) ** 2
    return out * hull * 0.35 * gain


def riser(dauer=1.0):
    t = np.arange(int(dauer * SR)) / SR
    f = 200 * (8 ** (t / dauer))
    ton = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.15
    return (ton + whoosh(dauer, 1.2)) * (t / dauer) ** 2


def aufschlag():
    t = np.arange(int(0.8 * SR)) / SR
    f = 110 * np.exp(-t * 6) + 40
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5) * 0.9


def glocke(freq):
    t = np.arange(int(1.2 * SR)) / SR
    return (np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * freq * 2.76 * t)) * np.exp(-t * 4) * 0.25


# Tippen: unregelmässige Anschläge, ab und zu Leertaste (tiefer)
t = PROMPT_VON
while t < PROMPT_BIS:
    add(taste(rng.uniform(0.3, 1.2)), t, pan=rng.uniform(-0.3, 0.3), gain=rng.uniform(0.6, 1.0))
    t += rng.uniform(0.045, 0.11)
add(plopp(500, 1400), PROMPT_BIS + 0.25, gain=0.8)  # Senden

# KI schreibt: leise, schnelle Ticks
t = ANTWORT_VON
while t < ANTWORT_VON + 1.6:
    add(taste(1.5), t, pan=0.2, gain=0.22)
    t += 0.035

melodie = [72, 74, 76, 79, 81]
for i, tn in enumerate(NISCHEN):
    add(plopp(1200, 600), tn, pan=0.15 * (-1) ** i, gain=0.7)
    add(glocke(440 * 2 ** ((melodie[i] + 12 - 69) / 12)), tn, gain=0.6)

for i, tu in enumerate(UNTERTITEL):
    add(whoosh(0.28, 0.7), max(0, tu - 0.12), pan=0.3 * (-1) ** i)

add(riser(1.0), CTA - 1.0)
add(aufschlag(), CTA, gain=1.0)
for k, note in enumerate([72, 76, 79, 84]):
    add(glocke(440 * 2 ** ((note - 69) / 12)), CTA + 0.4 + k * 0.08, pan=-0.3 + k * 0.2, gain=0.7)

fade = np.ones(n)
fl = int(0.8 * SR)
fade[-fl:] = np.linspace(1, 0, fl) ** 2
mix = np.stack([L * fade, R * fade], axis=1)
mix = mix / np.max(np.abs(mix))
mix = np.tanh(mix * 1.8) / np.tanh(1.8) * 0.95
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"{sys.argv[1]}: {DUR} s")
