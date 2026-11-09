import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/900.css";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

// Reel „Dieser Prompt ist bares Geld“: wie abgefilmter Laptop-Bildschirm mit KI-Chat.
// Ich tippe den Prompt, die KI antwortet mit Nischen, unten laufen fette Untertitel
// mit rotem Schlüsselwort, am Schluss ich mit „Kommentiere START“.
// Alle Zeiten in Sekunden, alle Texte hier oder in Remotion Studio unter „Props“ änderbar.

const SANS = "Montserrat, sans-serif";
const ROT = "#e0262b";
const NAVY = "#1c3a5e";
const SCREEN = "#16181d";
const BUBBLE = "#2a2d35";
const TEXT = "#e9eaee";
const MUTED = "#9aa0ab";

const untertitel = z.object({ von: z.number(), text: z.string(), rot: z.string().optional() });
const nische = z.object({ titel: z.string(), text: z.string() });

export const kiPromptSchema = z.object({
  dauer: z.number(),
  musik: z.string(),
  prompt: z.string(),
  promptVon: z.number(),
  promptBis: z.number(),
  antwortVon: z.number(),
  antwortIntro: z.string(),
  nischen: z.array(nische),
  nischeAbstand: z.number(),
  untertitel: z.array(untertitel),
  ctaVon: z.number(),
  ctaFrage: z.string(),
  cta: z.string(),
});
export type KiPromptProps = z.infer<typeof kiPromptSchema>;

