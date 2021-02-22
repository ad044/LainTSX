import {
  changeEndComponent,
  continueGameAfterEnd,
  endGame,
} from "../eventTemplates";
import {EndSceneContext, GameEvent} from "../../types/types";

const handleEndSceneKeyPress = (
  endSceneContext: EndSceneContext
): GameEvent | undefined => {
  const { keyPress, selectionVisible, activeEndComponent } = endSceneContext;

  if (selectionVisible) {
    switch (keyPress) {
      case "UP":
      case "DOWN":
        const newComponent = keyPress === "UP" ? "end" : "continue";
        return changeEndComponent({ activeEndComponent: newComponent });
      case "CIRCLE":
        switch (activeEndComponent) {
          case "end":
            return endGame;
          case "continue":
            return continueGameAfterEnd;
        }
    }
  }
};

export default handleEndSceneKeyPress;
