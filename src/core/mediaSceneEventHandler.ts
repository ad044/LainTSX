const handleMediaSceneEvent = (gameContext: any) => {
  const keyPress = gameContext.keyPress;
  const activeMediaComponent = gameContext.activeMediaComponent;
  let newWordPosStateIdx = gameContext.wordPosStateIdx;
  let newRightSideComponentIdx = gameContext.rightSideComponentIdx;

  const rightSideComponents = ["fstWord", "sndWord", "thirdWord"];
  if (rightSideComponents.includes(activeMediaComponent)) {
    switch (keyPress) {
      case "DOWN":
        newWordPosStateIdx++;
        if (newWordPosStateIdx > 6) {
          newWordPosStateIdx = 1;
        }
        newRightSideComponentIdx++;
        if (newRightSideComponentIdx > 2) {
          newRightSideComponentIdx = 0;
        }
        return {
          event: `${activeMediaComponent}_down`,
          newWordPosStateIdx: newWordPosStateIdx,
          newRightSideComponentIdx: newRightSideComponentIdx,
        };
      case "UP":
        newWordPosStateIdx--;
        if (newWordPosStateIdx < 1) {
          newWordPosStateIdx = 6;
        }
        newRightSideComponentIdx--;
        if (newRightSideComponentIdx < 0) {
          newRightSideComponentIdx = 2;
        }
        return {
          event: `${activeMediaComponent}_up`,
          newWordPosStateIdx: newWordPosStateIdx,
          newRightSideComponentIdx: newRightSideComponentIdx,
        };
      case "RIGHT":
      case "LEFT":
        return { event: `${activeMediaComponent}_${keyPress.toLowerCase()}` };
      case "CIRCLE":
        return { event: `${activeMediaComponent}_select` };
    }
  } else {
    switch (keyPress) {
      case "UP":
      case "DOWN":
      case "RIGHT":
      case "LEFT":
        return { event: `${activeMediaComponent}_${keyPress.toLowerCase()}` };
      case "CIRCLE":
        return { event: `${activeMediaComponent}_select` };
    }
  }
};

export default handleMediaSceneEvent;
