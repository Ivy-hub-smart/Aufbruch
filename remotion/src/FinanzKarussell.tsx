import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";

// Stil A «hell & klar» für Finanz- & Immobilien-Karussells (4:5):
// Creme, Waldgrün, Goldstrich, Foto im Blazer auf Titel- und Schlussfolie.
const SANS = "Montserrat, sans-serif";
const CREME = "#f6f1e9";
const GRUEN = "#2f5d4a";
const HELLGRUEN = "#dfe8df";
const DUNKEL = "#1f2a24";
const GOLD = "#e0a43a";

const folie = z.object({
  art: z.enum(["titel", "inhalt", "schluss"]),
  kicker: z.string().optional(), // kleine Überschrift in Grossbuchstaben
  zahl: z.string().optional(), // grosse Zahl auf Inhaltsfolien
  titel: z.string(),
  zeilen: z.array(z.string()),
  tipp: z.string().optional(), // grüner Kasten unten
  knopf: z.string().optional(),
  nummer: z.string(),
});
export const finanzSchema = folie;
export type FinanzProps = z.infer<typeof folie>;

// Karussell 1: «Am Ende vom Monat ist nichts übrig?» – die 3-Konten-Methode
export const DREI_KONTEN: FinanzProps[] = [
  {
    art: "titel",
    kicker: "FINANZEN · EINFACH",
    titel: "Am Ende vom Monat ist nichts übrig?",
    zeilen: ["So änderst du das mit 3 Konten."],
    knopf: "Wisch weiter 👉",
    nummer: "1/6",
  },
  {
    art: "inhalt",
    kicker: "DAS PROBLEM",
    titel: "Alles liegt auf einem Konto.",
    zeilen: ["Du siehst Geld und gibst es aus.", "Was am Ende übrig bleibt, ist Zufall."],
    tipp: "Die Lösung: Gib jedem Franken einen Platz.",
    nummer: "2/6",
  },
  {
    art: "inhalt",
    kicker: "KONTO 1",
    zahl: "1",
    titel: "Fixkosten",
    zeilen: ["Miete, Krankenkasse, Versicherungen, Handy, Abos", "und die Steuern nicht vergessen!"],
    tipp: "Tipp: Dauerauftrag am Zahltag. Dann ist alles bezahlt, bevor du es ausgibst.",
    nummer: "3/6",
  },
  {
    art: "inhalt",
    kicker: "KONTO 2",
    zahl: "2",
    titel: "Zum Leben",
    zeilen: ["Einkaufen, Freizeit, Kleider, Ausgang", "Ein fester Betrag pro Monat."],
    tipp: "Tipp: Teile ihn durch 4. So weisst du jede Woche, wie viel noch da ist.",
    nummer: "4/6",
  },
  {
    art: "inhalt",
    kicker: "KONTO 3",
    zahl: "3",
    titel: "Sparen",
    zeilen: ["Zuerst sparen, nicht das, was übrig bleibt.", "Auch 50 Franken im Monat zählen."],
    tipp: "Tipp: Eröffne es bei einer anderen Bank. Aus den Augen, aus dem Sinn.",
    nummer: "5/6",
  },
  {
    art: "schluss",
    kicker: "SO STARTEST DU HEUTE",
    titel: "3 Schritte, 20 Minuten:",
    zeilen: ["1. Fixkosten zusammenzählen", "2. Zweites Konto eröffnen", "3. Dauerauftrag am Zahltag"],
    knopf: "Speichern & ausprobieren 🤍",
    nummer: "6/6",
  },
];

const Kicker: React.FC<{ text?: string }> = ({ text }) =>
  text ? <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: GRUEN, marginBottom: 30 }}>{text}</div> : null;

const Strich: React.FC = () => <div style={{ width: 90, height: 10, borderRadius: 5, background: GOLD, margin: "40px 0" }} />;

