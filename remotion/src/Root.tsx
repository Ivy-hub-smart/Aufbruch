import { Composition } from "remotion";
import { Aufruf1111 } from "./Aufruf1111";
import { GemeinsamWachsen } from "./GemeinsamWachsen";
import { TanzVideo } from "./TanzVideo";
import { ZweifelTraum } from "./ZweifelTraum";

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="Aufruf1111"
    component={Aufruf1111}
    durationInFrames={180} // 6 Sekunden bei 30 fps
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="GemeinsamWachsen"
    component={GemeinsamWachsen}
    durationInFrames={180} // 6 Sekunden bei 30 fps
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="TanzVideo"
    component={TanzVideo}
    durationInFrames={180} // 6 Sekunden bei 30 fps
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="ZweifelTraum"
    component={ZweifelTraum}
    durationInFrames={180} // 6 Sekunden bei 30 fps
    fps={30}
    width={1080}
    height={1920}
  />
  </>
);
