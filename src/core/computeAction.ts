import { GameContext } from "../components/StateManagers/EventManager";
import handleMainSceneEvent from "./mainSceneEventHandler";
import handleMediaSceneEvent from "./mediaSceneEventHandler";

const computeAction = (gameContext: GameContext) => {
  switch (gameContext.scene) {
    case "main":
      return handleMainSceneEvent(gameContext);
    case "media":
      return handleMediaSceneEvent(gameContext);
  }
};

export default computeAction;
