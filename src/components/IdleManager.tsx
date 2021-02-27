import { useFrame } from "react-three-fiber";
import { playAudio, useStore } from "../store";
import * as audio from "../static/audio/sfx";
import {
  playIdleAudio,
  playIdleVideo,
  playLainIdleAnim,
} from "../core/eventTemplates";
import {
  getRandomIdleLainAnim,
  getRandomIdleMedia,
} from "../helpers/idle-helpers";
import handleEvent from "../core/handleEvent";

type IdleManagerProps = {
  lainIdleTimerRef: any;
  idleSceneTimerRef: any;
};

const IdleManager = (props: IdleManagerProps) => {
  const mainSubscene = useStore((state) => state.mainSubscene);
  const scene = useStore((state) => state.currentScene);

  useFrame(() => {
    const now = Date.now();
    if (
      props.lainIdleTimerRef.current !== -1 &&
      props.idleSceneTimerRef.current !== -1 &&
      mainSubscene !== "pause" &&
      mainSubscene !== "level_selection" &&
      scene === "main"
    ) {
      if (now > props.lainIdleTimerRef.current + 10000) {
        // after one idle animation plays, the second comes sooner than it would after a regular keypress
        props.lainIdleTimerRef.current = now - 2500;

        const [idleLainAnim, duration] = getRandomIdleLainAnim();

        const event = playLainIdleAnim({
          lainMoveState: idleLainAnim,
          duration: duration,
        });

        if (event) handleEvent(event);
      }
      if (now > props.idleSceneTimerRef.current + 500000) {
        // put it on lock until the next action, since while the idle media plays, the
        // Date.now() value keeps increasing, which can result in another idle media playing right after one finishes
        // one way to work around this would be to modify the value depending on the last played idle media's duration
        // but i'm way too lazy for that
        props.idleSceneTimerRef.current = -1;

        playAudio(audio.sound32);

        const data = getRandomIdleMedia();

        const { type, nodeName, images, media } = data;
        let event;
        if (type === "audio" && images && nodeName) {
          event = playIdleAudio({
            idleNodeName: nodeName,
            idleImages: images,
            idleMedia: media,
          });
        } else if (type === "video") {
          event = playIdleVideo({ idleMedia: media });
        }

        if (event) handleEvent(event);
      }
    }
  });

  return null;
};

export default IdleManager;
