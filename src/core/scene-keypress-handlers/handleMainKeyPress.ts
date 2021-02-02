import { findNode, getNodeById } from "../../utils/node-utils";

const handleMainSceneEvent = (mainSceneContext: any) => {
  const {
    subscene,
    selectedLevel,
    pauseMatrixIdx,
    activePauseComponent,
    gameProgress,
    currentSite,
    siteRotY,
    activeNode,
    level,
    keyPress,
  } = mainSceneContext;

  switch (subscene) {
    case "site":
      switch (keyPress) {
        case "LEFT":
        case "RIGHT": {
          const keyPressToLower = keyPress.toLowerCase();

          const nodeData = findNode(
            keyPressToLower,
            activeNode.matrixIndices!,
            level,
            currentSite,
            gameProgress
          );

          if (!nodeData) return;

          if (nodeData.didMove) {
            return {
              event: keyPressToLower === "left" ? `site_left` : "site_right",
              siteRotY:
                keyPressToLower === "left"
                  ? siteRotY + Math.PI / 4
                  : siteRotY - Math.PI / 4,
              node: {
                ...getNodeById(nodeData.node, currentSite),
                matrixIndices: nodeData.matrixIndices,
              },
            };
          } else {
            return {
              event: "change_node",
              nodeMatrixIndices: nodeData.matrixIndices,
              node: {
                ...getNodeById(nodeData.node, currentSite),
                matrixIndices: nodeData.matrixIndices,
              },
            };
          }
        }
        case "UP":
        case "DOWN": {
          const keyPressToLower = keyPress.toLowerCase();
          const nodeData = findNode(
            keyPressToLower,
            activeNode.matrixIndices!,
            level,
            currentSite,
            gameProgress
          );

          if (!nodeData) return;

          if (nodeData.didMove) {
            return {
              event: keyPressToLower === "up" ? "site_up" : "site_down",
              level: (keyPressToLower === "up" ? level + 1 : level - 1)
                .toString()
                .padStart(2, "0"),
              node: {
                ...getNodeById(nodeData.node, currentSite),
                matrixIndices: nodeData.matrixIndices,
              },
            };
          } else {
            return {
              event: "change_node",
              node: {
                ...getNodeById(nodeData.node, currentSite),
                matrixIndices: nodeData.matrixIndices,
              },
            };
          }
        }
        case "CIRCLE":
          const eventAnimation =
            Math.random() < 0.4 ? "rip_node" : "throw_node";

          const nodeType = activeNode.type;

          switch (nodeType) {
            case 0:
            case 2:
            case 4:
            case 3:
            case 5:
              return {
                event: `${eventAnimation}_media`,
                scene: "media",
                siteRotY: siteRotY,
              };
            case 6:
              if (activeNode.node_name.substr(0, 3) === "TaK") {
                return {
                  event: `${eventAnimation}_tak`,
                  scene: "tak",
                  siteRotY: siteRotY,
                };
              } else {
                return {
                  event: `${eventAnimation}_media`,
                  scene: "media",
                  siteRotY: siteRotY,
                };
              }
            case 8:
              return {
                event: `${eventAnimation}_gate`,
                scene: "gate",
                siteRotY: siteRotY,
              };
            case 7:
              return {
                event: `${eventAnimation}_sskn`,
                scene: "sskn",
                siteRotY: siteRotY,
              };
          }
          break;
        case "L2":
          return { event: "toggle_level_selection", level: level };
        case "TRIANGLE":
          return { event: "pause_game" };
        case "SPACE":
          return { event: "play_with_hair", siteRotY: siteRotY };
      }
      break;
    case "level_selection":
      switch (keyPress) {
        case "UP":
          if (currentSite === "a") {
            if (selectedLevel + 1 <= 22)
              return {
                event: `level_selection_up`,
                selectedLevelIdx: selectedLevel + 1,
              };
          } else if (currentSite === "b") {
            if (selectedLevel + 1 <= 13)
              return {
                event: `level_selection_up`,
                selectedLevelIdx: selectedLevel + 1,
              };
          }
          break;
        case "DOWN":
          if (selectedLevel - 1 >= 1)
            return {
              event: `level_selection_down`,
              selectedLevelIdx: selectedLevel - 1,
            };
          break;
        case "X":
          return {
            event: "level_selection_back",
          };

        case "CIRCLE":
          if (level === selectedLevel) return;

          const direction = selectedLevel > level ? "up" : "down";

          const nodeData = findNode(
            direction,
            activeNode.matrixIndices!,
            selectedLevel,
            currentSite,
            gameProgress
          );

          if (nodeData) {
            const event =
              selectedLevel < level ? "select_level_down" : "select_level_up";
            return {
              event: event,
              node: {
                ...getNodeById(nodeData.node, currentSite),
                matrixIndices: nodeData.matrixIndices,
              },
              level: selectedLevel.toString().padStart(2, "0"),
            };
          }
      }
      break;
    case "pause":
      switch (keyPress) {
        case "UP":
          if (pauseMatrixIdx - 1 < 0) break;
          return {
            event: "pause_up",
            pauseMatrixIdx: pauseMatrixIdx - 1,
          };
        case "DOWN":
          if (pauseMatrixIdx + 1 > 4) break;
          return {
            event: "pause_down",
            pauseMatrixIdx: pauseMatrixIdx + 1,
          };
        case "CIRCLE":
          return {
            event: `pause_${activePauseComponent}_select`,
            site: currentSite,
          };
      }
  }
};

export default handleMainSceneEvent;
