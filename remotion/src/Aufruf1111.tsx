import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const GOLD = "#ffd54a";
const PINK = "#ff3d8b";
const FONT = '"Arial Black", "Helvetica Neue", Arial, sans-serif';

// Kopf sitzt dort, wo die HyperFrames-Ringe und Strahlen zentriert sind (47 % Höhe)
const HEAD_SIZE = 560;
const HEAD_CENTER_Y = 1920 * 0.47;

export const Aufruf1111: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headIn = spring({ frame: frame - 4, fps, config: { damping: 9, stiffness: 120 } });
  const float = Math.sin(frame / 12) * 10;
  const tilt = Math.sin(frame / 18) * 3;

  const line1 = spring({ frame: frame - 30, fps, config: { damping: 14 } });
  const line2 = spring({ frame: frame - 42, fps, config: { damping: 14 } });
  const cta = spring({ frame: frame - 70, fps, config: { damping: 8, stiffness: 140 } });
  const handle = spring({ frame: frame - 85, fps, config: { damping: 14 } });
  const pulse = frame > 90 ? 1 + Math.sin((frame - 90) / 4) * 0.04 : 1;

  const outro = interpolate(frame, [165, 180], [1, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ transform: `scale(${outro})` }}>
      {/* Hintergrund, Zähler 0 → 1111 und Konfetti kommen aus HyperFrames */}
      <OffthreadVideo src={staticFile("hyperframes-bg.mp4")} muted />

      <div
        style={{
          position: "absolute",
          left: 540 - HEAD_SIZE / 2,
          top: HEAD_CENTER_Y - HEAD_SIZE / 2 + float,
          width: HEAD_SIZE,
          height: HEAD_SIZE,
          borderRadius: "50%",
          overflow: "hidden",
          border: `14px solid ${GOLD}`,
          boxShadow: `0 0 80px rgba(255,213,74,0.7), 0 0 0 10px ${PINK}`,
          transform: `scale(${headIn}) rotate(${tilt}deg)`,
        }}
      >
        <Img
          src={staticFile("kopf.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 1290,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          color: "white",
          textShadow: "0 6px 24px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            fontSize: 74,
            opacity: line1,
            transform: `translateY(${(1 - line1) * 80}px)`,
          }}
        >
          Hilf mir am <span style={{ color: GOLD }}>11.11.</span>
        </div>
        <div
          style={{
            fontSize: 74,
            marginTop: 10,
            opacity: line2,
            transform: `translateY(${(1 - line2) * 80}px)`,
          }}
        >
          zu <span style={{ color: GOLD }}>1111 Followern!</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1590,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
          fontWeight: 900,
            fontSize: 70,
            color: "white",
            background: `linear-gradient(90deg, ${PINK}, #9b5cff)`,
            padding: "28px 70px",
            borderRadius: 999,
            boxShadow: "0 12px 40px rgba(255,61,139,0.6)",
            transform: `scale(${cta * pulse})`,
          }}
        >
          JETZT FOLGEN!
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1770,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 58,
          color: "#3de0ff",
          textShadow: "0 0 24px rgba(61,224,255,0.7)",
          opacity: handle,
          transform: `translateY(${(1 - handle) * 40}px)`,
        }}
      >
        @aufbruchsvision
      </div>
    </AbsoluteFill>
  );
};
