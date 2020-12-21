import node_matrices from "../resources/node_matrices.json";
import site_a from "../resources/site_a.json";
import site_b from "../resources/site_b.json";
import { SiteType } from "../components/MainScene/Site";
import unlocked_nodes from "../resources/initial_progress.json";
import level_y_values from "../resources/level_y_values.json";

type NodeSelectorContext = {
  action: string;
  activeId: string;
  nodeMatrixIndices: { matrixIdx: number; rowIdx: number; colIdx: number };
  level: number;
  siteRotY: number;
  sitePosY: number;
  gameProgress: typeof unlocked_nodes;
  currentSite: string;
};

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

export const getNodeId = (
  level: number,
  nodeMatrixIndices: {
    matrixIdx: number;
    rowIdx: number;
    colIdx: number;
  }
) => {
  return (
    level.toString().padStart(2, "0") +
    node_matrices[
      nodeMatrixIndices.matrixIdx.toString() as keyof typeof node_matrices
    ][nodeMatrixIndices.rowIdx][nodeMatrixIndices.colIdx]
  );
};

export const getNodeHudId = (nodeMatrixIndices: {
  matrixIdx: number;
  rowIdx: number;
  colIdx: number;
}) =>
  hudAssocs[
    `${nodeMatrixIndices.rowIdx}${nodeMatrixIndices.colIdx}` as keyof typeof hudAssocs
  ];

export const isNodeVisible = (
  nodeId: string,
  gameProgress: typeof unlocked_nodes,
  currentSite: string
) => {
  const siteData = currentSite === "a" ? site_a : site_b;
  const nodeLevel = nodeId.substr(0, 2);
  const nodeData = (siteData as SiteType)[nodeLevel][nodeId];
  if (nodeData) {
    const unlockedBy = nodeData.unlocked_by;

    let unlocked;
    if (unlockedBy === "") unlocked = true;
    else
      unlocked =
        gameProgress[unlockedBy as keyof typeof gameProgress].is_viewed;

    // visible = (global_final_viewcount > 0) && (req_final_viewcount <= global_final_viewcount + 1)

    return (
      unlocked &&
      gameProgress[nodeData.node_name as keyof typeof gameProgress].is_visible
    );
  } else {
    return false;
  }
};

const tryCol = (col: number, triedCols: number[]) => {
  const possibleCols = [0, 1, 2, 3].filter((elem) => elem !== col);
  return possibleCols.find((elem) => !triedCols.includes(elem));
};

const tryRow = (row: number, triedRows: number[]) => {
  const possibleRows = [0, 1, 2].filter((elem) => elem !== row);
  return possibleRows.find((elem) => !triedRows.includes(elem));
};

const findNodeAfterLevelSelection = (
  gameProgress: typeof unlocked_nodes,
  targetLevel: number,
  nodeMatrixIndices: { matrixIdx: number; rowIdx: number; colIdx: number },
  currentSite: string
) => {
  let newMatIndices = Object.assign({}, nodeMatrixIndices);

  let triedCols: number[] = [];

  newMatIndices.rowIdx = 0;

  let newNodeId = getNodeId(targetLevel, newMatIndices);

  while (!isNodeVisible(newNodeId, gameProgress, currentSite)) {
    if (triedCols.length < 4) {
      triedCols.push(newMatIndices.colIdx);
      const colToTry = tryCol(newMatIndices.colIdx, triedCols);
      if (colToTry !== undefined) {
        newMatIndices.colIdx = colToTry;
      }
    } else {
      if (newMatIndices.rowIdx === 2) {
        newMatIndices.colIdx = nodeMatrixIndices.colIdx;
        newNodeId = "UNKNOWN";
        break;
      } else {
        newMatIndices.rowIdx++;
        triedCols = [];
        newMatIndices.colIdx = 0;
      }
    }
    newNodeId = getNodeId(targetLevel, newMatIndices);
  }

  const newNodeHudId = getNodeHudId(newMatIndices);

  return {
    newLevel: targetLevel,
    newNodeId: newNodeId,
    newNodeHudId: newNodeHudId,
    newNodeMatrixIndices: newMatIndices,
    newSitePosY:
      level_y_values[
        targetLevel.toString().padStart(2, "0") as keyof typeof level_y_values
      ],
  };
};