export const KI_PROMPT: KiPromptProps = {
  dauer: 19,
  musik: "ki-prompt-sound.wav",
  prompt:
    "Gib mir eine Liste von lokalen Unternehmen und Nischen in meiner Stadt, die 2026 von KI-Automationen profitieren – und denen ich solche Lösungen für 500 Franken verkaufen kann.",
  promptVon: 1.0,
  promptBis: 4.6,
  antwortVon: 5.6,
  antwortIntro:
    "2026 ist Goldgräberstimmung für KI-Automationen. Viele KMU haben von KI gehört – aber keine Zeit, es umzusetzen. Diese Nischen passen zu deinem Preis:",
  nischen: [
    { titel: "Coiffeur & Beauty", text: "Online-Termine, Erinnerung per WhatsApp, weniger Ausfälle" },
    { titel: "Handwerker", text: "Anfragen sortieren, Offerte als Entwurf in 2 Minuten" },
    { titel: "Physio & Praxen", text: "Terminbuchung, Rückruf-Assistent, No-Show-Erinnerung" },
    { titel: "Restaurants & Cafés", text: "Reservationen, Google-Bewertungen beantworten" },
    { titel: "Treuhand & Immobilien", text: "Belege und Anfragen automatisch vorsortieren" },
  ],
  nischeAbstand: 1.2,
  untertitel: [
    { von: 0.0, text: "ES IST OFFIZIELL", rot: "OFFIZIELL" },
    { von: 1.3, text: "KOPIER DIESEN PROMPT", rot: "PROMPT" },
    { von: 2.8, text: "UND FRAG DIE KI", rot: "KI" },
    { von: 4.0, text: "WELCHE FIRMEN IN DEINER STADT", rot: "STADT" },
    { von: 5.6, text: "2026 KI BRAUCHEN", rot: "2026" },
    { von: 7.0, text: "SIE HABEN DAVON GEHÖRT", rot: "GEHÖRT" },
    { von: 8.4, text: "ABER KEINE ZEIT", rot: "ZEIT" },
    { von: 9.7, text: "GENAU DA KOMMST DU", rot: "DU" },
    { von: 11.1, text: "INS SPIEL", rot: "SPIEL" },
    { von: 12.3, text: "AB 500 FRANKEN", rot: "500" },
    { von: 13.6, text: "PRO AUTOMATION", rot: "AUTOMATION" },
  ],
  ctaVon: 15.0,
  ctaFrage: "Willst du den ganzen Prompt?",
  cta: "Kommentiere START 👇",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// fette Untertitel in Grossbuchstaben, ein Wort im roten Kasten (wie in den Trend-Reels)
const Untertitel: React.FC<{ text: string; rot?: string }> = ({ text, rot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 12, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", top: 1330, left: 50, right: 50, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 18px", transform: `scale(${0.7 + p * 0.3})`, opacity: p }}>
      {text.split(" ").map((w, i) => {
        const hl = rot && w.replace(/[^\p{L}\p{N}]/gu, "") === rot;
        return (
          <span
            key={i}
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 92,
              lineHeight: 1.05,
              color: "white",
              padding: hl ? "0 16px 4px" : 0,
              background: hl ? ROT : "transparent",
              borderRadius: 14,
              transform: hl ? "rotate(-2deg)" : undefined,
              textShadow: hl ? "none" : "0 4px 0 rgba(0,0,0,0.55), 0 0 28px rgba(0,0,0,0.7)",
              WebkitTextStroke: hl ? undefined : "2px rgba(0,0,0,0.35)",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Cursor: React.FC = () => {
  const frame = useCurrentFrame();
  return <span style={{ display: "inline-block", width: 14, height: 40, marginLeft: 4, background: TEXT, verticalAlign: "-6px", opacity: Math.floor(frame / 12) % 2 ? 0 : 1 }} />;
};

// der Chat auf dem „Laptop“
const Chat: React.FC<KiPromptProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const zeichen = Math.round(interpolate(t, [p.promptVon, p.promptBis], [0, p.prompt.length], clamp));
  const gesendet = t >= p.promptBis + 0.25;
  const denkt = gesendet && t < p.antwortVon;
  const introZeichen = Math.round(interpolate(t, [p.antwortVon, p.antwortVon + 1.6], [0, p.antwortIntro.length], clamp));
  const listeVon = p.antwortVon + 1.7;

  // beim Antworten scrollt der Chat nach oben, damit die Liste ins Bild kommt
  const scroll = interpolate(t, [p.antwortVon, listeVon + p.nischen.length * p.nischeAbstand], [0, 560], { ...clamp, easing: Easing.inOut(Easing.cubic) });

  return (
    <div style={{ position: "absolute", inset: 0, background: SCREEN, overflow: "hidden", fontFamily: SANS }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, padding: "60px 70px", transform: `translateY(${-scroll}px)` }}>
        {/* meine Nachricht */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", gap: 20 }}>
          <div style={{ maxWidth: 760, background: BUBBLE, color: TEXT, borderRadius: 34, padding: "28px 34px", fontSize: 38, lineHeight: 1.38, fontWeight: 500 }}>
            {zeichen === 0 ? <Cursor /> : p.prompt.slice(0, zeichen)}
            {zeichen > 0 && !gesendet && <Cursor />}
          </div>
          <Img src={staticFile("kopf.png")} style={{ width: 84, height: 84, borderRadius: 999, objectFit: "cover", border: "3px solid #3a3e48" }} />
        </div>

        {/* Antwort der KI */}
        <div style={{ marginTop: 50, color: TEXT }}>
          {gesendet && (
            <div style={{ display: "flex", alignItems: "center", gap: 18, color: MUTED, fontSize: 30, fontWeight: 700 }}>
              <svg width="46" height="46" viewBox="0 0 46 46">
                <g transform={`rotate(${frame * 3} 23 23)`}>
                  {[0, 60, 120].map((r) => (
                    <ellipse key={r} cx="23" cy="23" rx="20" ry="8" fill="none" stroke="#c9b6ff" strokeWidth="3" transform={`rotate(${r} 23 23)`} />
                  ))}
                </g>
              </svg>
              {denkt ? `Denkt nach${".".repeat(1 + (Math.floor(frame / 8) % 3))}` : "KI-Assistent"}
            </div>
          )}
          {introZeichen > 0 && <div style={{ marginTop: 22, fontSize: 38, lineHeight: 1.45, fontWeight: 500 }}>{p.antwortIntro.slice(0, introZeichen)}</div>}
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 22 }}>
            {p.nischen.map((n, i) => {
              const von = (listeVon + i * p.nischeAbstand) * fps;
              const e = spring({ frame: frame - von, fps, config: { damping: 15, stiffness: 160 } });
              if (frame < von) return null;
              // kurzes Aufleuchten, als würde ich darauf tippen
              const tipp = interpolate(frame - von, [6, 12, 30], [0, 1, 0], clamp);
              return (
                <div
                  key={i}
                  style={{
                    opacity: e,
                    transform: `translateY(${(1 - e) * 30}px)`,
                    background: `rgba(255,255,255,${0.05 + tipp * 0.08})`,
                    border: `2px solid rgba(224,38,43,${tipp * 0.9})`,
                    borderRadius: 24,
                    padding: "22px 28px",
                  }}
                >
                  <div style={{ fontSize: 40, fontWeight: 900 }}>
                    {i + 1}. {n.titel}
                  </div>
                  <div style={{ fontSize: 33, lineHeight: 1.35, color: "#c7cad1", marginTop: 6, fontWeight: 500 }}>{n.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Laptop-Bildschirm schräg von oben gefilmt, Blick aus dem Fenster dahinter, leichtes Wackeln
const Bildschirm: React.FC<KiPromptProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const wx = Math.sin(t * 1.3) * 6 + Math.sin(t * 3.1) * 2;
  const wy = Math.cos(t * 1.1) * 5;
  const rot = Math.sin(t * 0.9) * 0.6;
  const zoom = interpolate(t, [0, p.ctaVon], [1.0, 1.08], clamp);
  return (
    <AbsoluteFill style={{ background: "#0d0f13", overflow: "hidden" }}>
      {/* Fenster: unscharfer See, hell überstrahlt */}
      <Img src={staticFile("see-unscharf.jpg")} style={{ position: "absolute", left: -60, top: -60, width: 1200, height: 900, objectFit: "cover", filter: "blur(6px) brightness(1.25) saturate(0.85)", transform: `translate(${wx * 0.4}px, ${wy * 0.4}px)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 900, background: "linear-gradient(rgba(255,255,255,0.35), rgba(255,255,255,0) 60%, rgba(13,15,19,0.9))" }} />
      <div style={{ position: "absolute", inset: 0, transform: `translate(${wx}px, ${wy}px) rotate(${rot}deg) scale(${zoom})`, transformOrigin: "50% 70%" }}>
        <div style={{ position: "absolute", left: 30, right: 30, top: 520, height: 1500, perspective: 1600 }}>
          <div style={{ position: "absolute", inset: 0, transform: "rotateX(14deg)", transformOrigin: "50% 0%", borderRadius: "28px 28px 0 0", border: "14px solid #0a0b0e", borderBottom: "none", boxShadow: "0 -20px 60px rgba(0,0,0,0.6)", overflow: "hidden" }}>
            <Chat {...p} />
            {/* Spiegelung auf dem Glas */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.10), rgba(255,255,255,0) 35%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.05))" }} />
          </div>
        </div>
      </div>
      {/* dunkler Grund hinter den Untertiteln */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, height: 520, background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0))" }} />
      {/* gefilmter Look: Vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55))" }} />
    </AbsoluteFill>
  );
};

// Schluss: ich im Blazer, Frage und Aufruf
const Schluss: React.FC<{ frage: string; cta: string }> = ({ frage, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame, fps, config: { damping: 14 } });
  const b = spring({ frame: frame - 12, fps, config: { damping: 11, stiffness: 180 } });
  const puls = 1 + Math.max(0, Math.sin((frame - 30) / 7)) * 0.04 * (frame > 30 ? 1 : 0);
  const zoom = interpolate(frame, [0, 120], [1.06, 1.0], clamp);
  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0, 8], [0, 1], clamp) }}>
      <Img src={staticFile("see-unscharf.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(4px) brightness(1.05)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(rgba(243,227,200,0.35), rgba(28,58,94,0.15))" }} />
      <Img src={staticFile("foto-blazer.png")} style={{ position: "absolute", left: 90, bottom: 0, width: 900, transform: `scale(${zoom})`, transformOrigin: "50% 100%" }} />
      <div style={{ position: "absolute", top: 200, left: 60, right: 60, textAlign: "center", opacity: a, transform: `translateY(${(1 - a) * -40}px)` }}>
        <div style={{ display: "inline-block", fontFamily: SANS, fontWeight: 900, fontSize: 78, lineHeight: 1.12, color: NAVY, background: "rgba(251,244,234,0.94)", padding: "26px 40px 32px", borderRadius: 36, boxShadow: "0 18px 50px rgba(28,58,94,0.25)" }}>
          {frage}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 300, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: b, transform: `scale(${(0.6 + b * 0.4) * puls})` }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 66, color: "white", background: ROT, padding: "24px 50px 28px", borderRadius: 999, boxShadow: "0 14px 40px rgba(120,10,10,0.45)" }}>{cta}</div>
      </div>
      <div style={{ position: "absolute", bottom: 200, left: 0, right: 0, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 44, color: "white", textShadow: "0 2px 12px rgba(0,0,0,0.6)", opacity: b }}>
        @aufbruchsvision
      </div>
    </AbsoluteFill>
  );
};

export const KiPrompt: React.FC<KiPromptProps> = (p) => {
  const { fps } = useVideoConfig();
  const ende = Math.round(p.ctaVon * fps);
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <Audio src={staticFile(p.musik)} />
      <Sequence durationInFrames={ende + 8}>
        <Bildschirm {...p} />
      </Sequence>
      {p.untertitel.map((u, i) => {
        const von = Math.round(u.von * fps);
        const bis = Math.round((p.untertitel[i + 1]?.von ?? p.ctaVon) * fps);
        return (
          <Sequence key={i} from={von} durationInFrames={bis - von}>
            <Untertitel text={u.text} rot={u.rot} />
          </Sequence>
        );
      })}
      <Sequence from={ende}>
        <Schluss frage={p.ctaFrage} cta={p.cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
