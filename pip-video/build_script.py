"""Erzeugt aus der Szenenliste das Drehbuch (DREHBUCH.md) und die Bild-Prompts (prompts.json).
60 Szenen x 3 Sekunden = 180 Sekunden (3 Minuten)."""
import json, pathlib

PIP = ("Pip, a small fluffy chestnut-brown puppy with long floppy ears, big round blue-grey "
       "expressive eyes, shiny black button nose, white fur patch on the chest, fluffy curled tail, "
       "teal collar with a round golden tag engraved 'PIP'")
STYLE = ("Pixar-style 3D animated film still, highly detailed fur texture, soft cinematic lighting, "
         "warm colors, shallow depth of field, 16:9, no text")
LINA = "Lina, a 7-year-old girl with curly red hair in two pigtails, yellow raincoat and green rubber boots"

# (Akt, Szene auf Deutsch, Sprechertext oder "", Prompt-Szene auf Englisch)
S = [
 # AKT 1 – Morgen
 (1, "Sonnenaufgang über einer kleinen Stadt mit bunten Dächern.", "Es war ein windiger Morgen in Sonnenhausen …",
  "Establishing shot: sunrise over a small cozy European town with colorful rooftops, church tower, rolling green hills, golden morning mist"),
 (1, "Ein gemütliches Kinderzimmer, Pip schläft zusammengerollt im Körbchen.", "… und Pip schlief noch tief und fest.",
  "{PIP} sleeping curled up in a round plaid dog basket in a cozy room, morning sunbeams through the window"),
 (1, "Nahaufnahme: Pips Nase zuckt, ein Sonnenstrahl kitzelt sie.", "",
  "Extreme close-up of {PIP}'s black nose twitching as a sunbeam touches it, dust particles glowing in the light"),
 (1, "Pip öffnet verschlafen ein Auge.", "",
  "Close-up of {PIP} opening one sleepy eye, ear flopped over his face, cute and drowsy"),
 (1, "Pip streckt sich lang – Po in die Höhe.", "",
  "{PIP} doing a big morning stretch, front paws forward and fluffy tail up in the air, yawning widely"),
 (1, "Pip tapst zum Fenster und stellt die Pfoten aufs Fensterbrett.", "",
  "{PIP} standing on hind legs with front paws on a wooden windowsill, looking outside, seen from behind"),
 (1, "Draußen am blauen Himmel tanzt ein roter Drachen.", "Da sah er etwas Rotes am Himmel tanzen.",
  "View from the window: a bright red diamond-shaped kite with a long ribbon tail dancing in a blue sky above the rooftops"),
 (1, "Pips Augen werden riesig, der Drachen spiegelt sich darin.", "",
  "Close-up of {PIP}'s huge amazed eyes, the red kite reflected in his pupils, ears perked up"),
 (1, "Pip wedelt aufgeregt mit dem Schwanz.", "",
  "{PIP} wagging his fluffy tail so fast it blurs, excited open-mouth smile, at the window"),
 (1, "Pip rennt die Holztreppe hinunter, Ohren fliegen.", "",
  "{PIP} running down a wooden staircase, floppy ears flying, motion blur, dynamic low angle"),
 (1, "In der Küche: Pip schlittert über den Fliesenboden.", "",
  "{PIP} sliding comically across a shiny checkered kitchen floor, paws splayed, surprised face"),
 (1, "Pip steht vor der Hundeklappe in der Haustür.", "",
  "{PIP} in front of a small dog flap in a blue wooden front door, determined look, tail up"),
 # AKT 2 – Hinaus
 (2, "Pip schlüpft durch die Hundeklappe nach draußen.", "Pip zögerte keine Sekunde.",
  "{PIP} squeezing through a dog flap, head and front paws outside, morning garden behind"),
 (2, "Im Garten: Tau glitzert auf dem Gras, Pip schaut nach oben.", "",
  "{PIP} in a dewy garden with sparkling grass and tulips, looking up at the sky"),
 (2, "Der Drachen zieht weiter Richtung Stadt.", "",
  "Low angle: the red kite drifting over a garden fence toward the town, puffy white clouds"),
 (2, "Pip zwängt sich unter dem Gartenzaun durch.", "",
  "{PIP} crawling under a white picket fence, fur ruffled, tongue out"),
 (2, "Pip läuft eine Kopfsteinpflasterstraße entlang.", "",
  "{PIP} trotting happily down a cobblestone street lined with pastel houses and flower boxes"),
 (2, "Eine Katze auf einer Mauer schaut Pip skeptisch an.", "",
  "A grumpy fat grey cat on a stone wall raising an eyebrow at {PIP} who passes below"),
 (2, "Pip grüsst die Katze mit einem fröhlichen Bellen.", "",
  "{PIP} barking cheerfully up at a grey cat, little sound puff, playful mood"),
 (2, "Der Wochenmarkt: bunte Stände mit Obst und Blumen.", "Auf dem Markt war schon viel los.",
  "Wide shot of a busy colorful farmers market square with fruit and flower stalls, striped awnings"),
 (2, "Pip schlängelt sich zwischen Beinen und Körben hindurch.", "",
  "Dog's-eye view: {PIP} weaving between people's legs and wicker baskets at the market"),
 (2, "Ein Apfel rollt vom Stand, Pip springt darüber.", "",
  "{PIP} leaping over a rolling red apple, mid-air jump, apples spilling from a crate"),
 (2, "Der Bäcker lacht und wirft Pip ein Stück Brezel zu.", "",
  "A friendly round baker with a white hat laughing and tossing a pretzel piece to {PIP}"),
 (2, "Pip fängt die Brezel in der Luft.", "",
  "{PIP} catching a pretzel piece in mid-air with his mouth, happy eyes closed"),
 # AKT 3 – Im Park
 (3, "Pip erreicht das Tor zum Stadtpark.", "Der Drachen führte ihn bis in den Park.",
  "{PIP} arriving at an ornate iron park gate, big old trees and green lawns beyond"),
 (3, "Der Park: weite Wiese, Teich, grosse Eiche.", "",
  "Wide establishing shot of a sunny city park with a pond, a huge old oak tree and a meadow, red kite in the sky"),
 (3, "Pip rennt über die Wiese, Gänseblümchen fliegen.", "",
  "{PIP} running joyfully across a meadow full of daisies, petals flying, low angle"),
 (3, "Entenfamilie am Teich – die Mama-Ente schnattert empört.", "",
  "A mother duck with ducklings quacking indignantly at {PIP} on the edge of a pond"),
 (3, "Pip bremst ab und entschuldigt sich mit gesenktem Kopf.", "",
  "{PIP} stopping short with an apologetic face, ears down, in front of the ducks"),
 (3, "Ein Windstoss – Blätter wirbeln durch die Luft.", "Plötzlich kam ein starker Windstoss.",
  "Strong gust of wind swirling green leaves through the park, trees bending, dramatic"),
 (3, "Der rote Drachen trudelt hilflos.", "",
  "The red kite spinning out of control in the wind, string loose, dramatic sky"),
 (3, "Der Drachen verfängt sich hoch oben in der Eiche.", "",
  "The red kite tangled high up in the branches of a huge oak tree, ribbon tail hanging down"),
 (3, "Unter dem Baum: Lina hält die leere Spule.", "Unter dem Baum stand ein Mädchen namens Lina.",
  "{LINA} standing under a big oak holding an empty kite spool, looking up sadly"),
 (3, "Nahaufnahme: Eine Träne rollt über Linas Wange.", "",
  "Close-up of {LINA}'s face, a tear rolling down her freckled cheek, soft light"),
 (3, "Pip schaut von Lina zum Baum und zurück.", "",
  "{PIP} looking up at the tree with a thoughtful tilted head, Lina in the background"),
 (3, "Pip stupst Lina sanft mit der Nase an.", "",
  "{PIP} gently nudging {LINA}'s hand with his nose, she looks down surprised"),
 # AKT 4 – Die Rettung
 (4, "Lina kniet sich hin und streichelt Pip.", "„Hallo, kleiner Hund … kannst du mir helfen?“",
  "{LINA} kneeling and petting {PIP}, small hopeful smile"),
 (4, "Pip bellt entschlossen – Brust raus, Schwanz hoch.", "Pip hatte einen Plan.",
  "{PIP} standing heroically with chest out and tail high, determined bark, low angle hero shot"),
 (4, "Pip springt auf eine Parkbank neben dem Baum.", "",
  "{PIP} jumping onto a green wooden park bench next to the oak tree"),
 (4, "Pip springt hoch – aber der Ast ist viel zu weit.", "",
  "{PIP} jumping as high as he can toward a branch far out of reach, comedic"),
 (4, "Pip plumpst ins Laub, ein Blatt auf dem Kopf.", "",
  "{PIP} landing in a pile of leaves, one leaf on his head, dazed funny face"),
 (4, "Ein Eichhörnchen schaut neugierig aus einem Astloch.", "Doch da oben wohnte jemand.",
  "A cute red squirrel peeking curiously out of a hole in the oak tree trunk"),
 (4, "Pip bellt dem Eichhörnchen zu und zeigt mit der Pfote nach oben.", "",
  "{PIP} looking up at a squirrel and pointing upward with his paw, pleading eyes"),
 (4, "Das Eichhörnchen nickt und flitzt den Stamm hinauf.", "",
  "A red squirrel racing up the oak trunk in a spiral, bits of bark flying"),
 (4, "Das Eichhörnchen knabbert am verhedderten Faden.", "",
  "Close-up: a red squirrel nibbling a tangled kite string on a branch, red kite fabric nearby"),
 (4, "Die Schnur fällt herunter – Pip schnappt sie.", "",
  "{PIP} catching a falling kite string in his teeth, focused eyes"),
 (4, "Pip zieht mit aller Kraft, Pfoten in die Erde gestemmt.", "",
  "{PIP} pulling a string with all his might, paws dug into the ground, fur bristling"),
 (4, "Der Drachen löst sich und schwebt nach unten.", "",
  "The red kite breaking free from the branches and gliding down, leaves falling around it"),
 # AKT 5 – Freunde
 (5, "Pip bringt Lina den Drachen, Schnur im Maul.", "Und Pip brachte Lina ihren Drachen zurück.",
  "{PIP} proudly trotting toward {LINA} with the red kite string in his mouth"),
 (5, "Lina umarmt Pip überglücklich.", "",
  "{LINA} hugging {PIP} tightly, both overjoyed, sunlight glowing behind them"),
 (5, "Das Eichhörnchen winkt vom Ast.", "",
  "A red squirrel on an oak branch waving a tiny paw, smiling"),
 (5, "Lina und Pip rennen gemeinsam über die Wiese.", "",
  "{LINA} and {PIP} running together across the meadow, kite lifting behind them"),
 (5, "Der Drachen steigt hoch in den Himmel.", "",
  "The red kite soaring high into a bright blue sky, ribbon tail fluttering"),
 (5, "Pip hält die Schnur zusammen mit Lina.", "Jetzt durfte Pip mithelfen.",
  "{LINA} and {PIP} holding the kite string together, Pip's tail wagging"),
 (5, "Die Entenfamilie schaut zufrieden zu.", "",
  "The duck family on the pond watching the kite contentedly"),
 (5, "Picknick auf der Decke: Lina teilt ihr Sandwich.", "",
  "{LINA} and {PIP} on a checkered picnic blanket, she shares a sandwich with him"),
 (5, "Goldene Stunde: Silhouetten vor dem Sonnenuntergang.", "Der Tag ging langsam zu Ende.",
  "Silhouettes of {LINA} and {PIP} on a hill at golden-hour sunset, kite in the orange sky"),
 (5, "Lina trägt Pip auf dem Arm nach Hause, er gähnt.", "",
  "{LINA} carrying a sleepy yawning {PIP} home down a cobblestone street at dusk, street lamps glowing"),
 (5, "Pip schläft zufrieden im Körbchen, der Drachen hängt an der Wand.", "",
  "{PIP} sleeping happily in his dog basket at night, the red kite hanging on the wall, moonlight"),
 (5, "Mond über der Stadt – Schlussbild mit Titel.", "Gute Nacht, Pip.",
  "Moonlit night over the small town with starry sky, a single lit window, peaceful ending shot"),
]
assert len(S) == 60, len(S)

