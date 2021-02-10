import authorize_user_letters from "../../resources/authorize_user_letters.json";
import handleNameSelection from "../../utils/handleNameSelection";

const handleBootSceneKeyPress = (bootSceneContext: any) => {
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
        return { event: "prompt_left" };
      case "RIGHT":
        return { event: "prompt_right" };
      case "CIRCLE":
        switch (activePromptComponent) {
          case "no":
            return { event: "load_data_no" };
          case "yes":
            return {
              event: "load_data_yes",
            };
        }
    }
  } else {
    switch (subscene) {
      case "main_menu":
        switch (keyPress) {
          case "UP":
          case "DOWN":
            return { event: `main_menu_${keyPress.toLowerCase()}` };
          case "CIRCLE":
            return { event: `main_menu_${activeMainMenuComponent}_select` };
        }
        break;
      case "authorize_user":
        switch (keyPress) {
          case "START":
            if (playerName.length > 0) {
              return {
                event: "start_new_game",
              };
            }
            break;
          case "X":
            if (playerName.length > 0) {
              return {
                event: "remove_last_char",
                playerName: playerName.slice(0, -1),
              };
            } else {
              return { event: "authorize_user_back" };
            }
          case "LEFT":
            // if utmost left, break
            if (
              [0, 13, 26, 39, 52].includes(authorizeUserLetterIdx) ||
              authorizeUserLetterIdx === 15
            )
              break;
            // skip
            else if (
              authorizeUserLetterIdx === 41 ||
              authorizeUserLetterIdx === 17 ||
              authorizeUserLetterIdx === 30 ||
              authorizeUserLetterIdx === 43 ||
              authorizeUserLetterIdx === 19 ||
              authorizeUserLetterIdx === 45
            ) {
              return {
                event: "authorize_user_left",
                authorizeUserLetterIdx: authorizeUserLetterIdx - 2,
              };
            } else {
              return {
                event: "authorize_user_left",
                authorizeUserLetterIdx: authorizeUserLetterIdx - 1,
              };
            }
          case "RIGHT":
            // if utmost right, break
            if ([12, 25, 38, 51, 64].includes(authorizeUserLetterIdx)) break;
            // skip empty
            else if (
              authorizeUserLetterIdx === 39 ||
              authorizeUserLetterIdx === 41 ||
              authorizeUserLetterIdx === 28 ||
              authorizeUserLetterIdx === 15 ||
              authorizeUserLetterIdx === 43 ||
              authorizeUserLetterIdx === 17
            ) {
              return {
                event: "authorize_user_right",
                authorizeUserLetterIdx: authorizeUserLetterIdx + 2,
              };
            } else {
              return {
                event: "authorize_user_right",
                authorizeUserLetterIdx: authorizeUserLetterIdx + 1,
              };
            }
          case "DOWN":
            // if utmost down, break
            if (
              Array.from(new Array(13), (x, i) => i + 52).includes(
                authorizeUserLetterIdx
              )
            ) {
              break;
              // skip empty
            } else if (
              authorizeUserLetterIdx === 0 ||
              authorizeUserLetterIdx === 1 ||
              authorizeUserLetterIdx === 52 ||
              authorizeUserLetterIdx === 27 ||
              authorizeUserLetterIdx === 31 ||
              authorizeUserLetterIdx === 5
            ) {
              return {
                event: "authorize_user_down",
                authorizeUserLetterIdx: authorizeUserLetterIdx + 26,
              };
            } else if (authorizeUserLetterIdx === 3) {
              return {
                event: "authorize_user_down",
                authorizeUserLetterIdx: authorizeUserLetterIdx + 52,
              };
            } else {
              return {
                event: "authorize_user_down",
                authorizeUserLetterIdx: authorizeUserLetterIdx + 13,
              };
            }
          case "UP":
            // if utmost up, break
            if (
              Array.from(new Array(13), (x, i) => i).includes(
                authorizeUserLetterIdx
              )
            ) {
              break;
              // skip empty
            } else if (
              authorizeUserLetterIdx === 26 ||
              authorizeUserLetterIdx === 27 ||
              authorizeUserLetterIdx === 53 ||
              authorizeUserLetterIdx === 31 ||
              authorizeUserLetterIdx === 57
            ) {
              return {
                event: "authorize_user_up",
                authorizeUserLetterIdx: authorizeUserLetterIdx - 26,
              };
            } else if (authorizeUserLetterIdx === 55) {
              return {
                event: "authorize_user_up",
                authorizeUserLetterIdx: authorizeUserLetterIdx - 52,
              };
            } else {
              return {
                event: "authorize_user_up",
                authorizeUserLetterIdx: authorizeUserLetterIdx - 13,
              };
            }
          case "CIRCLE":
            const chosenCharacter =
              authorize_user_letters[
                authorizeUserLetterIdx.toString() as keyof typeof authorize_user_letters
              ];

            const newName = handleNameSelection(playerName, chosenCharacter);

            if (newName !== undefined)
              return { event: "update_player_name", playerName: newName };
            else return { event: "update_player_name_denied" };
        }
        break;
    }
  }
};

export default handleBootSceneKeyPress;
