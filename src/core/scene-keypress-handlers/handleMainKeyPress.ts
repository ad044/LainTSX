import {
  findNode,
  getNodeById,
  isNodeVisible,
  unknownNodeTemplate,
} from "../../utils/node-utils";

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
    ssknLvl,
    showingAbout,
    promptVisible,
    activePromptComponent,
    gateLvl,
  } = mainSceneContext;

  if (promptVisible) {
    switch (keyPress) {
      case "LEFT":
        return { event: "prompt_left" };
      case "RIGHT":
        return { event: "prompt_right" };
      case "CIRCLE":
        switch (activePromptComponent) {
          case "no":
            return { event: "exit_prompt" };
          case "yes":
            return {
              event: `pause_${activePauseComponent}_select`,
              site: currentSite,
            };
        }
    }
  } else {
    switch (subscene) {
      case "site":
        switch (keyPress) {
          case "LEFT":
          case "RIGHT": {
            const keyPressToLower = keyPress.toLowerCase();

            const nodeData = findNode(
              activeNode.id,
              keyPressToLower,
              activeNode.matrixIndices!,
              level,
              currentSite,
              gameProgress,
              true
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
                  ...(nodeData.node !== "unknown"
                    ? getNodeById(nodeData.node, currentSite)
                    : unknownNodeTemplate),
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
              activeNode.id,
              keyPressToLower,
              activeNode.matrixIndices!,
              level,
              currentSite,
              gameProgress,
              true
            );

            if (!nodeData) return;

            if (nodeData.didMove) {
              return {
                event: keyPressToLower === "up" ? "site_up" : "site_down",
                level: (keyPressToLower === "up" ? level + 1 : level - 1)
                  .toString()
                  .padStart(2, "0"),
                node: {
                  ...(nodeData.node !== "unknown"
                    ? getNodeById(nodeData.node, currentSite)
                    : unknownNodeTemplate),
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

            if (
              activeNode.id === "" ||
              !isNodeVisible(activeNode, gameProgress)
            )
              return;

            if (activeNode.upgrade_requirement > ssknLvl) {
              const rejectAnimations = [
                "touch_and_scare",
                "knock_and_fall",
                "knock",
              ];

              const pickedAnim =
                rejectAnimations[
                  Math.floor(Math.random() * rejectAnimations.length)
                ];

              return {
                event: pickedAnim,
                siteRotY: siteRotY,
              };
            }

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
                  level: level.toString().padStart(2, "0"),
                };
              case 6:
                if (activeNode.node_name.substr(0, 3) === "TaK") {
                  return {
                    event: `${eventAnimation}_tak`,
                    scene: "tak",
                    siteRotY: siteRotY,
                    node: activeNode,
                  };
                } else {
                  return {
                    event: `${eventAnimation}_media`,
                    scene: "media",
                    siteRotY: siteRotY,
                    level: level.toString().padStart(2, "0"),
                  };
                }
              case 8:
                return {
                  event: `${eventAnimation}_gate`,
                  scene: "gate",
                  siteRotY: siteRotY,
                  node: activeNode,
                };
              case 7:
                return {
                  event: `${eventAnimation}_sskn`,
                  scene: "sskn",
                  siteRotY: siteRotY,
                };
              case 9:
                const bodyPart = (() => {
                  switch (parseInt(activeNode.node_name.slice(-1))) {
                    case 6:
                      return "head";
                    case 5:
                      return "rightArm";
                    case 4:
                      return "leftArm";
                    case 3:
                      return "rightLeg";
                    case 2:
                      return "leftLeg";
                    case 1:
                      return "body";
                  }
                })();
                return {
                  event: `${eventAnimation}_polytan`,
                  scene: "polytan",
                  siteRotY: siteRotY,
                  node: activeNode,
                  bodyPart: bodyPart,
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

            const rowIdx = direction === "up" ? 2 : 0;
            const nodeData = findNode(
              activeNode.id,
              direction,
              { ...activeNode.matrixIndices!, rowIdx: rowIdx },
              selectedLevel,
              currentSite,
              gameProgress,
              false
            );

            if (nodeData) {
              const event =
                selectedLevel < level ? "select_level_down" : "select_level_up";
              return {
                event: event,
                node: {
                  ...(nodeData.node !== "unknown"
                    ? getNodeById(nodeData.node, currentSite)
                    : unknownNodeTemplate),
                  matrixIndices: nodeData.matrixIndices,
                },
                level: selectedLevel.toString().padStart(2, "0"),
              };
            }
        }
        break;
      case "pause":
        if (showingAbout)
          return {
            event: "exit_about",
          };
        else {
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
              if (activePauseComponent === "change") {
                if (gateLvl < 4) {
                  return { event: "show_permission_denied" };
                } else {
                  return {
                    event: "display_prompt",
                  };
                }
              } else if (
                activePauseComponent === "save" ||
                activePauseComponent === "load"
              ) {
                return {
                  event: "display_prompt",
                };
              } else {
                return {
                  event: `pause_${activePauseComponent}_select`,
                };
              }
          }
        }
        break;
      case "not_found":
        return { event: "exit_not_found" };
    }
  }
};

export default handleMainSceneEvent;
