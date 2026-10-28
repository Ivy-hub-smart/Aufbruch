import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/800.css";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";

const SANS = "Montserrat, sans-serif";
const BRAUN = "#4a3424";
const SCHATTEN = "0 2px 6px rgba(40,25,15,0.5), 0 4px 28px rgba(40,25,15,0.7)";

// Vorstellungs-Karussell zum Anpinnen (4:5), im Look der Gedanken-Reels.
// balken: Satz im weissen Balken unten, der zum Weiterwischen einlädt.
const folie = z.object({
  foto: z.boolean(),
  titel: z.string(),
  zeilen: z.array(z.string()),
  balken: z.string().optional(),
});
export const vorstellungSchema = folie;
export type VorstellungProps = z.infer<typeof folie>;

export const VORSTELLUNG: VorstellungProps[] = [
  {
    foto: true,
    titel: "Hi, ich bin Yvonne,",
    zeilen: ["43 Jahre alt.", "Vor 1 Monat habe ich beschlossen, mit Instagram zu starten.", "In der Hoffnung, mir eine Weltreise / ein bisschen Taschengeld zu verdienen."],
    balken: "Das hätte ich aber nicht erwartet 😊👉",
  },
  {
    foto: false,
    titel: "Das erwartet dich hier:",
    zeilen: ["🤍 Ehrliche Gedanken für Frauen, die mehr wollen als nur funktionieren", "🌿 Mein Weg zum 2. Einkommen – Schritt für Schritt", "💡 Einfache KI-Tipps, die Zeit sparen"],
    balken: "Weiter 👉",
  },
  {
    foto: false,
    titel: "Lust, mitzukommen?",
    zeilen: ["Folge mir und sag Hallo in den Kommentaren.", "Ich freue mich auf dich!"],
    balken: "Folgen ➕ @aufbruchsvision",
  },
];

export const Vorstellung: React.FC<VorstellungProps> = ({ foto, titel, zeilen, balken }) => (
  <AbsoluteFill>
    <Img src={staticFile("wasser-hintergrund.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "rgba(60,42,28,0.18)" }} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px", textAlign: "center", gap: 30 }}>
      {foto && (
        <div style={{ width: 270, height: 270, borderRadius: "50%", overflow: "hidden", border: "8px solid rgba(250,243,234,0.95)", boxShadow: "0 10px 30px rgba(40,25,15,0.35)", marginBottom: 10 }}>
          <Img src={staticFile("foto-hocke.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(2.6)", transformOrigin: "74% 66%" }} />
        </div>
      )}
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 70, lineHeight: 1.15, color: "white", textShadow: SCHATTEN }}>{titel}</div>
      {zeilen.map((z) => (
        <div key={z} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 46, lineHeight: 1.3, color: "white", textShadow: SCHATTEN }}>
          {z}
        </div>
      ))}
      {balken && (
        <div
          style={{
            marginTop: 26,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 48,
            color: BRAUN,
            background: "rgba(250,243,234,0.96)",
            padding: "20px 40px",
            borderRadius: 18,
            boxShadow: "0 10px 30px rgba(40,25,15,0.3)",
          }}
        >
          {balken}
        </div>
      )}
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, textAlign: "center", fontFamily: "Georgia, serif", fontSize: 24, letterSpacing: 1, color: "rgba(255,255,255,0.75)" }}>
      AufbruchsVision
    </div>
  </AbsoluteFill>
);
