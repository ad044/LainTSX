import { SsknSceneContext } from "../../store";
import { changeSsknComponent, exitSskn, upgradeSskn } from "../eventTemplates";
import { GameEvent } from "../handleEvent";

const handleSsknSceneKeyPress = (
  ssknSceneContext: SsknSceneContext
): GameEvent | undefined => {
  const {
    keyPress,
    activeSsknComponent,
    activeNode,
    gameProgress,
    ssknLvl,
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
          const newGameProgress = {
            ...gameProgress,
            [activeNode.node_name]: {
              is_viewed: 1,
              is_visible: 0,
            },
          };
          const newSsknLvl = ssknLvl + 1;

          return upgradeSskn({
            gameProgress: newGameProgress,
            ssknLvl: newSsknLvl,
          });
        case "cancel":
          return exitSskn;
      }
  }
};

export default handleSsknSceneKeyPress;
