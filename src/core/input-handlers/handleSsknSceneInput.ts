import { changeSsknComponent, exitSskn, upgradeSskn } from "../eventTemplates";
import { GameEvent, SsknSceneContext } from "../../types/types";

const handleSsknSceneInput = (
  ssknSceneContext: SsknSceneContext,
  keyPress: string
): GameEvent | undefined => {
  const { activeSsknComponent, activeNode } = ssknSceneContext;

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

export default handleSsknSceneInput;
