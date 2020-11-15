import { GameContext } from "./StateManagers/EventManager";

const handleMediaSceneEvent = (gameContext: GameContext) => {
  const keyPress = gameContext.keyPress;
  const activeMediaComponent = gameContext.activeMediaComponent;
  return { event: `${activeMediaComponent}_${keyPress}` };
};

export default handleMediaSceneEvent;
