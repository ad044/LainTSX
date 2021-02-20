import { playAudio, useStore } from "../store";
import sleep from "../utils/sleep";

type Mutation = {
  mutation: Object;
  delay?: number;
};

type EventAudio = {
  sfx: HTMLAudioElement[];
  delay?: number;
};

export type GameEvent = {
  state?: Mutation[];
  audio?: EventAudio[];
  effects?: (() => void)[];
};

// the async/await here might be misleading for some, it functions as a setTimeout that fires
// multiple async calls without stopping the execution, which is what we want.
const handleEvent = (event: GameEvent) => {
  const setState = useStore.setState;

  const { state, effects, audio } = event;

  if (state)
    state.forEach(async (mutationData) => {
      const { delay, mutation } = mutationData;
      if (delay) await sleep(delay);
      setState(mutation);
    });

  if (effects) effects.forEach((effect) => effect());

  if (audio)
    audio.forEach(async (audio) => {
      const { delay, sfx } = audio;
      if (delay) await sleep(delay);
      sfx.forEach((soundEffect) => playAudio(soundEffect));
    });
};

export default handleEvent;
