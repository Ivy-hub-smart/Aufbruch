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

## Serie „2. Einkommen mit KI“ (8 Reels)

Acht Reels à 12 Sekunden im Stil des Karussells: Navy und Creme, Logo-Wellen,
überall die gut lesbare fette Schrift (Montserrat). Musik: eigener Ukulele-Beat
mit 112,5 BPM (`remotion/scripts/ki-beat.py`, lizenzfrei), jeder Bildwechsel fällt
auf den Takt und bekommt einen Glocken-Ton. Jedes Reel beginnt mit einer Hook, danach
wechselt das Bild alle 1,6 Sekunden: Titel, drei Schritte, „Merke dir“, Aufruf.
Es gibt nur zwei Fotos, abwechselnd: Hocke am Steg und schwarzer Blazer.

| Nr | Hook | Tipp | Video |
|---|---|---|---|
| 1 | Einmal erstellen. Immer wieder verkaufen. | Digitale Produkte | `remotion/out/ki-tipp-1.mp4` |
| 2 | Jedes Café in deiner Stadt braucht das. | Social Media für lokale Firmen | `remotion/out/ki-tipp-2.mp4` |
| 3 | Spazieren gehen und dabei Content machen? | Kurzvideos ohne Stress | `remotion/out/ki-tipp-3.mp4` |
| 4 | Deine Prompts sind bares Geld wert. | Prompt-Vorlagen verkaufen | `remotion/out/ki-tipp-4.mp4` |
| 5 | Empfehlen statt verkaufen – und trotzdem verdienen. | Affiliate mit KI-Content | `remotion/out/ki-tipp-5.mp4` |
| 6 | Deine Idee auf 1000 Tassen – ohne Risiko. | Print-on-Demand | `remotion/out/ki-tipp-6.mp4` |
| 7 | Was du heute über KI lernst, suchen andere morgen. | Bring anderen KI bei | `remotion/out/ki-tipp-7.mp4` |
| 8 | Warum die meisten aufgeben – und du nicht. | Dranbleiben schlägt Talent | `remotion/out/ki-tipp-8.mp4` |

| Teil | Tool | Datei |
|---|---|---|
| Creme-Hintergrund: unscharfer See, Schleier, Logo-Wellen, Lichtpunkte | HyperFrames | `hyperframes/creme/index.html` |
| Schnitte, Fotos, Hook, Schritte, Fazit, Aufruf, Logo | Remotion | `remotion/src/KiTippVideo.tsx`, Texte in `remotion/src/kiTipps.ts` |
| Fotos | – | `remotion/public/foto-hocke.jpg`, `remotion/public/foto-blazer.png` |

```bash
npm run render:ki-szenen   # Creme-Hintergrund
npm run render:ki-tipps    # alle 8 Reels
```

### Mit eigener Stimme (Voice-over)

Aufnahme in `remotion/public/voice-tipp-N.wav` (aufbereitet mit
`ffmpeg -af "highpass=f=80,afftdn=nf=-30,acompressor=threshold=-20dB:ratio=3,loudnorm=I=-14"`),
dazu in `kiTipps.ts` beim Tipp `voice: { src, cuts }` mit den Satzanfängen in Sekunden.
Die Bilder wechseln dann mit den Sätzen, lange Sätze bekommen zwei Bilder, die Musik
(`ki-beat-32.wav`) läuft leise darunter.

```bash
cd remotion && npx remotion render KiTipp1 out/ki-tipp-1-voice.mp4
```

### Texte selbst ändern

Jeder Text ist änderbar: `hook`, Etikett oben, Überschrift (`small`, `big`), die drei
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

## Reel „Folge mir“

12 Sekunden, pro Bild eine kurze Aussage in grosser, fetter Schrift, alle 1,3 s
ein Wechsel: „Ein Gehalt ist kein Plan B.“ → „Dein 2. Einkommen. Mit KI.“ →
„Ohne zu kündigen.“ → „Ohne Vorwissen.“ → „10 Minuten pro Tag.“ → „Ich zeige dir
jeden Schritt.“ → „Ehrlich. Einfach. Echt.“ → „Folge mir @aufbruchsvision“.
Musik: eigener Beat mit Klavier und Ukulele, 90 BPM, ein Wechsel alle 2 Schläge.
Texte in `remotion/src/FolgeMir.tsx` (`FOLGE_MIR`), Video `remotion/out/folge-mir.mp4`.

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
