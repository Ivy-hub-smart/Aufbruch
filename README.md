# 11.11. – Aufruf: 1111 Follower

6-Sekunden-Video (1080×1920, 30 fps, Hochformat für Reels/TikTok/Stories),
gebaut mit **HyperFrames** und **Remotion**:

| Teil | Tool | Datei |
|---|---|---|
| Hintergrund, Lichtstrahlen, Ringe, Zähler 0 → 1111, Konfetti | HyperFrames | `hyperframes/bg/index.html` |
| Kopf-Foto, Text „Hilf mir am 11.11. zu 1111 Followern!“, Button „JETZT FOLGEN!“ | Remotion | `remotion/src/Aufruf1111.tsx` |

Fertiges Video: `remotion/out/aufruf-1111.mp4`

## Video 2: „Gemeinsam wachsen“

6 Sekunden, Foto vollflächig: „Lasst uns einander stärken – Gemeinsam wachsen –
Gemeinsam ans Ziel – Folgt mir, ich folge euch!“ mit @aufbruchsvision und
Fortschrittsbalken „11.11. · Ziel: 1111 Follower“.

| Teil | Tool | Datei |
|---|---|---|
| Foto mit Zoom, Sonnenlicht, Abdunklung, Lichtblitz | HyperFrames | `hyperframes/photo/index.html` |
| Texte, Ziel-Leiste, @aufbruchsvision | Remotion | `remotion/src/GemeinsamWachsen.tsx` |

Fertiges Video: `remotion/out/gemeinsam-wachsen.mp4`

## Video 3: Tanz-Video

6 Sekunden mit eigenem Beat (120 BPM): Freisteller aus dem Bootsfoto „tanzt“
im Takt (Wippen, Hüpfen, Drehen) vor Disco-Lichtern. Texte: „Lasst uns gemeinsam
wachsen! – 11.11. · Ziel: 1111 Follower – Folgt mir, ich folge euch!“

| Teil | Tool | Datei |
|---|---|---|
| Freistellen (`hyperframes remove-background`), Tanzbewegung, Lichter | HyperFrames | `hyperframes/dance/index.html` |
| Texte im Takt, @aufbruchsvision, Musik | Remotion | `remotion/src/TanzVideo.tsx`, `remotion/scripts/beat.py` |

Fertiges Video: `remotion/out/tanz-video.mp4`

## Eigenes Foto einsetzen

Ersetze `remotion/public/kopf.png` durch dein Foto (quadratisch, Gesicht mittig) und rendere neu.

## Rendern

```bash
npm run install:all
npx --prefix hyperframes hyperframes browser ensure   # Chrome für HyperFrames
npm run render                                        # erst HyperFrames, dann Remotion
```

Ohne Zugriff auf remotion.media kann Remotion einen vorhandenen Chrome nutzen:
`REMOTION_BROWSER=/pfad/zu/headless_shell npm run render`
