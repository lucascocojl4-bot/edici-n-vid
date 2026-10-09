import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type VideoProps = {
  titulo: string;
  subtitulo: string;
  colorFondo: string;
  // Nombre de un archivo dentro de /public (ej. "clip.mp4"). Vacío = sin clip.
  clip: string;
};

export const videoSchemaDefaults: VideoProps = {
  titulo: "Mi video",
  subtitulo: "Editado automáticamente con Remotion",
  colorFondo: "#0f172a",
  clip: "",
};

export const Video: React.FC<VideoProps> = ({
  titulo,
  subtitulo,
  colorFondo,
  clip,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const entrada = spring({ frame, fps, config: { damping: 200 } });
  const opacidadSub = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colorFondo }}>
      {clip ? <OffthreadVideo src={staticFile(clip)} /> : null}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif",
          color: "white",
          textAlign: "center",
          padding: 60,
        }}
      >
        <div
          style={{
            fontSize: width * 0.06,
            fontWeight: 800,
            transform: `scale(${entrada})`,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {titulo}
        </div>
        <div
          style={{
            fontSize: width * 0.025,
            marginTop: 24,
            opacity: opacidadSub,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          {subtitulo}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
