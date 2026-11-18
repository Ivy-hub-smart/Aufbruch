import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { FinanzProps } from "./FinanzKarussell";

// Neue Vorstellung zum Anpinnen im weichen Stil
export const VORSTELLUNG_WEICH: FinanzProps[] = [
  {
    art: "titel",
    kicker: "SCHÖN, BIST DU DA",
    titel: "Hi, ich bin Yvonne.",
    zeilen: ["Ich zeige dir, wie du finanziell freier wirst."],
    knopf: "Wisch weiter 👉",
    nummer: "1/4",
  },
  {
    art: "inhalt",
    kicker: "WARUM ICH DAS MACHE",
    titel: "Geld muss nicht kompliziert sein.",
    zeilen: ["Ich kenne mich mit Finanzen und Immobilien aus.", "Und ich weiss: Viele fühlen sich beim Thema Geld allein gelassen."],
    tipp: "Hier bekommst du Wissen, das man wirklich versteht. 🤍",
    nummer: "2/4",
  },
  {
    art: "inhalt",
    kicker: "DAS ERWARTET DICH",
    titel: "Hier lernst du:",
    zeilen: ["💰 Ordnung im Geld", "🌿 Raus aus den Schulden", "🏡 Dein Weg zum Eigenheim", "✨ Ein zweites Einkommen"],
    tipp: "Einfach erklärt. Schritt für Schritt.",
    nummer: "3/4",
  },
  {
    art: "schluss",
    kicker: "LUST, MITZUKOMMEN?",
    titel: "Folge mir & sag Hallo!",
    zeilen: ["Schreib mir in die Kommentare:", "Was ist dein grösstes Geldziel?"],
    knopf: "Jetzt folgen 🤍",
    nummer: "4/4",
  },
];

// Stil «weich & natürlich» (4:5): warmer Sand, Salbei & Rosé als weiche Formen,
// elegante Serifenschrift, runde grüne Tipp-Karten, Foto im Blazer frei vor weichem Kreis. Nutzt dieselben Texte wie Stil A.
export const SERIF = "'Cormorant Garamond', Georgia, serif";
export const SANS = "Montserrat, sans-serif";
export const BRAUN = "#4a3a2e";
export const TEXT = "#6b5a4c";
export const SALBEI = "#8a9a7b";
export const GRUEN = "#5e7d62"; // sanftes Grün für Tipp-Karten und Knöpfe

// weiche, unscharfe Farbflecken im Hintergrund
export const Hintergrund: React.FC = () => (
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
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: "white", background: GRUEN, boxShadow: "0 10px 26px rgba(94,125,98,0.3)", padding: "20px 40px", borderRadius: 999, display: "inline-block" }}>
      {text}
    </div>
  ) : null;

// Foto im Blazer ohne Rahmen: Freisteller steht unten rechts vor einem weichen Salbei-Rosé-Kreis
export const Freisteller: React.FC<{ hoehe: number }> = ({ hoehe }) => (
  <>
    <div
      style={{
        position: "absolute",
        right: -hoehe * 0.12,
        bottom: -hoehe * 0.08,
        width: hoehe * 0.9,
        height: hoehe * 0.9,
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 35%, #e4ead9 0%, #dfe6d6 45%, #efd9cb 100%)",
        boxShadow: "0 0 80px 30px rgba(239,217,203,0.35)",
      }}
    />
    <Img src={staticFile("foto-blazer.png")} style={{ position: "absolute", right: -hoehe * 0.06, bottom: 0, height: hoehe }} />
  </>
);

const Fuss: React.FC<{ nummer: string; hinweis?: boolean; links?: boolean }> = ({ nummer, hinweis, links }) => (
  <>
    <div style={{ position: "absolute", top: 50, right: 60, fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: SALBEI }}>{nummer}</div>
    <div style={{ position: "absolute", left: links ? 80 : 0, right: links ? undefined : 0, bottom: 34, textAlign: links ? "left" : "center", fontFamily: SANS, fontWeight: 500, fontSize: 20, letterSpacing: 1, color: TEXT, opacity: 0.7 }}>
      {hinweis ? <>Keine persönliche Finanzberatung<br />@aufbruchsvision</> : "@aufbruchsvision"}
    </div>
  </>
);

export const WeichKarussell: React.FC<FinanzProps> = ({ art, kicker, zahl, titel, zeilen, tipp, knopf, nummer }) => {
  if (art === "titel" || art === "schluss") {
    const titelFolie = art === "titel";
    return (
      <AbsoluteFill>
        <Hintergrund />
        <Freisteller hoehe={titelFolie ? 860 : 700} />
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
        <Fuss nummer={nummer} hinweis={!titelFolie} links />
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
              fontWeight: 600,
              fontSize: 40,
              lineHeight: 1.4,
              color: "white",
              background: GRUEN,
              boxShadow: "0 16px 40px rgba(94,125,98,0.28)",
              padding: "40px 48px",
              borderRadius: 56,
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
