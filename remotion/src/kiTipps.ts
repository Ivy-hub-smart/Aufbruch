// Serie „2. Einkommen mit KI“: ein Tipp pro Video, Hintergrund aus HyperFrames
export type KiTipp = {
  id: string;
  bg: string; // gerendertes HyperFrames-Video in public/
  clip?: { src: string; rate: number }; // echtes Video statt Szene, verlangsamt auf 10 s
  accent: string;
  small: string;
  big: string;
  steps: [string, string, string];
  fazit: string;
  cta: string;
};

const SEE = "linear-gradient(90deg, #0077b6 0%, #00b4d8 100%)";
const ABEND = "linear-gradient(90deg, #e0115f 0%, #ff8c42 100%)";
const WIESE = "linear-gradient(90deg, #2d8a34 0%, #8cc63f 100%)";
const UFER = "linear-gradient(90deg, #3a0ca3 0%, #4895ef 100%)";

export const KI_TIPPS: KiTipp[] = [
  {
    id: "KiTipp1",
    bg: "hyperframes-ki-1.mp4",
    accent: SEE,
    small: "2. Einkommen mit KI:",
    big: "Digitale Produkte verkaufen",
    steps: [
      "KI schreibt den Inhalt: Planer, Checklisten, E-Books",
      "Canva macht es schön – in einer Stunde",
      "Verkaufen auf Etsy, Gumroad oder Digistore24",
    ],
    fazit: "Einmal erstellt – immer wieder verkauft.",
    cta: "Speichern & folgen für Tipp 2!",
  },
  {
    id: "KiTipp2",
    bg: "hyperframes-ki-2.mp4",
    accent: WIESE,
    small: "2. Einkommen mit KI:",
    big: "Social Media für lokale Firmen",
    steps: [
      "Coiffeur, Café, Physio: Alle brauchen Posts",
      "KI schreibt Entwürfe – du gibst den Feinschliff",
      "Monatspaket anbieten, z. B. ab 300 CHF",
    ],
    fazit: "Schon 3 Kunden sind ein echtes Standbein.",
    cta: "Speichern & folgen für Tipp 3!",
  },
  {
    id: "KiTipp3",
    bg: "",
    clip: { src: "spaziergang-pool.mp4", rate: 0.65 },
    accent: ABEND,
    small: "2. Einkommen mit KI:",
    big: "Kurzvideos ohne Stress",
    steps: [
      "KI liefert Ideen, Skript und Untertitel",
      "Jeden Tag ein Reel – beim Spazieren gefilmt",
      "Geld über Affiliate-Links und Kooperationen",
    ],
    fazit: "Reichweite ist das neue Kapital.",
    cta: "Speichern & folgen für Tipp 4!",
  },
  {
    id: "KiTipp4",
    bg: "hyperframes-ki-4.mp4",
    accent: UFER,
    small: "2. Einkommen mit KI:",
    big: "Prompt-Vorlagen verkaufen",
    steps: [
      "Deine besten Prompts sammeln und testen",
      "Als Paket bündeln: z. B. 50 Prompts für Coaches",
      "Für 9 bis 29 CHF digital verkaufen",
    ],
    fazit: "Dein Wissen ist ein Produkt.",
    cta: "Speichern & folgen für Tipp 5!",
  },
  {
    id: "KiTipp5",
    bg: "hyperframes-ki-5.mp4",
    accent: SEE,
    small: "2. Einkommen mit KI:",
    big: "Affiliate mit KI-Content",
    steps: [
      "Nur empfehlen, was du selbst nutzt",
      "KI hilft bei Blog, Pinterest und Newsletter",
      "Provision pro Verkauf – Werbung kennzeichnen!",
    ],
    fazit: "Ehrlich empfehlen, langfristig verdienen.",
    cta: "Speichern & folgen für Tipp 6!",
  },
  {
    id: "KiTipp6",
    bg: "hyperframes-ki-6.mp4",
    accent: WIESE,
    small: "2. Einkommen mit KI:",
    big: "Print-on-Demand mit KI-Designs",
    steps: [
      "Deine Idee + KI-Bild = eigenes Design",
      "Auf Shirts, Tassen und Poster drucken lassen",
      "Kein Lager, kein Risiko – Bildrechte prüfen!",
    ],
    fazit: "Kreativität trifft Automatisierung.",
    cta: "Speichern & folgen für Tipp 7!",
  },
  {
    id: "KiTipp7",
    bg: "hyperframes-ki-7.mp4",
    accent: ABEND,
    small: "2. Einkommen mit KI:",
    big: "Bring anderen KI bei",
    steps: [
      "Was du heute lernst, suchen andere morgen",
      "Mini-Workshop online oder vor Ort anbieten",
      "Klein starten: ein Abend, fünf Leute",
    ],
    fazit: "Wer lehrt, wird selbst zum Profi.",
    cta: "Speichern & folgen für Tipp 8!",
  },
  {
    id: "KiTipp8",
    bg: "hyperframes-ki-8.mp4",
    accent: UFER,
    small: "Der wichtigste Tipp:",
    big: "Dranbleiben schlägt Talent",
    steps: [
      "30 Minuten pro Tag – jeden Tag",
      "Lieber eine Idee umsetzen als zehn planen",
      "Finger weg von „reich über Nacht“",
    ],
    fazit: "Gegenwind macht dich stärker.",
    cta: "Folge mir für mehr KI-Tipps!",
  },
];
