import { useFrame } from "@react-three/fiber";
import { useStore } from "@/store";
import { playAudio } from "@/utils/audio";
import { playIdleMedia, playLainIdleAnim } from "@/core/events";
import { getRandomIdleLainAnim, getRandomIdle } from "@/utils/idle";
import handleEvent from "@/core/handleEvent";
import { useEffect } from "react";
import { GameScene, MainSubscene } from "@/types";

type IdleManagerProps = {
  lainIdleTimerRef: any;
  idleSceneTimerRef: any;
};

const IdleManager = (props: IdleManagerProps) => {
  const mainSubscene = useStore((state) => state.mainSubscene);
  const site = useStore((state) => state.site);
  const gameProgress = useStore((state) => state.gameProgress);
  const scene = useStore((state) => state.scene);

  useEffect(() => {
    if (scene !== GameScene.Main) {
      props.idleSceneTimerRef.current = -1;
    }
  }, [props.idleSceneTimerRef, scene]);

  useFrame(() => {
    const now = Date.now();
    if (
      props.lainIdleTimerRef.current !== -1 &&
      props.idleSceneTimerRef.current !== -1 &&
      scene === GameScene.Main &&
      mainSubscene === MainSubscene.Site
    ) {
      if (now > props.lainIdleTimerRef.current + 10000) {
        // after one idle animation plays, the second comes sooner than it would after a regular keypress
        props.lainIdleTimerRef.current = now - 2500;

        const [animation, duration] = getRandomIdleLainAnim();
        const event = playLainIdleAnim(animation, duration);
        if (event) handleEvent(event);
      }
      if (now > props.idleSceneTimerRef.current + 30000) {
        // put it on lock until the next action, since while the idle media plays, the
        // Date.now() value keeps increasing, which can result in another idle media playing right after one finishes
        // one way to work around this would be to modify the value depending on the last played idle media's duration
        // but i'm way too lazy for that
        props.idleSceneTimerRef.current = -1;

        playAudio("snd_32.mp4");

        const data = getRandomIdle(site, gameProgress);
        const event = playIdleMedia(data);

        handleEvent(event);
      }
    }
  });

  return null;
};

export default IdleManager;
