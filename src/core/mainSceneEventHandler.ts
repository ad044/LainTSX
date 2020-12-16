import node_matrices from "../resources/node_matrices.json";
import site_a from "../resources/site_a.json";
import nodeSelector, { getNodeHudId, getNodeId } from "./nodeSelector";

const handleMainSceneEvent = (gameContext: any) => {
  let event;

  const keyPress = gameContext.keyPress;
  const subscene = gameContext.mainSubscene;
  const selectedLevel = gameContext.selectedLevel;
  const pauseMatrixIdx = gameContext.pauseMatrixIdx;
  const activePauseComponent = gameContext.activePauseComponent;
  const unlockedNodes = gameContext.unlockedNodes;
  const activeNodeId = gameContext.activeNodeId;

  let nodeMatrixIndices = gameContext.nodeMatrixIndices;

  const level = parseInt(gameContext.activeLevel);
  const siteRotY = gameContext.siteTransformState.rotY;
  const sitePosY = gameContext.siteTransformState.posY;

  let newActiveNodeId;
  let newActiveHudId;
  let newLevel = parseInt(gameContext.activeLevel);
  let newSiteRotY = gameContext.siteTransformState.rotY;
  let newSitePosY = gameContext.siteTransformState.posY;
  let newScene = gameContext.scene;

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
          unlockedNodes: unlockedNodes,
        });

        if (selectedNodeData) {
          event = selectedNodeData.event;
          newActiveNodeId = selectedNodeData.newActiveNodeId;
          nodeMatrixIndices = selectedNodeData.newNodeMatrixIndices;
          newSiteRotY = selectedNodeData.newSiteRotY;
          newSitePosY = selectedNodeData.newSitePosY;
          newLevel = selectedNodeData.newLevel;
          newActiveHudId = selectedNodeData.newActiveHudId;
          console.log(selectedNodeData.newActiveNodeId);
        }

        break;
      case "CIRCLE":
        // in this case we have to check the type of the blue orb
        // and dispatch an action depending on that, so we have to precalculate the
        // new active blue orb here.
        newActiveNodeId = getNodeId(level, nodeMatrixIndices);

        const nodeType = (site_a as any)[gameContext.activeLevel][
          newActiveNodeId
        ].type;

        const eventAnimation = "throw_node_";

        switch (parseInt(nodeType)) {
          case 0:
          case 2:
            event = eventAnimation + "media";
            newScene = "media";
            break;
          case 8:
            event = eventAnimation + "gate";
            newScene = "gate";
            break;
          case 7:
            event = eventAnimation + "sskn";
            newScene = "sskn";
            break;
        }
        break;
      case "L2":
        return { event: "toggle_level_selection" };
      case "TRIANGLE":
        return { event: "toggle_pause" };
    }

    return {
      event: event,
      newNodeMatrixIndices: nodeMatrixIndices,
      newSitePosY: newSitePosY,
      newSiteRotY: newSiteRotY,
      newLevel: newLevel.toString().padStart(2, "0"),
      newScene: newScene,
      newActiveNodeId: newActiveNodeId,
      newActiveHudId: newActiveHudId,
    };
  } else if (subscene === "level_selection") {
    switch (keyPress) {
      case "UP":
        if (selectedLevel + 1 <= 22)
          return {
            event: `level_selection_up`,
            newSelectedLevelIdx: selectedLevel + 1,
          };
        break;
      case "DOWN":
        if (selectedLevel - 1 >= 0)
          return {
            event: `level_selection_down`,
            newSelectedLevelIdx: selectedLevel - 1,
          };
        break;
      case "X":
        return {
          event: "level_selection_back",
          newActiveNodeId: getNodeId(newLevel, nodeMatrixIndices),
          newActiveHudId: getNodeHudId(nodeMatrixIndices),
          newLevel: newLevel.toString().padStart(2, "0"),
        };
      case "CIRCLE":
        const selectedNodeData = nodeSelector({
          action: "select_level",
          activeId: activeNodeId,
          nodeMatrixIndices: nodeMatrixIndices,
          level: selectedLevel,
          siteRotY: siteRotY,
          sitePosY: sitePosY,
          unlockedNodes: unlockedNodes,
        });

        if (level === selectedLevel) break;
        if (selectedNodeData) {
          const event =
            selectedLevel < level ? "select_level_down" : "select_level_up";
          return {
            event: event,
            newLevel: selectedLevel.toString().padStart(2, "0"),
            newActiveNodeId: selectedNodeData.newActiveNodeId,
            newActiveHudId: selectedNodeData.newActiveHudId,
            newNodeMatrixIndices: selectedNodeData.newNodeMatrixIndices,
            newSitePosY: -selectedNodeData.newSitePosY,
          };
        }
    }
  } else if (subscene === "pause") {
    switch (keyPress) {
      case "UP":
        if (pauseMatrixIdx - 1 < 0) break;
        return {
          event: "pause_up",
          newPauseMatrixIdx: pauseMatrixIdx - 1,
        };
      case "DOWN":
        if (pauseMatrixIdx + 1 > 4) break;
        return {
          event: "pause_down",
          newPauseMatrixIdx: pauseMatrixIdx + 1,
        };
      case "CIRCLE":
        return {
          event: `pause_${activePauseComponent}_select`,
        };
    }
  }
};

export default handleMainSceneEvent;
