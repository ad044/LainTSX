import { changeSsknComponent, exitSskn, upgradeSskn } from "../eventTemplates";
import { GameEvent, SsknSceneContext } from "../../types/types";

const handleSsknSceneKeyPress = (
  ssknSceneContext: SsknSceneContext
): GameEvent | undefined => {
  const {
    keyPress,
    activeSsknComponent,
    activeNode,
    gameProgress,
  } = ssknSceneContext;

  switch (keyPress) {
    case "UP":
    case "DOWN":
      const direction = keyPress.toLowerCase();
      const newComponent = direction === "up" ? "ok" : "cancel";
      return changeSsknComponent({ activeSsknComponent: newComponent });
    case "CIRCLE":
      switch (activeSsknComponent) {
        case "ok":
          return upgradeSskn({ activeNode: activeNode });
        case "cancel":
          return exitSskn;
      }
  }
};

export default handleSsknSceneKeyPress;
