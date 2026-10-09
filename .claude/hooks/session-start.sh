#!/bin/bash
# Prepara el entorno en cada sesión cloud (iPad / web): ffmpeg + dependencias de Remotion.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

if ! command -v ffmpeg >/dev/null 2>&1; then
  (apt-get update -qq && apt-get install -y -qq ffmpeg) >/dev/null 2>&1 || \
    echo "Aviso: no se pudo instalar ffmpeg con apt" >&2
fi

npm install --no-audit --no-fund >/dev/null
