import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BLUE, BLUE_L, FONT, FPS, W, metalText, prog, win } from "./theme";

/* ---------- piezas base ---------- */

// Cartel metalizado: bisel de metal + cristal oscuro
export const Plate: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; radius?: number; glow?: number }> = ({
  children, style, radius = 44, glow = 0.3,
}) => (
  <div
    style={{
      padding: 2.5, borderRadius: radius,
      background: "linear-gradient(135deg,#ffffff 0%,#8794a6 28%,#eef2f8 52%,#5f6b7b 78%,#d9e0ea 100%)",
      boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 60px rgba(47,155,255,${glow})`,
      ...style,
    }}
  >
    <div
      style={{
        borderRadius: radius - 2.5,
        background: "linear-gradient(180deg, rgba(34,42,56,0.88), rgba(12,16,24,0.92))",
        backdropFilter: "blur(30px) saturate(150%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.38), inset 0 0 40px rgba(255,255,255,0.04)",
        position: "relative", overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

// Barrido de brillo sobre un cartel
export const Shine: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const k = interpolate(t, [at, at + 0.9], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
      background: `linear-gradient(105deg, transparent ${k - 18}%, rgba(255,255,255,0.28) ${k}%, transparent ${k + 18}%)` }} />
  );
};

export const Kicker: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, letterSpacing: "0.2em", textTransform: "uppercase", color: BLUE_L,
    textShadow: "0 0 18px rgba(47,155,255,0.7)", ...style }}>{children}</div>
);

export const Title: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 66, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: "-0.035em", lineHeight: 1.05, ...metalText,
    filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.5))", ...style }}>{children}</div>
);

export const Glow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{
    background: `linear-gradient(105deg, #d6edff, #fff 45%, #8fcbff)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
    filter: "drop-shadow(0 0 12px rgba(47,155,255,0.9)) drop-shadow(0 0 30px rgba(47,155,255,0.5))",
  }}>{children}</span>
);

/* ---------- iconos de línea ---------- */
const S: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 76 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={BLUE_L} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round"
    style={{ filter: "drop-shadow(0 0 10px rgba(47,155,255,0.9))" }}>{children}</svg>
);
export const IconUp = ({ size }: { size?: number }) => <S size={size}><path d="M10 46 L26 30 L36 38 L54 16" /><path d="M40 16 H54 V30" /></S>;
export const IconDown = ({ size }: { size?: number }) => <S size={size}><path d="M10 18 L26 34 L36 26 L54 48" /><path d="M40 48 H54 V34" /></S>;
export const IconFlat = ({ size }: { size?: number }) => <S size={size}><path d="M8 32 H56" /><path d="M46 22 L56 32 L46 42" /></S>;
export const IconNoSystem = ({ size }: { size?: number }) => <S size={size}><circle cx="32" cy="32" r="12" /><path d="M32 8 V16 M32 48 V56 M8 32 H16 M48 32 H56 M15 15 L21 21 M43 43 L49 49 M49 15 L43 21 M21 43 L15 49" /><path d="M12 52 L52 12" /></S>;
export const IconGrow = ({ size }: { size?: number }) => <S size={size}><path d="M8 54 H56" /><path d="M12 46 C22 44 26 34 34 30 C42 26 46 18 54 12" /><path d="M44 12 H54 V22" /></S>;
export const IconCar = ({ size }: { size?: number }) => <S size={size}><path d="M8 40 V32 L14 22 H42 L52 32 H58 V40 Z" /><circle cx="20" cy="42" r="5" /><circle cx="46" cy="42" r="5" /></S>;
export const IconHouse = ({ size }: { size?: number }) => <S size={size}><path d="M8 32 L32 10 L56 32" /><path d="M14 28 V54 H50 V28" /><path d="M27 54 V38 H37 V54" /></S>;
export const IconShield = ({ size }: { size?: number }) => <S size={size}><path d="M32 8 L52 16 V30 C52 42 43 51 32 56 C21 51 12 42 12 30 V16 Z" /><path d="M23 31 L30 38 L42 24" /></S>;
export const IconTrophy = ({ size }: { size?: number }) => <S size={size}><path d="M20 10 H44 V26 C44 34 38 40 32 40 C26 40 20 34 20 26 Z" /><path d="M20 16 H10 C10 26 14 30 20 30 M44 16 H54 C54 26 50 30 44 30" /><path d="M32 40 V50 M22 54 H42" /></S>;
export const IconBubble = ({ size }: { size?: number }) => <S size={size}><path d="M10 14 H54 V42 H30 L18 54 V42 H10 Z" /></S>;

/* ---------- carteles en modo vídeo completo (arriba, sobre la cabeza) ---------- */

const CartelWrap: React.FC<{ t: number; from: number; to: number; children: React.ReactNode; shineAt?: number }> = ({ t, from, to, children, shineAt }) => {
  const v = win(t, from, to, 0.45, 0.3);
  if (v <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 205, width: W, display: "flex", justifyContent: "center",
      opacity: v, transform: `translateY(${(1 - v) * -30}px) scale(${0.94 + 0.06 * v})`, filter: `blur(${(1 - v) * 8}px)` }}>
      <Plate>
        <div style={{ position: "relative" }}>{children}</div>
        <Shine t={t} at={shineAt ?? from + 0.15} />
      </Plate>
    </div>
  );
};

