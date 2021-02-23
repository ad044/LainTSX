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
  updateAuthorizeUserLetterIdx,
  updatePlayerName,
} from "../eventTemplates";
import { BootSceneContext, GameEvent } from "../../types/types";

const handleBootSceneKeyPress = (
  bootSceneContext: BootSceneContext
): GameEvent | undefined => {
  const {
    keyPress,
    subscene,
    activeMainMenuComponent,
    activePromptComponent,
    promptVisible,
    authorizeUserLetterIdx,
    playerName,
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
            if (playerName.length > 0) {
              return startNewGame;
            }
            return;
          case "X":
            if (playerName.length > 0) {
              return removePlayerNameLastChar({
                playerName: playerName.slice(0, -1),
              });
            } else {
              return exitUserAuthorization;
            }
          case "LEFT":
            // if utmost left, break
            if (
              [0, 13, 26, 39, 52].includes(authorizeUserLetterIdx) ||
              authorizeUserLetterIdx === 15
            )
              return;
            // skip
            else if (
              authorizeUserLetterIdx === 41 ||
              authorizeUserLetterIdx === 17 ||
              authorizeUserLetterIdx === 30 ||
              authorizeUserLetterIdx === 43 ||
              authorizeUserLetterIdx === 19 ||
              authorizeUserLetterIdx === 45
            ) {
              return updateAuthorizeUserLetterIdx({
                authorizeUserLetterIdx: authorizeUserLetterIdx - 2,
              });
            } else {
              return updateAuthorizeUserLetterIdx({
                authorizeUserLetterIdx: authorizeUserLetterIdx - 1,
              });
            }
          case "RIGHT":
            // if utmost right, break
            if ([12, 25, 38, 51, 64].includes(authorizeUserLetterIdx)) return;
            // skip empty
            else if (
              authorizeUserLetterIdx === 39 ||
              authorizeUserLetterIdx === 41 ||
              authorizeUserLetterIdx === 28 ||
              authorizeUserLetterIdx === 15 ||
              authorizeUserLetterIdx === 43 ||
              authorizeUserLetterIdx === 17
            ) {
              return updateAuthorizeUserLetterIdx({
                authorizeUserLetterIdx: authorizeUserLetterIdx + 2,
              });
            } else {
              return updateAuthorizeUserLetterIdx({
                authorizeUserLetterIdx: authorizeUserLetterIdx + 1,
              });
            }
          case "DOWN":
            // if utmost down, break
            if (
              Array.from(new Array(13), (x, i) => i + 52).includes(
                authorizeUserLetterIdx
              )
            ) {
              return;
              // skip empty
            } else if (
              authorizeUserLetterIdx === 0 ||
              authorizeUserLetterIdx === 1 ||
              authorizeUserLetterIdx === 52 ||
              authorizeUserLetterIdx === 27 ||
              authorizeUserLetterIdx === 31 ||
              authorizeUserLetterIdx === 5
            ) {
              return updateAuthorizeUserLetterIdx({
                authorizeUserLetterIdx: authorizeUserLetterIdx + 26,
              });
            } else if (authorizeUserLetterIdx === 3) {
              return updateAuthorizeUserLetterIdx({
                authorizeUserLetterIdx: authorizeUserLetterIdx + 52,
              });
            } else {
              return updateAuthorizeUserLetterIdx({
                authorizeUserLetterIdx: authorizeUserLetterIdx + 13,
              });
            }
          case "UP":
            // if utmost up, break
            if (
              Array.from(new Array(13), (x, i) => i).includes(
                authorizeUserLetterIdx
              )
            ) {
              return;
              // skip empty
            } else if (
              authorizeUserLetterIdx === 26 ||
              authorizeUserLetterIdx === 27 ||
              authorizeUserLetterIdx === 53 ||
              authorizeUserLetterIdx === 31 ||
              authorizeUserLetterIdx === 57
            ) {
              return updateAuthorizeUserLetterIdx({
                authorizeUserLetterIdx: authorizeUserLetterIdx - 26,
              });
            } else if (authorizeUserLetterIdx === 55) {
              return updateAuthorizeUserLetterIdx({
                authorizeUserLetterIdx: authorizeUserLetterIdx - 52,
              });
            } else {
              return updateAuthorizeUserLetterIdx({
                authorizeUserLetterIdx: authorizeUserLetterIdx - 13,
              });
            }
          case "CIRCLE":
            const chosenCharacter =
              authorize_user_letters[
                authorizeUserLetterIdx.toString() as keyof typeof authorize_user_letters
              ];

            const newName = handleNameSelection(playerName, chosenCharacter);

            if (newName !== undefined)
              return updatePlayerName({ playerName: newName });
            else return failUpdatePlayerName;
        }
    }
  }
};

export default handleBootSceneKeyPress;
