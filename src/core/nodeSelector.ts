import node_matrices from "../resources/node_matrices.json";
import site_a from "../resources/site_a.json";
import { SiteType } from "../components/MainScene/Site";
import unlocked_nodes from "../resources/unlocked_nodes.json";
import level_y_values from "../resources/level_y_values.json";

type NodeSelectorContext = {
  action: string;
  nodeMatIdx: number;
  nodeColIdx: number;
  nodeRowIdx: number;
  level: number;
  siteRotY: number;
  sitePosY: number;
  unlockedNodes: typeof unlocked_nodes;
};

const getNodeId = (
  level: number,
  nodeMatIdx: number,
  nodeRowIdx: number,
  nodeColIdx: number
) =>
  level.toString().padStart(2, "0") +
  node_matrices[nodeMatIdx.toString() as keyof typeof node_matrices][
    nodeRowIdx
  ][nodeColIdx];

const isNodeVisible = (
  nodeId: string,
  unlockedNodes: typeof unlocked_nodes
) => {
  const nodeLevel = nodeId.substr(0, 2);
  const nodeData = (site_a as SiteType)[nodeLevel][nodeId];
  if (nodeData) {
    const unlockedBy = nodeData.unlocked_by;

    let unlocked;
    if (unlockedBy === "-1") unlocked = true;
    else
      unlocked =
        unlockedNodes[unlockedBy as keyof typeof unlockedNodes].unlocked;

    // ishidden checker needs tweaking, this is temp
    return (
      unlocked && (nodeData.is_hidden === "0" || nodeData.is_hidden === "3")
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
  unlockedNodes: typeof unlocked_nodes,
  targetLevel: number,
  nodeMatIdx: number,
  nodeRowIdx: number,
  nodeColIdx: number
) => {
  let newNodeRowIdx = nodeRowIdx;
  let newNodeMatIdx = nodeMatIdx;
  let newNodeColIdx = nodeColIdx;

  let triedCols: number[] = [];

  let newNodeId = getNodeId(
    targetLevel,
    newNodeMatIdx,
    newNodeRowIdx,
    newNodeColIdx
  );

  while (!isNodeVisible(newNodeId, unlockedNodes)) {
    if (triedCols.length < 4) {
      triedCols.push(newNodeColIdx);
      const colToTry = tryCol(newNodeColIdx, triedCols);
      if (colToTry !== undefined) {
        newNodeColIdx = colToTry;
      }
    } else {
      newNodeRowIdx++;
      triedCols = [];
      newNodeColIdx = 0;
    }
    newNodeId = getNodeId(
      targetLevel,
      newNodeMatIdx,
      newNodeRowIdx,
      newNodeColIdx
    );
  }

  return {
    newLevel: targetLevel,
    newNodeId: newNodeId,
    newNodeRowIdx: newNodeRowIdx,
    newNodeColIdx: newNodeColIdx,
    newSitePosY:
      level_y_values[
        targetLevel.toString().padStart(0, "2") as keyof typeof level_y_values
      ],
  };
};

const findNodeVertical = (
  direction: string,
  unlockedNodes: typeof unlocked_nodes,
  level: number,
  nodeMatIdx: number,
  nodeRowIdx: number,
  nodeColIdx: number
) => {
  let newNodeId;
  let newLevel = level;
  let newNodeRowIdx = nodeRowIdx;
  let newNodeMatIdx = nodeMatIdx;
  let newNodeColIdx = nodeColIdx;

  if (direction === "down") {
    newNodeRowIdx++;

    let triedCols: number[] = [];

    if (newNodeRowIdx > 2) {
      newNodeRowIdx = 0;
      newLevel = level - 1;
    }

    newNodeId = getNodeId(
      newLevel,
      newNodeMatIdx,
      newNodeRowIdx,
      newNodeColIdx
    );

    while (!isNodeVisible(newNodeId, unlockedNodes)) {
      if (triedCols.length < 4) {
        triedCols.push(newNodeColIdx);
        const colToTry = tryCol(newNodeColIdx, triedCols);
        if (colToTry !== undefined) {
          newNodeColIdx = colToTry;
        }
      } else {
        if (newNodeRowIdx === 2) {
          newNodeRowIdx = 0;
          newLevel = level - 1;
        } else {
          newNodeRowIdx++;
          triedCols = [];
          newNodeColIdx = 0;
        }
      }
      newNodeId = getNodeId(
        newLevel,
        newNodeMatIdx,
        newNodeRowIdx,
        newNodeColIdx
      );
    }
  } else if (direction === "up") {
    newNodeRowIdx--;

    let triedCols: number[] = [];

    if (newNodeRowIdx < 0) {
      newNodeRowIdx = 2;
      newLevel = level + 1;
    }

    newNodeId = getNodeId(
      newLevel,
      newNodeMatIdx,
      newNodeRowIdx,
      newNodeColIdx
    );

    while (!isNodeVisible(newNodeId, unlockedNodes)) {
      if (triedCols.length < 4) {
        triedCols.push(newNodeColIdx);
        const colToTry = tryCol(newNodeColIdx, triedCols);
        if (colToTry !== undefined) {
          newNodeColIdx = colToTry;
        }
      } else {
        if (newNodeRowIdx === 0) {
          newNodeRowIdx = 2;
          newLevel = level + 1;
        } else {
          newNodeRowIdx--;
          triedCols = [];
          newNodeColIdx = 0;
        }
      }
      newNodeId = getNodeId(
        newLevel,
        newNodeMatIdx,
        newNodeRowIdx,
        newNodeColIdx
      );
    }
  }
  return {
    newNodeId: newNodeId,
    newLevel: newLevel,
    newNodeRowIdx: newNodeRowIdx,
    newNodeColIdx: newNodeColIdx,
  };
};

const findNodeHorizontal = (
  direction: string,
  unlockedNodes: typeof unlocked_nodes,
  level: number,
  nodeMatIdx: number,
  nodeRowIdx: number,
  nodeColIdx: number
) => {
  let newNodeId;
  let newNodeRowIdx = nodeRowIdx;
  let newNodeMatIdx = nodeMatIdx;
  let newNodeColIdx = nodeColIdx;
  if (direction === "left") {
    let didMove = false;

    newNodeColIdx--;

    let triedRows: number[] = [];

    if (newNodeColIdx < 0) {
      newNodeColIdx = 0;
      newNodeMatIdx = nodeMatIdx + 1 > 8 ? 1 : nodeMatIdx + 1;
    }

    newNodeId = getNodeId(level, newNodeMatIdx, newNodeRowIdx, newNodeColIdx);

    while (!isNodeVisible(newNodeId, unlockedNodes)) {
      if (triedRows.length < 3) {
        triedRows.push(newNodeRowIdx);
        const rowToTry = tryRow(newNodeRowIdx, triedRows);
        if (rowToTry !== undefined) {
          newNodeRowIdx = rowToTry;
        }
      } else {
        if (newNodeColIdx < 0) {
          didMove = true;
          newNodeColIdx = 0;
          newNodeMatIdx = nodeMatIdx + 1 > 8 ? 1 : nodeMatIdx + 1;
        } else {
          didMove ? newNodeColIdx++ : newNodeColIdx--;
          triedRows = [];
          newNodeRowIdx = 0;
        }
      }
      newNodeId = getNodeId(level, newNodeMatIdx, newNodeRowIdx, newNodeColIdx);
    }
  } else if (direction === "right") {
    let didMove = false;

    newNodeColIdx++;

    let triedRows: number[] = [];

    if (newNodeColIdx > 3) {
      newNodeColIdx = 3;
      newNodeMatIdx = nodeMatIdx - 1 < 1 ? 8 : nodeMatIdx - 1;
    }

    newNodeId = getNodeId(level, newNodeMatIdx, newNodeRowIdx, newNodeColIdx);

    while (!isNodeVisible(newNodeId, unlockedNodes)) {
      if (triedRows.length < 3) {
        triedRows.push(newNodeRowIdx);
        const rowToTry = tryRow(newNodeRowIdx, triedRows);
        if (rowToTry !== undefined) {
          newNodeRowIdx = rowToTry;
        }
      } else {
        if (newNodeColIdx > 3) {
          didMove = true;
          newNodeColIdx = 3;
          newNodeMatIdx = nodeMatIdx - 1 < 1 ? 8 : nodeMatIdx - 1;
        } else {
          didMove ? newNodeColIdx-- : newNodeColIdx++;
          triedRows = [];
          newNodeRowIdx = 0;
        }
      }
      newNodeId = getNodeId(level, newNodeMatIdx, newNodeRowIdx, newNodeColIdx);
    }
  }

  return {
    newNodeId: newNodeId,
    newNodeMatIdx: newNodeMatIdx,
    newNodeRowIdx: newNodeRowIdx,
    newNodeColIdx: newNodeColIdx,
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
        context.unlockedNodes,
        context.level,
        context.nodeMatIdx,
        context.nodeRowIdx,
        context.nodeColIdx
      );

      if (newNodeData) {
        const didMove = context.nodeMatIdx !== newNodeData.newNodeMatIdx;
        const siteRotYModifier = move === "left" ? Math.PI / 4 : -Math.PI / 4;

        return {
          event: didMove ? context.action : "change_node",
          newActiveNodeId: newNodeData.newNodeId,
          newNodeMatIdx: newNodeData.newNodeMatIdx,
          newNodeRowIdx: newNodeData.newNodeRowIdx,
          newNodeColIdx: newNodeData.newNodeColIdx,
          newSiteRotY: didMove
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
        context.unlockedNodes,
        context.level,
        context.nodeMatIdx,
        context.nodeRowIdx,
        context.nodeColIdx
      );

      if (newNodeData) {
        const didMove = context.level !== newNodeData.newLevel;
        const sitePosYModifier = move === "up" ? -1.5 : 1.5;
        return {
          event: didMove ? context.action : "change_node",
          newActiveNodeId: newNodeData.newNodeId,
          newNodeMatIdx: context.nodeMatIdx,
          newNodeRowIdx: newNodeData.newNodeRowIdx,
          newNodeColIdx: newNodeData.newNodeColIdx,
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
        context.unlockedNodes,
        context.level,
        context.nodeMatIdx,
        context.nodeRowIdx,
        context.nodeColIdx
      );

      if (newNodeData) {
        return {
          newActiveNodeId: newNodeData.newNodeId,
          newNodeMatIdx: context.nodeMatIdx,
          newNodeRowIdx: newNodeData.newNodeRowIdx,
          newNodeColIdx: newNodeData.newNodeColIdx,
          newSitePosY: newNodeData.newSitePosY,
          newLevel: newNodeData.newLevel,
        };
      }
  }
};

export default nodeSelector;
