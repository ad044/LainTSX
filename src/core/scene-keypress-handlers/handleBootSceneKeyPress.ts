const handleBootSceneKeyPress = (bootSceneContext: any) => {
  const {
    keyPress,
    subscene,
    activeMainMenuComponent,
    activePromptComponent,
    promptVisible,
    authorizeUserLetterIdx,
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
          case "X":
            return { event: "authorize_user_back" };
          case "LEFT":
            // if utmost left, break
            if ([0, 13, 26, 39, 52].includes(authorizeUserLetterIdx)) break;
            else {
              return {
                event: "authorize_user_left",
                authorizeUserLetterIdx: authorizeUserLetterIdx - 1,
              };
            }
          case "RIGHT":
            // if utmost right, break
            if ([12, 25, 38, 51, 64].includes(authorizeUserLetterIdx)) break;
            else {
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
            )
              break;
            else {
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
            )
              break;
            else {
              return {
                event: "authorize_user_up",
                authorizeUserLetterIdx: authorizeUserLetterIdx - 13,
              };
            }
        }
    }
  }
};

export default handleBootSceneKeyPress;
