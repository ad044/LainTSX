const handleMediaSceneEvent = (gameContext: any) => {
  const keyPress = gameContext.keyPress;
  const activeMediaComponent = gameContext.activeMediaComponent;

  const wordPosStateIdx = gameContext.wordPosStateIdx;
  const rightSideComponentIdx = gameContext.rightSideComponentIdx;

  const rightSideComponents = ["fstWord", "sndWord", "thirdWord"];

  const calculateNewRightSide = (
    direction: string,
    wordPosStateIdx: number,
    rightSideComponentIdx: number
  ) => {
    if (direction === "UP") {
      wordPosStateIdx--;
      if (wordPosStateIdx < 1) {
        wordPosStateIdx = 6;
      }
      rightSideComponentIdx--;
      if (rightSideComponentIdx < 0) {
        rightSideComponentIdx = 2;
      }
    } else if (direction === "DOWN") {
      wordPosStateIdx++;
      if (wordPosStateIdx > 6) {
        wordPosStateIdx = 1;
      }
      rightSideComponentIdx++;
      if (rightSideComponentIdx > 2) {
        rightSideComponentIdx = 0;
      }
    }

    return {
      newWordPosStateIdx: wordPosStateIdx,
      newRightSideComponentIdx: rightSideComponentIdx,
    };
  };

  switch (keyPress) {
    case "UP":
    case "DOWN":
    case "RIGHT":
    case "LEFT":
      if (rightSideComponents.includes(activeMediaComponent)) {
        const newRightSide = calculateNewRightSide(
          keyPress,
          wordPosStateIdx,
          rightSideComponentIdx
        );
        return {
          event: `media_rightside_${keyPress.toLowerCase()}`,
          newRightSideComponentIdx: newRightSide.newRightSideComponentIdx,
          newWordPosStateIdx: newRightSide.newWordPosStateIdx,
        };
      } else {
        const newLeftSideComponentIdx = keyPress === "UP" ? 0 : 1;
        return {
          event: `media_leftside_${keyPress.toLowerCase()}`,
          newLeftSideComponentIdx: newLeftSideComponentIdx,
        };
      }
    case "CIRCLE":
      return { event: `media_${activeMediaComponent}_select` };
  }
};

export default handleMediaSceneEvent;
