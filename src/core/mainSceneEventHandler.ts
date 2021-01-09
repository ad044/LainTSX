import site_a from "../resources/site_a.json";
import site_b from "../resources/site_b.json";
import nodeSelector, { getNodeHudId, getNodeId } from "./nodeSelector";
import { SiteType } from "../components/MainScene/SyncedComponents/Site";

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

  let activeNodeId = gameContext.activeNodeId;
  let activeHudId;
  let nodeMatrixIndices = gameContext.nodeMatrixIndices;
  let level = parseInt(gameContext.activeLevel);
  let siteRotY = gameContext.siteTransformState.rotY;
  let sitePosY = gameContext.siteTransformState.posY;
  let scene = gameContext.scene;

  if (subscene === "site") {
    let selectedNodeData;
    switch (keyPress) {
      case "LEFT":
      case "RIGHT":
      case "DOWN":
      case "UP":
        selectedNodeData = nodeSelector({
          action: `site_${keyPress.toLowerCase()}`,
          activeId: activeNodeId,
          nodeMatrixIndices: nodeMatrixIndices,
          level: level,
          siteRotY: siteRotY,
          sitePosY: sitePosY,
          gameProgress: gameProgress,
          currentSite: currentSite,
        });

        if (selectedNodeData) {
          event = selectedNodeData.event;
          activeNodeId = selectedNodeData.newActiveNodeId;
          nodeMatrixIndices = selectedNodeData.newNodeMatrixIndices;
          siteRotY = selectedNodeData.newSiteRotY;
          sitePosY = selectedNodeData.newSitePosY;
          level = selectedNodeData.newLevel;
          activeHudId = selectedNodeData.newActiveHudId;
        }

        break;
      case "CIRCLE":
        // in this case we have to check the type of the blue orb
        // and dispatch an action depending on that, so we have to precalculate the
        // new active blue orb here.
        activeNodeId = getNodeId(level, nodeMatrixIndices);

        const siteData = currentSite === "a" ? site_a : site_b;

        const nodeData = (siteData as SiteType)[gameContext.activeLevel][
          activeNodeId
        ];
        const nodeType = nodeData.type;

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
            if (nodeData.node_name.substr(0, 3) === "TaK") {
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
        return { event: "toggle_level_selection" };
      case "TRIANGLE":
        return { event: "pause_game" };
      case "SPACE":
        return { event: "test", siteRotY: siteRotY };
    }

    return {
      event: event,
      nodeMatrixIndices: nodeMatrixIndices,
      sitePosY: sitePosY,
      siteRotY: siteRotY,
      level: level.toString().padStart(2, "0"),
      scene: scene,
      activeNodeId: activeNodeId,
      activeHudId: activeHudId,
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
          activeNodeId: getNodeId(level, nodeMatrixIndices),
          activeHudId: getNodeHudId(nodeMatrixIndices),
          level: level.toString().padStart(2, "0"),
        };
      case "CIRCLE":
        const selectedNodeData = nodeSelector({
          action: "select_level",
          activeId: activeNodeId,
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
            level: selectedLevel.toString().padStart(2, "0"),
            activeNodeId: selectedNodeData.newActiveNodeId,
            activeHudId: selectedNodeData.newActiveHudId,
            nodeMatrixIndices: selectedNodeData.newNodeMatrixIndices,
            sitePosY: -selectedNodeData.newSitePosY,
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
          currentNodeId: activeNodeId,
          currentNodeMatrixIndices: nodeMatrixIndices,
          currentHudId: getNodeHudId(nodeMatrixIndices),
          currentLevel: level.toString().padStart(2, "0"),
          site: currentSite === "a" ? "b" : "a",
        };
    }
  }
};

export default handleMainSceneEvent;
