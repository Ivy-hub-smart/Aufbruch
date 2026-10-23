# 11.11. – Aufruf: 1111 Follower

6-Sekunden-Video (1080×1920, 30 fps, Hochformat für Reels/TikTok/Stories),
gebaut mit **HyperFrames** und **Remotion**:

| Teil | Tool | Datei |
|---|---|---|
| Hintergrund, Lichtstrahlen, Ringe, Zähler 0 → 1111, Konfetti | HyperFrames | `hyperframes/bg/index.html` |
| Kopf-Foto, Text „Hilf mir am 11.11. zu 1111 Followern!“, Button „JETZT FOLGEN!“ | Remotion | `remotion/src/Aufruf1111.tsx` |

Fertiges Video: `remotion/out/aufruf-1111.mp4`

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
