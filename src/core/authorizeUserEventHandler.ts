const handleAuthorizeUserEvent = (gameContext: any) => {
  const keyPress = gameContext.keyPress;

  const bgLettersPos = gameContext.bgLettersPos;
  const activeLetterTexOffset = gameContext.activeLetterTexOffset;
  const matrixIdx = gameContext.matrixIdx;

  const currentSubscene = "authorize_user";

  switch (keyPress) {
    case "LEFT":
      const utmostLeftIndices = [0, 13, 26, 39, 52];
      if (utmostLeftIndices.includes(matrixIdx)) {
        break;
      } else {
        return {
          event: `${currentSubscene}_left`,
          newBgLettersPos: { x: bgLettersPos.x + 0.3, y: bgLettersPos.y },
          newActiveLetterTexOffset: {
            x: activeLetterTexOffset.x - 0.0775,
            y: activeLetterTexOffset.y,
          },
          newAuthorizeUserMatrixIdx: matrixIdx - 1,
        };
      }
    case "RIGHT":
      const utmostRightIndices = [12, 25, 38, 51, 64];
      if (utmostRightIndices.includes(matrixIdx)) {
        break;
      } else {
        return {
          event: `${currentSubscene}_right`,
          newBgLettersPos: { x: bgLettersPos.x - 0.3, y: bgLettersPos.y },
          newActiveLetterTexOffset: {
            x: activeLetterTexOffset.x + 0.0775,
            y: activeLetterTexOffset.y,
          },
          newAuthorizeUserMatrixIdx: matrixIdx + 1,
        };
      }
    case "DOWN":
      const utmostLowIndices = Array.from(new Array(13), (x, i) => i + 52);
      if (utmostLowIndices.includes(matrixIdx)) {
        break;
      } else {
        return {
          event: `${currentSubscene}_down`,
          newBgLettersPos: { x: bgLettersPos.x, y: bgLettersPos.y + 0.25 },
          newActiveLetterTexOffset: {
            x: activeLetterTexOffset.x,
            y: activeLetterTexOffset.y - 0.2,
          },
          newAuthorizeUserMatrixIdx: matrixIdx + 13,
        };
      }
    case "UP":
      const utmostHighIndices = Array.from(new Array(13), (x, i) => i);
      if (utmostHighIndices.includes(matrixIdx)) {
        break;
      } else {
        return {
          event: `${currentSubscene}_up`,
          newBgLettersPos: { x: bgLettersPos.x, y: bgLettersPos.y - 0.25 },
          newActiveLetterTexOffset: {
            x: activeLetterTexOffset.x,
            y: activeLetterTexOffset.y + 0.2,
          },
          newAuthorizeUserMatrixIdx: matrixIdx - 13,
        };
      }
    case "X": {
      return { event: "authorize_user_back" };
    }
  }
};

export default handleAuthorizeUserEvent;
