#!/usr/bin/env bash
# Rendert pro KI-Tipp die passende Szene mit dem passenden Foto (fotos/<name>.png)
set -euo pipefail
cd "$(dirname "$0")/.."

# Tipp-Nr : Szene : Foto  (Tipp 3 nutzt das echte Spaziergang-Video)
JOBS="1:see-morgen:steg 2:wind-wiese:blazer-oliv 4:wind-ufer:blazer-blau 5:see-morgen:hocke
6:wind-wiese:kirschen 7:see-abend:blazer-schwarz 8:wind-ufer:kleid"

for job in $JOBS; do
  IFS=: read -r nr szene foto <<< "$job"
  if [ $# -gt 0 ] && [[ " $* " != *" $nr "* ]]; then continue; fi
  cp "fotos/$foto.png" "$szene/assets/ich.png"
  (cd "$szene" && npx hyperframes render -f 30 -q high -o "../../remotion/public/hyperframes-ki-$nr.mp4")
done
