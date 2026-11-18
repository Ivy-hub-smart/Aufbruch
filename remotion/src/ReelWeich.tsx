import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BRAUN, Freisteller, GRUEN, Hintergrund, SALBEI, SANS, SERIF, TEXT } from "./WeichKarussell";

// Reel im weichen Stil (1080×1920, 12 s): lockt zum Karussell «Am Ende vom Monat ist nichts übrig?».
// Texte bleiben oben (y < 1100), rechts 160 px frei für die Instagram-Knöpfe;
// mein Foto steht unten, wo später die Bildunterschrift liegt, nur den Körper verdeckt.
export const REEL_DAUER = 360;

const weich = (f: number, dauer: number) =>
  interpolate(f, [0, dauer], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

// blendet eine Szene weich ein und am Ende wieder aus
const Szene: React.FC<{ dauer: number; children: React.ReactNode }> = ({ dauer, children }) => {
  const f = useCurrentFrame();
  const ein = weich(f, 14);
  const aus = 1 - weich(f - (dauer - 12), 12);
  return (
    <AbsoluteFill style={{ opacity: Math.min(ein, aus), padding: "250px 160px 0 90px", alignItems: "flex-start" }}>
      {children}
    </AbsoluteFill>
  );
};

// einzelnes Element, das ab `start` sanft von unten hochkommt
const Rein: React.FC<{ start: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ start, children, style }) => {
  const p = weich(useCurrentFrame() - start, 18);
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * 24}px)`, filter: `blur(${(1 - p) * 6}px)`, ...style }}>{children}</div>;
};

const Titel: React.FC<{ children: React.ReactNode; gross?: boolean }> = ({ children, gross }) => (
  <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: gross ? 140 : 104, lineHeight: 1.02, color: BRAUN }}>{children}</div>
);

const Text: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 54, lineHeight: 1.3, color: TEXT }}>{children}</div>
);

const Pille: React.FC<{ zahl: string; text: string }> = ({ zahl, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 24, background: GRUEN, color: "white", borderRadius: 999, padding: "26px 56px 26px 26px", boxShadow: "0 14px 34px rgba(94,125,98,0.28)" }}>
    <div style={{ width: 84, height: 84, borderRadius: "50%", background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 52 }}>
      {zahl}
    </div>
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 60 }}>{text}</div>
  </div>
);

export const ReelWeich: React.FC = () => {
  const f = useCurrentFrame();
  // Hintergrund und Foto leben die ganze Zeit leicht
  const zoom = interpolate(f, [0, REEL_DAUER], [1.06, 1]);
  const fotoRein = weich(f, 20);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Hintergrund />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: fotoRein, transform: `translateY(${(1 - fotoRein) * 40}px)` }}>
        <Freisteller hoehe={1000} />
      </AbsoluteFill>
      <Audio src={staticFile("gedanke-klavier.wav")} volume={0.7} />

      {/* 0–2 s: Riesen-Hook */}
      <Sequence durationInFrames={62}>
        <Szene dauer={62}>
          <Rein start={0} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 38, letterSpacing: 6, color: SALBEI, marginBottom: 34 }}>
            KENNST DU DAS?
          </Rein>
          <Titel gross>
            Ende Monat
            <br />
            nichts übrig?
          </Titel>
        </Szene>
      </Sequence>

      {/* 2–5 s: Es liegt nicht an dir */}
      <Sequence from={62} durationInFrames={90}>
        <Szene dauer={90}>
          <Rein start={0}>
            <Titel>
              Das liegt nicht
              <br />
              an dir.
            </Titel>
          </Rein>
          <Rein start={22} style={{ marginTop: 44 }}>
            <Text>Sondern daran, dass alles auf einem einzigen Konto liegt.</Text>
          </Rein>
        </Szene>
      </Sequence>

      {/* 5–9,5 s: die 3 Konten */}
      <Sequence from={152} durationInFrames={136}>
        <Szene dauer={136}>
          <Rein start={0}>
            <Titel>
              Probier es mit
              <br />
              3 Konten:
            </Titel>
          </Rein>
          <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 50 }}>
            <Rein start={18}>
              <Pille zahl="1" text="Fixkosten" />
            </Rein>
            <Rein start={40}>
              <Pille zahl="2" text="Zum Leben" />
            </Rein>
            <Rein start={62}>
              <Pille zahl="3" text="Sparen" />
            </Rein>
          </div>
        </Szene>
      </Sequence>

      {/* 9,5–12 s: Hinweis aufs Karussell */}
      <Sequence from={288} durationInFrames={REEL_DAUER - 288}>
        <Szene dauer={REEL_DAUER - 288 + 30}>
          <Rein start={0}>
            <Titel>Alle Schritte findest du auf meinem Profil 📌</Titel>
          </Rein>
          <Rein start={20} style={{ marginTop: 50 }}>
            <div style={{ display: "inline-block", fontFamily: SANS, fontWeight: 600, fontSize: 52, color: "white", background: GRUEN, padding: "26px 54px", borderRadius: 999, boxShadow: "0 12px 30px rgba(94,125,98,0.3)" }}>
              Folgen & speichern 🤍
            </div>
          </Rein>
        </Szene>
      </Sequence>
    </AbsoluteFill>
  );
};