const Row: React.FC<{ icon?: React.ReactNode; kicker?: string; children: React.ReactNode }> = ({ icon, kicker, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "26px 44px" }}>
    {icon}
    <div>
      {kicker && <Kicker style={{ fontSize: 24, marginBottom: 6 }}>{kicker}</Kicker>}
      <Title size={64}>{children}</Title>
    </div>
  </div>
);

export const Cartels: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <>
      {/* ingreso → estructura */}
      <CartelWrap t={t} from={4.0} to={7.0}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "26px 46px" }}>
          <Title size={62}>Ingreso</Title>
          <svg width="150" height="40" viewBox="0 0 150 40" fill="none">
            <path d="M4 20 H138 M122 6 L138 20 L122 34" stroke={BLUE_L} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="190" strokeDashoffset={(1 - prog(t, 4.45, 0.7)) * 190} style={{ filter: "drop-shadow(0 0 10px rgba(47,155,255,0.9))" }} />
          </svg>
          <div style={{ opacity: prog(t, 5.0, 0.4) }}><Title size={62}><Glow>Estructura</Glow></Title></div>
        </div>
        <div style={{ textAlign: "center", paddingBottom: 24, marginTop: -8, opacity: prog(t, 5.5, 0.4) }}>
          <Kicker style={{ fontSize: 26 }}>trabaja y crece sola</Kicker>
        </div>
      </CartelWrap>

      {/* el problema */}
      <CartelWrap t={t} from={11.7} to={14.0}>
        <Row kicker="El problema" icon={<IconNoSystem />}>La dirección de sus ingresos</Row>
      </CartelWrap>

      {/* el dinero entraba → sin sistema → se gastaba → estancado */}
      <CartelWrap t={t} from={14.7} to={16.45}><Row kicker="Ingresos" icon={<IconUp />}>El dinero entraba</Row></CartelWrap>
      <CartelWrap t={t} from={16.5} to={19.0}><Row kicker="Pero" icon={<IconNoSystem />}>No había un sistema</Row></CartelWrap>
      <CartelWrap t={t} from={19.05} to={20.0}><Row icon={<IconDown />}>Se gastaba</Row></CartelWrap>
      <CartelWrap t={t} from={20.05} to={21.3}><Row icon={<IconFlat />}>Se mantenía estancado</Row></CartelWrap>

      {/* hoy */}
      <CartelWrap t={t} from={39.55} to={42.95}><Row kicker="Hoy" icon={<IconGrow />}>Estructura en <Glow>paralelo</Glow></Row></CartelWrap>
      <CartelWrap t={t} from={43.0} to={44.85}><Row icon={<IconGrow />}>Creciendo para su <Glow>futuro</Glow></Row></CartelWrap>

      {/* estructura clara */}
      <CartelWrap t={t} from={45.6} to={47.4}><Row kicker="Si no tenés" icon={<IconShield />}>Una estructura clara</Row></CartelWrap>
      <CartelWrap t={t} from={47.5} to={49.75}><Row icon={<IconUp />}>Tu dinero en <Glow>paralelo</Glow></Row></CartelWrap>
    </>
  );
};

/* ---------- panel superior (vídeo desplazado hacia abajo) ---------- */

const PanelWrap: React.FC<{ t: number; from: number; to: number; children: React.ReactNode }> = ({ t, from, to, children }) => {
  const v = win(t, from, to, 0.5, 0.25);
  if (v <= 0.001) return null;
  return <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 640, opacity: v, transform: `translateY(${(1 - v) * -24}px)` }}>{children}</div>;
};

const Tile: React.FC<{ t: number; at: number; n: string; icon: React.ReactNode; label: string; sub: React.ReactNode; hot?: number }> = ({ t, at, n, icon, label, sub, hot = 0 }) => {
  const v = prog(t, at, 0.55);
  return (
    <div style={{ width: 316, opacity: v, transform: `translateY(${(1 - v) * 40}px) scale(${0.9 + 0.1 * v})` }}>
      <Plate radius={40} glow={0.25 + hot * 0.5}>
        <div style={{ padding: "18px 22px 18px", height: 232, boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {icon}
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, ...{ color: BLUE_L }, textShadow: "0 0 20px rgba(47,155,255,0.9)" }}>{n}</div>
          </div>
          <Title size={42} style={{ marginTop: 8 }}>{label}</Title>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 27, color: "rgba(226,234,246,0.92)", marginTop: 4, lineHeight: 1.18 }}>{sub}</div>
        </div>
        <Shine t={t} at={at + 0.1} />
      </Plate>
    </div>
  );
};

