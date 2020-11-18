import { GameContext } from "./StateManagers/EventManager";

const handleSSknSceneEvent = (gameContext: GameContext) => {
  const keyPress = gameContext.keyPress;
  const activeSSknComponent = gameContext.activeSSknComponent;
  return { event: `${activeSSknComponent}_${keyPress}` };
};

export default handleSSknSceneEvent;
