"""Eigener Ukulele-Beat für die KI-Reels (eigene Synthese, lizenzfrei).

python3 ki-beat.py tipps  public/ki-beat.wav       # 112,5 BPM, Wechsel alle 3 Schläge
python3 ki-beat.py folge  public/folge-mir-beat.wav  # 90 BPM, wärmer, mit Klavier
Jeder Bildwechsel fällt auf einen Schlag und bekommt einen hellen Glocken-Ton.
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = 12.0
FPS = 30
n = int(SR * DUR)
rng = np.random.default_rng(2026)

MODE = sys.argv[1]
if MODE == "tipps":
    BPM = 112.5  # 1 Schlag = 16 Frames
    CUTS = [64, 112, 160, 208, 256, 304]  # Frames, wie CUTS in KiTippVideo.tsx
else:
    BPM = 90.0  # 1 Schlag = 20 Frames
    CUTS = [40 * i for i in range(1, 8)]  # wie SZENE in FolgeMir.tsx
beat = 60 / BPM

L = np.zeros(n)
R = np.zeros(n)


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= n:
        return
    end = min(n, i + len(sig))
    s = sig[: end - i] * gain
    L[i:end] += s * (1 - pan) / 2 * 2 ** 0.5
    R[i:end] += s * (1 + pan) / 2 * 2 ** 0.5


def hz(note):
    return 440 * 2 ** ((note - 69) / 12)


def pluck(freq, dur=1.2, bright=0.5):
    """Karplus-Strong: klingt wie eine gezupfte Saite (Ukulele)."""
    period = int(SR / freq)
    buf = rng.uniform(-1, 1, period)
    out = np.zeros(int(SR * dur))
    for i in range(len(out)):
        j = i % period
        out[i] = buf[j]
        buf[j] = 0.996 * ((1 - bright) * buf[j] + bright * buf[(j + 1) % period])
    return out * np.exp(-np.arange(len(out)) / SR * 2.2)


def piano(freq, dur=2.5):
    t = np.arange(int(SR * dur)) / SR
    tone = sum(np.sin(2 * np.pi * freq * k * t) / k ** 1.6 for k in range(1, 6))
    return tone * np.exp(-t * 1.6) * np.minimum(1, t * 200) * 0.25


def glock(freq):
    t = np.arange(int(SR * 1.2)) / SR
    return (np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * freq * 2.76 * t)) * np.exp(-t * 4) * 0.22


def kick():
    t = np.arange(int(0.3 * SR)) / SR
    f = 45 + 90 * np.exp(-t * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10) * 0.7


def clap():
    t = np.arange(int(0.18 * SR)) / SR
    env = np.exp(-t * 30) + 0.6 * np.exp(-np.maximum(t - 0.012, 0) * 30) * (t > 0.012)
    noise = rng.uniform(-1, 1, len(t))
    noise = np.convolve(noise, [1, -1], "same")  # heller
    return noise * env * 0.16


def shaker():
    t = np.arange(int(0.07 * SR)) / SR
    noise = np.convolve(rng.uniform(-1, 1, len(t)), [1, -1], "same")
    return noise * np.sin(np.pi * t / t[-1]) * 0.05


def bass(freq, dur):
    t = np.arange(int(SR * dur)) / SR
    return np.sin(2 * np.pi * freq * t) * np.exp(-t * 2.5) * np.minimum(1, t * 300) * 0.35


# I–V–vi–IV in C: C, G, Am, F (Ukulele-Griffe als MIDI-Noten)
CHORDS = [[60, 64, 67, 72], [59, 62, 67, 71], [57, 60, 64, 69], [57, 60, 65, 69]]
ROOTS = [36, 43, 45, 41]

bars = int(DUR / (4 * beat)) + 1
for bar in range(bars):
    t0 = bar * 4 * beat
    chord = CHORDS[bar % 4]
    if MODE == "tipps":
        # Strum-Muster: ab, ab-auf, auf-ab-auf (Achtel)
        for eighth, down in [(0, True), (2, True), (3, False), (5, False), (6, True), (7, False)]:
            notes = chord if down else chord[::-1]
            for k, note in enumerate(notes):
                add(pluck(hz(note), bright=0.55 if down else 0.4), t0 + eighth * beat / 2 + k * 0.012, pan=-0.25, gain=0.34 if down else 0.22)
    else:
        for k, note in enumerate(chord):
            add(piano(hz(note)), t0 + k * 0.02, gain=0.9)
        for eighth in range(8):
            if bar >= 1:
                note = chord[[0, 2, 1, 3, 2, 3, 1, 2][eighth]] + 12
                add(pluck(hz(note), dur=0.8, bright=0.45), t0 + eighth * beat / 2, pan=0.3, gain=0.16)
    # Hook-Takt bleibt leicht, danach kommt der Groove
    groove = bar >= 1
    for b in range(4):
        tb = t0 + b * beat
        if groove and b in (0, 2):
            add(kick(), tb, gain=0.45 if MODE == "tipps" else 0.3)
            add(bass(hz(ROOTS[bar % 4]), beat * 1.8), tb, gain=0.45)
        if groove and b in (1, 3):
            add(clap(), tb, pan=0.1, gain=1.6)
        if groove and MODE == "tipps":
            add(shaker(), tb + beat / 2, pan=0.4)
            add(shaker(), tb, pan=0.4, gain=0.6)

# heller Glocken-Ton auf jedem Bildwechsel, steigt bis zum Aufruf
melody = [72, 74, 76, 79, 76, 81, 84]
for i, f in enumerate(CUTS):
    add(glock(hz(melody[i % len(melody)] + 12)), f / FPS, pan=0.2 * (-1) ** i)

# Schluss: ausklingen lassen
fade = np.ones(n)
fl = int(0.6 * SR)
fade[-fl:] = np.linspace(1, 0, fl) ** 2
mix = np.stack([L * fade, R * fade], axis=1)
mix = mix / np.max(np.abs(mix)) * 0.85
pcm = (mix * 32767).astype(np.int16)

with wave.open(sys.argv[2], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"{sys.argv[2]}: {BPM} BPM, {DUR} s")
