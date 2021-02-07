import { findNodeFromWord } from "../../utils/media-utils";

const handleMediaKeyPress = (mediaSceneContext: any) => {
  const {
    keyPress,
    activeMediaComponent,
    wordPosStateIdx,
    rightSideComponentIdx,
    activeNode,
    activeSite,
    gameProgress,
  } = mediaSceneContext;

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
      wordPosStateIdx: wordPosStateIdx,
      rightSideComponentIdx: rightSideComponentIdx,
    };
  };

  switch (keyPress) {
    case "UP":
    case "DOWN":
    case "RIGHT":
    case "LEFT":
      if (["fstWord", "sndWord", "thirdWord"].includes(activeMediaComponent)) {
        const rightSide = calculateNewRightSide(
          keyPress,
          wordPosStateIdx,
          rightSideComponentIdx
        );
        return {
          event: `media_rightside_${keyPress.toLowerCase()}`,
          rightSideComponentIdx: rightSide.rightSideComponentIdx,
          wordPosStateIdx: rightSide.wordPosStateIdx,
        };
      } else {
        const leftSideComponentIdx = keyPress === "UP" ? 0 : 1;
        return {
          event: `media_leftside_${keyPress.toLowerCase()}`,
          leftSideComponentIdx: leftSideComponentIdx,
        };
      }
    case "CIRCLE":
      switch (activeMediaComponent) {
        case "fstWord":
        case "sndWord":
        case "thirdWord":
          const data = findNodeFromWord(
            activeMediaComponent,
            activeNode,
            activeSite,
            gameProgress
          );

          if (data) {
            return { event: `media_${activeMediaComponent}_select`, ...data };
          } else {
            return { event: `word_node_not_found` };
          }
        default:
          if (activeMediaComponent === "play") {
            return {
              event: `media_play_select`,
              node: activeNode,
            };
          } else {
            return {
              event: `media_exit_select`,
            };
          }
      }
  }
};

export default handleMediaKeyPress;
