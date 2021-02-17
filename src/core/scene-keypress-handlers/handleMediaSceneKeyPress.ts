import { findNodeFromWord } from "../../utils/media-utils";
import { MediaSceneContext } from "../../store";

const handleMediaSceneKeyPress = (mediaSceneContext: MediaSceneContext) => {
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
        case "DOWN":
          return {
            event: `media_leftside_${keyPress.toLowerCase()}`,
          };
        case "RIGHT":
          return {
            event: "media_leftside_right",
            lastActiveComponent: activeMediaComponent,
            newActiveComponent: lastActiveMediaComponents.right,
          };
        case "CIRCLE":
          switch (activeMediaComponent) {
            case "play":
              return {
                event: "media_play_select",
                node: activeNode,
              };
            case "exit":
              return {
                event: "media_play_select",
              };
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
              case "fstWord":
                return "thirdWord";
              case "sndWord":
                return "fstWord";
              case "thirdWord":
                return "sndWord";
            }
          })();
          return {
            event: "media_rightside_up",
            newActiveComponent: newComponent,
            wordPosStateIdx: newWordPosStateIdx,
          };
        }
        case "DOWN": {
          const newWordPosStateIdx =
            wordPosStateIdx + 1 > 6 ? 1 : wordPosStateIdx + 1;
          const newComponent = (() => {
            switch (activeMediaComponent) {
              case "fstWord":
                return "sndWord";
              case "sndWord":
                return "thirdWord";
              case "thirdWord":
                return "fstWord";
            }
          })();

          return {
            event: "media_rightside_down",
            newActiveComponent: newComponent,
            wordPosStateIdx: newWordPosStateIdx,
          };
        }

        case "LEFT":
          return {
            event: "media_rightside_left",
            lastActiveComponent: activeMediaComponent,
            newActiveComponent: lastActiveMediaComponents.left,
          };

        case "CIRCLE":
          const data = findNodeFromWord(
            activeMediaComponent,
            activeNode,
            activeSite,
            gameProgress
          );

          if (data) {
            return { event: `media_word_select`, ...data };
          } else {
            return { event: `word_node_not_found` };
          }
      }
  }
};

export default handleMediaSceneKeyPress;
