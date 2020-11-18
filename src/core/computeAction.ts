import { GameContext } from "./StateManagers/EventManager";
import handleMainSceneEvent from "./mainSceneEventHandler";
import handleMediaSceneEvent from "./mediaSceneEventHandler";
import handleBootMainMenuEvent from "./bootEventHandler";
import handleGateSceneEvent from "./gateSceneEventHandler";
import handleSSknSceneEvent from "./ssknSceneEventHandler";

const computeAction = (gameContext: GameContext) => {
  switch (gameContext.scene) {
    case "main":
      return handleMainSceneEvent(gameContext);
    case "media":
      return handleMediaSceneEvent(gameContext);
    case "boot":
      return handleBootMainMenuEvent(gameContext);
    case "gate":
      return handleGateSceneEvent();
    case "sskn":
      return handleSSknSceneEvent(gameContext);
  }
};

export default computeAction;
