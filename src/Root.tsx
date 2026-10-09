import { Composition } from "remotion";
import { Video, videoSchemaDefaults } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Horizontal 16:9 (YouTube) */}
      <Composition
        id="Principal"
        component={Video}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={videoSchemaDefaults}
      />
      {/* Vertical 9:16 (Reels / TikTok / Shorts) */}
      <Composition
        id="Vertical"
        component={Video}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={videoSchemaDefaults}
      />
    </>
  );
};
