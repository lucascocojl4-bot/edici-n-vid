import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import data from "../data/captions.json";
import { BLUE, BLUE_L, FONT, FPS, easeOut } from "./theme";
import { interpolate } from "remotion";

type Word = { text: string; start: number; end: number; seg: number };
const clean = (s: string) => s.toLowerCase().replace(/[.,;:¿?¡!]/g, "");

const KEY = new Set([
  "álvaro", "cuello", "ingreso", "ingresos", "estructura", "crece", "trabaja", "ahorro",
  "tres", "patrimonio", "largo", "corto", "plazo", "estabilidad", "calidad", "vida",
  "paralelo", "futuro", "dinero", "comenta", "clase", "crezca", "creciendo", "gastaba",
  "estancado", "sistema", "problema", "invertimos",
]);
const SMALL = new Set(["y", "a", "el", "la", "de", "en", "su", "un", "o", "no", "se", "si", "lo", "tu", "él", "es", "ni", "le", "va", "que", "una", "los", "con", "para", "al", "como"]);

type Group = { words: Word[]; start: number; end: number };

const buildGroups = (): Group[] => {
  const words = data.words as Word[];
  const groups: Group[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) groups.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  words.forEach((w, i) => {
    cur.push(w);
    const chars = cur.map((x) => x.text).join(" ").length;
    const next = words[i + 1];
    const punct = /[.,;]$/.test(w.text);
    const last = clean(w.text);
    const big = cur.length >= 3 || chars > 17;
    const hardEnd = !next || next.seg !== w.seg || next.start - w.end > 0.45;
    if (hardEnd || punct || (big && !SMALL.has(last)) || cur.length >= 4) flush();
  });
  flush();
  // Duración visible: hasta el siguiente grupo si está pegado
  groups.forEach((g, i) => {
    const n = groups[i + 1];
    g.start = Math.max(0, g.start - 0.03);
    const hold = g.end + 0.22;
    g.end = n && n.start - 0.03 < hold ? n.start - 0.03 : hold;
  });
  return groups;
};

const Key: React.FC<{ text: string; local: number }> = ({ text, local }) => (
  <span
    style={{
      display: "inline-block",
      textShadow: "none",
      background: `linear-gradient(105deg, #ffffff 0%, #ffffff 40%, #a9dcff 50%, #ffffff 60%, #ffffff 100%)`,
      backgroundSize: "300% 100%",
      backgroundPosition: `${interpolate(local, [0, 0.7], [100, 0], { extrapolateRight: "clamp" })}% 0`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      filter: `drop-shadow(0 0 9px rgba(47,155,255,0.8)) drop-shadow(0 0 22px rgba(47,155,255,0.5))`,
    }}
  >
    {text}
  </span>
);

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const groups = useMemo(buildGroups, []);
  const g = groups.find((x) => t >= x.start && t < x.end);
  if (!g) return null;
  const local = t - g.start;
  const inP = interpolate(local, [0, 0.14], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  return (
    <div
      style={{
        position: "absolute", left: 60, right: 60, top: 1250, height: 190,
        display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
        fontFamily: FONT, fontWeight: 800, fontSize: 84, letterSpacing: "-0.03em", lineHeight: 1.08,
        color: "#fff",
        textShadow: "0 3px 22px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.5)",
        opacity: inP, transform: `translateY(${(1 - inP) * 18}px) scale(${0.96 + 0.04 * inP})`,
      }}
    >
      <div>
        {g.words.map((w, i) => {
          const txt = w.text.replace(/[.,;]$/, "");
          return (
            <React.Fragment key={i}>
              {KEY.has(clean(w.text)) ? <Key text={txt} local={local} /> : txt}
              {i < g.words.length - 1 ? " " : ""}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
