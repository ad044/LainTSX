import node_matrices from "../resources/node_matrices.json";
import site_a from "../resources/site_a.json";
import site_b from "../resources/site_b.json";
import {
  NodeDataType,
  SiteType,
} from "../components/MainScene/SyncedComponents/Site";
import unlocked_nodes from "../resources/initial_progress.json";
import level_y_values from "../resources/level_y_values.json";
import node_huds from "../resources/node_huds.json";
import filterInvisibleNodes from "./utils/filterInvisibleNodes";
import {
  findNodeLeft,
  findNodeRight,
  getVisibleNodesMatrix,
} from "./utils/nodeUtils";

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

export const getNodeById = (id: string, currentSite: string) => {
  const siteData = currentSite === "a" ? site_a : site_b;
  const level = id.substr(0, 2);
  return (siteData as SiteType)[level][id];
};

export const getNode = (
  level: number,
  nodeMatrixIndices: {
    matrixIdx: number;
    rowIdx: number;
    colIdx: number;
  },
  currentSite: string
) => {
  const siteData = currentSite === "a" ? site_a : site_b;

  const formattedLevel = level.toString().padStart(2, "0");
  const nodePos =
    node_matrices[
      nodeMatrixIndices.matrixIdx.toString() as keyof typeof node_matrices
    ][nodeMatrixIndices.rowIdx][nodeMatrixIndices.colIdx];

  const id = formattedLevel + nodePos;

  return (siteData as SiteType)[formattedLevel][id];
};

export const getNodeHud = (nodeMatrixIndices: {
  matrixIdx: number;
  rowIdx: number;
  colIdx: number;
}) =>
  node_huds[
    hudAssocs[
      `${nodeMatrixIndices.rowIdx}${nodeMatrixIndices.colIdx}` as keyof typeof hudAssocs
    ] as keyof typeof node_huds
  ];

