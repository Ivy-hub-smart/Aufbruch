import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/kaushan-script/400.css";
import "@fontsource/caveat/700.css";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { KI_TIPPS, SERIE } from "./kiTipps";

// Karussell-Farben, in jedem Reel gleich
const NAVY = "#1c3a5e";
const BLUE = "#2b5687";
const CREAM = "#f3e3c8";
const INK = "#22324a";
const SCRIPT = "'Kaushan Script', cursive";
const HAND = "Caveat, cursive";
const SANS = "Montserrat, sans-serif";

// alle 48 Frames (1,6 s) ein Wechsel, Hook etwas länger
const CUTS = [0, 66, 114, 162, 210, 258, 306, 360];

// Alle Texte sind Props: in Remotion Studio rechts unter „Props“ änderbar
// oder beim Rendern mit --props.
export const kiTippSchema = z.object({
  nr: z.number(),
  label: z.string().optional(),
  hook: z.string().optional(),
  small: z.string().optional(),
  big: z.string().optional(),
  steps: z.array(z.string()).length(3).optional(),
  fazit: z.string().optional(),
  cta: z.string().optional(),
});
export type KiTippProps = z.infer<typeof kiTippSchema>;

export const Brush: React.FC<{ fill: string }> = ({ fill }) => (
  <svg viewBox="0 0 400 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: -1 }}>
    <path d="M6 22 C80 6 250 2 392 14 C398 40 396 66 386 88 C260 98 120 96 10 84 C2 62 0 42 6 22Z" fill={fill} opacity=".95" />
    <path d="M0 30 C60 24 120 22 180 26" stroke={fill} strokeWidth="5" opacity=".5" fill="none" />
    <path d="M220 92 C300 90 360 88 400 84" stroke={fill} strokeWidth="4" opacity=".5" fill="none" />
  </svg>
);

export const Logo: React.FC<{ light?: boolean }> = ({ light }) => {
  const c = light ? "#ffffff" : NAVY;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", color: c, fontFamily: SANS }}>
      <svg width="150" height="60" viewBox="0 0 110 44">
        <path d="M10 18 C30 4 55 4 75 14 C88 20 98 18 104 12" stroke={c} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M6 32 C28 20 52 22 70 30 C84 36 96 34 106 26" stroke={light ? "#cfe3ff" : "#2b6aa8"} strokeWidth="5" fill="none" strokeLinecap="round" />
      </svg>
      <div style={{ fontSize: 54, letterSpacing: 0.5 }}>aufbruchsvision</div>
      <div style={{ fontSize: 23, letterSpacing: 4, marginTop: 4 }}>Dein Weg. Deine Freiheit.</div>
    </div>
  );
};

// Einstieg jeder Szene: kurzer Zoom und Schub, damit jeder Wechsel spürbar ist
const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 170 } });
};

export const Creme: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile("hyperframes-creme.mp4")} muted />
    {children}
  </AbsoluteFill>
);

// foto: hocke = echtes Foto am See, blazer = Freisteller vor dem Creme-Hintergrund
const Foto: React.FC<{ foto: "hocke" | "blazer"; focus: string; children: React.ReactNode }> = ({ foto, focus, children }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 48], [1.12, 1.02], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      {foto === "hocke" ? (
        // näher an mich heran, ich hocke rechts unten auf dem Steg
        <Img src={staticFile("foto-hocke.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom * 1.3})`, transformOrigin: "80% 74%" }} />
      ) : (
        <>
          <OffthreadVideo src={staticFile("hyperframes-creme.mp4")} muted />
          <Img
            src={staticFile("foto-blazer.png")}
            style={{ position: "absolute", left: 60, bottom: 0, width: 960, transform: `scale(${zoom})`, transformOrigin: focus }}
          />
        </>
      )}
      {children}
    </AbsoluteFill>
  );
};

// cremefarbene Karte oben auf dem Foto
const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const p = useEnter(2);
  return (
    <div
      style={{
        position: "absolute",
        top: 170,
        left: 60,
        right: 60,
        padding: "40px 46px",
        background: "rgba(251,244,234,0.93)",
        borderRadius: 40,
        boxShadow: "0 18px 50px rgba(28,58,94,0.25)",
        transform: `translateY(${(1 - p) * -80}px) rotate(-1.5deg)`,
        opacity: p,
      }}
    >
      {children}
    </div>
  );
};

const Badge: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      top: 70,
      right: 60,
      padding: "12px 34px",
      color: "white",
      fontFamily: SANS,
      fontSize: 34,
      isolation: "isolate",
    }}
  >
    <svg viewBox="0 0 110 66" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: -1 }}>
      <path d="M8 14 C30 4 80 2 104 10 C110 24 108 44 100 58 C70 66 30 64 6 56 C0 40 2 26 8 14Z" fill={BLUE} />
    </svg>
    {text}
  </div>
);

const StepOnPhoto: React.FC<{ n: number; text: string }> = ({ n, text }) => (
  <Panel>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 30 }}>
      <div style={{ fontFamily: SCRIPT, fontSize: 150, lineHeight: 0.85, color: NAVY }}>{n}</div>
      <div style={{ fontFamily: SCRIPT, fontSize: 64, lineHeight: 1.15, color: NAVY }}>{text}</div>
    </div>
  </Panel>
);

const StepOnCreme: React.FC<{ n: number; text: string }> = ({ n, text }) => {
  const p = useEnter();
  return (
    <Creme>
      <div style={{ position: "absolute", top: 520, left: 90, right: 90, textAlign: "center", opacity: p, transform: `translateX(${(1 - p) * 160}px)` }}>
        <div style={{ fontFamily: SCRIPT, fontSize: 300, lineHeight: 0.9, color: NAVY, transform: `scale(${0.6 + p * 0.4})` }}>{n}</div>
        <div style={{ fontFamily: SCRIPT, fontSize: 84, lineHeight: 1.15, color: NAVY, marginTop: 40 }}>{text}</div>
      </div>
      <Logo />
    </Creme>
  );
};

