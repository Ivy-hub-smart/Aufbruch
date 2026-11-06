import "@fontsource/montserrat/900.css";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

const NAVY = "#1c3a5e";
const SANS = "Montserrat, sans-serif";

// Echtes Video mit einem starken Satz als Hook:
// pro Abschnitt eine kurze Zeile, gross und mittig, schon im ersten Frame;
// frage: kleine Einladung zum Kommentieren, ab Sekunde 2 bis zum Schluss sichtbar.
// video: Datei in public/, top: Höhe der Textkarte (dort, wo das Gesicht nicht ist)
export const autoFahrtSchema = z.object({
  video: z.string(),
  top: z.number(),
  // kamera: pro Zeile eine eigene Einstellung, damit es wie mehrere Kameras wirkt.
  // zoom = Vergrösserung, x/y = Punkt im Video (0–1, z. B. Gesicht), der nach zielY (0–1) rückt,
  // spiegeln = seitenverkehrt, drehung = Grad schräg
  zeilen: z.array(
    z.object({
      text: z.string(),
      sek: z.number(),
      kamera: z
        .object({ zoom: z.number(), x: z.number(), y: z.number(), zielY: z.number().optional(), spiegeln: z.boolean().optional(), drehung: z.number().optional() })
        .optional(),
    }),
  ),
  frage: z.string().optional(),
  // musik: Beat in public/ (Standard folge-mir-beat.wav, 12 s), punch: bei jeder neuen Zeile
  // abwechselnd näher ans Gesicht springen (Jump-Cut-Gefühl, hält die Leute im Video)
  musik: z.string().optional(),
  punch: z.boolean().optional(),
  // blitz: kurzer weisser Lichtblitz bei jedem Schnitt
  blitz: z.boolean().optional(),
});
export type AutoFahrtProps = z.infer<typeof autoFahrtSchema>;

export const AUTO_FAHRT: AutoFahrtProps = {
  video: "auto-fahrt.mp4",
  top: 720,
  zeilen: [
    { text: "Niemand kommt, um dir das Leben aufzubauen,", sek: 3.3 },
    { text: "von dem du heimlich träumst.", sek: 3.2 },
    { text: "Also fange ich selbst an. Folge mir auf dem Weg.", sek: 3.5 },
    { text: "Folge mir – ich nehme dich mit. 🌿", sek: 2.2 },
  ],
  frage: "Kennst du das? Schreib ein 🙋‍♀️",
};

// Laptop-Abend (IMG_8411.mov): ich klappe den Laptop auf und erzähle, warum.
// Gesicht in der Mitte, Laptop unten, darum Text oben; Neugier-Hook als Zitat.
export const LAPTOP_ABEND: AutoFahrtProps = {
  video: "laptop-abend.mp4",
  top: 150,
  zeilen: [
    { text: "„Was machst du eigentlich jeden Abend am Laptop?“", sek: 2.8 },
    { text: "Ich baue mir ein zweites Einkommen auf. Mit KI.", sek: 2.6 },
    { text: "Ohne zu kündigen. Ohne Vorwissen.", sek: 2.4 },
    { text: "Jeden Abend ein kleiner Schritt.", sek: 2.6 },
    { text: "In einem Jahr bin ich froh, dass ich heute angefangen habe.", sek: 3.0 },
    { text: "Willst du wissen, wie? 👇", sek: 2.6 },
  ],
  frage: "Kommentiere START",
  musik: "ki-beat-32.wav",
  punch: true,
};

// Gleiche Geschichte, aber mit Beauty-Filter (weichere Haut, frischer, siehe README)
// und bei jeder Zeile einer anderen Kameraeinstellung statt immer derselben Pose.
// Gesicht liegt im Video bei etwa x 0.37, y 0.34.
export const LAPTOP_ABEND_BEAUTY: AutoFahrtProps = {
  ...LAPTOP_ABEND,
  video: "laptop-abend-beauty.mp4",
  punch: false,
  blitz: true,
  zeilen: [
    { ...LAPTOP_ABEND.zeilen[0], kamera: { zoom: 1.05, x: 0.45, y: 0.5, zielY: 0.52 } }, // Totale: Laptop geht auf
    { ...LAPTOP_ABEND.zeilen[1], kamera: { zoom: 1.6, x: 0.37, y: 0.34, zielY: 0.55 } }, // Nahaufnahme Gesicht
    { ...LAPTOP_ABEND.zeilen[2], kamera: { zoom: 1.3, x: 0.4, y: 0.4, zielY: 0.55, spiegeln: true, drehung: -3 } }, // gespiegelt, schräg
    { ...LAPTOP_ABEND.zeilen[3], kamera: { zoom: 1.25, x: 0.42, y: 0.5, zielY: 0.6, drehung: 2.5 } }, // halbnah, andere Seite schräg
    { ...LAPTOP_ABEND.zeilen[4], kamera: { zoom: 1.55, x: 0.37, y: 0.36, zielY: 0.52, spiegeln: true } }, // nah, gespiegelt
    { ...LAPTOP_ABEND.zeilen[5], kamera: { zoom: 1.35, x: 0.38, y: 0.38, zielY: 0.55 } }, // Lächeln zum Schluss
  ],
};

// Fertigmachen im Bad: Gesicht in der Mitte, Text oben; Geschichte aus dem Bachelor/Master-Reel
export const FERTIG_MACHEN: AutoFahrtProps = {
  video: "fertig-machen.mp4",
  top: 150,
  zeilen: [
    { text: "Bachelor. Master. Jahrelange Erfahrung.", sek: 2.6 },
    { text: "Und trotzdem das Gefühl: Reicht das nicht?", sek: 2.7 },
    { text: "Darum baue ich mir jetzt meinen Plan B. Folge mir.", sek: 2.6 },
    { text: "Folge mir – ich nehme dich mit. 🌿", sek: 2.2 },
  ],
  frage: "Kennst du das? Schreib ein 🙋‍♀️",
};