export const isNodeVisible = (
  node: NodeDataType,
  gameProgress: typeof unlocked_nodes
) => {
  if (node) {
    const unlockedBy = node.unlocked_by;

    let unlocked;
    if (unlockedBy === "") unlocked = true;
    else
      unlocked =
        gameProgress[unlockedBy as keyof typeof gameProgress].is_viewed;

    // visible = (global_final_viewcount > 0) && (req_final_viewcount <= global_final_viewcount + 1)

    return (
      unlocked &&
      gameProgress[node.node_name as keyof typeof gameProgress].is_visible
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

  let newNode: NodeDataType | "UNKNOWN" = getNode(
    targetLevel,
    newMatIndices,
    currentSite
  );

  while (!isNodeVisible(newNode, gameProgress)) {
    if (triedCols.length < 4) {
      triedCols.push(newMatIndices.colIdx);
      const colToTry = tryCol(newMatIndices.colIdx, triedCols);
      if (colToTry !== undefined) {
        newMatIndices.colIdx = colToTry;
      }
    } else {
      if (newMatIndices.rowIdx === 2) {
        newMatIndices.colIdx = nodeMatrixIndices.colIdx;
        newNode = "UNKNOWN";
        break;
      } else {
        newMatIndices.rowIdx++;
        triedCols = [];
        newMatIndices.colIdx = 0;
      }
    }
    newNode = getNode(targetLevel, newMatIndices, currentSite);
  }

  const newNodeHud = getNodeHud(newMatIndices);

  return {
    newLevel: targetLevel,
    node: newNode,
    newNodeHud: newNodeHud,
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
  let newNode: NodeDataType | "UNKNOWN";
  let newLevel = level;
  let newMatIndices = Object.assign({}, nodeMatrixIndices);

  if (direction === "down") {
    newMatIndices.rowIdx++;

    let triedCols: number[] = [];

    if (newMatIndices.rowIdx > 2) {
      newMatIndices.rowIdx = 0;
      newLevel = level - 1;
    }

    newNode = getNode(newLevel, newMatIndices, currentSite);

    while (!isNodeVisible(newNode, gameProgress)) {
      if (triedCols.length < 4) {
        triedCols.push(newMatIndices.colIdx);
        const colToTry = tryCol(newMatIndices.colIdx, triedCols);
        if (colToTry !== undefined) {
          newMatIndices.colIdx = colToTry;
        }
      } else {
        if (newMatIndices.rowIdx === 2) {
          if (newLevel === level - 1) {
            newNode = "UNKNOWN";
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
      newNode = getNode(newLevel, newMatIndices, currentSite);
    }
  } else if (direction === "up") {
    newMatIndices.rowIdx--;

    let triedCols: number[] = [];

    if (newMatIndices.rowIdx < 0) {
      newMatIndices.rowIdx = 2;
      newLevel = level + 1;
    }

    newNode = getNode(newLevel, newMatIndices, currentSite);

    while (!isNodeVisible(newNode, gameProgress)) {
      if (triedCols.length < 4) {
        triedCols.push(newMatIndices.colIdx);
        const colToTry = tryCol(newMatIndices.colIdx, triedCols);
        if (colToTry !== undefined) {
          newMatIndices.colIdx = colToTry;
        }
      } else {
        if (newMatIndices.rowIdx === 0) {
          if (newLevel === level + 1) {
            newNode = "UNKNOWN";
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
      newNode = getNode(newLevel, newMatIndices, currentSite);
    }
  }

  return {
    node: newNode!,
    newNodeHud: getNodeHud(newMatIndices),
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
  let newNode: NodeDataType | "UNKNOWN";
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

    newNode = getNode(level, newMatIndices, currentSite);

    while (!isNodeVisible(newNode, gameProgress)) {
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
            newNode = "UNKNOWN";
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
      newNode = getNode(level, newMatIndices, currentSite);
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

    newNode = getNode(level, newMatIndices, currentSite);

    while (!isNodeVisible(newNode, gameProgress)) {
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
            newNode = "UNKNOWN";
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
      newNode = getNode(level, newMatIndices, currentSite);
    }
  }

  const newNodeHud = getNodeHud(newMatIndices);

  return {
    didMove: didMove,
    node: newNode!,
    newNodeHud: newNodeHud,
    newNodeMatrixIndices: newMatIndices,
  };
};

const nodeSelector = (context: NodeSelectorContext) => {
  let newNodeData;
  let move;

  switch (context.action) {
    case "site_left":
    case "site_right":
      const t =
        context.action === "site_right"
          ? findNodeRight(
              context.nodeMatrixIndices,
              context.level,
              context.currentSite,
              context.gameProgress
            )
          : findNodeLeft(
              context.nodeMatrixIndices,
              context.level,
              context.currentSite,
              context.gameProgress
            );

      move = context.action === "site_left" ? "left" : "right";
      newNodeData = findNodeHorizontal(
        move,
        context.gameProgress,
        context.level,
        context.activeId,
        context.nodeMatrixIndices,
        context.currentSite
      );

      console.log(t!.matrixIndices);
      if (newNodeData) {
        const siteRotYModifier = move === "left" ? Math.PI / 4 : -Math.PI / 4;

        return {
          event: newNodeData.didMove ? context.action : "change_node",
          node: getNodeById(t!.node, context.currentSite),
          newActiveHud: newNodeData.newNodeHud,
          newNodeMatrixIndices: t!.matrixIndices,
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
          node: newNodeData.node,
          newNodeMatrixIndices: newNodeData.newNodeMatrixIndices,
          newActiveHud: newNodeData.newNodeHud,
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
          node: newNodeData.node,
          nodeMatrixIndices: newNodeData.newNodeMatrixIndices,
          activeHud: newNodeData.newNodeHud,
          siteRotY: context.siteRotY,
          level: newNodeData.newLevel,
          sitePosY: newNodeData.newSitePosY,
        };
      }
  }
};

export default nodeSelector;
