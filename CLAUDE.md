# Proyecto de edición de video (Remotion + ffmpeg)

- El usuario trabaja desde un iPad: todo se ejecuta en el entorno cloud. Responde en español.
- Renderiza con `npm run render`, `npm run render:vertical` o `npx remotion render src/index.ts <Composición> out/<archivo>.mp4 --props='{...}'`.
- No se puede descargar el Chrome de Remotion (red bloqueada). `remotion.config.ts` usa `/opt/pw-browsers/chromium_headless_shell-*`.
- ffmpeg está en el sistema para cortes, conversión, extracción de audio, etc.
- Cuando termines un render, envía el archivo de `out/` al usuario con SendUserFile.
- Los archivos subidos por el usuario van en `public/`.
