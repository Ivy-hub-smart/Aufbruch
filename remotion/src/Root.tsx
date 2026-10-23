import { Composition } from "remotion";
import { Aufruf1111 } from "./Aufruf1111";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Aufruf1111"
    component={Aufruf1111}
    durationInFrames={180} // 6 Sekunden bei 30 fps
    fps={30}
    width={1080}
    height={1920}
  />
);
