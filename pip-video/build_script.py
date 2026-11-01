"""Erzeugt aus der Szenenliste das Drehbuch (DREHBUCH.md) und die Bild-Prompts (prompts.json).
"Pip und Pippin": 20 Szenen x 3 Sekunden = 60 Sekunden (1 Minute)."""
import json, pathlib

PIP = ("Pip, a small fluffy chestnut-brown puppy with long floppy ears, big round blue-grey "
       "expressive eyes, shiny black button nose, white fur patch on the chest, fluffy curled tail, "
       "teal collar with a round golden tag engraved 'PIP'")
PIPPIN = ("Pippin, a small fluffy ginger orange tabby kitten with big turquoise-green eyes, pink nose, "
          "long white whiskers, cream-colored belly, bushy striped tail, dark teal collar with a small golden bell")
STYLE = ("Pixar-style 3D animated film still, highly detailed fur texture, soft cinematic lighting, "
         "warm colors, shallow depth of field, 16:9, no text")

# (Akt, Figuren für die Storyboard-Karte: pip/pippin/beide/none, Szene DE, Sprecher, Prompt EN)
S = [
 # 0:00–0:12  Morgen
 (1, "none", "Morgen in der Stadt: Sonnenaufgang über bunten Dächern.", "Es war ein sonniger Morgen in Sonnenhausen …",
  "Establishing shot: sunrise over a small cozy European town with colorful rooftops, church tower, green hills, golden morning mist"),
 (1, "pip", "Pip schläft zusammengerollt in seinem Körbchen.", "… und Pip schlief noch tief und fest.",
  "{PIP} sleeping curled up in a round plaid dog basket in a cozy room, morning sunbeams through the window"),
 (1, "pippin", "Am Fenster sitzt Pippin und klopft mit der Pfote an die Scheibe.", "Da klopfte es am Fenster.",
  "{PIPPIN} sitting on the outside windowsill, tapping on the glass with one paw, playful wink, morning light"),
 (1, "pip", "Pip macht riesige Augen und wedelt mit dem Schwanz.", "Pippin, sein bester Freund!",
  "Close-up of {PIP} waking up with huge delighted eyes, ears perked up, tail wagging, looking at the window"),
 # 0:12–0:24  Hinaus
 (2, "beide", "Pip schlüpft durch die Hundeklappe, Pippin wartet schon.", "Pip zögerte keine Sekunde.",
  "{PIP} squeezing through a dog flap in a blue front door, {PIPPIN} waiting outside on the doorstep, smiling"),
 (2, "beide", "Zusammen laufen sie durch die Kopfsteinpflaster-Gasse.", "",
  "{PIP} and {PIPPIN} trotting side by side down a cobblestone street with pastel houses and flower boxes"),
 (2, "pippin", "Auf dem Markt balanciert Pippin über die Obstkisten.", "Auf dem Markt war schon viel los.",
  "{PIPPIN} balancing on top of colorful fruit crates at a busy farmers market, striped awnings, {PIP} watching below laughing"),
 (2, "beide", "Die beiden erreichen den Park mit der grossen Eiche.", "",
  "{PIP} and {PIPPIN} arriving at a sunny city park with a pond, meadow full of daisies and a huge old oak tree"),
 # 0:24–0:36  Das Problem
 (3, "pippin", "Ein Windstoss wirbelt Blätter auf – Pippin jagt hinterher, den Baum hinauf.", "Plötzlich kam ein starker Windstoss.",
  "{PIPPIN} chasing swirling green leaves in the wind, leaping up the trunk of a huge oak tree, dynamic"),
 (3, "pippin", "Pippin sitzt hoch oben in der Eiche fest.", "Und auf einmal war Pippin ganz weit oben.",
  "{PIPPIN} clinging to a thin branch high up in a huge oak tree, looking down nervously, ears flat"),
 (3, "pippin", "Pippin miaut ängstlich, der Schwanz zittert.", "",
  "Close-up of {PIPPIN} meowing anxiously high in the tree, big worried turquoise eyes, leaves around"),
 (3, "pip", "Pip stupst tröstend den Baumstamm an und schaut nach oben.", "",
  "{PIP} at the foot of the oak, gently nudging the trunk with his nose, looking up with concern"),
 # 0:36–0:48  Der Plan
 (4, "pip", "Pip hat einen Plan – Brust raus, Schwanz hoch.", "Pip hatte einen Plan.",
  "{PIP} standing heroically with chest out and tail high, determined look, low angle hero shot, oak tree behind"),
 (4, "pip", "Pip schiebt einen grossen Laubhaufen unter den Baum.", "",
  "{PIP} pushing a big pile of autumn leaves under the oak tree with his nose and paws, leaves flying"),
 (4, "pip", "Pip bellt nach oben: «Spring, Pippin!»", "„Spring, Pippin – ich fang dich auf!“",
  "{PIP} on top of a soft leaf pile barking encouragingly upward, paws spread, looking at the treetop"),
 (4, "pippin", "Pippin nimmt Anlauf und springt.", "",
  "{PIPPIN} leaping from the oak branch through the air, legs spread, tail streaming, brave face"),
 # 0:48–1:00  Freunde
 (5, "beide", "Platsch! Beide landen lachend im Laubhaufen.", "",
  "{PIPPIN} landing in a big leaf pile next to {PIP}, leaves exploding everywhere, both laughing"),
 (5, "beide", "Pippin schmiegt sich an Pip – dicke Umarmung.", "Danke, Pip!",
  "{PIPPIN} hugging {PIP} and rubbing her head against his cheek, both overjoyed, warm sunlight"),
 (5, "beide", "Goldene Stunde: zusammen auf dem Hügel im Sonnenuntergang.", "Der Tag ging langsam zu Ende.",
  "Silhouettes of {PIP} and {PIPPIN} sitting together on a grassy hill at golden-hour sunset, orange sky"),
 (5, "beide", "Abends schlafen beide zusammengekuschelt im Körbchen.", "Gute Nacht, Pip und Pippin.",
  "{PIP} and {PIPPIN} sleeping cuddled together in a round dog basket at night, moonlight through the window"),
]
assert len(S) == 20, len(S)

