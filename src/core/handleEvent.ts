import { useStore } from "@/store";
import { GameEvent } from "@/types";
import { playAudio } from "@/utils/audio";
import sleep from "@/utils/sleep";

// the async/await here might be misleading for some, it functions as a
// setTimeout that fires multiple async calls without stopping the execution,
// which is what we want.
const handleEvent = (event: GameEvent) => {
  const applyMutation = useStore.getState().applyMutation;
  const { state, effects, audio, additionalEvents } = event;

  if (state) {
    state.forEach(async (mutationData) => {
      const { delay, mutation } = mutationData;
      if (delay) await sleep(delay);

      applyMutation(mutation);
    });
  }

  if (effects) {
    effects.forEach((effect) => effect());
  }

  if (audio) {
    audio.forEach(async (audio) => {
      const { delay, sfx } = audio;
      if (delay) await sleep(delay);
      sfx.forEach((soundEffect) => {
        playAudio(soundEffect);
      });
    });
  }

  if (additionalEvents) {
    additionalEvents.forEach(async (gameEvent) => {
      const { delay, event } = gameEvent;
      if (delay) await sleep(delay);
      handleEvent(event);
    });
  }
};

export default handleEvent;
