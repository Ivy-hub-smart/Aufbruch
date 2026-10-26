// Serie „2. Einkommen mit KI“ im Karussell-Stil (Navy/Creme), ein Tipp pro Reel.
// Nur zwei Fotos: Hocke am Steg und schwarzer Blazer, abwechselnd.
export type KiTipp = {
  id: string;
  label?: string; // Etikett oben rechts, sonst „Tipp n/8“
  hook: string; // erste 2 Sekunden: muss neugierig machen
  small: string;
  big: string;
  steps: [string, string, string];
  fazit: string;
  cta: string;
};

export const SERIE = 8;

export const KI_TIPPS: KiTipp[] = [
  {
    id: "KiTipp1",
    hook: "Einmal erstellen. Immer wieder verkaufen.",
    small: "2. Einkommen mit KI",
    big: "Digitale Produkte",
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
    hook: "Jedes Café in deiner Stadt braucht das.",
    small: "2. Einkommen mit KI",
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
    hook: "Spazieren gehen und dabei Content machen?",
    small: "2. Einkommen mit KI",
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
    hook: "Deine Prompts sind bares Geld wert.",
    small: "2. Einkommen mit KI",
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
    hook: "Empfehlen statt verkaufen – und trotzdem verdienen.",
    small: "2. Einkommen mit KI",
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
    hook: "Deine Idee auf 1000 Tassen – ohne Risiko.",
    small: "2. Einkommen mit KI",
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
    hook: "Was du heute über KI lernst, suchen andere morgen.",
    small: "2. Einkommen mit KI",
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
    hook: "Warum die meisten aufgeben – und du nicht.",
    small: "Der wichtigste Tipp",
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
