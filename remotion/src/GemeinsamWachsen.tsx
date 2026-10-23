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

const FONT = "Montserrat, sans-serif";
const ACCENT = "linear-gradient(90deg, #ffd37a 0%, #ff8a8a 55%, #ff6fb0 100%)";

type Scene = { from: number; to: number; small: string; big: string };

// 30 fps: jede Botschaft steht gut 1,3 Sekunden
const SCENES: Scene[] = [
  { from: 8, to: 50, small: "Lasst uns", big: "einander stärken" },
  { from: 50, to: 90, small: "Gemeinsam", big: "wachsen" },
  { from: 90, to: 126, small: "Gemeinsam", big: "ans Ziel" },
  { from: 126, to: 181, small: "Folgt mir –", big: "ich folge euch!" },
];

const SceneText: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < scene.from || frame >= scene.to) return null;

  const t = frame - scene.from;
  const inSmall = spring({ frame: t, fps, config: { damping: 16, stiffness: 160 } });
  const inBig = spring({ frame: t - 4, fps, config: { damping: 13, stiffness: 150 } });
  const isLast = scene.to > 180;
  const out = isLast
    ? 1
    : interpolate(frame, [scene.to - 6, scene.to], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: 1330,
        width: "100%",
        textAlign: "center",
        fontFamily: FONT,
        opacity: out,
        filter: `blur(${(1 - out) * 12}px)`,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 66,
          color: "white",
          letterSpacing: "0.02em",
          textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          opacity: inSmall,
          transform: `translateY(${(1 - inSmall) * 50}px)`,
        }}
      >
        {scene.small}
      </div>
      <div
        style={{
          fontWeight: 900,
          fontSize: 100,
          lineHeight: 1.1,
          marginTop: 6,
          background: ACCENT,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.45))",
          opacity: inBig,
          transform: `translateY(${(1 - inBig) * 70}px) scale(${0.85 + inBig * 0.15})`,
        }}
      >
        {scene.big}
      </div>
    </div>
  );
};

export const GemeinsamWachsen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagIn = spring({ frame: frame - 6, fps, config: { damping: 14 } });
  const handleIn = spring({ frame: frame - 140, fps, config: { damping: 12 } });
  const handlePulse = frame > 155 ? 1 + Math.sin((frame - 155) / 4) * 0.03 : 1;
  // Wachstumsbalken: füllt sich über die ganzen 6 Sekunden
  const grow = interpolate(frame, [10, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Foto mit Ken-Burns-Zoom, Sonnenlicht und Abdunklung kommt aus HyperFrames */}
      <OffthreadVideo src={staticFile("hyperframes-photo.mp4")} muted />

      <div
        style={{
          position: "absolute",
          top: 120,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: tagIn,
          transform: `translateY(${(1 - tagIn) * -40}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: "0.14em",
            color: "white",
            padding: "20px 44px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.16)",
            border: "2px solid rgba(255,255,255,0.45)",
            backdropFilter: "blur(10px)",
            textAlign: "center",
          }}
        >
          11.11. · ZIEL: 1111 FOLLOWER
          <div
            style={{
              marginTop: 14,
              height: 8,
              borderRadius: 4,
              background: "rgba(255,255,255,0.25)",
              overflow: "hidden",
            }}
          >
            <div style={{ width: `${grow * 100}%`, height: "100%", background: ACCENT }} />
          </div>
        </div>
      </div>

      {SCENES.map((s) => (
        <SceneText key={s.from} scene={s} />
      ))}

      <div
        style={{
          position: "absolute",
          top: 1640,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: handleIn,
          transform: `translateY(${(1 - handleIn) * 40}px) scale(${handlePulse})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 58,
            color: "#05303f",
            background: "white",
            padding: "24px 60px",
            borderRadius: 999,
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          }}
        >
          @aufbruchsvision
        </div>
      </div>
    </AbsoluteFill>
  );
};
