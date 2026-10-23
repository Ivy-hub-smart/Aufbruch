import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/900.css";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FONT = "Montserrat, sans-serif";
const ACCENT = "linear-gradient(90deg, #ffe27a 0%, #ffffff 50%, #ffe27a 100%)";
const BEAT_FRAMES = 15; // 120 BPM bei 30 fps

type Scene = { from: number; to: number; small: string; big: string };

// jede Botschaft dauert genau einen Takt (4 Schläge = 2 Sekunden)
const SCENES: Scene[] = [
  { from: 0, to: 60, small: "Lasst uns", big: "gemeinsam wachsen!" },
  { from: 60, to: 120, small: "11.11. · Ziel:", big: "1111 Follower" },
  { from: 120, to: 181, small: "Folgt mir –", big: "ich folge euch!" },
];

export const TanzVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // kleiner Hüpfer auf jedem Schlag
  const sinceBeat = frame % BEAT_FRAMES;
  const beatBump = 1 + 0.06 * Math.exp(-sinceBeat / 3);

  const handleIn = spring({ frame: frame - 125, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill>
      {/* Tanz-Szene (Freisteller, Lichter, Bewegung) kommt aus HyperFrames */}
      <OffthreadVideo src={staticFile("hyperframes-dance.mp4")} muted />
      <Audio src={staticFile("beat.wav")} />

      {SCENES.map((scene) => {
        if (frame < scene.from || frame >= scene.to) return null;
        const t = frame - scene.from;
        const inSmall = spring({ frame: t, fps, config: { damping: 14, stiffness: 180 } });
        const inBig = spring({ frame: t - 3, fps, config: { damping: 11, stiffness: 170 } });
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
                textShadow: "0 4px 20px rgba(0,0,0,0.45)",
                opacity: inSmall,
                transform: `translateY(${(1 - inSmall) * -50}px)`,
              }}
            >
              {scene.small}
            </div>
            <div
              style={{
                fontWeight: 900,
                fontSize: 96,
                lineHeight: 1.1,
                marginTop: 6,
                background: ACCENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.5))",
                opacity: inBig,
                transform: `scale(${(0.6 + inBig * 0.4) * beatBump})`,
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
          transform: `translateY(${(1 - handleIn) * 60}px) scale(${beatBump})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 58,
            color: "#3a0a5e",
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
