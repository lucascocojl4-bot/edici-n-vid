#!/bin/bash
# Descarga un vídeo compartido de Google Drive a public/.
# Uso: scripts/descargar-drive.sh "<enlace de Drive>" [nombre.mp4]
# El archivo debe estar compartido como "Cualquier persona con el enlace".
set -euo pipefail

enlace="${1:?Falta el enlace de Google Drive}"
nombre="${2:-}"

# Extrae el ID de enlaces tipo /file/d/<ID>/..., ?id=<ID> o un ID directo.
id=$(printf '%s' "$enlace" | sed -nE 's#.*/d/([A-Za-z0-9_-]+).*#\1#p')
[ -z "$id" ] && id=$(printf '%s' "$enlace" | sed -nE 's#.*[?&]id=([A-Za-z0-9_-]+).*#\1#p')
[ -z "$id" ] && id="$enlace"

destino_dir="$(cd "$(dirname "$0")/.." && pwd)/public"
mkdir -p "$destino_dir"
tmp="$destino_dir/.descarga-$id"

# confirm=t evita la página de aviso de "archivo demasiado grande para analizar".
curl -fL --retry 3 -o "$tmp" -D "$tmp.headers" \
  "https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t"

if [ -z "$nombre" ]; then
  nombre=$(grep -i '^content-disposition' "$tmp.headers" | tail -1 \
    | sed -nE 's/.*filename="?([^";]+)"?.*/\1/p' | tr -d '\r')
  nombre="${nombre:-video-$id.mp4}"
fi
rm -f "$tmp.headers"

if file "$tmp" | grep -qi 'html'; then
  rm -f "$tmp"
  echo "Error: Drive devolvió una página web, no el vídeo." >&2
  echo "Revisa que el archivo esté compartido como 'Cualquier persona con el enlace'." >&2
  exit 1
fi

mv "$tmp" "$destino_dir/$nombre"
echo "Descargado: public/$nombre"
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_type,width,height \
  -of compact "$destino_dir/$nombre" || true