// Variante mit „Du“-Hook: spricht Fremde in der ersten Sekunde direkt an
export const FERTIG_MACHEN_DU: AutoFahrtProps = {
  video: "fertig-machen.mp4",
  top: 150,
  zeilen: [
    { text: "Du hast alles richtig gemacht –", sek: 2.4 },
    { text: "und trotzdem reicht es nicht?", sek: 2.4 },
    { text: "Ich baue mir gerade meinen Plan B auf. Mit KI, 10 Minuten am Tag.", sek: 3.0 },
    { text: "Folge mir – ich nehme dich mit. 🌿", sek: 2.2 },
  ],
  frage: "Kennst du das? Schreib ein 🙋‍♀️",
};

const Zeile: React.FC<{ text: string; top: number }> = ({ text, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // erste Zeile ohne Einblendung, damit sie im Vorschaubild steht
  const p = spring({ frame: frame + 30, fps, config: { damping: 14, stiffness: 200 } });
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 76,
          lineHeight: 1.15,
          color: NAVY,
          textAlign: "center",
          background: "rgba(251,244,234,0.94)",
          padding: "34px 44px 40px",
          borderRadius: 36,
          boxShadow: "0 18px 50px rgba(0,0,0,0.3)",
          transform: `scale(${0.9 + p * 0.1})`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Frage-Pille unten, über dem Bereich, den Instagram mit der Caption verdeckt
const Frage: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", top: 1420, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 54,
          color: "white",
          background: NAVY,
          padding: "18px 40px",
          borderRadius: 999,
          boxShadow: "0 12px 34px rgba(0,0,0,0.35)",
          transform: `scale(${p * (1 + 0.03 * Math.sin(frame / 7))})`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const B = 1080;
const H = 1920;
type Kamera = NonNullable<AutoFahrtProps["zeilen"][number]["kamera"]>;

// Verschiebung + Zoom so, dass der Punkt (x, y) mittig auf Höhe zielY liegt.
// Begrenzt so, dass auch gedreht nie ein schwarzer Rand sichtbar wird.
const kameraTransform = (k: Kamera, seit: number) => {
  const zoom = k.zoom * (1 + seit * 0.0012); // langsames Hineinfahren
  const w = (Math.abs(k.drehung ?? 0) * Math.PI) / 180;
  const ex = (B / 2) * Math.cos(w) + (H / 2) * Math.sin(w);
  const ey = (B / 2) * Math.sin(w) + (H / 2) * Math.cos(w);
  const zielY = (k.zielY ?? 0.5) * H;
  const tx = Math.min(B / 2 - ex, Math.max(B / 2 + ex - B * zoom, B / 2 - k.x * B * zoom));
  const ty = Math.min(H / 2 - ey, Math.max(H / 2 + ey - H * zoom, zielY - k.y * H * zoom));
  return `translate(${tx}px, ${ty}px) scale(${zoom})`;
};

export const AutoFahrt: React.FC<AutoFahrtProps> = ({ video, top, zeilen, frage, musik, punch, blitz }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  // welche Zeile läuft gerade, und seit wie vielen Frames?
  let nr = 0;
  let start = 0;
  for (let i = 0, f = 0; i < zeilen.length; i++) {
    if (frame >= f) {
      nr = i;
      start = f;
    }
    f += Math.round(zeilen[i].sek * fps);
  }
  const seit = frame - start;
  const k = zeilen[nr].kamera;
  // punch: abwechselnd 1.0 und 1.14, dazu ein langsamer Drift, Mittelpunkt auf Gesichtshöhe
  const pz = punch ? (nr % 2 ? 1.14 : 1.0) + frame * 0.0006 : 1;
  const innen = k ? kameraTransform(k, seit) : `translate(${B / 2}px, ${H * 0.35}px) scale(${pz}) translate(${-B / 2}px, ${-H * 0.35}px)`;
  const aussen = k ? `rotate(${k.drehung ?? 0}deg) scaleX(${k.spiegeln ? -1 : 1})` : undefined;
  // Lichtblitz in den ersten 5 Frames jedes Schnitts (nicht beim allerersten Bild)
  const hell = blitz && nr > 0 ? Math.max(0, 1 - seit / 5) * 0.75 : 0;
  let from = 0;
  return (
    <AbsoluteFill style={{ background: "black", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: aussen }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: B, height: H, transformOrigin: "0 0", transform: innen }}>
          <OffthreadVideo src={staticFile(video)} muted style={{ width: B, height: H }} />
        </div>
      </AbsoluteFill>
      {hell > 0 && <AbsoluteFill style={{ background: "white", opacity: hell }} />}
      {/* leiser eigener Beat; in Instagram lieber einen Trend-Sound darüberlegen */}
      <Audio src={staticFile(musik ?? "folge-mir-beat.wav")} volume={(f) => 0.6 * Math.min(1, (durationInFrames - f) / 20)} />
      {zeilen.map((z, i) => {
        const start = from;
        from += Math.round(z.sek * fps);
        return (
          <Sequence key={i} from={start} durationInFrames={Math.round(z.sek * fps)}>
            <Zeile text={z.text} top={top} />
          </Sequence>
        );
      })}
      {frage && (
        <Sequence from={2 * fps} durationInFrames={durationInFrames - 2 * fps}>
          <Frage text={frage} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

export const autoFahrtDauer = (p: AutoFahrtProps) => Math.round(p.zeilen.reduce((s, z) => s + z.sek, 0) * 30);
