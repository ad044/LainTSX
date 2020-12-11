import node_matrices from "../resources/node_matrices.json";
import site_a from "../resources/site_a.json";
import level_y_values from "../resources/level_y_values.json";
import nodeSelector from "./nodeSelector";
import unlocked_nodes from "../resources/unlocked_nodes.json";

const hudAssocs = {
  "00": "fg_hud_1",
  "10": "fg_hud_2",
  "20": "fg_hud_3",
  "01": "bg_hud_1",
  "11": "bg_hud_2",
  "21": "bg_hud_3",
  "02": "bg_hud_4",
  "12": "bg_hud_5",
  "22": "bg_hud_6",
  "03": "fg_hud_4",
  "13": "fg_hud_5",
  "23": "fg_hud_6",
};

const handleMainSceneEvent = (gameContext: any) => {
  let event;

  const keyPress = gameContext.keyPress;
  const subscene = gameContext.mainSubscene;
  const levelSelectionIdx = gameContext.levelSelectionIdx;
  const pauseMatrixIdx = gameContext.pauseMatrixIdx;
  const activePauseComponent = gameContext.activePauseComponent;
  const unlockedNodes = gameContext.unlockedNodes;

  const nodeColIdx = gameContext.nodeMatrixIndices.colIdx;
  const nodeRowIdx = gameContext.nodeMatrixIndices.rowIdx;
  const nodeMatIdx = gameContext.nodeMatrixIndices.matrixIdx;
  const level = gameContext.activeLevel;
  const siteRotY = gameContext.siteTransformState.rotY;
  const sitePosY = gameContext.siteTransformState.posY;

  let newNodeMatIdx = gameContext.nodeMatrixIndices.matrixIdx;
  let newNodeColIdx = gameContext.nodeMatrixIndices.colIdx;
  let newNodeRowIdx = gameContext.nodeMatrixIndices.rowIdx;
  let newLevel = gameContext.activeLevel;
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
          keyPress: keyPress,
          nodeMatIdx: nodeMatIdx,
          nodeColIdx: nodeColIdx,
          nodeRowIdx: nodeRowIdx,
          level: level,
          siteRotY: siteRotY,
          sitePosY: sitePosY,
          unlockedNodes: unlockedNodes,
        });

        if (selectedNodeData) {
          event = selectedNodeData.event;
          newNodeMatIdx = selectedNodeData.newNodeMatIdx;
          newNodeColIdx = selectedNodeData.newNodeColIdx;
          newNodeRowIdx = selectedNodeData.newNodeRowIdx;
          newSiteRotY = selectedNodeData.newSiteRotY;
          newSitePosY = selectedNodeData.newSitePosY;
          newLevel = selectedNodeData.newLevel;
        }

        break;
      case "CIRCLE":
        // in this case we have to check the type of the blue orb
        // and dispatch an action depending on that, so we have to precalculate the
        // new active blue orb here.
        const newActiveNodeId =
          newLevel +
          node_matrices[newNodeMatIdx.toString() as keyof typeof node_matrices][
            newNodeRowIdx as number
          ][newNodeColIdx as number];

        const nodeType = (site_a as any)[newLevel][newActiveNodeId].type;

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

    const newActiveNodeId =
      newLevel +
      node_matrices[newNodeMatIdx.toString() as keyof typeof node_matrices][
        newNodeRowIdx as number
      ][newNodeColIdx as number];

    const newActiveHudId =
      hudAssocs[`${newNodeRowIdx}${newNodeColIdx}` as keyof typeof hudAssocs];

    return {
      event: event,
      newNodeColIdx: newNodeColIdx,
      newNodeRowIdx: newNodeRowIdx,
      newNodeMatIdx: newNodeMatIdx,
      newSitePosY: newSitePosY,
      newSiteRotY: newSiteRotY,
      newLevel: newLevel,
      newScene: newScene,
      newActiveNodeId: newActiveNodeId,
      newActiveHudId: newActiveHudId,
    };
  } else if (subscene === "level_selection") {
    switch (keyPress) {
      case "UP":
        if (levelSelectionIdx + 1 <= 23)
          return {
            event: `level_selection_up`,
            newSelectedLevelIdx: levelSelectionIdx + 1,
          };
        break;
      case "DOWN":
        if (levelSelectionIdx - 1 >= 0)
          return {
            event: `level_selection_down`,
            newSelectedLevelIdx: levelSelectionIdx - 1,
          };
        break;
      case "X":
        return {
          event: "level_selection_back",
          newActiveNodeId:
            newLevel +
            node_matrices[
              newNodeMatIdx.toString() as keyof typeof node_matrices
            ][newNodeRowIdx as number][newNodeColIdx as number],
          newActiveHudId:
            hudAssocs[
              `${newNodeRowIdx}${newNodeColIdx}` as keyof typeof hudAssocs
            ],
          newLevel: newLevel,
        };
      case "CIRCLE":
        const oldLevel = newLevel;
        newLevel = (levelSelectionIdx + 1).toString().padStart(2, "0");
        if (oldLevel === newLevel) break;
        else if (newLevel < oldLevel) {
          return {
            event: "select_level_down",
            newLevel: newLevel,
            newSitePosY:
              level_y_values[newLevel as keyof typeof level_y_values],
          };
        } else {
          return {
            event: "select_level_up",
            newLevel: newLevel,
            newSitePosY: -level_y_values[
              newLevel as keyof typeof level_y_values
            ],
            newActiveNodeId: "2022",
            newActiveHudId: "fg_hud_1",
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