export const KiTippVideo: React.FC<KiTippProps> = ({ nr, ...texte }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tipp = { ...KI_TIPPS[nr - 1], ...texte };
  const label = tipp.label ?? `Tipp ${nr}/${SERIE}`;
  // die beiden Fotos wechseln sich ab, jedes Reel beginnt mit einem anderen
  const a = nr % 2 === 1 ? "hocke" : "blazer";
  const b = a === "hocke" ? "blazer" : "hocke";
  const seg = (i: number) => ({ from: CUTS[i], durationInFrames: CUTS[i + 1] - CUTS[i] });

  return (
    <AbsoluteFill style={{ background: "#fbf4ea", fontFamily: SANS }}>
      {/* Hook: steht schon im ersten Frame (Vorschaubild) */}
      <Sequence {...seg(0)}>
        <Foto foto={a} focus="70% 60%">
          <div
            style={{
              position: "absolute",
              top: 200,
              left: 60,
              right: 60,
              padding: "44px 50px",
              background: "rgba(251,244,234,0.94)",
              borderRadius: 40,
              transform: `rotate(-2deg) scale(${1 + 0.015 * Math.sin(frame / 6)})`,
              boxShadow: "0 18px 50px rgba(28,58,94,0.25)",
            }}
          >
            <div style={{ fontFamily: SCRIPT, fontSize: 92, lineHeight: 1.12, color: NAVY, textAlign: "center" }}>{tipp.hook}</div>
          </div>
        </Foto>
      </Sequence>

      {/* Titel */}
      <Sequence {...seg(1)}>
        <TitleScene label={label} small={tipp.small} big={tipp.big} />
      </Sequence>

      <Sequence {...seg(2)}>
        <Foto foto={b} focus="50% 30%">
          <StepOnPhoto n={1} text={tipp.steps[0]} />
        </Foto>
      </Sequence>

      <Sequence {...seg(3)}>
        <StepOnCreme n={2} text={tipp.steps[1]} />
      </Sequence>

      <Sequence {...seg(4)}>
        <Foto foto={a} focus="30% 80%">
          <StepOnPhoto n={3} text={tipp.steps[2]} />
        </Foto>
      </Sequence>

      <Sequence {...seg(5)}>
        <FazitScene fazit={tipp.fazit} />
      </Sequence>

      <Sequence {...seg(6)}>
        <CtaScene cta={tipp.cta} />
      </Sequence>

      {/* Fortschritt oben: hält die Leute bis zum Schluss */}
      <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${(frame / (durationInFrames - 1)) * 100}%`, background: BLUE }} />
      {frame >= CUTS[1] && frame < CUTS[6] && <Badge text={label} />}
    </AbsoluteFill>
  );
};

const TitleScene: React.FC<{ label: string; small: string; big: string }> = ({ small, big }) => {
  const p = useEnter();
  const q = useEnter(6);
  return (
    <Creme>
      <div style={{ position: "absolute", top: 560, left: 80, right: 80, textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontSize: 46, letterSpacing: 6, textTransform: "uppercase", color: BLUE, opacity: p }}>{small}</div>
        <div
          style={{
            fontFamily: SCRIPT,
            fontSize: 138,
            lineHeight: 1.08,
            color: NAVY,
            marginTop: 30,
            opacity: q,
            transform: `scale(${0.7 + q * 0.3}) rotate(-2deg)`,
          }}
        >
          {big}
        </div>
      </div>
      <Logo />
    </Creme>
  );
};

const FazitScene: React.FC<{ fazit: string }> = ({ fazit }) => {
  const p = useEnter();
  const q = useEnter(8);
  return (
    <Creme>
      <div style={{ position: "absolute", top: 520, left: 80, right: 80, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div
          style={{
            position: "relative",
            isolation: "isolate",
            padding: "18px 60px",
            fontFamily: HAND,
            fontWeight: 700,
            fontSize: 74,
            color: INK,
            transform: `rotate(-3deg) scale(${p})`,
          }}
        >
          <Brush fill={CREAM} />
          Merke dir:
        </div>
        <div style={{ fontFamily: SCRIPT, fontSize: 104, lineHeight: 1.12, color: NAVY, marginTop: 50, opacity: q, transform: `translateY(${(1 - q) * 60}px)` }}>
          {fazit}
        </div>
      </div>
      <Logo />
    </Creme>
  );
};

const CtaScene: React.FC<{ cta: string }> = ({ cta }) => {
  const p = useEnter();
  const q = useEnter(10);
  return (
    <Creme>
      <div style={{ position: "absolute", top: 420, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 50 }}>
        <div style={{ fontFamily: SCRIPT, fontSize: 104, lineHeight: 1.12, color: NAVY, opacity: p, transform: `scale(${0.8 + p * 0.2})` }}>{cta}</div>
        <div
          style={{
            position: "relative",
            isolation: "isolate",
            padding: "20px 70px",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 80,
            letterSpacing: 4,
            color: "white",
            transform: `rotate(-2deg) scale(${q})`,
          }}
        >
          <Brush fill={BLUE} />
          @aufbruchsvision
        </div>
        <div style={{ display: "flex", gap: 50, fontFamily: SANS, fontWeight: 700, fontSize: 36, color: NAVY, opacity: q }}>
          <div>🔖 Speichern</div>
          <div>📤 Teilen</div>
          <div>➕ Folgen</div>
        </div>
      </div>
      <Logo />
    </Creme>
  );
};