const HookPanel: React.FC<{ t: number }> = ({ t }) => {
  const a = prog(t, 0.55, 0.6);
  return (
    <PanelWrap t={t} from={0.3} to={3.35}>
      <div style={{ position: "absolute", left: 70, top: 215, width: 330, height: 330, opacity: a, transform: `scale(${0.88 + 0.12 * a})` }}>
        <Plate radius={56} glow={0.55}>
          <Img src={staticFile("alvaro.jpg")} style={{ width: 325, height: 325, objectFit: "cover", objectPosition: "50% 18%", display: "block" }} />
          <Shine t={t} at={0.75} />
        </Plate>
      </div>
      <div style={{ position: "absolute", left: 435, top: 255, width: 600 }}>
        <div style={{ opacity: prog(t, 0.5, 0.4), transform: `translateX(${(1 - prog(t, 0.5, 0.5)) * 30}px)` }}>
          <Title size={104} style={{ lineHeight: 0.98 }}>Álvaro</Title>
        </div>
        <div style={{ opacity: prog(t, 1.0, 0.4), transform: `translateX(${(1 - prog(t, 1.0, 0.5)) * 30}px)` }}>
          <Title size={104} style={{ lineHeight: 0.98 }}><Glow>Cuello</Glow></Title>
        </div>
        <div style={{ opacity: prog(t, 1.45, 0.4), marginTop: 22 }}>
          <Kicker style={{ fontSize: 28, letterSpacing: "0.14em" }}>Futbolista profesional</Kicker>
        </div>
      </div>
    </PanelWrap>
  );
};

const PartsPanel: React.FC<{ t: number }> = ({ t }) => {
  const bar = prog(t, 22.6, 1.0);
  return (
    <PanelWrap t={t} from={21.4} to={39.2}>
      <div style={{ position: "absolute", left: 0, top: 185, width: W, textAlign: "center", opacity: prog(t, 21.75, 0.5) }}>
        <Kicker style={{ fontSize: 27 }}>Su ahorro mensual</Kicker>
        <Title size={64} style={{ marginTop: 4 }}>En <Glow>tres partes</Glow></Title>
      </div>
      {/* barra dividida en 3 */}
      <div style={{ position: "absolute", left: 66, top: 322, width: W - 132, height: 12, display: "flex", gap: 14, opacity: prog(t, 22.4, 0.4) }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, borderRadius: 8, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
            <div style={{ width: `${(i === 0 ? bar : i === 1 ? prog(t, 27.0, 0.8) : prog(t, 32.6, 0.8)) * 100}%`, height: "100%",
              background: `linear-gradient(90deg, ${BLUE}, ${BLUE_L})`, boxShadow: `0 0 18px ${BLUE}` }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 46, top: 362, width: W - 92, display: "flex", gap: 20 }}>
        <Tile t={t} at={24.1} n="1" icon={<IconGrow />} label="Patrimonio" hot={win(t, 25.5, 26.9, 0.2, 0.3)}
          sub="a largo plazo" />
        <Tile t={t} at={27.0} n="2" icon={<IconTrophy />} label="Objetivos" hot={win(t, 29.0, 32.4, 0.2, 0.3)}
          sub={prog(t, 29.9, 0.3) > 0 ? <span><Glow>auto</Glow> · <Glow>casa</Glow></span> : "a corto plazo"} />
        <Tile t={t} at={32.6} n="3" icon={<IconShield />} label="Estabilidad" hot={win(t, 34.2, 39.0, 0.3, 0.4)}
          sub={t > 38.0 ? <span>calidad de <Glow>vida</Glow></span> : "un piso si algo cambia"} />
      </div>
    </PanelWrap>
  );
};

const CtaPanel: React.FC<{ t: number }> = ({ t }) => {
  const b = prog(t, 50.75, 0.6);
  const pulse = 1 + 0.025 * Math.sin((t - 51.4) * 5) * (t > 51.4 ? 1 : 0);
  return (
    <PanelWrap t={t} from={49.8} to={99}>
      <div style={{ position: "absolute", left: 0, top: 210, width: W, textAlign: "center", opacity: prog(t, 50.0, 0.4) }}>
        <Kicker style={{ fontSize: 28 }}>Comenta acá abajo</Kicker>
      </div>
      <div style={{ position: "absolute", left: 0, top: 275, width: W, display: "flex", justifyContent: "center",
        opacity: b, transform: `scale(${(0.88 + 0.12 * b) * pulse})` }}>
        <Plate radius={70} glow={0.6}>
          <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "26px 56px" }}>
            <IconBubble size={84} />
            <Title size={118} style={{ letterSpacing: "-0.04em" }}><Glow>ÁLVARO</Glow></Title>
          </div>
          <Shine t={t} at={50.9} />
        </Plate>
      </div>
      <div style={{ position: "absolute", left: 0, top: 468, width: W, textAlign: "center", opacity: prog(t, 51.8, 0.5), transform: `translateY(${(1 - prog(t, 51.8, 0.5)) * 16}px)` }}>
        <Title size={50} style={{ lineHeight: 1.12 }}>y te mando una clase<br /><span style={{ fontWeight: 700, fontSize: 40, opacity: 0.9 }}>sobre cómo lo hicimos con él</span></Title>
      </div>
    </PanelWrap>
  );
};

export const Panels: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <>
      <HookPanel t={t} />
      <PartsPanel t={t} />
      <CtaPanel t={t} />
    </>
  );
};
