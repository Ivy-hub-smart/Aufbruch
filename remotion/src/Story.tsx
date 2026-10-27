import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/900.css";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";
import { Brush, Logo } from "./KiTippVideo";

const NAVY = "#1c3a5e";
const BLUE = "#2b5687";
const SANS = "Montserrat, sans-serif";

// Story-Bild (Standbild): Frage oben, darunter freier Platz für den
// Umfrage- oder Fragen-Sticker aus Instagram (hinweis: welcher Sticker passt).
export const storySchema = z.object({ text: z.string(), mark: z.string(), hinweis: z.string(), foto: z.enum(["hocke", "blazer"]) });
export type StoryProps = z.infer<typeof storySchema>;

export const STORIES: StoryProps[] = [
  { text: "Kennst du das Gefühl, dass dein Job", mark: "nicht alles sein kann?", hinweis: "Umfrage-Sticker hier", foto: "blazer" },
  { text: "Was hält dich am meisten", mark: "zurück?", hinweis: "Umfrage: Zeit / Mut / Wissen", foto: "hocke" },
  { text: "Frag mich alles zu", mark: "KI & Nebeneinkommen", hinweis: "Fragen-Sticker hier", foto: "blazer" },
];

export const Story: React.FC<StoryProps> = ({ text, mark, hinweis, foto }) => (
  <AbsoluteFill>
    <Img src={staticFile("creme-hintergrund.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    {/* Foto rund oben, wie ein persönlicher Gruss */}
    <div style={{ position: "absolute", top: 170, left: "50%", marginLeft: -170, width: 340, height: 340, borderRadius: "50%", overflow: "hidden", border: `10px solid ${BLUE}`, background: "#fbf4ea" }}>
      <Img
        src={staticFile(foto === "hocke" ? "foto-hocke.jpg" : "foto-blazer.png")}
        style={
          foto === "hocke"
            ? { width: "100%", height: "100%", objectFit: "cover", transform: "scale(2.6)", transformOrigin: "74% 66%" }
            : { width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%", transform: "scale(1.5)", transformOrigin: "50% 20%" }
        }
      />
    </div>
    <div style={{ position: "absolute", top: 600, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 18 }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 84, lineHeight: 1.08, color: NAVY }}>{text}</div>
      <div style={{ position: "relative", isolation: "isolate", padding: "12px 46px 20px", fontFamily: SANS, fontWeight: 900, fontSize: 84, lineHeight: 1.08, color: "white", transform: "rotate(-2deg)" }}>
        <Brush fill={BLUE} />
        {mark}
      </div>
    </div>
    {/* darunter bleibt Platz frei für den Sticker aus Instagram */}
    <Logo />
  </AbsoluteFill>
);
