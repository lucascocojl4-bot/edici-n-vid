# Edición de video automática (Remotion + ffmpeg)

> **Sobre el iPad:** iPadOS no permite instalar Node.js, Chromium ni ffmpeg, que son
> lo que Remotion necesita para renderizar. Por eso este proyecto **se ejecuta en la
> nube** (Claude Code en claude.ai / app de Claude) y tú lo controlas desde el iPad.

## Cómo usarlo desde el iPad

1. Abre la app de Claude (o claude.ai/code) y empieza una sesión en este repositorio.
2. Al arrancar, un *hook* (`.claude/hooks/session-start.sh`) instala automáticamente
   ffmpeg (si falta) y las dependencias de Remotion.
3. Pídele a Claude lo que quieras, por ejemplo:
   - "Renderiza un video vertical con el título 'Oferta de verano'"
   - "Pon este clip de fondo y añade subtítulos"
   - "Recorta los primeros 10 segundos de mi video con ffmpeg"
4. El video final queda en `out/` y Claude te lo puede enviar para descargarlo.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run render` | Video horizontal 1920×1080 → `out/video.mp4` |
| `npm run render:vertical` | Video vertical 1080×1920 → `out/vertical.mp4` |
| `npm run still` | Miniatura PNG → `out/miniatura.png` |
| `npm run studio` | Editor visual de Remotion (solo útil en un ordenador) |

Personalizar sin tocar código:

```bash
npx remotion render src/index.ts Principal out/mi-video.mp4 \
  --props='{"titulo":"Hola","subtitulo":"Mi canal","colorFondo":"#000","clip":"clip.mp4"}'
```

`clip` es un archivo que hayas puesto en `public/`.

## Estructura

- `src/Root.tsx`: composiciones (Principal 16:9 y Vertical 9:16, 30 fps, 5 s)
- `src/Video.tsx`: el video (clip de fondo + título animado)
- `remotion.config.ts`: usa el Chromium preinstalado del entorno cloud
- `public/`: tus clips, audios e imágenes
- `out/`: los renders (no se suben a git)

## Vídeos grandes (más de 30 MB) desde Google Drive

1. Sube el vídeo a Google Drive y compártelo como **"Cualquier persona con el enlace"**.
2. Pega el enlace en el chat con tus indicaciones.
3. Claude lo descarga con `scripts/descargar-drive.sh "<enlace>"` a `public/`.

Requiere permitir `drive.google.com` y `drive.usercontent.google.com` en el acceso de red
del entorno: https://code.claude.com/docs/en/cloud-environments#network-access