AKTE = {1: "Akt 1 – Ein roter Punkt am Himmel", 2: "Akt 2 – Hinaus in die Stadt",
        3: "Akt 3 – Im Park", 4: "Akt 4 – Die Rettung", 5: "Akt 5 – Neue Freunde"}

def ts(sec):
    return f"{sec // 60}:{sec % 60:02d}"

out = pathlib.Path(__file__).parent
prompts, md = [], []
md += ["# Pip und der rote Drachen", "",
       "Kurzfilm, **3:00 Min.**, **60 Bilder à 3 Sekunden**, 16:9. Referenz: `pip-referenz.jpg`.", "",
       "**Figur (in jedem Prompt enthalten):** " + PIP, "", "**Stil-Zusatz:** " + STYLE, ""]
akt = 0
for i, (a, de, vo, p) in enumerate(S):
    if a != akt:
        akt = a
        md += [f"## {AKTE[a]}", "", "| # | Zeit | Szene | Sprecher | Bild-Prompt |", "|---|---|---|---|---|"]
    full = p.replace("{PIP}", PIP).replace("{LINA}", LINA) + ". " + STYLE
    prompts.append({"nr": i + 1, "start": ts(i * 3), "ende": ts(i * 3 + 3), "szene": de, "sprecher": vo, "prompt": full})
    short = p.replace("{PIP}", "Pip").replace("{LINA}", "Lina")
    md.append(f"| {i+1} | {ts(i*3)}–{ts(i*3+3)} | {de} | {vo} | {short} |")
    nxt = S[i + 1][0] if i + 1 < len(S) else None
    if nxt != a:
        md.append("")

(out / "DREHBUCH.md").write_text("\n".join(md), encoding="utf-8")
(out / "prompts.json").write_text(json.dumps(prompts, ensure_ascii=False, indent=2), encoding="utf-8")
print("ok", len(prompts))
