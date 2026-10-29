import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/800.css";
import { AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

const SANS = "Montserrat, sans-serif";
const BRAUN = "#4a3424";
const CREME = "rgba(250,243,234,0.96)";
// wie in den Gedanken-Reels: weisse Schrift mit warmem Schatten, auf leicht braunem Grund
const SCHATTEN = "0 2px 6px rgba(40,25,15,0.5), 0 4px 28px rgba(40,25,15,0.7)";
const SAND = "rgba(74,52,36,0.55)";

// Video, in dem ich in die Kamera spreche. Darüber kommen Karten zu den Sätzen:
// hook = gross oben, karte = Prompt zum Abfotografieren unten, cta = Pille unten,
// untertitel = gesprochener Satz auf Brusthöhe (nur wo keine Karte dasselbe zeigt).
const einblendung = z.object({
  von: z.number(),
  bis: z.number(),
  art: z.enum(["hook", "karte", "cta", "untertitel"]),
  titel: z.string().optional(),
  text: z.string(),
});
// video: fertiges Hochformat-Video. Für einen unscharfen Hintergrund (Porträtmodus)
// vorher mit `hyperframes remove-background` freistellen und mit ffmpeg über eine
// weichgezeichnete Kopie legen (siehe README).
export const sprechvideoSchema = z.object({
  video: z.string(),
  stimme: z.string(),
  musik: z.string(),
  dauer: z.number(),
  einblendungen: z.array(einblendung),
});
export type SprechvideoProps = z.infer<typeof sprechvideoSchema>;

export const HOOK_PROMPT: SprechvideoProps = {
  video: "hook-prompt-portrait.mp4",
  stimme: "hook-prompt-stimme.wav",
  musik: "klavier-27.wav",
  dauer: 26.3,
  einblendungen: [
    { von: 0, bis: 3.6, art: "hook", titel: "❌ Schreib der KI nie:", text: "«Erstelle mir eine Hook.»" },
    {
      von: 6.5,
      bis: 20.7,
      art: "karte",
      titel: "✅ Schreib stattdessen:",
      text: "«Erstelle mir 5 Hooks für ein Reel über [dein Thema]. Für Menschen, die neben dem Job ein 2. Einkommen aufbauen wollen. Jede Hook soll ein Gefühl treffen und höchstens 6 Wörter haben.»",
    },
    { von: 3.7, bis: 6.3, art: "untertitel", text: "Da kommt nur Einheitsbrei raus." },
    { von: 18.9, bis: 20.8, art: "untertitel", text: "Der Unterschied ist riesig." },
    { von: 20.9, bis: 23.0, art: "untertitel", text: "Solche KI-Tipps lerne ich gerade." },
    { von: 23.0, bis: 24.7, art: "untertitel", text: "Willst du auch?" },
    { von: 20.9, bis: 26.3, art: "cta", text: "Kommentiere START 👇" },
  ],
};

const weich = (f: number, dauer: number) =>
  interpolate(f, [0, dauer], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

const Einblendung: React.FC<{ art: "hook" | "karte" | "cta" | "untertitel"; titel?: string; text: string; sofort: boolean }> = ({ art, titel, text, sofort }) => {
  const frame = useCurrentFrame();
  const p = sofort ? 1 : weich(frame, 14);
  const stil = { opacity: p, transform: `translateY(${(1 - p) * 20}px)` };
  if (art === "hook") {
    return (
      <div style={{ position: "absolute", top: 110, left: 50, right: 50, display: "flex", justifyContent: "center", ...stil }}>
        <div style={{ background: SAND, borderRadius: 32, padding: "26px 40px 32px", textAlign: "center" }}>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 50, color: "white", textShadow: SCHATTEN }}>{titel}</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 80, lineHeight: 1.1, color: "white", textShadow: SCHATTEN, marginTop: 6 }}>{text}</div>
        </div>
      </div>
    );
  }
  if (art === "karte") {
    return (
      <div style={{ position: "absolute", top: 1080, left: 50, right: 50, ...stil }}>
        <div style={{ background: SAND, borderRadius: 32, padding: "30px 40px 36px", textAlign: "center" }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, color: "white", textShadow: SCHATTEN }}>{titel}</div>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 44, lineHeight: 1.32, color: "white", textShadow: SCHATTEN, marginTop: 12 }}>{text}</div>
        </div>
      </div>
    );
  }
  if (art === "untertitel") {
    return (
      <div style={{ position: "absolute", top: 860, left: 60, right: 60, display: "flex", justifyContent: "center", ...stil }}>
        <div style={{ background: SAND, borderRadius: 24, padding: "16px 32px 20px", fontFamily: SANS, fontWeight: 800, fontSize: 52, lineHeight: 1.2, color: "white", textShadow: SCHATTEN, textAlign: "center" }}>
          {text}
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", top: 1400, left: 0, right: 0, display: "flex", justifyContent: "center", ...stil }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, color: BRAUN, background: CREME, padding: "22px 50px", borderRadius: 999, boxShadow: "0 12px 34px rgba(40,25,15,0.35)" }}>
        {text}
      </div>
    </div>
  );
};

export const Sprechvideo: React.FC<SprechvideoProps> = ({ video, stimme, musik, einblendungen }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <OffthreadVideo src={staticFile(video)} muted />
      <Audio src={staticFile(stimme)} />
      {/* ganz leises Klavier, damit die Stimme klar bleibt */}
      <Audio src={staticFile(musik)} volume={0.12} />
      {einblendungen.map((e, i) => (
        <Sequence key={i} from={Math.round(e.von * fps)} durationInFrames={Math.round((e.bis - e.von) * fps)}>
          <Einblendung art={e.art} titel={e.titel} text={e.text} sofort={e.von === 0} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