AKTE = {1: "0:00–0:12 · Morgen", 2: "0:12–0:24 · Hinaus in die Stadt", 3: "0:24–0:36 · Pippin sitzt fest",
        4: "0:36–0:48 · Pips Plan", 5: "0:48–1:00 · Beste Freunde"}

def ts(sec):
    return f"{sec // 60}:{sec % 60:02d}"

out = pathlib.Path(__file__).parent
prompts, md = [], []
md += ["# Pip und Pippin", "",
       "Kurzfilm, **1:00 Min.**, **20 Bilder à 3 Sekunden**, 16:9. Referenzen: `pip-referenz.jpg`, `pippin-referenz.jpg`.", "",
       "**Pip (Hund):** " + PIP, "", "**Pippin (Katze):** " + PIPPIN, "", "**Stil-Zusatz:** " + STYLE, ""]
akt = 0
for i, (a, who, de, vo, p) in enumerate(S):
    if a != akt:
        akt = a
        md += [f"## {AKTE[a]}", "", "| # | Zeit | Szene | Sprecher | Bild-Prompt |", "|---|---|---|---|---|"]
    full = p.replace("{PIP}", PIP).replace("{PIPPIN}", PIPPIN) + ". " + STYLE
    prompts.append({"nr": i + 1, "start": ts(i * 3), "ende": ts(i * 3 + 3), "figuren": who,
                    "szene": de, "sprecher": vo, "prompt": full})
    short = p.replace("{PIPPIN}", "Pippin").replace("{PIP}", "Pip")
    md.append(f"| {i+1} | {ts(i*3)}–{ts(i*3+3)} | {de} | {vo} | {short} |")
    if i + 1 == len(S) or S[i + 1][0] != a:
        md.append("")

(out / "DREHBUCH.md").write_text("\n".join(md), encoding="utf-8")
(out / "prompts.json").write_text(json.dumps(prompts, ensure_ascii=False, indent=2), encoding="utf-8")
print("ok", len(prompts))
