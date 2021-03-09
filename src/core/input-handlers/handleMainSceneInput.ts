import {
  findNode,
  getNodeById,
  isNodeVisible,
  nodeToScene,
  unknownNodeTemplate,
} from "../../helpers/node-helpers";
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
  hideWordNotFound,
  knockNode,
  knockNodeAndFall,
  loadGame,
  loadGameFail,
  pauseGame,
  resetInputCooldown,
  ripNode,
  saveGame,
  selectLevel,
  showAbout,
  showPermissionDenied,
  siteMoveHorizontal,
  siteMoveVertical,
  throwNode,
} from "../eventTemplates";
import { GameEvent, MainSceneContext } from "../../types/types";
import { getCurrentUserState } from "../../store";

const handleMainSceneInput = (
  mainSceneContext: MainSceneContext,
  keyPress: string
): GameEvent | undefined => {
  const {
    subscene,
    selectedLevel,
    activePauseComponent,
    gameProgress,
    activeSite,
    siteRotY,
    activeNode,
    level,
    showingAbout,
    promptVisible,
    activePromptComponent,
    siteSaveState,
    wordNotFound,
    canLainMove,
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
              case "change": {
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
                return changeSite({
                  newActiveSite: siteToLoad,
                  newActiveNode: stateToLoad.activeNode,
                  newSiteRot: stateToLoad.siteRot,
                  newActiveLevel: stateToLoad.activeLevel,
                  newSiteSaveState: newSiteSaveState,
                });
              }
              case "save":
                return saveGame({ userSaveState: getCurrentUserState() });
              case "load": {
                const stateToLoad = localStorage.getItem("lainSaveState");

                if (stateToLoad)
                  return loadGame({
                    userSaveState: JSON.parse(stateToLoad),
                  });
                else return loadGameFail;
              }
            }
        }
    }
  } else {
    switch (subscene) {
      case "site":
        if (wordNotFound) return hideWordNotFound;
        switch (keyPress) {
          case "LEFT":
          case "RIGHT": {
            const direction = keyPress.toLowerCase();
            const nodeData = findNode(
              activeNode,
              direction,
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
              if (!canLainMove) return resetInputCooldown;
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

            const upperLimit = activeSite === "a" ? 22 : 13;
            if (
              (activeNode.matrixIndices?.rowIdx === 0 &&
                direction === "up" &&
                level === upperLimit) ||
              (activeNode.matrixIndices?.rowIdx === 2 &&
                direction === "down" &&
                level === 1)
            )
              return resetInputCooldown;

            const nodeData = findNode(
              activeNode,
              direction,
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

            if (nodeData.didMove) {
              if (!canLainMove) return resetInputCooldown;

              return siteMoveVertical({
                lainMoveAnimation: lainMoveAnimation,
                activeLevel: newLevel,
                activeNode: newNode,
              });
            } else return changeNode({ activeNode: newNode });
          }
          case "CIRCLE":
            if (!canLainMove) return resetInputCooldown;

            const eventAnimation = Math.random() < 0.4 ? throwNode : ripNode;

            if (
              activeNode.id === "" ||
              !isNodeVisible(activeNode, gameProgress)
            )
              return;

            if (activeNode.upgrade_requirement > gameProgress.sskn_level) {
              const rejectEvents = [knockNodeAndFall, knockNode, explodeNode];
              return rejectEvents[Math.floor(Math.random() * 3)];
            }

            const newScene = nodeToScene(activeNode);
            if (newScene) return eventAnimation({ currentScene: newScene });
            break;
          case "L2":
            return enterLevelSelection({ selectedLevel: level });
          case "TRIANGLE":
            if (!canLainMove) return resetInputCooldown;
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
          case "CROSS":
            return exitLevelSelection;

          case "CIRCLE":
            if (!canLainMove) return resetInputCooldown;

            if (level === selectedLevel) return;

            const direction = selectedLevel > level ? "up" : "down";

            const newStartingPoint = {
              ...activeNode,
              matrixIndices: {
                matrixIdx: activeNode.matrixIndices!.matrixIdx,
                rowIdx: direction === "up" ? 2 : 0,
                colIdx: 0,
              },
            };

            const nodeData = findNode(
              newStartingPoint,
              direction,
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
            const components = ["load", "about", "change", "save", "exit"];

            const newComponent =
              components[
                components.indexOf(activePauseComponent) +
                  (keyPress === "UP" ? -1 : 1)
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
                if (
                  activePauseComponent === "change" &&
                  gameProgress.gate_level < 4
                )
                  return showPermissionDenied;
                else return displayPrompt;
            }
        }
        break;
    }
  }
};

export default handleMainSceneInput;
