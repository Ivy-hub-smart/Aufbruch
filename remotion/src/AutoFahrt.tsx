import "@fontsource/montserrat/900.css";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

const NAVY = "#1c3a5e";
const SANS = "Montserrat, sans-serif";

// Echtes Video mit einem starken Satz als Hook:
// pro Abschnitt eine kurze Zeile, gross und mittig, schon im ersten Frame;
// die letzte Zeile lädt zum Kommentieren ein.
// video: Datei in public/, top: Höhe der Textkarte (dort, wo das Gesicht nicht ist)
export const autoFahrtSchema = z.object({
  video: z.string(),
  top: z.number(),
  zeilen: z.array(z.object({ text: z.string(), sek: z.number() })),
});
export type AutoFahrtProps = z.infer<typeof autoFahrtSchema>;

export const AUTO_FAHRT: AutoFahrtProps = {
  video: "auto-fahrt.mp4",
  top: 720,
  zeilen: [
    { text: "Niemand kommt, um dir das Leben aufzubauen,", sek: 3.3 },
    { text: "von dem du heimlich träumst.", sek: 3.2 },
    { text: "Also fange ich selbst an. Folge mir auf dem Weg.", sek: 3.5 },
    { text: "Kennst du das? Schreib ein 🙋‍♀️", sek: 2.2 },
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
    { text: "Kennst du das? Schreib ein 🙋‍♀️", sek: 2.2 },
  ],
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

export const AutoFahrt: React.FC<AutoFahrtProps> = ({ video, top, zeilen }) => {
  const { fps } = useVideoConfig();
  let from = 0;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <OffthreadVideo src={staticFile(video)} muted />
      {/* leiser eigener Beat; in Instagram lieber einen Trend-Sound darüberlegen */}
      <Audio src={staticFile("folge-mir-beat.wav")} volume={0.6} />
      {zeilen.map((z, i) => {
        const start = from;
        from += Math.round(z.sek * fps);
        return (
          <Sequence key={i} from={start} durationInFrames={Math.round(z.sek * fps)}>
            <Zeile text={z.text} top={top} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const autoFahrtDauer = (p: AutoFahrtProps) => Math.round(p.zeilen.reduce((s, z) => s + z.sek, 0) * 30);
