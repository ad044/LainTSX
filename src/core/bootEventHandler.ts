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
      case "DOWN":
      case "UP":
      case "LEFT":
      case "RIGHT":
        return {
          event: `${currentSubscene}_${keyPress.toLowerCase()}`,
          subscene: currentSubscene,
        };
      case "X":
        return {
          event: `${currentSubscene}_back`,
          subscene: currentSubscene,
        };
      case "CIRCLE":
        return {
          event: `${activeBootElement}_select`,
          subscene: currentSubscene,
        };
    }
  }
};

export default handleBootEvent;