const Knopf: React.FC<{ text?: string }> = ({ text }) =>
  text ? (
    <div style={{ position: "absolute", left: 80, bottom: 70, fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "white", background: GRUEN, padding: "16px 32px", borderRadius: 999 }}>
      {text}
    </div>
  ) : null;

// Blazer-Foto rechts unten auf hellgrünem Kreis
const Foto: React.FC<{ hoehe: number }> = ({ hoehe }) => (
  <>
    <div style={{ position: "absolute", right: -120, bottom: -40, width: hoehe * 0.85, height: hoehe * 0.85, borderRadius: "50%", background: HELLGRUEN }} />
    <Img src={staticFile("foto-blazer.png")} style={{ position: "absolute", right: -40, bottom: 0, height: hoehe }} />
  </>
);

const Rahmen: React.FC<{ nummer: string; children: React.ReactNode }> = ({ nummer, children }) => (
  <AbsoluteFill style={{ background: CREME }}>
    {children}
    <div style={{ position: "absolute", top: 50, right: 60, fontFamily: SANS, fontWeight: 700, fontSize: 26, color: GRUEN, opacity: 0.7 }}>{nummer}</div>
  </AbsoluteFill>
);

export const FinanzKarussell: React.FC<FinanzProps> = ({ art, kicker, zahl, titel, zeilen, tipp, knopf, nummer }) => {
  if (art === "titel") {
    return (
      <Rahmen nummer={nummer}>
        <Foto hoehe={900} />
        <div style={{ position: "absolute", left: 80, top: 110, width: 600 }}>
          <Kicker text={kicker} />
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 82, lineHeight: 1.08, color: DUNKEL }}>{titel}</div>
          <Strich />
          {zeilen.map((z) => (
            <div key={z} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 46, lineHeight: 1.3, color: GRUEN, width: 460 }}>{z}</div>
          ))}
        </div>
        <Knopf text={knopf} />
      </Rahmen>
    );
  }
  if (art === "schluss") {
    return (
      <Rahmen nummer={nummer}>
        <Foto hoehe={720} />
        <div style={{ position: "absolute", left: 80, top: 110, width: 920 }}>
          <Kicker text={kicker} />
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.1, color: DUNKEL }}>{titel}</div>
          <Strich />
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            {zeilen.map((z) => (
              <div key={z} style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, color: GRUEN }}>{z}</div>
            ))}
          </div>
        </div>
        <Knopf text={knopf} />
        <div style={{ position: "absolute", left: 80, bottom: 30, fontFamily: SANS, fontWeight: 500, fontSize: 20, color: GRUEN, opacity: 0.6 }}>
          Keine persönliche Finanzberatung · @aufbruchsvision
        </div>
      </Rahmen>
    );
  }
  // Inhaltsfolie: grosse goldene Zahl, Titel, Zeilen, grüner Tipp-Kasten
  return (
    <Rahmen nummer={nummer}>
      {zahl && (
        <div style={{ position: "absolute", right: 40, top: 40, fontFamily: SANS, fontWeight: 800, fontSize: 460, lineHeight: 1, color: GOLD, opacity: 0.22 }}>{zahl}</div>
      )}
      <AbsoluteFill style={{ padding: "0 80px 40px", justifyContent: "center" }}>
        <Kicker text={kicker} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 100, lineHeight: 1.06, color: DUNKEL, maxWidth: 800 }}>{titel}</div>
        <Strich />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {zeilen.map((z) => (
            <div key={z} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 52, lineHeight: 1.3, color: DUNKEL }}>{z}</div>
          ))}
        </div>
        {tipp && (
          <div
            style={{
              marginTop: 70,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 44,
              lineHeight: 1.35,
              color: "white",
              background: GRUEN,
              padding: "38px 44px",
              borderRadius: 28,
            }}
          >
            {tipp}
          </div>
        )}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 22, color: GRUEN, opacity: 0.6 }}>
        @aufbruchsvision
      </div>
    </Rahmen>
  );
};
