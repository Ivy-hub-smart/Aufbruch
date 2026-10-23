"""Erzeugt einen 6-Sekunden-Dance-Beat mit 120 BPM (eigene Synthese, lizenzfrei)."""
import sys
import numpy as np
import wave

SR = 44100
BPM = 120
DUR = 6.0
beat = 60 / BPM
n = int(SR * DUR)
out = np.zeros(n)
rng = np.random.default_rng(1111)


def add(sig, start):
    i = int(start * SR)
    end = min(n, i + len(sig))
    out[i:end] += sig[: end - i]


def kick():
    t = np.arange(int(0.35 * SR)) / SR
    freq = 50 + 120 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 9) * 0.9


def clap():
    t = np.arange(int(0.2 * SR)) / SR
    return rng.uniform(-1, 1, len(t)) * np.exp(-t * 25) * 0.35


def hat():
    t = np.arange(int(0.05 * SR)) / SR
    noise = rng.uniform(-1, 1, len(t))
    return np.diff(noise, prepend=0) * np.exp(-t * 90) * 0.18


def chord(freqs, length):
    t = np.arange(int(length * SR)) / SR
    env = np.minimum(1, t * 40) * np.exp(-t * 3)
    saw = sum(2 * ((t * f) % 1) - 1 for f in freqs) / len(freqs)
    return saw * env * 0.18


# Akkordfolge Am – F – C – G (je ein Takt = 4 Schläge)
chords = [[220, 261.6, 329.6], [174.6, 220, 261.6], [261.6, 329.6, 392], [196, 246.9, 293.7]]
bass = [110, 87.3, 130.8, 98]
for i in range(int(DUR / beat)):
    t0 = i * beat
    add(kick(), t0)
    if i % 2 == 1:
        add(clap(), t0)
    add(hat(), t0 + beat / 2)
    bar = (i // 4) % 4
    if i % 4 == 0:
        add(chord(chords[bar], beat * 4), t0)
    tb = np.arange(int(beat / 2 * SR)) / SR
    add(np.sin(2 * np.pi * bass[bar] * tb) * np.exp(-tb * 6) * 0.35, t0 + beat / 2)

# kurzes Ausblenden am Ende
fade = int(0.3 * SR)
out[-fade:] *= np.linspace(1, 0, fade)
out = np.tanh(out * 1.3) * 0.8
pcm = (out * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
