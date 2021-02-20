import { findNodeFromWord } from "../../helpers/media-helpers";
import { MediaSceneContext } from "../../store";
import {
  changeLeftMediaComponent,
  changeMediaSide,
  changeRightMediaComponent,
  exitMedia,
  playMedia,
  selectWord,
  wordNotFound,
} from "../eventTemplates";
import { GameEvent } from "../handleEvent";

const handleMediaSceneKeyPress = (
  mediaSceneContext: MediaSceneContext
): GameEvent | undefined => {
  const {
    keyPress,
    activeMediaComponent,
    wordPosStateIdx,
    activeNode,
    activeSite,
    gameProgress,
    currentMediaSide,
    lastActiveMediaComponents,
  } = mediaSceneContext;

  switch (currentMediaSide) {
    case "left":
      switch (keyPress) {
        case "UP":
        case "DOWN": {
          const newComponent = keyPress === "UP" ? "play" : "exit";

          return changeLeftMediaComponent({ activeComponent: newComponent });
        }
        case "RIGHT": {
          return changeMediaSide({
            activeMediaComponent: lastActiveMediaComponents.right,
            lastActiveMediaComponents: {
              ...lastActiveMediaComponents,
              left: activeMediaComponent as "play" | "exit",
            },
            currentMediaSide: "right",
          });
        }
        case "CIRCLE":
          switch (activeMediaComponent) {
            case "play":
              return playMedia;
            case "exit":
              return exitMedia;
          }
      }
      break;
    case "right":
      switch (keyPress) {
        case "UP": {
          const newWordPosStateIdx =
            wordPosStateIdx - 1 < 1 ? 6 : wordPosStateIdx - 1;
          const newComponent = (() => {
            switch (activeMediaComponent) {
              default:
              case "fstWord":
                return "thirdWord";
              case "sndWord":
                return "fstWord";
              case "thirdWord":
                return "sndWord";
            }
          })();
          return changeRightMediaComponent({
            activeComponent: newComponent,
            wordPosStateIdx: newWordPosStateIdx,
          });
        }
        case "DOWN": {
          const newWordPosStateIdx =
            wordPosStateIdx + 1 > 6 ? 1 : wordPosStateIdx + 1;
          const newComponent = (() => {
            switch (activeMediaComponent) {
              default:
              case "fstWord":
                return "sndWord";
              case "sndWord":
                return "thirdWord";
              case "thirdWord":
                return "fstWord";
            }
          })();

          return changeRightMediaComponent({
            activeComponent: newComponent,
            wordPosStateIdx: newWordPosStateIdx,
          });
        }

        case "LEFT":
          return changeMediaSide({
            activeMediaComponent: lastActiveMediaComponents.left,
            lastActiveMediaComponents: {
              ...lastActiveMediaComponents,
              right: activeMediaComponent as
                | "fstWord"
                | "sndWord"
                | "thirdWord",
            },
            currentMediaSide: "left",
          });

        case "CIRCLE":
          const data = findNodeFromWord(
            activeMediaComponent,
            activeNode,
            activeSite,
            gameProgress
          );

          if (data) {
            const { node, level, siteRotY } = { ...data };
            return selectWord({
              activeNode: node,
              activeLevel: level,
              siteRot: [0, siteRotY, 0],
            });
          } else {
            return wordNotFound;
          }
      }
  }
};

export default handleMediaSceneKeyPress;