const findNodeVertical = (
  direction: string,
  gameProgress: typeof unlocked_nodes,
  level: number,
  nodeMatrixIndices: { matrixIdx: number; rowIdx: number; colIdx: number },
  currentSite: string
) => {
  let newNodeId;
  let newLevel = level;
  let newMatIndices = Object.assign({}, nodeMatrixIndices);

  if (direction === "down") {
    newMatIndices.rowIdx++;

    let triedCols: number[] = [];

    if (newMatIndices.rowIdx > 2) {
      newMatIndices.rowIdx = 0;
      newLevel = level - 1;
    }

    newNodeId = getNodeId(newLevel, newMatIndices);

    while (!isNodeVisible(newNodeId, gameProgress, currentSite)) {
      if (triedCols.length < 4) {
        triedCols.push(newMatIndices.colIdx);
        const colToTry = tryCol(newMatIndices.colIdx, triedCols);
        if (colToTry !== undefined) {
          newMatIndices.colIdx = colToTry;
        }
      } else {
        if (newMatIndices.rowIdx === 2) {
          if (newLevel === level - 1) {
            newNodeId = "UNKNOWN";
            newMatIndices.colIdx = nodeMatrixIndices.colIdx;
            break;
          }
          newMatIndices.rowIdx = 0;
          newLevel = level - 1;
        } else {
          newMatIndices.rowIdx++;
          newMatIndices.colIdx = 0;
          triedCols = [];
        }
      }
      newNodeId = getNodeId(newLevel, newMatIndices);
    }
  } else if (direction === "up") {
    newMatIndices.rowIdx--;

    let triedCols: number[] = [];

    if (newMatIndices.rowIdx < 0) {
      newMatIndices.rowIdx = 2;
      newLevel = level + 1;
    }

    newNodeId = getNodeId(newLevel, newMatIndices);

    while (!isNodeVisible(newNodeId, gameProgress, currentSite)) {
      if (triedCols.length < 4) {
        triedCols.push(newMatIndices.colIdx);
        const colToTry = tryCol(newMatIndices.colIdx, triedCols);
        if (colToTry !== undefined) {
          newMatIndices.colIdx = colToTry;
        }
      } else {
        if (newMatIndices.rowIdx === 0) {
          if (newLevel === level + 1) {
            newNodeId = "UNKNOWN";
            newMatIndices.colIdx = nodeMatrixIndices.colIdx;
            break;
          }
          newMatIndices.rowIdx = 2;
          newLevel = level + 1;
        } else {
          newMatIndices.rowIdx--;
          newMatIndices.colIdx = 0;
          triedCols = [];
        }
      }
      newNodeId = getNodeId(newLevel, newMatIndices);
    }
  }

  return {
    newNodeId: newNodeId,
    newNodeHudId: getNodeHudId(newMatIndices),
    newLevel: newLevel,
    newNodeMatrixIndices: newMatIndices,
  };
};

