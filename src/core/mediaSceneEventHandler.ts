import { GameContext } from "../components/StateManagers/EventManager";

const handleMediaSceneEvent = (gameContext: GameContext) => {
  const keyPress = gameContext.keyPress;

  const activeMediaComponent = gameContext.activeMediaComponent;
  switch (keyPress) {
    case "right":
      return { event: `switch_to_right_side_from_${activeMediaComponent}` };
    case "left":
      return { event: `switch_to_left_side_from_${activeMediaComponent}` };
    default:
      return { event: `${activeMediaComponent}_${keyPress}`, newScene: "main" };
  }
};

export default handleMediaSceneEvent;
