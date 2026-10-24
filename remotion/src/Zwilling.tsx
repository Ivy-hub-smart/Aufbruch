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
const GREY = "linear-gradient(90deg, #cfd6e0 0%, #ffffff 50%, #cfd6e0 100%)";
const TWIN = "linear-gradient(90deg, #8ff0ff 0%, #ffffff 50%, #8ff0ff 100%)";
const SUN = "linear-gradient(90deg, #e0115f 0%, #ff5e3a 100%)";

type Scene = { from: number; to: number; small: string; big: string; accent: string; light?: boolean };

// Sonntagabend bis 2 s, Zwilling bis 4 s, danach der Wunsch
const SCENES: Scene[] = [
  { from: 0, to: 60, small: "Sonntagabend.", big: "Morgen gehört meine Zeit wieder anderen.", accent: GREY },
  { from: 60, to: 120, small: "Meine Wünsche", big: "bekommen ein Gesicht.", accent: TWIN },
  { from: 120, to: 181, small: "Ich will meine Zeit", big: "selbst bestimmen.", accent: SUN, light: true },
];

export const Zwilling: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const handleIn = spring({ frame: frame - 125, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill>
      {/* Sonntagabend, Zwilling und Morgenlicht kommen aus HyperFrames */}
      <OffthreadVideo src={staticFile("hyperframes-zwilling.mp4")} muted />

      {SCENES.map((scene) => {
        if (frame < scene.from || frame >= scene.to) return null;
        const t = frame - scene.from;
        // erste Szene steht schon im ersten Frame (Vorschaubild)
        const inSmall = scene.from === 0 ? 1 : spring({ frame: t, fps, config: { damping: 14, stiffness: 180 } });
        const inBig = scene.from === 0 ? 1 : spring({ frame: t - 3, fps, config: { damping: 11, stiffness: 170 } });
        const out =
          scene.to > 180
            ? 1
            : interpolate(frame, [scene.to - 4, scene.to], [1, 0], { extrapolateLeft: "clamp" });
        return (
          <div
            key={scene.from}
            style={{
              position: "absolute",
              top: 150,
              width: "100%",
              padding: "0 50px",
              textAlign: "center",
              fontFamily: FONT,
              opacity: out,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 64,
                // heller Morgenhimmel braucht dunkle Schrift
                color: scene.light ? "#3a0a5e" : "white",
                textShadow: scene.light ? "none" : "0 4px 20px rgba(0,0,0,0.55)",
                opacity: inSmall,
                transform: `translateY(${(1 - inSmall) * -50}px)`,
              }}
            >
              {scene.small}
            </div>
            <div
              style={{
                fontWeight: 900,
                fontSize: 92,
                lineHeight: 1.1,
                marginTop: 6,
                background: scene.accent,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter: scene.light ? "drop-shadow(0 3px 8px rgba(255,255,255,0.8))" : "drop-shadow(0 6px 16px rgba(0,0,0,0.6))",
                opacity: inBig,
                transform: `scale(${0.6 + inBig * 0.4})`,
              }}
            >
              {scene.big}
            </div>
          </div>
        );
      })}

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
            fontFamily: FONT,
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
