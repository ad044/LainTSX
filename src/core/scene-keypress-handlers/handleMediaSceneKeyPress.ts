import { findNodeFromWord } from "../../utils/media-utils";
import { MediaSceneContext } from "../../store";
import { changeLeftMediaComponent, changeMediaSide } from "../eventTemplates";

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
        case "DOWN": {
          const direction = keyPress.toLowerCase();
          const newComponent = direction === "up" ? "play" : "exit";
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
            return { event: `media_word_select`, ...data };
          } else {
            return { event: `word_node_not_found` };
          }
      }
  }
};

export default handleMediaSceneKeyPress;
