import { findNodeFromWord } from "../../helpers/media-helpers";
import {
  changeLeftMediaComponent,
  changeMediaSide,
  changeRightMediaComponent,
  exitMedia,
  playMedia,
  selectWord,
  wordNotFound,
} from "../eventTemplates";
import { isNodeVisible } from "../../helpers/node-helpers";
import {GameEvent, MediaSceneContext, RightMediaComponent} from "../../types/types";

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
              right: activeMediaComponent as RightMediaComponent,
            },
            currentMediaSide: "left",
          });

        case "CIRCLE":
          const wordIdx = (() => {
            switch (activeMediaComponent as RightMediaComponent) {
              case "fstWord":
                return 1;
              case "sndWord":
                return 2;
              case "thirdWord":
                return 3;
            }
          })();

          const nodeName = activeNode.node_name;
          const wordToFind = activeNode.words[wordIdx];

          const data = findNodeFromWord(wordToFind, nodeName, activeSite);

          const { node, level, siteRotY } = { ...data };

          if (!isNodeVisible(node, gameProgress)) return wordNotFound;

          return selectWord({
            activeNode: node,
            activeLevel: level,
            siteRot: [0, siteRotY, 0],
          });
      }
  }
};

export default handleMediaSceneKeyPress;
