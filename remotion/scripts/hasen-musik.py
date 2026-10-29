"""Fröhliche Kinder-Melodie für den Hoppelhasen (eigene Synthese, lizenzfrei).

python3 hasen-musik.py public/hasen-musik.wav

150 BPM: 1 Schlag = 12 Frames, jeder Hasen-Hopser (24 Frames) dauert 2 Schläge,
die Landungen fallen also auf den Takt. Ukulele, Glockenspiel-Melodie, Bass, Shaker.
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = 8.0
n = int(SR * DUR)
rng = np.random.default_rng(1111)
BPM = 150.0
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


def pluck(freq, dur=0.8, bright=0.5):
    """Karplus-Strong: klingt wie eine gezupfte Saite (Ukulele)."""
    period = int(SR / freq)
    buf = rng.uniform(-1, 1, period)
    out = np.zeros(int(SR * dur))
    for i in range(len(out)):
        j = i % period
        out[i] = buf[j]
        buf[j] = 0.996 * ((1 - bright) * buf[j] + bright * buf[(j + 1) % period])
    return out * np.exp(-np.arange(len(out)) / SR * 3)


def glock(freq, dur=0.9):
    t = np.arange(int(SR * dur)) / SR
    return (np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * freq * 2.76 * t)) * np.exp(-t * 5) * 0.4


def bass(freq, dur):
    t = np.arange(int(SR * dur)) / SR
    return np.sin(2 * np.pi * freq * t) * np.exp(-t * 4) * np.minimum(1, t * 300) * 0.4


def shaker():
    t = np.arange(int(0.06 * SR)) / SR
    noise = np.convolve(rng.uniform(-1, 1, len(t)), [1, -1], "same")
    return noise * np.sin(np.pi * t / t[-1]) * 0.05


def tock():
    """Holzblock: kurzer, hüpfender Klack."""
    t = np.arange(int(0.08 * SR)) / SR
    return np.sin(2 * np.pi * 900 * t) * np.exp(-t * 60) * 0.35


# C – F – G – C, dann Schluss auf C (Ukulele-Griffe als MIDI-Noten)
CHORDS = [[60, 64, 67, 72], [60, 65, 69, 72], [59, 62, 67, 71], [60, 64, 67, 72], [60, 64, 67, 72]]
ROOTS = [36, 41, 43, 36, 36]
# Melodie in Achteln (None = Pause), ein Takt pro Zeile
MELODIE = [
    [72, None, 76, None, 79, 76, 72, None],
    [77, None, 81, None, 77, 76, 74, None],
    [74, 76, 77, 79, 77, 74, 71, None],
    [72, 76, 79, 84, 79, 76, 72, None],
    [84, None, None, None, None, None, None, None],
]

for bar, chord in enumerate(CHORDS):
    t0 = bar * 4 * beat
    schluss = bar == len(CHORDS) - 1
    # Ukulele: Schlagmuster ab-ab-auf auf jedem Schlag, am Schluss nur ein Akkord
    for b in range(1 if schluss else 4):
        for k, note in enumerate(chord):
            add(pluck(hz(note), 1.6 if schluss else 0.8), t0 + b * beat + k * 0.012, pan=-0.3, gain=0.22)
        if not schluss:
            for k, note in enumerate(reversed(chord)):
                add(pluck(hz(note), 0.4, 0.7), t0 + (b + 0.5) * beat + k * 0.01, pan=-0.3, gain=0.12)
    # Bass: Grundton und Quinte im Wechsel (hüpfend)
    for b in range(1 if schluss else 4):
        root = ROOTS[bar] + (7 if b % 2 else 0)
        add(bass(hz(root), beat * 0.9), t0 + b * beat, gain=0.9)
    # Glockenspiel-Melodie
    for k, note in enumerate(MELODIE[bar]):
        if note is not None:
            add(glock(hz(note), 1.6 if schluss else 0.9), t0 + k * beat / 2, pan=0.3, gain=0.75)
    # Rhythmus: Holzblock auf 2 und 4, Shaker in Achteln
    if not schluss:
        for b in (1, 3):
            add(tock(), t0 + b * beat, pan=0.2)
        for k in range(8):
            add(shaker(), t0 + k * beat / 2, pan=0.4, gain=1.0 if k % 2 else 0.6)

fade = np.ones(n)
fl = int(0.5 * SR)
fade[-fl:] = np.linspace(1, 0, fl) ** 2
mix = np.stack([L * fade, R * fade], axis=1)
mix = mix / np.max(np.abs(mix)) * 0.85
# lauter für Handy-Lautsprecher: sanft begrenzen statt nur normalisieren
mix = np.tanh(mix * 2.2) / np.tanh(2.2) * 0.95
pcm = (mix * 32767).astype(np.int16)

with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"{sys.argv[1]}: {BPM} BPM, {DUR} s")