const findNodeHorizontal = (
  direction: string,
  gameProgress: typeof unlocked_nodes,
  level: number,
  activeId: string,
  nodeMatrixIndices: { matrixIdx: number; rowIdx: number; colIdx: number },
  currentSite: string
) => {
  let newNodeId;
  let newMatIndices = Object.assign({}, nodeMatrixIndices);

  let didMove = false;

  if (direction === "left") {
    newMatIndices.colIdx--;

    let triedRows: number[] = [];

    if (newMatIndices.colIdx < 0) {
      didMove = true;
      newMatIndices.colIdx = 0;
      newMatIndices.matrixIdx =
        newMatIndices.matrixIdx + 1 > 8 ? 1 : newMatIndices.matrixIdx + 1;
    }

    newNodeId = getNodeId(level, newMatIndices);

    while (!isNodeVisible(newNodeId, gameProgress, currentSite)) {
      if (triedRows.length < 3) {
        triedRows.push(newMatIndices.rowIdx);
        const rowToTry = tryRow(newMatIndices.rowIdx, triedRows);
        if (rowToTry !== undefined) {
          newMatIndices.rowIdx = rowToTry;
        }
      } else {
        if (newMatIndices.colIdx > 3 && didMove) return;

        if (newMatIndices.colIdx < 0) {
          if (activeId === "UNKNOWN") {
            didMove = true;
            newMatIndices.colIdx = nodeMatrixIndices.colIdx;
            newMatIndices.matrixIdx =
              newMatIndices.matrixIdx + 1 > 8 ? 1 : newMatIndices.matrixIdx + 1;
            newNodeId = "UNKNOWN";
            break;
          } else {
            didMove = true;
            newMatIndices.colIdx = 0;
            newMatIndices.matrixIdx =
              newMatIndices.matrixIdx + 1 > 8 ? 1 : newMatIndices.matrixIdx + 1;
          }
        } else {
          didMove ? newMatIndices.colIdx++ : newMatIndices.colIdx--;
          triedRows = [];
          newMatIndices.rowIdx = 0;
        }
      }
      newNodeId = getNodeId(level, newMatIndices);
    }
  } else if (direction === "right") {
    newMatIndices.colIdx++;

    let triedRows: number[] = [];

    if (newMatIndices.colIdx > 3) {
      didMove = true;
      newMatIndices.colIdx = 3;
      newMatIndices.matrixIdx =
        newMatIndices.matrixIdx - 1 < 1 ? 8 : newMatIndices.matrixIdx - 1;
    }

    newNodeId = getNodeId(level, newMatIndices);

    while (!isNodeVisible(newNodeId, gameProgress, currentSite)) {
      if (triedRows.length < 3) {
        triedRows.push(newMatIndices.rowIdx);
        const rowToTry = tryRow(newMatIndices.rowIdx, triedRows);
        if (rowToTry !== undefined) {
          newMatIndices.rowIdx = rowToTry;
        }
      } else {
        if (newMatIndices.colIdx < 0 && didMove) return;

        if (newMatIndices.colIdx > 3) {
          if (activeId === "UNKNOWN") {
            didMove = true;
            newMatIndices.colIdx = nodeMatrixIndices.colIdx;
            newMatIndices.matrixIdx =
              newMatIndices.matrixIdx - 1 < 1 ? 8 : newMatIndices.matrixIdx - 1;
            newNodeId = "UNKNOWN";
            break;
          } else {
            if (didMove) return;
            else {
              didMove = true;
              newMatIndices.colIdx = 3;
              newMatIndices.matrixIdx =
                newMatIndices.matrixIdx - 1 < 1
                  ? 8
                  : newMatIndices.matrixIdx - 1;
            }
          }
        } else {
          didMove ? newMatIndices.colIdx-- : newMatIndices.colIdx++;
          triedRows = [];
          newMatIndices.rowIdx = 0;
        }
      }
      newNodeId = getNodeId(level, newMatIndices);
    }
  }

  const newNodeHudId = getNodeHudId(newMatIndices);

  return {
    didMove: didMove,
    newNodeId: newNodeId,
    newNodeHudId: newNodeHudId,
    newNodeMatrixIndices: newMatIndices,
  };
};

const nodeSelector = (context: NodeSelectorContext) => {
  let newNodeData;
  let move;

  switch (context.action) {
    case "site_left":
    case "site_right":
      move = context.action === "site_left" ? "left" : "right";
      newNodeData = findNodeHorizontal(
        move,
        context.gameProgress,
        context.level,
        context.activeId,
        context.nodeMatrixIndices,
        context.currentSite
      );

      if (newNodeData) {
        const siteRotYModifier = move === "left" ? Math.PI / 4 : -Math.PI / 4;

        return {
          event: newNodeData.didMove ? context.action : "change_node",
          newActiveNodeId: newNodeData.newNodeId,
          newActiveHudId: newNodeData.newNodeHudId,
          newNodeMatrixIndices: newNodeData.newNodeMatrixIndices,
          newSiteRotY: newNodeData.didMove
            ? context.siteRotY + siteRotYModifier
            : context.siteRotY,
          newSitePosY: context.sitePosY,
          newLevel: context.level,
        };
      }
      break;
    case "site_up":
    case "site_down":
      move = context.action === "site_up" ? "up" : "down";

      newNodeData = findNodeVertical(
        move,
        context.gameProgress,
        context.level,
        context.nodeMatrixIndices,
        context.currentSite
      );

      if (newNodeData) {
        const didMove = context.level !== newNodeData.newLevel;
        const sitePosYModifier = move === "up" ? -1.5 : 1.5;
        return {
          event: didMove ? context.action : "change_node",
          newActiveNodeId: newNodeData.newNodeId,
          newNodeMatrixIndices: newNodeData.newNodeMatrixIndices,
          newActiveHudId: newNodeData.newNodeHudId,
          newSiteRotY: context.siteRotY,
          newSitePosY: didMove
            ? context.sitePosY + sitePosYModifier
            : context.sitePosY,
          newLevel: newNodeData.newLevel,
        };
      }
      break;
    case "select_level":
      newNodeData = findNodeAfterLevelSelection(
        context.gameProgress,
        context.level,
        context.nodeMatrixIndices,
        context.currentSite
      );

      if (newNodeData) {
        return {
          newActiveNodeId: newNodeData.newNodeId,
          newNodeMatrixIndices: newNodeData.newNodeMatrixIndices,
          newActiveHudId: newNodeData.newNodeHudId,
          newSiteRotY: context.siteRotY,
          newLevel: newNodeData.newLevel,
          newSitePosY: newNodeData.newSitePosY,
        };
      }
  }
};

export default nodeSelector;
