import { AbsoluteFill, Audio, OffthreadVideo, staticFile } from "remotion";

// 3D-Hase im Duke-Stil: Garten, Gartenstuhl, Teetasse, Fell und Hoppeln kommen aus HyperFrames
// (hyperframes/hase3d/index.html, Three.js). Remotion legt die Musik darunter:
// 150 BPM, Absprung aus dem Stuhl und jede Landung fallen auf den Takt (scripts/hasen-musik.py).
export const Hoppelhase3D: React.FC = () => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile("hyperframes-hase3d.mp4")} muted />
    <Audio src={staticFile("hasen-3d-musik.wav")} />
  </AbsoluteFill>
);
