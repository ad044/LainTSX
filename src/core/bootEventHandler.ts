import handleAuthorizeUserEvent from "./authorizeUserEventHandler";

const handleBootEvent = (gameContext: any) => {
  const keyPress = gameContext.keyPress;

  const activeBootElement = gameContext.activeBootElement;
  const currentSubscene = gameContext.bootSubscene;
  const authorizeUserBgLettersPos = gameContext.authorizeUserBgLettersPos;
  const authorizeUserActiveLetterTexOffset =
    gameContext.authorizeUserActiveLetterTexOffset;
  const authorizeUserMatrixIdx = gameContext.authorizeUserMatrixIdx;

  if (currentSubscene === "authorize_user") {
    return handleAuthorizeUserEvent({
      keyPress: keyPress,
      bgLettersPos: authorizeUserBgLettersPos,
      activeLetterTexOffset: authorizeUserActiveLetterTexOffset,
      matrixIdx: authorizeUserMatrixIdx,
    });
  } else {
    switch (keyPress) {
      case "down":
      case "up":
      case "left":
      case "right":
      case "back":
        return {
          event: `${currentSubscene}_${keyPress}`,
          subscene: currentSubscene,
        };
      case "select":
        return {
          event: `${activeBootElement}_${keyPress}`,
          subscene: currentSubscene,
        };
    }
  }
};

export default handleBootEvent;
