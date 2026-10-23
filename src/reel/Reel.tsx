import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Captions } from "./Captions";
import { Cartels, Panels } from "./Graphics";
import { FONT, FPS, GLITCHES, H, W } from "./theme";
import { VideoLayer, panelProgress } from "./VideoLayer";

// SFX: [segundo, archivo, volumen]. Siempre muy por debajo de la voz (que va a 1.0).
const SFX: [number, string, number][] = [
  [0.27, "woosh", 0.22], [0.6, "chime", 0.16], [1.02, "click", 0.2],
  [3.3, "woosh", 0.14],
  [4.03, "pop", 0.14], [5.0, "click", 0.2], [6.4, "click2", 0.2],
  [11.75, "click", 0.18], [12.0, "click2", 0.16],
  [14.72, "click", 0.18], [16.52, "click2", 0.18], [19.07, "click", 0.18], [20.07, "click2", 0.18],
  [21.38, "woosh", 0.22], [21.42, "glitch", 0.12],
  [22.5, "click", 0.2], [23.5, "click2", 0.2],
  [24.1, "pop", 0.18], [27.0, "pop", 0.18], [32.6, "pop", 0.18],
  [25.6, "click", 0.16], [29.9, "click2", 0.16], [34.3, "click", 0.16], [38.1, "click2", 0.2],
  [39.17, "woosh", 0.2], [39.2, "glitch", 0.12],
  [39.58, "click", 0.16], [42.1, "click2", 0.2], [44.2, "click", 0.2],
  [45.62, "click2", 0.16], [47.6, "click", 0.18],
  [49.76, "woosh", 0.22], [49.8, "glitch", 0.12],
  [50.3, "click", 0.2], [50.78, "chime", 0.2],
];

const useFonts = () => {
  const [h] = useState(() => delayRender("fuentes"));
  useEffect(() => {
    Promise.all(
      [500, 600, 700, 800].map((w) => new FontFace("Inter", `url(${staticFile(`fonts/inter-latin-${w}-normal.woff2`)})`, { weight: String(w) }).load()),
    ).then((fs) => { fs.forEach((f) => (document.fonts as unknown as { add(f: FontFace): void }).add(f)); continueRender(h); })
      .catch(() => continueRender(h));
  }, [h]);
};

export const Reel: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const p = panelProgress(frame);
  return (
    <AbsoluteFill style={{ background: "#03050a", fontFamily: FONT }}>
      {/* fondo oscuro estilo Apple */}
      <AbsoluteFill style={{
        background: "radial-gradient(900px 520px at 50% 14%, rgba(47,155,255,0.20), transparent 70%), radial-gradient(700px 500px at 10% 0%, rgba(120,140,255,0.10), transparent 70%), linear-gradient(180deg,#070a12,#020306)",
      }} />
      <VideoLayer />
      {/* sombras suaves para legibilidad (solo con vídeo a pantalla completa) */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 520, opacity: 1 - p,
        background: "linear-gradient(180deg, rgba(0,0,0,0.42), transparent)" }} />
      <div style={{ position: "absolute", left: 0, top: H - 760, width: W, height: 760,
        background: "linear-gradient(0deg, rgba(0,0,0,0.55), transparent)" }} />
      <Panels />
      <Cartels />
      <Captions />
      {SFX.map(([s, f, v], i) => (
        <Sequence key={i} from={Math.round(s * FPS)} durationInFrames={Math.round(1.8 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${f}.wav`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
