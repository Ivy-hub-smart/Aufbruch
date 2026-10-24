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
const SUN = "linear-gradient(90deg, #ffe27a 0%, #ffffff 50%, #ffe27a 100%)";

type Scene = { from: number; to: number; small: string; big: string; accent: string };

// Zweifel bis 3 s, danach der Traum (Umschwung kommt aus HyperFrames)
const SCENES: Scene[] = [
  { from: 0, to: 45, small: "Was, wenn ich es", big: "nicht schaffe?", accent: GREY },
  { from: 45, to: 90, small: "…finanziell frei zu sein?", big: "Ein zweites Standbein?", accent: GREY },
  { from: 90, to: 135, small: "Und was,", big: "wenn doch?", accent: SUN },
  { from: 135, to: 181, small: "Zweifeln ist erlaubt.", big: "Aufgeben nicht.", accent: SUN },
];

export const ZweifelTraum: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const handleIn = spring({ frame: frame - 140, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill>
      {/* Freisteller, Regen, Umschwung und Urlaubsszene kommen aus HyperFrames */}
      <OffthreadVideo src={staticFile("hyperframes-traum.mp4")} muted />

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
                color: "white",
                textShadow: "0 4px 20px rgba(0,0,0,0.55)",
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
                filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.6))",
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
