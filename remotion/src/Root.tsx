import { Composition, Still } from "remotion";
import { Aufruf1111 } from "./Aufruf1111";
import { GemeinsamWachsen } from "./GemeinsamWachsen";
import { TanzVideo } from "./TanzVideo";
import { ZweifelTraum } from "./ZweifelTraum";
import { Zwilling } from "./Zwilling";
import { KiTippVideo, kiTippSchema } from "./KiTippVideo";
import { KI_TIPPS, SERIE } from "./kiTipps";
import { AUTO_FAHRT, FERTIG_MACHEN, FERTIG_MACHEN_DU, AutoFahrt, autoFahrtDauer, autoFahrtSchema } from "./AutoFahrt";
import { GEDANKEN, Gedanke, gedankeDauer, gedankeSchema } from "./Gedanke";
import { PDF_STORIES, VORSTELLUNG, Vorstellung, vorstellungSchema } from "./Vorstellung";
import { HOOK_PROMPT, Sprechvideo, sprechvideoSchema } from "./Sprechvideo";
import { STORIES, Story, storySchema } from "./Story";
import { Hoppelhase } from "./Hoppelhase";
import { Hoppelhase3D } from "./Hoppelhase3D";
import { FOLGE_MIR, FolgeMir, folgeMirDauer, folgeMirSchema } from "./FolgeMir";

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
  <Composition
    id="Zwilling"
    component={Zwilling}
    durationInFrames={180} // 6 Sekunden bei 30 fps
    fps={30}
    width={1080}
    height={1920}
  />
  {KI_TIPPS.map((tipp, i) => (
    <Composition
      key={tipp.id}
      id={tipp.id}
      component={KiTippVideo}
      schema={kiTippSchema}
      durationInFrames={tipp.voice ? Math.round(tipp.voice.cuts[6] * 30) : 360} // 12 s, mit Stimme so lang wie sie
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ nr: i + 1, label: tipp.label ?? `Tipp ${i + 1}/${SERIE}`, hook: tipp.hook, small: tipp.small, big: tipp.big, steps: tipp.steps, fazit: tipp.fazit, cta: tipp.cta }}
    />
  ))}
  <Composition
    id="FolgeMir"
    component={FolgeMir}
    schema={folgeMirSchema}
    durationInFrames={folgeMirDauer(FOLGE_MIR)} // 12 Sekunden bei 30 fps
    fps={30}
    width={1080}
    height={1920}
    defaultProps={FOLGE_MIR}
  />
  <Composition
    id="AutoFahrt"
    component={AutoFahrt}
    schema={autoFahrtSchema}
    durationInFrames={autoFahrtDauer(AUTO_FAHRT)} // 10 Sekunden
    fps={30}
    width={1080}
    height={1920}
    defaultProps={AUTO_FAHRT}
  />
  <Composition
    id="FertigMachen"
    component={AutoFahrt}
    schema={autoFahrtSchema}
    durationInFrames={autoFahrtDauer(FERTIG_MACHEN)} // knapp 8 Sekunden
    fps={30}
    width={1080}
    height={1920}
    defaultProps={FERTIG_MACHEN}
  />
  <Composition
    id="FertigMachenDu"
    component={AutoFahrt}
    schema={autoFahrtSchema}
    durationInFrames={autoFahrtDauer(FERTIG_MACHEN_DU)} // 10 Sekunden
    fps={30}
    width={1080}
    height={1920}
    defaultProps={FERTIG_MACHEN_DU}
  />
  {STORIES.map((story, i) => (
    <Still key={i} id={`Story${i + 1}`} component={Story} schema={storySchema} width={1080} height={1920} defaultProps={story} />
  ))}
  {GEDANKEN.map((g, i) => (
    <Composition
      key={`g${i}`}
      id={`Gedanke${i + 1}`}
      component={Gedanke}
      schema={gedankeSchema}
      durationInFrames={gedankeDauer(g)}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={g}
    />
  ))}
  {VORSTELLUNG.map((folie, i) => (
    <Still key={`v${i}`} id={`Vorstellung${i + 1}`} component={Vorstellung} schema={vorstellungSchema} width={1080} height={1350} defaultProps={folie} />
  ))}
  {PDF_STORIES.map((folie, i) => (
    <Still key={`p${i}`} id={`PdfStory${i + 1}`} component={Vorstellung} schema={vorstellungSchema} width={1080} height={1920} defaultProps={folie} />
  ))}
  <Composition
    id="HookPrompt"
    component={Sprechvideo}
    schema={sprechvideoSchema}
    durationInFrames={Math.round(HOOK_PROMPT.dauer * 30)}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={HOOK_PROMPT}
  />
  <Composition
    id="Hoppelhase"
    component={Hoppelhase}
    durationInFrames={240} // 8 Sekunden bei 30 fps
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="Hoppelhase3D"
    component={Hoppelhase3D}
    durationInFrames={300} // 10 Sekunden bei 30 fps
    fps={30}
    width={1080}
    height={1920}
  />
  </>
);
