import { AbsoluteFill, Audio, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";

// Hellbraun mit dunklerem Rand, cremefarbener Bauch, rosa Ohren innen
const FELL = "#c9a074";
const FELL_DUNKEL = "#a87c50";
const RAND = "#6e4a2c";
const CREME = "#f3e2c7";
const ROSA = "#f7a8b8";

const BODEN = 1580; // hier stehen die Füsse (y im Video)
const GROESSE = 1.25; // Hase ist 400 × 600 gezeichnet

// Ablauf in Frames (30 fps, 8 Sekunden)
const HOPS_REIN = { von: 0, bis: 96, anzahl: 4, xVon: 270, xBis: 540, hoehe: 150 };
const WINKEN = { von: 104, bis: 166 };
const FREUDENSPRUNG = { von: 170, bis: 198, hoehe: 330 };
const HOPS_RAUS = { von: 204, bis: 240, anzahl: 2, xVon: 540, xBis: 1320, hoehe: 170 };
const BLINZELN = [60, 128, 156];

type Pose = { x: number; hoehe: number; luft: number; steigt: number; boden: number; neigung: number };

// Phase 0..1 innerhalb eines Sprungs: hoch und runter als Sinusbogen
const sprung = (p: number, hoehe: number) => ({
  hoehe: Math.sin(Math.PI * p) * hoehe,
  luft: Math.sin(Math.PI * p),
  steigt: Math.cos(Math.PI * p), // +1 beim Absprung, -1 bei der Landung
  boden: Math.max(0, 1 - Math.min(p, 1 - p) * 8), // 1 kurz vor/nach dem Bodenkontakt
});

const hopps = (frame: number, s: typeof HOPS_REIN): Pose => {
  const t = (frame - s.von) / (s.bis - s.von);
  const n = t * s.anzahl;
  const p = n - Math.floor(n);
  const x = interpolate(t, [0, 1], [s.xVon, s.xBis]);
  return { x, ...sprung(p, s.hoehe), neigung: 7 * Math.sin(Math.PI * p) };
};

const stehen = (x: number): Pose => ({ x, hoehe: 0, luft: 0, steigt: 0, boden: 0, neigung: 0 });

const pose = (f: number): Pose => {
  if (f < HOPS_REIN.bis) return hopps(f, HOPS_REIN);
  if (f >= FREUDENSPRUNG.von && f < FREUDENSPRUNG.bis) {
    const p = (f - FREUDENSPRUNG.von) / (FREUDENSPRUNG.bis - FREUDENSPRUNG.von);
    return { x: 540, ...sprung(p, FREUDENSPRUNG.hoehe), neigung: 0 };
  }
  if (f >= HOPS_RAUS.von) return hopps(f, HOPS_RAUS);
  return stehen(540);
};

export const Hoppelhase: React.FC = () => {
  const frame = useCurrentFrame();
  const { x, hoehe, luft, steigt, boden, neigung } = pose(frame);

  // Quetschen bei der Landung, Strecken in der Luft, ruhiges Atmen im Stand
  const atmen = luft === 0 ? Math.sin(frame / 6) * 0.015 : 0;
  const sy = 1 - boden * 0.12 + luft * 0.06 + atmen;
  const sx = 1 + boden * 0.1 - luft * 0.03 - atmen;

  // Ohren schwingen nach: beim Steigen klappen sie nach aussen, beim Fallen stehen sie hoch
  const zucken = luft === 0 ? Math.max(0, Math.sin((frame - 100) / 3)) * 8 * (frame % 40 < 12 ? 1 : 0) : 0;
  const ohr = 10 + steigt * 16 * luft + (luft > 0 ? 0 : Math.sin(frame / 9) * 3);

  // Arme: in der Luft nach oben, beim Freudensprung ganz hoch, rechter Arm winkt
  const freude = frame >= FREUDENSPRUNG.von && frame < FREUDENSPRUNG.bis ? luft : 0;
  const armLuft = 35 * luft + 80 * freude;
  const winkt = interpolate(frame, [WINKEN.von, WINKEN.von + 8, WINKEN.bis - 8, WINKEN.bis], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const armRechts = -armLuft - winkt * (135 + 22 * Math.sin((frame - WINKEN.von) / 2.4));
  const armLinks = armLuft;

  const augenZu = BLINZELN.some((b) => frame >= b && frame < b + 5);
  const lachen = winkt > 0 || freude > 0;

  const breite = 400 * GROESSE;
  const hoeheBild = 600 * GROESSE;
  const schatten = 1 - Math.min(hoehe / 400, 0.6);

  return (
    <AbsoluteFill>
      {/* Wiese, Sonne, Wolken, Gras, Blumen und Schmetterling kommen aus HyperFrames */}
      <OffthreadVideo src={staticFile("hyperframes-wiese.mp4")} muted />
      {/* fröhliche Melodie, 150 BPM: jede Landung fällt auf den Takt (scripts/hasen-musik.py) */}
      <Audio src={staticFile("hasen-musik.wav")} />

      {/* Schatten am Boden */}
      <div
        style={{
          position: "absolute",
          left: x - 150 * schatten,
          top: BODEN - 22,
          width: 300 * schatten,
          height: 44,
          borderRadius: "50%",
          background: "rgba(40,70,20,0.35)",
          filter: "blur(4px)",
        }}
      />

      <svg
        viewBox="0 0 400 600"
        width={breite}
        height={hoeheBild}
        style={{
          position: "absolute",
          left: x - breite / 2,
          top: BODEN - hoeheBild - hoehe,
          overflow: "visible",
          transformOrigin: "50% 100%",
          transform: `rotate(${neigung}deg) scale(${sx}, ${sy})`,
        }}
      >
        <g stroke={RAND} strokeWidth={5} strokeLinejoin="round">
          {/* riesige Ohren */}
          <g transform={`rotate(${-ohr - zucken} 165 200)`}>
            <ellipse cx={148} cy={60} rx={50} ry={155} fill={FELL} />
            <ellipse cx={148} cy={72} rx={27} ry={120} fill={ROSA} stroke="none" />
          </g>
          <g transform={`rotate(${ohr} 235 200)`}>
            <ellipse cx={252} cy={60} rx={50} ry={155} fill={FELL} />
            <ellipse cx={252} cy={72} rx={27} ry={120} fill={ROSA} stroke="none" />
          </g>

          {/* Füsse */}
          <ellipse cx={135} cy={572} rx={62} ry={24} fill={FELL_DUNKEL} />
          <ellipse cx={265} cy={572} rx={62} ry={24} fill={FELL_DUNKEL} />

          {/* Körper mit Bauch */}
          <ellipse cx={200} cy={448} rx={122} ry={132} fill={FELL} />
          <ellipse cx={200} cy={468} rx={76} ry={96} fill={CREME} stroke="none" />

          {/* Kopf */}
          <ellipse cx={200} cy={268} rx={110} ry={98} fill={FELL} />
          <ellipse cx={176} cy={306} rx={36} ry={27} fill={CREME} stroke="none" />
          <ellipse cx={224} cy={306} rx={36} ry={27} fill={CREME} stroke="none" />
          <circle cx={128} cy={300} r={16} fill={ROSA} opacity={0.6} stroke="none" />
          <circle cx={272} cy={300} r={16} fill={ROSA} opacity={0.6} stroke="none" />

          {/* Augen */}
          {augenZu ? (
            <>
              <path d="M140 248 Q160 260 180 248" fill="none" strokeWidth={6} strokeLinecap="round" />
              <path d="M220 248 Q240 260 260 248" fill="none" strokeWidth={6} strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx={160} cy={245} rx={20} ry={25} fill="white" strokeWidth={4} />
              <ellipse cx={240} cy={245} rx={20} ry={25} fill="white" strokeWidth={4} />
              <circle cx={164} cy={250} r={12} fill="#2b1a10" stroke="none" />
              <circle cx={236} cy={250} r={12} fill="#2b1a10" stroke="none" />
              <circle cx={168} cy={245} r={4.5} fill="white" stroke="none" />
              <circle cx={240} cy={245} r={4.5} fill="white" stroke="none" />
            </>
          )}

          {/* Schnurrhaare */}
          <g strokeWidth={3} strokeLinecap="round" fill="none">
            <path d="M140 300 L82 290 M140 310 L80 314" />
            <path d="M260 300 L318 290 M260 310 L320 314" />
          </g>

          {/* riesige Zähne, darüber Nase und Mund */}
          <rect x={170} y={298} width={30} height={lachen ? 74 : 66} rx={7} fill="white" strokeWidth={4} />
          <rect x={200} y={298} width={30} height={lachen ? 74 : 66} rx={7} fill="white" strokeWidth={4} />
          <path
            d={lachen ? "M150 290 Q175 314 200 294 Q225 314 250 290" : "M158 292 Q180 310 200 296 Q220 310 242 292"}
            fill="none"
            strokeWidth={5}
            strokeLinecap="round"
          />
          <path d="M186 278 Q200 270 214 278 Q208 292 200 294 Q192 292 186 278 Z" fill={ROSA} strokeWidth={4} />

          {/* zwei Arme mit Pfoten */}
          <g transform={`rotate(${armLinks} 128 382)`}>
            <ellipse cx={112} cy={438} rx={28} ry={62} fill={FELL} />
            <ellipse cx={108} cy={492} rx={26} ry={20} fill={CREME} />
          </g>
          <g transform={`rotate(${armRechts} 272 382)`}>
            <ellipse cx={288} cy={438} rx={28} ry={62} fill={FELL} />
            <ellipse cx={292} cy={492} rx={26} ry={20} fill={CREME} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
