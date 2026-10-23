import React from "react";
import {
  interpolate,
  OffthreadVideo,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FPS, GLITCHES, H, PANELS, PANEL_OFF, PANEL_TOP, W, easeOut } from "./theme";

// Cambios de encuadre (punch-in) en segundos; se activan con un corte seco.
const ZOOM: [number, number][] = [
  [0, 1.0], [4.0, 1.1], [7.0, 1.0], [9.6, 1.12], [13.4, 1.0],
  [14.63, 1.1], [15.43, 1.0], [16.5, 1.1], [19.1, 1.0],
  [39.2, 1.1], [42.97, 1.0], [44.8, 1.12], [47.5, 1.0],
];

const zoomAt = (t: number) => {
  let cur = ZOOM[0][1];
  for (let i = 1; i < ZOOM.length; i++) {
    const [k, v] = ZOOM[i];
    if (t >= k) {
      cur = interpolate(t, [k, k + 0.14], [ZOOM[i - 1][1], v], {
        extrapolateRight: "clamp",
        easing: easeOut,
      });
    }
  }
  return cur;
};

export const panelProgress = (frame: number) => {
  let p = 0;
  for (const [a, b] of PANELS) {
    const up = interpolate(frame, [a * FPS, a * FPS + 18], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut,
    });
    const down = interpolate(frame, [b * FPS - 14, b * FPS], [1, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut,
    });
    p = Math.max(p, Math.min(up, down));
  }
  return p;
};

const Vid: React.FC<{ style?: React.CSSProperties; main?: boolean }> = ({ style, main }) => (
  <OffthreadVideo
    src={staticFile("clip.mp4")}
    muted={!main}
    style={{ position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover", ...style }}
  />
);

export const VideoLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const p = panelProgress(frame);
  const top = PANEL_TOP * p;
  const off = PANEL_OFF * p;
  const z = 1 + (zoomAt(t) - 1) * (1 - p);

  // Glitch: ~7 fotos tras cada instante marcado
  let g = -1;
  for (const gt of GLITCHES) {
    const k = frame - Math.round(gt * FPS);
    if (k >= 0 && k < 7) g = k;
  }
  const glitch = g >= 0;
  const r = (s: string) => random(`${g}-${s}`) * 2 - 1;

  return (
    <div
      style={{
        position: "absolute", left: 0, top, width: W, height: H - top, overflow: "hidden",
        borderTopLeftRadius: 52 * p, borderTopRightRadius: 52 * p,
        boxShadow: p > 0 ? "0 -18px 70px rgba(47,155,255,0.22)" : "none",
      }}
    >
      <div
        style={{
          position: "absolute", left: 0, top: -off, width: W, height: H,
          transform: `scale(${z})`, transformOrigin: "55% 33%",
        }}
      >
        <Vid main style={glitch ? { transform: `translateX(${r("a") * 14}px)` } : undefined} />
        {glitch && (
          <>
            <Vid style={{ transform: `translateX(${22 + r("b") * 14}px)`, mixBlendMode: "screen", opacity: 0.55, filter: "sepia(1) saturate(6) hue-rotate(300deg)" }} />
            <Vid style={{ transform: `translateX(${-22 + r("c") * 14}px)`, mixBlendMode: "screen", opacity: 0.55, filter: "sepia(1) saturate(6) hue-rotate(150deg)" }} />
            {[0, 1, 2].map((i) => {
              const y = (random(`${g}-y${i}`) * 0.8 + 0.05) * H;
              const h = 40 + random(`${g}-h${i}`) * 120;
              return (
                <div key={i} style={{ position: "absolute", left: 0, top: y, width: W, height: h, overflow: "hidden" }}>
                  <Vid style={{ top: -y, transform: `translateX(${r(`s${i}`) * 70}px)` }} />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
