import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { FinanzProps } from "./FinanzKarussell";

// Stil «weich & natürlich» (4:5): warmer Sand, Salbei & Rosé als weiche Formen,
// elegante Serifenschrift, Foto am See im Bogen. Nutzt dieselben Texte wie Stil A.
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "Montserrat, sans-serif";
const BRAUN = "#4a3a2e";
const TEXT = "#6b5a4c";
const SALBEI = "#8a9a7b";

// weiche, unscharfe Farbflecken im Hintergrund
const Hintergrund: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(165deg, #f4ede4 0%, #ebe0d2 100%)", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: -220, top: -180, width: 720, height: 720, borderRadius: "50%", background: "#d6ddcc", filter: "blur(90px)", opacity: 0.9 }} />
    <div style={{ position: "absolute", right: -260, bottom: -200, width: 820, height: 820, borderRadius: "50%", background: "#efd6c8", filter: "blur(110px)", opacity: 0.85 }} />
  </AbsoluteFill>
);

const Kicker: React.FC<{ text?: string }> = ({ text }) =>
  text ? <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 5, color: SALBEI, marginBottom: 26 }}>{text}</div> : null;

const Ranke: React.FC = () => <div style={{ fontFamily: SERIF, fontSize: 44, color: SALBEI, margin: "26px 0 30px" }}>~ 🌿 ~</div>;

const Knopf: React.FC<{ text?: string }> = ({ text }) =>
  text ? (
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: BRAUN, background: "rgba(255,255,255,0.65)", border: "2px solid rgba(138,154,123,0.5)", padding: "18px 36px", borderRadius: 999, display: "inline-block" }}>
      {text}
    </div>
  ) : null;

// Foto am See in einem Bogen (oben rund), weich umrandet
const Bogenfoto: React.FC<{ breite: number; hoehe: number; style?: React.CSSProperties }> = ({ breite, hoehe, style }) => (
  <div
    style={{
      position: "absolute",
      width: breite,
      height: hoehe,
      borderRadius: `${breite / 2}px ${breite / 2}px 28px 28px`,
      overflow: "hidden",
      border: "10px solid rgba(255,255,255,0.75)",
      boxShadow: "0 20px 50px rgba(74,58,46,0.18)",
      ...style,
    }}
  >
    {/* Foto 1080×1920, ich sitze bei etwa 72 % / 74 %: doppelt so breit wie der Bogen, so verschoben, dass ich mittig unten sitze */}
    <Img
      src={staticFile("foto-hocke.jpg")}
      style={{ position: "absolute", width: breite * 2, height: (breite * 2 * 1920) / 1080, left: breite / 2 - 0.72 * breite * 2, top: hoehe * 0.56 - (0.74 * breite * 2 * 1920) / 1080 }}
    />
  </div>
);

const Fuss: React.FC<{ nummer: string; hinweis?: boolean }> = ({ nummer, hinweis }) => (
  <>
    <div style={{ position: "absolute", top: 50, right: 60, fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: SALBEI }}>{nummer}</div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 20, letterSpacing: 1, color: TEXT, opacity: 0.7 }}>
      {hinweis ? "Keine persönliche Finanzberatung · @aufbruchsvision" : "@aufbruchsvision"}
    </div>
  </>
);

export const WeichKarussell: React.FC<FinanzProps> = ({ art, kicker, zahl, titel, zeilen, tipp, knopf, nummer }) => {
  if (art === "titel" || art === "schluss") {
    const titelFolie = art === "titel";
    return (
      <AbsoluteFill>
        <Hintergrund />
        <Bogenfoto breite={titelFolie ? 430 : 330} hoehe={titelFolie ? 620 : 430} style={{ right: titelFolie ? 70 : 60, bottom: titelFolie ? 120 : 110 }} />
        <div style={{ position: "absolute", left: 80, top: 120, width: titelFolie ? 900 : 920 }}>
          <Kicker text={kicker} />
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: titelFolie ? 108 : 92, lineHeight: 1.02, color: BRAUN, width: titelFolie ? 860 : 900 }}>{titel}</div>
          <Ranke />
          <div style={{ display: "flex", flexDirection: "column", gap: 20, width: titelFolie ? 500 : 900 }}>
            {zeilen.map((z) => (
              <div key={z} style={{ fontFamily: titelFolie ? SERIF : SANS, fontStyle: titelFolie ? "italic" : "normal", fontWeight: titelFolie ? 600 : 500, fontSize: titelFolie ? 54 : 46, lineHeight: 1.3, color: TEXT }}>
                {z}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 80, bottom: 120 }}>
          <Knopf text={knopf} />
        </div>
        <Fuss nummer={nummer} hinweis={!titelFolie} />
      </AbsoluteFill>
    );
  }
  // Inhaltsfolie: kleine kursive Nummer, Serifen-Titel, Tipp als helle, weiche Karte
  return (
    <AbsoluteFill>
      <Hintergrund />
      <AbsoluteFill style={{ padding: "0 90px 40px", justifyContent: "center" }}>
        {zahl && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 120, lineHeight: 1, color: SALBEI, opacity: 0.8, marginBottom: 6 }}>{zahl}.</div>}
        <Kicker text={kicker} />
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 112, lineHeight: 1.02, color: BRAUN }}>{titel}</div>
        <Ranke />
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {zeilen.map((z) => (
            <div key={z} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 46, lineHeight: 1.35, color: TEXT }}>{z}</div>
          ))}
        </div>
        {tipp && (
          <div
            style={{
              marginTop: 60,
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 40,
              lineHeight: 1.4,
              color: BRAUN,
              background: "rgba(255,255,255,0.6)",
              border: "2px solid rgba(255,255,255,0.9)",
              boxShadow: "0 14px 40px rgba(74,58,46,0.1)",
              padding: "36px 42px",
              borderRadius: 40,
            }}
          >
            {tipp}
          </div>
        )}
      </AbsoluteFill>
      <Fuss nummer={nummer} />
    </AbsoluteFill>
  );
};
