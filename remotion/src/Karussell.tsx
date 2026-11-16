import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/800.css";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";

const SANS = "Montserrat, sans-serif";
const BRAUN = "#4a3424";
const SCHATTEN = "0 2px 6px rgba(20,25,35,0.55), 0 4px 28px rgba(20,25,35,0.6)";

// Karussell (4:5) mit meinem Foto im Hintergrund:
// scharf: Foto am See klar sichtbar, Text oben im Himmel;
// sonst: dasselbe Foto weich unscharf und etwas abgedunkelt, Text mittig.
const folie = z.object({
  scharf: z.boolean(),
  titel: z.string(),
  zeilen: z.array(z.string()),
  balken: z.string().optional(),
  nummer: z.string(),
});
export const karussellSchema = folie;
export type KarussellProps = z.infer<typeof folie>;

// Wochenplan Montag: «Du musst nicht perfekt sein»
export const MONTAG: KarussellProps[] = [
  {
    scharf: true,
    titel: "Du musst nicht perfekt sein, um anzufangen.",
    zeilen: [],
    balken: "Wisch weiter 👉",
    nummer: "1/5",
  },
  {
    scharf: false,
    titel: "Meine ersten Posts?",
    zeilen: ["Ehrlich gesagt: nicht gut. 😅", "Ich habe sie trotzdem gepostet."],
    nummer: "2/5",
  },
  {
    scharf: false,
    titel: "Perfekt wird man nicht vorher.",
    zeilen: ["Man wird besser, während man es tut."],
    nummer: "3/5",
  },
  {
    scharf: false,
    titel: "Darum mein Tipp:",
    zeilen: ["Fang klein an.", "Heute. Mit dem, was du hast. 🌱"],
    nummer: "4/5",
  },
  {
    scharf: true,
    titel: "Du musst nur anfangen, um besser zu werden.",
    zeilen: [],
    balken: "Speichern & folgen 🤍",
    nummer: "5/5",
  },
];

export const Karussell: React.FC<KarussellProps> = ({ scharf, titel, zeilen, balken, nummer }) => (
  <AbsoluteFill style={{ background: "#7a8a96" }}>
    {/* Foto 1080×1920: Ausschnitt so, dass ich unten links auf dem Steg sitze und oben Himmel für den Text bleibt */}
    <Img
      src={staticFile("foto-hocke.jpg")}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "50% 70%",
        filter: scharf ? "none" : "blur(26px) saturate(0.9)",
        transform: scharf ? "none" : "scale(1.12)",
      }}
    />
    <AbsoluteFill
      style={{
        background: scharf
          ? "linear-gradient(180deg, rgba(20,30,45,0.45) 0%, rgba(20,30,45,0.12) 45%, rgba(20,30,45,0) 60%, rgba(20,30,45,0.25) 100%)"
          : "rgba(40,35,30,0.32)",
      }}
    />
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: scharf ? "flex-start" : "center",
        padding: scharf ? "130px 80px 0" : "0 90px",
        textAlign: "center",
        gap: 30,
      }}
    >
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: scharf ? 76 : 72, lineHeight: 1.15, color: "white", textShadow: SCHATTEN }}>{titel}</div>
      {zeilen.map((z) => (
        <div key={z} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 50, lineHeight: 1.3, color: "white", textShadow: SCHATTEN }}>
          {z}
        </div>
      ))}
      {balken && (
        <div
          style={{
            marginTop: 20,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 42,
            color: BRAUN,
            background: "rgba(250,243,234,0.96)",
            padding: "18px 36px",
            borderRadius: 18,
            boxShadow: "0 10px 30px rgba(20,25,35,0.3)",
          }}
        >
          {balken}
        </div>
      )}
    </AbsoluteFill>
    <div style={{ position: "absolute", top: 44, right: 54, fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "rgba(255,255,255,0.85)", textShadow: SCHATTEN }}>
      {nummer}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, textAlign: "center", fontFamily: "Georgia, serif", fontSize: 26, letterSpacing: 1, color: "rgba(255,255,255,0.85)", textShadow: SCHATTEN }}>
      AufbruchsVision
    </div>
  </AbsoluteFill>
);
