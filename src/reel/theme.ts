import type { CSSProperties } from "react";
import { Easing, interpolate } from "remotion";

export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const BLUE = "#2f9bff";
export const BLUE_L = "#9bd4ff";
export const FONT =
  'Inter, -apple-system, "SF Pro Display", "Helvetica Neue", system-ui, sans-serif';

// Acabado metalizado (texto)
export const metalText: CSSProperties = {
  background:
    "linear-gradient(180deg,#ffffff 0%,#d3dae4 42%,#f6f8fb 50%,#98a3b3 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);

// Progreso 0→1 de una animación que empieza en `at` (s) y dura `dur` (s)
export const prog = (t: number, at: number, dur = 0.5) =>
  interpolate(t, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

// Ventana visible [from,to] con entrada/salida suaves → 0..1
export const win = (t: number, from: number, to: number, i = 0.4, o = 0.3) =>
  Math.min(prog(t, from, i), 1 - prog(t, to - o, o));

// Ventanas (s) en las que el vídeo baja y se abre el panel de gráficos
export const PANELS: [number, number][] = [
  [0.3, 3.35],
  [21.4, 39.2],
  [49.8, 99],
];

// Momentos de glitch (coinciden con cortes del montaje)
export const GLITCHES = [21.4, 39.2, 49.8];

export const PANEL_TOP = 640; // y donde empieza el vídeo en modo panel
export const PANEL_OFF = 330; // recorte superior del vídeo en modo panel
