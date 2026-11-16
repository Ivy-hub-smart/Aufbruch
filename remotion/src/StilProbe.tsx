import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";

const SANS = "Montserrat, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

// Drei Stil-Vorschläge für Finanz- & Immobilien-Karussells (4:5), alle mit derselben Titelfolie.
export const stilProbeSchema = z.object({ stil: z.enum(["hell", "dunkel", "notiz"]) });
export type StilProbeProps = z.infer<typeof stilProbeSchema>;

const PROBLEM = "Am Ende vom Monat ist nichts übrig?";
const LOESUNG = "So änderst du das mit 3 Konten.";

// A: hell & klar – Creme, dunkles Grün, Foto im Blazer rechts unten
const Hell: React.FC = () => (
  <AbsoluteFill style={{ background: "#f6f1e9" }}>
    <div style={{ position: "absolute", right: -120, bottom: -40, width: 760, height: 760, borderRadius: "50%", background: "#dfe8df" }} />
    <Img src={staticFile("foto-blazer.png")} style={{ position: "absolute", right: -40, bottom: 0, height: 900 }} />
    <div style={{ position: "absolute", left: 80, top: 110, width: 600 }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: "#2f5d4a", marginBottom: 30 }}>FINANZEN · EINFACH</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 82, lineHeight: 1.08, color: "#1f2a24" }}>{PROBLEM}</div>
      <div style={{ width: 90, height: 10, borderRadius: 5, background: "#e0a43a", margin: "40px 0" }} />
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 46, lineHeight: 1.3, color: "#2f5d4a", width: 460 }}>{LOESUNG}</div>
    </div>
    <div style={{ position: "absolute", left: 80, bottom: 70, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#ffffff", background: "#2f5d4a", padding: "16px 30px", borderRadius: 999 }}>
      Wisch weiter 👉
    </div>
  </AbsoluteFill>
);

// B: dunkel & edel – Nachtblau mit Gold, Foto im Blazer, wirkt wie Fachfrau
const Dunkel: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(160deg, #1c2541 0%, #0b132b 100%)" }}>
    <div style={{ position: "absolute", right: 60, bottom: 0, width: 560, height: 980, borderRadius: "280px 280px 0 0", background: "linear-gradient(180deg, #c9a96e 0%, #8a6d3b 100%)", opacity: 0.9 }} />
    <Img src={staticFile("foto-blazer.png")} style={{ position: "absolute", right: 20, bottom: 0, height: 940 }} />
    <div style={{ position: "absolute", left: 80, top: 120, width: 640 }}>
      <div style={{ fontFamily: SERIF, fontSize: 92, lineHeight: 1.05, color: "#ffffff" }}>{PROBLEM}</div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, lineHeight: 1.3, color: "#c9a96e", marginTop: 44, width: 420 }}>{LOESUNG}</div>
    </div>
    <div style={{ position: "absolute", left: 80, bottom: 80, fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: "#c9a96e" }}>WISCH WEITER →</div>
    <div style={{ position: "absolute", left: 80, bottom: 40, fontFamily: SANS, fontWeight: 500, fontSize: 22, color: "rgba(255,255,255,0.6)" }}>@aufbruchsvision</div>
  </AbsoluteFill>
);

// C: Notizzettel – kariertes Papier, gelber Marker, rundes Foto wie aufgeklebt
const Notiz: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "#fbfaf6",
      backgroundImage: "linear-gradient(#e6eef5 2px, transparent 2px), linear-gradient(90deg, #e6eef5 2px, transparent 2px)",
      backgroundSize: "54px 54px",
    }}
  >
    <div style={{ position: "absolute", left: 80, top: 130, width: 900 }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 88, lineHeight: 1.15, color: "#22262b" }}>
        Am Ende vom Monat ist{" "}
        <span style={{ background: "linear-gradient(180deg, transparent 55%, #ffe066 55%)", padding: "0 8px" }}>nichts übrig?</span>
      </div>
      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 22 }}>
        {["1 Konto für Fixkosten", "1 Konto zum Leben", "1 Konto zum Sparen"].map((t) => (
          <div key={t} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, color: "#22262b" }}>
            <span style={{ color: "#2f9e6e", fontWeight: 800 }}>✓</span> {t}
          </div>
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", right: 70, bottom: 90, width: 330, height: 330, borderRadius: "50%", overflow: "hidden", border: "10px solid white", boxShadow: "0 12px 30px rgba(0,0,0,0.18)", transform: "rotate(4deg)", background: "#e9e4dc" }}>
      <Img src={staticFile("foto-blazer.png")} style={{ width: "100%", position: "absolute", top: -10 }} />
    </div>
    <div style={{ position: "absolute", left: 80, bottom: 110, fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#22262b", background: "#ffe066", padding: "14px 28px", transform: "rotate(-2deg)" }}>
      So geht's 👉
    </div>
  </AbsoluteFill>
);

export const StilProbe: React.FC<StilProbeProps> = ({ stil }) => (stil === "hell" ? <Hell /> : stil === "dunkel" ? <Dunkel /> : <Notiz />);
