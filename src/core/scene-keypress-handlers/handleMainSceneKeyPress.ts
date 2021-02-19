import {
  findNode,
  getNodeById,
  isNodeVisible,
  unknownNodeTemplate,
} from "../../utils/node-utils";
import { MainSceneContext } from "../../store";
import {
  changeNode,
  changePauseComponent,
  changePromptComponent,
  changeSelectedLevel,
  changeSite,
  displayPrompt,
  enterLevelSelection,
  exitAbout,
  exitLevelSelection,
  exitPause,
  exitPrompt,
  explodeNode,
  knockNode,
  knockNodeAndFall,
  loadGame,
  pauseGame,
  saveGame,
  selectLevel,
  showAbout,
  showPermissionDenied,
  siteMoveHorizontal,
  siteMoveVertical,
} from "../eventTemplates";

const handleMainSceneKeyPress = (mainSceneContext: MainSceneContext) => {
  const {
    subscene,
    selectedLevel,
    activePauseComponent,
    gameProgress,
    activeSite,
    siteRotY,
    activeNode,
    level,
    keyPress,
    ssknLvl,
    showingAbout,
    promptVisible,
    activePromptComponent,
    gateLvl,
    siteSaveState,
  } = mainSceneContext;

  if (promptVisible) {
    switch (keyPress) {
      case "LEFT":
        return changePromptComponent({ activePromptComponent: "yes" });
      case "RIGHT":
        return changePromptComponent({ activePromptComponent: "no" });
      case "CIRCLE":
        switch (activePromptComponent) {
          case "no":
            return exitPrompt;
          case "yes":
            switch (activePauseComponent) {
              case "change":
                const siteToLoad = activeSite === "a" ? "b" : "a";
                const stateToLoad = siteSaveState[siteToLoad];

                const newSiteSaveState = {
                  ...siteSaveState,
                  [activeSite]: {
                    activeNode: activeNode,
                    siteRot: [0, siteRotY, 0],
                    activeLevel: level.toString().padStart(2, "0"),
                  },
                };
                console.log(newSiteSaveState);

                return changeSite({
                  newActiveSite: siteToLoad,
                  newActiveNode: stateToLoad.activeNode,
                  newSiteRot: stateToLoad.siteRot,
                  newActiveLevel: stateToLoad.activeLevel,
                  newSiteSaveState: newSiteSaveState,
                });
              case "save":
                return saveGame();
              case "load":
                return loadGame();
            }
        }
    }
  } else {
    switch (subscene) {
      case "site":
        switch (keyPress) {
          case "LEFT":
          case "RIGHT": {
            const direction = keyPress.toLowerCase();
            const nodeData = findNode(
              activeNode.id,
              direction,
              activeNode.matrixIndices!,
              level,
              activeSite,
              gameProgress,
              true
            );

            if (!nodeData) return;

            const lainMoveAnimation = `move_${direction}`;
            const newSiteRot = [
              0,
              direction === "left"
                ? siteRotY + Math.PI / 4
                : siteRotY - Math.PI / 4,
              0,
            ];
            const newNode = {
              ...(nodeData.node !== "unknown"
                ? getNodeById(nodeData.node, activeSite)
                : unknownNodeTemplate),
              matrixIndices: nodeData.matrixIndices,
            };

            if (nodeData.didMove) {
              return siteMoveHorizontal({
                lainMoveAnimation: lainMoveAnimation,
                siteRot: newSiteRot,
                activeNode: newNode,
              });
            } else {
              return changeNode({ activeNode: newNode });
            }
          }
          case "UP":
          case "DOWN": {
            const direction = keyPress.toLowerCase();

            const nodeData = findNode(
              activeNode.id,
              direction,
              activeNode.matrixIndices!,
              level,
              activeSite,
              gameProgress,
              true
            );

            if (!nodeData) return;

            const lainMoveAnimation = `jump_${direction}`;
            const newLevel = (direction === "up" ? level + 1 : level - 1)
              .toString()
              .padStart(2, "0");
            const newNode = {
              ...(nodeData.node !== "unknown"
                ? getNodeById(nodeData.node, activeSite)
                : unknownNodeTemplate),
              matrixIndices: nodeData.matrixIndices,
            };

            if (nodeData.didMove)
              return siteMoveVertical({
                lainMoveAnimation: lainMoveAnimation,
                activeLevel: newLevel,
                activeNode: newNode,
              });
            else return changeNode({ activeNode: newNode });
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
              const rejectEvents = [explodeNode, knockNode, knockNodeAndFall];
              return rejectEvents[Math.floor(Math.random() * 3)];
            }

            switch (nodeType) {
              case 0:
              case 2:
              case 4:
              case 3:
              case 5:
                return {
                  event: `${eventAnimation}_media`,
                  mutations: { scene: "media" },
                };
              case 6:
                if (activeNode.node_name.substr(0, 3) === "TaK") {
                  return {
                    event: `${eventAnimation}_tak`,
                    mutations: { scene: "tak" },
                  };
                } else {
                  return {
                    event: `${eventAnimation}_media`,
                    mutations: { scene: "media" },
                  };
                }
              case 8:
                return {
                  event: `${eventAnimation}_gate`,
                  mutations: { scene: "gate" },
                };
              case 7:
                return {
                  event: `${eventAnimation}_sskn`,
                  mutations: { scene: "sskn" },
                };
              case 9:
                return {
                  event: `${eventAnimation}_polytan`,
                  mutations: { scene: "polytan" },
                };
            }
            break;
          case "L2":
            return enterLevelSelection({ selectedLevel: level });
          case "TRIANGLE":
            return pauseGame({ siteRot: [Math.PI / 2, siteRotY, 0] });
        }
        break;
      case "level_selection":
        switch (keyPress) {
          case "UP":
            const upperLimit = activeSite === "a" ? 22 : 13;
            if (selectedLevel + 1 <= upperLimit)
              return changeSelectedLevel({ selectedLevel: selectedLevel + 1 });
            break;
          case "DOWN":
            if (selectedLevel - 1 >= 1)
              return changeSelectedLevel({ selectedLevel: selectedLevel - 1 });
            break;
          case "X":
            return exitLevelSelection;

          case "CIRCLE":
            if (level === selectedLevel) return;

            const direction = selectedLevel > level ? "up" : "down";

            const rowIdx = direction === "up" ? 2 : 0;
            const nodeData = findNode(
              activeNode.id,
              direction,
              { ...activeNode.matrixIndices!, rowIdx: rowIdx },
              selectedLevel,
              activeSite,
              gameProgress,
              false
            );

            if (nodeData) {
              const newLevel = selectedLevel.toString().padStart(2, "0");
              const newNode = {
                ...(nodeData.node !== "unknown"
                  ? getNodeById(nodeData.node, activeSite)
                  : unknownNodeTemplate),
                matrixIndices: nodeData.matrixIndices,
              };
              const lainMoveState =
                selectedLevel < level ? "jump_down" : "jump_up";

              return selectLevel({
                lainMoveState: lainMoveState,
                activeLevel: newLevel,
                activeNode: newNode,
              });
            }
        }
        break;
      case "pause":
        if (showingAbout) return exitAbout;
        switch (keyPress) {
          case "UP":
          case "DOWN":
            const direction = keyPress.toLowerCase();
            const components = ["load", "about", "change", "save", "exit"];

            const newComponent =
              components[
                components.indexOf(activePauseComponent) +
                  (direction === "up" ? -1 : 1)
              ];

            if (newComponent)
              return changePauseComponent({
                activePauseComponent: newComponent,
              });
            break;
          case "CIRCLE":
            switch (activePauseComponent) {
              case "about":
                return showAbout;
              case "exit":
                return exitPause({ siteRot: [0, siteRotY, 0] });
              case "save":
              case "load":
                return displayPrompt;
              case "change":
                if (activePauseComponent === "change" && gateLvl > 4)
                  return showPermissionDenied;
                else return displayPrompt;
            }
        }
        break;
    }
  }
};

export default handleMainSceneKeyPress;
