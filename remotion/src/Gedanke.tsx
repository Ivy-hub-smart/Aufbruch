import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/800.css";
import { AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

const SANS = "Montserrat, sans-serif";
const BRAUN = "#4a3424";

// Stil der erfolgreichsten Reels: Sand unter Wasser, weisse Schrift,
// erste Zeile fett und sofort da, die weiteren Zeilen kommen nacheinander dazu.
const zeile = z.object({ text: z.string(), fett: z.boolean().optional() });
export const gedankeSchema = z.object({ zeilen: z.array(zeile), frage: z.string() });
export type GedankeProps = z.infer<typeof gedankeSchema>;

export const GEDANKEN: GedankeProps[] = [
  {
    zeilen: [
      { text: "Du bist nicht zu spät.", fett: true },
      { text: "Du hast nur gedacht, du musst erst perfekt sein." },
      { text: "Die meisten fangen nie an, weil sie auf ein Zeichen warten." },
      { text: "Vielleicht ist das hier deins …", fett: true },
    ],
    frage: "Du auch? Schreib ein 🤍",
  },
  {
    zeilen: [
      { text: "Sie sagen: «Sei doch zufrieden.»", fett: true },
      { text: "Ich bin dankbar. Wirklich." },
      { text: "Und trotzdem will ich mehr.", fett: true },
      { text: "Mehr Zeit. Mehr Freiheit. Mehr ich." },
      { text: "Ist das zu viel verlangt?" },
    ],
    frage: "Geht's dir auch so? Schreib ein 🤍",
  },
  {
    zeilen: [
      { text: "Niemand sieht, wie viel du trägst.", fett: true },
      { text: "Job. Familie. Haushalt. Termine." },
      { text: "Und abends dieser leise Gedanke:" },
      { text: "«Das kann doch nicht alles sein.»", fett: true },
      { text: "Kennst du das?" },
    ],
    frage: "Kennst du das? Schreib ein 🤍",
  },
];

const ABSTAND = 66; // alle 2,2 s kommt eine Zeile dazu

// 0 → 1 über `dauer` Frames, sanft auslaufend
const weich = (f: number, dauer: number) =>
  interpolate(f, [0, dauer], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

// start: Frame, ab dem die Zeile einblendet; vorher unsichtbar, aber mit Platz,
// damit der Textblock beim Dazukommen nicht springt
const Zeile: React.FC<{ text: string; fett?: boolean; start: number }> = ({ text, fett, start }) => {
  const frame = useCurrentFrame();
  // weiches Einblenden ohne Federn: aus leichter Unschärfe in knapp einer Sekunde
  const p = start === 0 ? 1 : weich(frame - start, 26);
  return (
    <div
      style={{
        fontFamily: SANS,
        fontWeight: fett ? 800 : 500,
        fontSize: fett ? 64 : 52,
        lineHeight: 1.25,
        color: "white",
        textShadow: "0 2px 6px rgba(40,25,15,0.5), 0 4px 28px rgba(40,25,15,0.7)",
        opacity: p,
        filter: `blur(${(1 - p) * 8}px)`,
        transform: `translateY(${(1 - p) * 14}px)`,
      }}
    >
      {text}
    </div>
  );
};

// Einladung zum Kommentieren: ab Sekunde 2, unten über dem Caption-Bereich
const Frage: React.FC<{ text: string }> = ({ text }) => {
  const p = weich(useCurrentFrame(), 24);
  return (
    <div style={{ position: "absolute", top: 1430, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 48,
          color: BRAUN,
          background: "rgba(250,243,234,0.95)",
          padding: "16px 38px",
          borderRadius: 999,
          boxShadow: "0 10px 30px rgba(40,25,15,0.3)",
          opacity: p,
          transform: `translateY(${(1 - p) * 16}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Gedanke: React.FC<GedankeProps> = ({ zeilen, frage }) => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile("hyperframes-wasser.mp4")} muted />
      {/* ruhiges Klavier (scripts/ki-beat.py ruhig); in Instagram gern einen ruhigen Trend-Sound darüberlegen */}
      <Audio src={staticFile("gedanke-klavier.wav")} volume={0.7} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 90px 260px", textAlign: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          {zeilen.map((z, i) => (
            <Zeile key={i} text={z.text} fett={z.fett} start={i * ABSTAND} />
          ))}
        </div>
      </AbsoluteFill>
      <Sequence from={2 * fps} durationInFrames={durationInFrames - 2 * fps}>
        <Frage text={frage} />
      </Sequence>
    </AbsoluteFill>
  );
};

// so lange, dass die letzte Zeile noch 3 Sekunden steht
export const gedankeDauer = (p: GedankeProps) => (p.zeilen.length - 1) * ABSTAND + 90;
