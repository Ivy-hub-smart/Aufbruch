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

## Video 4: „Was, wenn ich es nicht schaffe?“

6 Sekunden, Freisteller der Frau aus dem Urlaubsfoto. Bis 3 s grau mit Regen
(„Was, wenn ich es nicht schaffe? – …finanziell frei zu sein? Ein zweites
Standbein?“), dann Lichtblitz und Urlaubstraum in Farbe mit Sonne, Meer und
Palmen („Und was, wenn doch? – Zweifeln ist erlaubt. Aufgeben nicht.“).

| Teil | Tool | Datei |
|---|---|---|
| Freisteller, Regen, Umschwung Grau → Farbe, Sonne, Palmen | HyperFrames | `hyperframes/traum/index.html` |
| Texte, @aufbruchsvision | Remotion | `remotion/src/ZweifelTraum.tsx` |

Fertiges Video: `remotion/out/zweifel-traum.mp4`

## Video 5: „Meine Wünsche bekommen ein Gesicht“ (KI-Zwilling)

6 Sekunden. Sonntagabend unter Sternen, die Uhr rast, ich in Grau („Sonntagabend.
Morgen gehört meine Zeit wieder anderen.“). Dann löst sich mein Zwilling als
leuchtendes Hologramm aus mir heraus („Meine Wünsche bekommen ein Gesicht.“),
Lichtblitz, Morgenlicht, der Zwilling wird echt („Ich will meine Zeit selbst
bestimmen.“).

| Teil | Tool | Datei |
|---|---|---|
| Nacht, Uhr, Zwilling mit Hologramm-Linien, Morgenlicht | HyperFrames | `hyperframes/zwilling/index.html` |
| Texte, @aufbruchsvision | Remotion | `remotion/src/Zwilling.tsx` |

Fertiges Video: `remotion/out/zwilling.mp4`

## Serie „2. Einkommen mit KI“ (8 Videos)

Acht Videos à 10 Sekunden. Ich laufe am See oder im Wind, dazu je ein KI-Tipp:
Überschrift, drei Schritte als Karten, Fazit und „Speichern & folgen“.

| Nr | Tipp | Szene | Video |
|---|---|---|---|
| 1 | Digitale Produkte verkaufen | Morgen am See, Karomantel am Steg | `remotion/out/ki-tipp-1.mp4` |
| 2 | Social Media für lokale Firmen | Wind auf der Wiese | `remotion/out/ki-tipp-2.mp4` |
| 3 | Kurzvideos ohne Stress | Abend am Steg | `remotion/out/ki-tipp-3.mp4` |
| 4 | Prompt-Vorlagen verkaufen | Gegenwind am Ufer | `remotion/out/ki-tipp-4.mp4` |
| 5 | Affiliate mit KI-Content | Morgen am See | `remotion/out/ki-tipp-5.mp4` |
| 6 | Print-on-Demand mit KI-Designs | Wind auf der Wiese | `remotion/out/ki-tipp-6.mp4` |
| 7 | Bring anderen KI bei | Abend am Steg | `remotion/out/ki-tipp-7.mp4` |
| 8 | Dranbleiben schlägt Talent | Gegenwind am Ufer | `remotion/out/ki-tipp-8.mp4` |

| Teil | Tool | Datei |
|---|---|---|
| Morgen am See: Berge, Sonnenaufgang, Nebel, Schilf zieht vorbei | HyperFrames | `hyperframes/see-morgen/index.html` |
| Abend am Steg: Sonnenuntergang, Segelboote, Sonnenpfad | HyperFrames | `hyperframes/see-abend/index.html` |
| Wind auf der Wiese: Wolken jagen, Gras wogt, Blätter fliegen | HyperFrames | `hyperframes/wind-wiese/index.html` |
| Gegenwind am Ufer: Sturm und Wellen, dann bricht die Sonne durch | HyperFrames | `hyperframes/wind-ufer/index.html` |
| Tipps, Karten, Fazit, @aufbruchsvision | Remotion | `remotion/src/KiTippVideo.tsx`, Texte in `remotion/src/kiTipps.ts` |

### Texte selbst ändern

Jeder Text ist änderbar: Etikett oben, Überschrift (`small`, `big`), die drei
Schritte (`steps`), `fazit` und `cta`.

1. **Dauerhaft:** in `remotion/src/kiTipps.ts` die Wörter zwischen den
   Anführungszeichen ersetzen (geht auch direkt auf GitHub mit dem Stift-Symbol),
   dann `npm run render:ki-tipps`.
2. **Ausprobieren in Remotion Studio:** `cd remotion && npx remotion studio`,
   Tipp links wählen, rechts unter „Props“ die Texte tippen, Vorschau sofort,
   dann „Render“.
3. **Einmalig beim Rendern:**

```bash
cd remotion
npx remotion render KiTipp1 out/ki-tipp-1-neu.mp4 --props='{"nr":1,"big":"Mein Titel","steps":["Eins","Zwei","Drei"],"fazit":"Mein Fazit"}'
```

Nicht angegebene Texte bleiben wie in `kiTipps.ts`.

### Mit deinem eigenen Spaziergang-Video

Filme dich im Hochformat beim Laufen am See oder im Wind, lege das Video als
`remotion/public/mein-spaziergang.mp4` ab und rendere einen Tipp darüber:

```bash
cd remotion
npx remotion render KiTipp1 out/ki-tipp-1-echt.mp4 --props='{"nr":1,"clip":"mein-spaziergang.mp4"}'
```

Das Video sollte mindestens 10 Sekunden lang sein. Oben im Bild ist Platz für den Text.

## Eigenes Foto einsetzen

Ersetze `remotion/public/kopf.png` durch dein Foto (quadratisch, Gesicht mittig) und rendere neu.

## Rendern

```bash
npm run install:all
npx --prefix hyperframes hyperframes browser ensure   # Chrome für HyperFrames
npm run render                                        # erst HyperFrames, dann Remotion
```

Ohne Zugriff auf remotion.media kann Remotion einen vorhandenen Chrome nutzen:
`REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell npm run render`
