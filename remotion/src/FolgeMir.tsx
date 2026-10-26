import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/kaushan-script/400.css";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { Brush, Creme, Logo } from "./KiTippVideo";

const NAVY = "#1c3a5e";
const BLUE = "#2b5687";
const SANS = "Montserrat, sans-serif";
const SCRIPT = "'Kaushan Script', cursive";

// Folge-mir-Reel: pro Bild eine kurze Aussage in grosser, fetter Schrift.
// mark = Wort, das auf dem blauen Pinselstrich steht.
const szene = z.object({ text: z.string(), mark: z.string().optional(), foto: z.enum(["hocke", "blazer", "creme"]) });
export const folgeMirSchema = z.object({ szenen: z.array(szene), handle: z.string(), claim: z.string() });
export type FolgeMirProps = z.infer<typeof folgeMirSchema>;

export const FOLGE_MIR: FolgeMirProps = {
  szenen: [
    { text: "Ein Gehalt ist", mark: "kein Plan B.", foto: "hocke" },
    { text: "Dein 2. Einkommen.", mark: "Mit KI.", foto: "creme" },
    { text: "Ohne zu", mark: "kündigen.", foto: "blazer" },
    { text: "Ohne", mark: "Vorwissen.", foto: "creme" },
    { text: "30 Minuten", mark: "am Tag.", foto: "hocke" },
    { text: "Ich zeige dir", mark: "jeden Schritt.", foto: "creme" },
    { text: "Ehrlich. Einfach.", mark: "Echt.", foto: "blazer" },
  ],
  handle: "@aufbruchsvision",
  claim: "Folge mir",
};

const SZENE = 42; // 1,4 s pro Bild
const CTA = 66;

const Hintergrund: React.FC<{ foto: "hocke" | "blazer" | "creme" }> = ({ foto }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, SZENE], [1.1, 1], { extrapolateRight: "clamp" });
  if (foto === "hocke") {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={staticFile("foto-hocke.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom * 1.3})`, transformOrigin: "80% 74%" }} />
      </AbsoluteFill>
    );
  }
  return (
    <Creme>
      {foto === "blazer" && (
        <Img src={staticFile("foto-blazer.png")} style={{ position: "absolute", left: 60, bottom: 0, width: 960, transform: `scale(${zoom})`, transformOrigin: "50% 100%" }} />
      )}
    </Creme>
  );
};

// Text: auf Creme gross in der Mitte, auf Fotos oben auf heller Karte
const Aussage: React.FC<{ text: string; mark?: string; aufFoto: boolean }> = ({ text, mark, aufFoto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14, stiffness: 200 } });
  const q = spring({ frame: frame - 5, fps, config: { damping: 11, stiffness: 180 } });
  const size = aufFoto ? 96 : 118;
  return (
    <div
      style={{
        position: "absolute",
        top: aufFoto ? 190 : 620,
        left: 50,
        right: 50,
        padding: aufFoto ? "46px 30px 54px" : 0,
        background: aufFoto ? "rgba(251,244,234,0.95)" : "transparent",
        borderRadius: 40,
        boxShadow: aufFoto ? "0 18px 50px rgba(28,58,94,0.25)" : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 18,
        transform: `scale(${0.85 + p * 0.15})`,
        opacity: p,
      }}
    >
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 1.05, color: NAVY }}>{text}</div>
      {mark && (
        <div
          style={{
            position: "relative",
            isolation: "isolate",
            padding: "12px 50px 20px",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: size,
            lineHeight: 1.05,
            color: "white",
            transform: `rotate(-2deg) scale(${q})`,
          }}
        >
          <Brush fill={BLUE} />
          {mark}
        </div>
      )}
    </div>
  );
};

export const FolgeMir: React.FC<FolgeMirProps> = ({ szenen, handle, claim }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const ctaFrom = szenen.length * SZENE;
  const c = spring({ frame: frame - ctaFrom, fps, config: { damping: 12 } });
  const d = spring({ frame: frame - ctaFrom - 8, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ background: "#fbf4ea" }}>
      {szenen.map((s, i) => (
        <Sequence key={i} from={i * SZENE} durationInFrames={SZENE}>
          <Hintergrund foto={s.foto} />
          <Aussage text={s.text} mark={s.mark} aufFoto={s.foto !== "creme"} />
        </Sequence>
      ))}

      <Sequence from={ctaFrom} durationInFrames={CTA}>
        <Creme>
          <div style={{ position: "absolute", top: 520, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
            <div style={{ fontFamily: SCRIPT, fontSize: 170, color: NAVY, transform: `scale(${c})` }}>{claim}</div>
            <div
              style={{
                position: "relative",
                isolation: "isolate",
                padding: "18px 60px 26px",
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 88,
                color: "white",
                transform: `rotate(-2deg) scale(${d})`,
              }}
            >
              <Brush fill={BLUE} />
              {handle}
            </div>
          </div>
          <Logo />
        </Creme>
      </Sequence>

      <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${(frame / (durationInFrames - 1)) * 100}%`, background: BLUE }} />
    </AbsoluteFill>
  );
};

export const folgeMirDauer = (p: FolgeMirProps) => p.szenen.length * SZENE + CTA;
