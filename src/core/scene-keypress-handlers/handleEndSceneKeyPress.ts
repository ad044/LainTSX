import { changeEndComponent, changeSite, endGame } from "../eventTemplates";
import { EndSceneContext, GameEvent } from "../../types/types";
import { getCurrentUserState } from "../../store";

const handleEndSceneKeyPress = (
  endSceneContext: EndSceneContext
): GameEvent | undefined => {
  const {
    keyPress,
    selectionVisible,
    activeEndComponent,
    siteSaveState,
    activeNode,
    activeLevel,
    siteRot,
  } = endSceneContext;

  if (selectionVisible) {
    switch (keyPress) {
      case "UP":
      case "DOWN":
        const newComponent = keyPress === "UP" ? "end" : "continue";
        return changeEndComponent({ activeEndComponent: newComponent });
      case "CIRCLE":
        switch (activeEndComponent) {
          case "end":
            return endGame({ userSaveState: getCurrentUserState() });
          case "continue":
            const siteToLoad = "a";
            const stateToLoad = siteSaveState[siteToLoad];

            const newSiteSaveState = {
              ...siteSaveState,
              b: {
                activeNode: activeNode,
                siteRot: [0, siteRot[1], 0],
                activeLevel: activeLevel.toString().padStart(2, "0"),
              },
            };
            return changeSite({
              newActiveSite: siteToLoad,
              newActiveNode: stateToLoad.activeNode,
              newSiteRot: stateToLoad.siteRot,
              newActiveLevel: stateToLoad.activeLevel,
              newSiteSaveState: newSiteSaveState,
            });
        }
    }
  }
};

export default handleEndSceneKeyPress;
