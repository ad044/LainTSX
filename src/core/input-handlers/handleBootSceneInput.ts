import authorize_user_letters from "../../resources/authorize_user_letters.json";
import handleNameSelection from "../../helpers/name-selection-helpers";
import {
  changeMainMenuComponent,
  changePromptComponent,
  enterLoadData,
  enterUserAuthorization,
  exitLoadData,
  exitUserAuthorization,
  failUpdatePlayerName,
  loadGame,
  loadGameFail,
  removePlayerNameLastChar,
  startNewGame,
  updateAuthorizeUserLetterMatrixIndices,
  updatePlayerName,
} from "../eventTemplates";
import { BootSceneContext, GameEvent } from "../../types/types";

const handleBootSceneInput = (
  bootSceneContext: BootSceneContext,
  keyPress: string
): GameEvent | undefined => {
  const {
    subscene,
    activeMainMenuComponent,
    activePromptComponent,
    promptVisible,
    playerName,
    authorizeUserMatrixIndices,
  } = bootSceneContext;

  if (promptVisible) {
    switch (keyPress) {
      case "LEFT":
        return changePromptComponent({ activePromptComponent: "yes" });
      case "RIGHT":
        return changePromptComponent({ activePromptComponent: "no" });
      case "CIRCLE":
        switch (activePromptComponent) {
          case "no":
            return exitLoadData;
          case "yes":
            const stateToLoad = localStorage.getItem("lainSaveState");

            if (stateToLoad)
              return loadGame({
                userSaveState: JSON.parse(stateToLoad),
              });
            else return loadGameFail;
        }
    }
  } else {
    switch (subscene) {
      case "main_menu":
        switch (keyPress) {
          case "UP":
          case "DOWN":
            const newComponent =
              keyPress === "UP" ? "authorize_user" : "load_data";
            return changeMainMenuComponent({
              activeMainMenuComponent: newComponent,
            });
          case "CIRCLE":
            switch (activeMainMenuComponent) {
              case "authorize_user":
                return enterUserAuthorization;
              case "load_data":
                return enterLoadData;
            }
        }
        break;
      case "authorize_user":
        switch (keyPress) {
          case "START":
            if (playerName.length > 0) return startNewGame;
            return;
          case "CROSS":
            if (playerName.length > 0) {
              return removePlayerNameLastChar({
                playerName: playerName.slice(0, -1),
              });
            } else {
              return exitUserAuthorization;
            }
          case "LEFT": {
            const newMatrixIndices = {
              ...authorizeUserMatrixIndices,
              colIdx:
                authorizeUserMatrixIndices.colIdx - 1 < 0
                  ? authorizeUserMatrixIndices.colIdx
                  : authorizeUserMatrixIndices.colIdx - 1,
            };

            return updateAuthorizeUserLetterMatrixIndices({
              authorizeUserLetterMatrixIndices: newMatrixIndices,
            });
          }

          case "RIGHT": {
            const newMatrixIndices = {
              ...authorizeUserMatrixIndices,
              colIdx:
                authorizeUserMatrixIndices.colIdx + 1 > 12
                  ? authorizeUserMatrixIndices.colIdx
                  : authorizeUserMatrixIndices.colIdx + 1,
            };

            return updateAuthorizeUserLetterMatrixIndices({
              authorizeUserLetterMatrixIndices: newMatrixIndices,
            });
          }

          case "DOWN": {
            const newMatrixIndices = {
              ...authorizeUserMatrixIndices,
              rowIdx:
                authorizeUserMatrixIndices.rowIdx + 1 > 4
                  ? authorizeUserMatrixIndices.rowIdx
                  : authorizeUserMatrixIndices.rowIdx + 1,
            };

            return updateAuthorizeUserLetterMatrixIndices({
              authorizeUserLetterMatrixIndices: newMatrixIndices,
            });
          }

          case "UP": {
            const newMatrixIndices = {
              ...authorizeUserMatrixIndices,
              rowIdx:
                authorizeUserMatrixIndices.rowIdx - 1 < 0
                  ? authorizeUserMatrixIndices.rowIdx
                  : authorizeUserMatrixIndices.rowIdx - 1,
            };

            return updateAuthorizeUserLetterMatrixIndices({
              authorizeUserLetterMatrixIndices: newMatrixIndices,
            });
          }

          case "CIRCLE":
            const chosenCharacter =
              authorize_user_letters.matrix[authorizeUserMatrixIndices.rowIdx][
                authorizeUserMatrixIndices.colIdx
              ];

            if (chosenCharacter) {
              const newName = handleNameSelection(playerName, chosenCharacter);

              if (newName?.length === 8) return;
              if (newName !== undefined)
                return updatePlayerName({ playerName: newName });
              else return failUpdatePlayerName;
            }
        }
    }
  }
};

export default handleBootSceneInput;
