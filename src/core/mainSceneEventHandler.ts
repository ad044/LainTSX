import nodeSelector, { getNode, getNodeById, getNodeHud } from "./nodeSelector";
import {
  findNodeDown,
  findNodeLeft,
  findNodeRight,
  findNodeUp,
} from "./utils/nodeUtils";

const handleMainSceneEvent = (gameContext: any) => {
  let event;

  const keyPress = gameContext.keyPress;
  const subscene = gameContext.mainSubscene;
  const selectedLevel = gameContext.selectedLevel;
  const pauseMatrixIdx = gameContext.pauseMatrixIdx;
  const activePauseComponent = gameContext.activePauseComponent;
  const gameProgress = gameContext.gameProgress;
  const currentSite = gameContext.currentSite;

  const siteASaveState = gameContext.siteASaveState;
  const siteBSaveState = gameContext.siteBSaveState;

  let activeNode = gameContext.activeNode;
  let activeHud;
  let nodeMatrixIndices = gameContext.nodeMatrixIndices;
  let level = parseInt(gameContext.activeLevel);
  let siteRotY = gameContext.siteRotY;
  let sitePosY = gameContext.sitePosY;
  let scene = gameContext.scene;

  if (subscene === "site") {
    switch (keyPress) {
      case "LEFT":
      case "RIGHT":
        const keyPressToLower = keyPress.toLowerCase();

        const fn = keyPressToLower === "left" ? findNodeLeft : findNodeRight;

        const nodeData = fn.apply(null, [
          nodeMatrixIndices,
          level,
          currentSite,
          gameProgress,
        ]);

        if (nodeData) {
          return {
            event: nodeData.didRotate
              ? `site_${keyPressToLower}`
              : "change_node",
            siteRotY:
              keyPressToLower === "left"
                ? siteRotY + Math.PI / 4
                : siteRotY - Math.PI / 4,
            nodeMatrixIndices: nodeData.matrixIndices,
            node: getNodeById(nodeData.node, currentSite),
          };
        }
        break;
      case "UP":
      case "DOWN":
        const keyp = keyPress.toLowerCase();
        const tt = keyp === "up" ? findNodeUp : findNodeDown;
        const t = tt.apply(null, [
          nodeMatrixIndices,
          level,
          currentSite,
          gameProgress,
        ]);
        if (t) {
          return {
            event: t.didMove ? `site_${keyp}` : "change_node",
            nodeMatrixIndices: t.matrixIndices,
            level: (keyp === "up" ? level + 1 : level - 1)
              .toString()
              .padStart(2, "0"),
            node: getNodeById(t.node, currentSite),
          };
        }
        break;
      case "CIRCLE":
        activeNode = getNode(level, nodeMatrixIndices, currentSite);

        const nodeType = activeNode.type;

        const eventAnimation = Math.random() < 0.4 ? "rip_node" : "throw_node";

        switch (nodeType) {
          case 0:
          case 2:
          case 4:
          case 3:
          case 5:
            event = `${eventAnimation}_media`;
            scene = "media";
            break;
          case 6:
            if (activeNode.node_name.substr(0, 3) === "TaK") {
              event = `${eventAnimation}_tak`;
              scene = "tak";
            } else {
              event = `${eventAnimation}_media`;
              scene = "media";
            }
            break;
          case 8:
            event = `${eventAnimation}_gate`;
            scene = "gate";
            break;
          case 7:
            event = `${eventAnimation}_sskn`;
            scene = "sskn";
            break;
        }
        break;
      case "L2":
        return { event: "toggle_level_selection", level: level };
      case "TRIANGLE":
        return { event: "pause_game" };
      case "SPACE":
        return { event: "play_with_hair", siteRotY: siteRotY };
    }

    return {
      event: event,
      nodeMatrixIndices: nodeMatrixIndices,
      sitePosY: sitePosY,
      siteRotY: siteRotY,
      level: level.toString().padStart(2, "0"),
      scene: scene,
      node: activeNode,
      hud: activeHud,
    };
  } else if (subscene === "level_selection") {
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
          node: getNode(level, nodeMatrixIndices, currentSite),
          hud: getNodeHud(nodeMatrixIndices),
        };
      case "CIRCLE":
        const selectedNodeData = nodeSelector({
          action: "select_level",
          activeId: activeNode,
          nodeMatrixIndices: nodeMatrixIndices,
          level: selectedLevel,
          siteRotY: siteRotY,
          sitePosY: sitePosY,
          gameProgress: gameProgress,
          currentSite: currentSite,
        });

        if (level === selectedLevel) break;
        if (selectedNodeData) {
          const event =
            selectedLevel < level ? "select_level_down" : "select_level_up";
          return {
            event: event,
            nodeMatrixIndices: selectedNodeData.nodeMatrixIndices,
            sitePosY: -selectedNodeData.sitePosY!,
            level: selectedLevel.toString().padStart(2, "0"),
            node: selectedNodeData.node,
            hud: selectedNodeData.activeHud,
          };
        }
    }
  } else if (subscene === "pause") {
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
          currentSitePosY: sitePosY,
          currentSiteRotY: siteRotY,
          currentNodeId: activeNode,
          currentNodeMatrixIndices: nodeMatrixIndices,
          currentHud: getNodeHud(nodeMatrixIndices),
          currentLevel: level.toString().padStart(2, "0"),
          site: currentSite === "a" ? "b" : "a",
        };
    }
  }
};

export default handleMainSceneEvent;
