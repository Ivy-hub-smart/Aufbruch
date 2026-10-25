import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/900.css";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { KI_TIPPS } from "./kiTipps";

const FONT = "Montserrat, sans-serif";
const STEP_IN = [70, 110, 150]; // Karten kommen nacheinander
const OUTRO = 228; // Karten weg, Fazit kommt

// clip: eigenes Spaziergang-Video in public/ statt der HyperFrames-Szene
export type KiTippProps = { nr: number; clip?: string };

export const KiTippVideo: React.FC<KiTippProps> = ({ nr, clip }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const tipp = KI_TIPPS[nr - 1];

  // Überschrift steht schon im ersten Frame (Vorschaubild), wippt nur leicht
  const headPulse = 1 + 0.02 * Math.sin(frame / 8);
  const cardsOut = interpolate(frame, [OUTRO, OUTRO + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fazitIn = spring({ frame: frame - OUTRO - 6, fps, config: { damping: 11, stiffness: 160 } });
  const ctaIn = spring({ frame: frame - OUTRO - 22, fps, config: { damping: 14 } });
  const handleIn = spring({ frame: frame - OUTRO - 12, fps, config: { damping: 12 } });
  const progress = frame / (durationInFrames - 1);
  // im echten Video laufe ich in die Bildmitte: Karten und Fazit dann unten über dem Wasser
  const real = Boolean(clip || tipp.clip);
  const lower = real ? 560 : 0;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {clip || tipp.clip ? (
        <>
          <OffthreadVideo
            src={staticFile(clip ?? tipp.clip!.src)}
            playbackRate={clip ? 1 : tipp.clip!.rate}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* echtes Video ist hell: oben abdunkeln, damit der Text lesbar bleibt */}
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, transparent 70%)" }} />
        </>
      ) : (
        <OffthreadVideo src={staticFile(tipp.bg)} muted />
      )}

      {/* Serien-Etikett mit Fortschritt */}
      <div style={{ position: "absolute", top: 100, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            fontWeight: 900,
            fontSize: 34,
            letterSpacing: 3,
            color: "white",
            background: "rgba(10,20,40,0.55)",
            padding: "14px 36px",
            borderRadius: 999,
          }}
        >
          KI-NEBENEINKOMMEN · TIPP {nr}/{KI_TIPPS.length}
          <div style={{ position: "absolute", left: 0, bottom: 0, height: 6, width: `${progress * 100}%`, background: tipp.accent }} />
        </div>
      </div>

      <div style={{ position: "absolute", top: 200, width: "100%", padding: "0 50px", textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 56, color: "white", textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>
          {tipp.small}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 14,
            fontWeight: 900,
            fontSize: 82,
            lineHeight: 1.08,
            color: "white",
            background: tipp.accent,
            padding: "14px 34px 20px",
            borderRadius: 28,
            boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
            transform: `scale(${headPulse}) rotate(-1.5deg)`,
          }}
        >
          {tipp.big}
        </div>
      </div>

      {/* drei Schritte als Karten, abwechselnd von links und rechts */}
      {tipp.steps.map((step, i) => {
        const p = spring({ frame: frame - STEP_IN[i], fps, config: { damping: 13, stiffness: 150 } });
        const side = i % 2 === 0 ? -1 : 1;
        return (
          <div
            key={step}
            style={{
              position: "absolute",
              top: 560 + lower + i * 150,
              left: 60,
              right: 60,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "20px 30px",
              background: "rgba(255,255,255,0.92)",
              borderRadius: 32,
              boxShadow: "0 12px 34px rgba(0,0,0,0.3)",
              opacity: p * cardsOut,
              transform: `translateX(${(1 - p) * side * 1100}px) scale(${0.9 + cardsOut * 0.1})`,
            }}
          >
            <div
              style={{
                flex: "0 0 auto",
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: tipp.accent,
                color: "white",
                fontWeight: 900,
                fontSize: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontWeight: 700, fontSize: 40, lineHeight: 1.2, color: "#1d2440" }}>{step}</div>
          </div>
        );
      })}

      {/* Fazit und Aufruf */}
      {frame >= OUTRO && (
        <div style={{ position: "absolute", top: 600 + lower, width: "100%", padding: "0 60px", textAlign: "center" }}>
          <div
            style={{
              fontWeight: 900,
              fontSize: 78,
              lineHeight: 1.12,
              color: "white",
              textShadow: "0 6px 24px rgba(0,0,0,0.65)",
              // dunkle Fläche, damit der Text auch vor der hellen Sonne lesbar bleibt
              background: "rgba(10,20,40,0.45)",
              padding: "24px 30px",
              borderRadius: 36,
              opacity: fazitIn,
              transform: `scale(${0.5 + fazitIn * 0.5})`,
            }}
          >
            {tipp.fazit}
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: 34,
              fontWeight: 700,
              fontSize: 44,
              color: "#1d2440",
              background: "#ffe27a",
              padding: "16px 40px",
              borderRadius: 999,
              opacity: ctaIn,
              transform: `translateY(${(1 - ctaIn) * 40}px)`,
            }}
          >
            {tipp.cta}
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: 1700,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: handleIn,
          transform: `translateY(${(1 - handleIn) * 60}px)`,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 58,
            color: "#023e8a",
            background: "white",
            padding: "24px 60px",
            borderRadius: 999,
            boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
          }}
        >
          @aufbruchsvision
        </div>
      </div>
    </AbsoluteFill>
  );
};
