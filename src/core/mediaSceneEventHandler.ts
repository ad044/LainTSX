const handleMediaSceneEvent = (gameContext: any) => {
  const keyPress = gameContext.keyPress;
  const activeMediaComponent = gameContext.activeMediaComponent;
  let newWordPosStateIdx = gameContext.wordPosStateIdx;
  let newRightSideComponentIdx = gameContext.rightSideComponentIdx;

  const rightSideComponents = ["fstWord", "sndWord", "thirdWord"];
  if (rightSideComponents.includes(activeMediaComponent)) {
    switch (keyPress) {
      case "down":
        newWordPosStateIdx++;
        if (newWordPosStateIdx > 6) {
          newWordPosStateIdx = 1;
        }
        newRightSideComponentIdx++;
        if (newRightSideComponentIdx > 2) {
          newRightSideComponentIdx = 0;
        }
        break;
      case "up":
        newWordPosStateIdx--;
        if (newWordPosStateIdx < 1) {
          newWordPosStateIdx = 6;
        }
        newRightSideComponentIdx--;
        if (newRightSideComponentIdx < 0) {
          newRightSideComponentIdx = 2;
        }
        break;
    }
  }
  return {
    event: `${activeMediaComponent}_${keyPress}`,
    newWordPosStateIdx: newWordPosStateIdx,
    newRightSideComponentIdx: newRightSideComponentIdx,
  };
};

export default handleMediaSceneEvent;
