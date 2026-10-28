import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/800.css";
import { AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

const SANS = "Montserrat, sans-serif";
const BRAUN = "#4a3424";

// Stil der erfolgreichsten Reels: Sand unter Wasser, weisse Schrift.
// hook: 2–4 Wörter riesig in der ersten Sekunde, damit der Daumen stoppt;
// danach kommen die Zeilen nacheinander dazu.
const zeile = z.object({ text: z.string(), fett: z.boolean().optional() });
export const gedankeSchema = z.object({ hook: z.string(), zeilen: z.array(zeile), frage: z.string() });
export type GedankeProps = z.infer<typeof gedankeSchema>;

export const GEDANKEN: GedankeProps[] = [
  {
    hook: "Du bist nicht zu spät.",
    zeilen: [
      { text: "Du bist nicht zu spät.", fett: true },
      { text: "Du hast nur gedacht, du musst erst perfekt sein." },
      { text: "Die meisten fangen nie an, weil sie auf ein Zeichen warten." },
      { text: "Vielleicht ist das hier deins …", fett: true },
    ],
    frage: "Du auch? Schreib ein 🤍",
  },
  {
    hook: "«Sei doch zufrieden.»",
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
    hook: "Niemand sieht es.",
    zeilen: [
      { text: "Niemand sieht, wie viel du trägst.", fett: true },
      { text: "Job. Familie. Haushalt. Termine." },
      { text: "Und abends dieser leise Gedanke:" },
      { text: "«Das kann doch nicht alles sein.»", fett: true },
      { text: "Kennst du das?" },
    ],
    frage: "Kennst du das? Schreib ein 🤍",
  },
  // Werbung für das Gratis-PDF von Sales Circle: „Kommentiere START“
  {
    hook: "Wo fange ich an?",
    zeilen: [
      { text: "Ich wusste lange nicht, wo anfangen.", fett: true },
      { text: "Tausend Ideen. Videos. Kurse." },
      { text: "Und am Ende: nichts angefangen." },
      { text: "Was mir gefehlt hat: ein klarer erster Schritt.", fett: true },
      { text: "Kommentiere START – ich schick dir den Gratis-Guide." },
    ],
    frage: "Kommentiere START 👇",
  },
  {
    hook: "Nicht noch ein Kurs.",
    zeilen: [
      { text: "Ich brauchte nicht noch mehr Wissen.", fett: true },
      { text: "Ich brauchte einen Plan." },
      { text: "Einen, der neben dem Job Platz hat." },
      { text: "Strategisch. Schritt für Schritt.", fett: true },
      { text: "Kommentiere START für den Gratis-Guide." },
    ],
    frage: "Kommentiere START 👇",
  },
  {
    hook: "Irgendwann ist kein Plan.",
    zeilen: [
      { text: "Ich will nicht warten, bis «irgendwann».", fett: true },
      { text: "Darum lerne ich jetzt, wie digitales Einkommen funktioniert." },
      { text: "Ganz ohne meinen Job zu kündigen." },
      { text: "Gratis-Guide: Strategischer Einstieg ins digitale Einkommen", fett: true },
      { text: "Kommentiere START – ich schick ihn dir." },
    ],
    frage: "Kommentiere START 👇",
  },
];

const HOOK = 48; // 1,6 s Riesen-Hook, danach der Textblock
const ABSTAND = 66; // alle 2,2 s kommt eine Zeile dazu

// 0 → 1 über `dauer` Frames, sanft auslaufend
const weich = (f: number, dauer: number) =>
  interpolate(f, [0, dauer], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

// start: Frame, ab dem die Zeile einblendet; vorher unsichtbar, aber mit Platz,
// damit der Textblock beim Dazukommen nicht springt
const Zeile: React.FC<{ text: string; fett?: boolean; start: number }> = ({ text, fett, start }) => {
  const frame = useCurrentFrame();
  // weiches Einblenden ohne Federn: aus leichter Unschärfe in knapp einer Sekunde
  const p = weich(frame - start, 22);
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

// riesiger Hook im ersten Bild: dunklerer Grund, leichtes Heranzoomen, dann weich weg
const RiesenHook: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const weg = 1 - weich(frame - (HOOK - 12), 12);
  const zoom = interpolate(frame, [0, HOOK], [1, 1.08]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px 200px", opacity: weg }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(40,25,15,0.15) 0%, rgba(40,25,15,0.55) 100%)" }} />
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 124,
          lineHeight: 1.08,
          color: "white",
          textAlign: "center",
          textShadow: "0 3px 10px rgba(40,25,15,0.6), 0 6px 40px rgba(40,25,15,0.8)",
          transform: `scale(${zoom})`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const Gedanke: React.FC<GedankeProps> = ({ hook, zeilen, frage }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  // Hintergrund bewegt sich vom ersten Bild an sichtbar
  const bgZoom = interpolate(frame, [0, durationInFrames], [1.12, 1]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${bgZoom})` }}>
        <OffthreadVideo src={staticFile("hyperframes-wasser.mp4")} muted />
      </AbsoluteFill>
      {/* ruhiges Klavier (scripts/ki-beat.py ruhig); in Instagram gern einen ruhigen Trend-Sound darüberlegen */}
      <Audio src={staticFile("gedanke-klavier.wav")} volume={0.7} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 90px 260px", textAlign: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          {zeilen.map((z, i) => (
            <Zeile key={i} text={z.text} fett={z.fett} start={HOOK + i * ABSTAND} />
          ))}
        </div>
      </AbsoluteFill>
      <Sequence durationInFrames={HOOK}>
        <RiesenHook text={hook} />
      </Sequence>
      <Sequence from={HOOK + fps} durationInFrames={durationInFrames - HOOK - fps}>
        <Frage text={frage} />
      </Sequence>
    </AbsoluteFill>
  );
};

// so lange, dass die letzte Zeile noch 3 Sekunden steht
export const gedankeDauer = (p: GedankeProps) => HOOK + (p.zeilen.length - 1) * ABSTAND + 90;
