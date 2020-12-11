import node_matrices from "../resources/node_matrices.json";
import site_a from "../resources/site_a.json";
import { SiteType } from "../components/MainScene/Site";
import unlocked_nodes from "../resources/unlocked_nodes.json";

type NodeSelectorContext = {
  keyPress: string;
  nodeMatIdx: number;
  nodeColIdx: number;
  nodeRowIdx: number;
  level: string;
  siteRotY: number;
  sitePosY: number;
  unlockedNodes: typeof unlocked_nodes;
};

const getNodeId = (
  level: string,
  nodeMatIdx: number,
  nodeRowIdx: number,
  nodeColIdx: number
) =>
  level +
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

const findNodeVertical = (
  direction: string,
  unlockedNodes: typeof unlocked_nodes,
  level: string,
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
      newLevel = (parseInt(level) - 1).toString().padStart(2, "0");
    }

    let newNodeId = getNodeId(
      newLevel,
      newNodeMatIdx,
      newNodeRowIdx,
      newNodeColIdx
    );

    while (!isNodeVisible(newNodeId, unlockedNodes)) {
      if (triedCols.length < 4) {
        triedCols.push(newNodeColIdx);
        if (newNodeColIdx === 1 && !triedCols.includes(0)) newNodeColIdx = 0;
        else if (newNodeColIdx === 1 && !triedCols.includes(2))
          newNodeColIdx = 2;
        else if (newNodeColIdx === 1 && !triedCols.includes(3))
          newNodeColIdx = 3;
        else if (newNodeColIdx === 2 && !triedCols.includes(1))
          newNodeColIdx = 1;
        else if (newNodeColIdx === 2 && !triedCols.includes(3))
          newNodeColIdx = 3;
        else if (newNodeColIdx === 2 && !triedCols.includes(0))
          newNodeColIdx = 0;
        else if (newNodeColIdx === 3 && !triedCols.includes(2))
          newNodeColIdx = 2;
        else if (newNodeColIdx === 3 && !triedCols.includes(1))
          newNodeColIdx = 1;
        else if (newNodeColIdx === 3 && !triedCols.includes(0))
          newNodeColIdx = 0;
        else if (newNodeColIdx === 0 && !triedCols.includes(1))
          newNodeColIdx = 1;
        else if (newNodeColIdx === 0 && !triedCols.includes(2))
          newNodeColIdx = 2;
        else if (newNodeColIdx === 0 && !triedCols.includes(3))
          newNodeColIdx = 3;
      } else {
        if (newNodeRowIdx === 2) {
          newNodeRowIdx = 0;
          newLevel = (parseInt(level) - 1).toString().padStart(2, "0");
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
      newLevel = (parseInt(level) + 1).toString().padStart(2, "0");
    }

    let newNodeId = getNodeId(
      newLevel,
      newNodeMatIdx,
      newNodeRowIdx,
      newNodeColIdx
    );

    while (!isNodeVisible(newNodeId, unlockedNodes)) {
      if (triedCols.length < 4) {
        triedCols.push(newNodeColIdx);
        if (newNodeColIdx === 1 && !triedCols.includes(0)) newNodeColIdx = 0;
        else if (newNodeColIdx === 1 && !triedCols.includes(2))
          newNodeColIdx = 2;
        else if (newNodeColIdx === 1 && !triedCols.includes(3))
          newNodeColIdx = 3;
        else if (newNodeColIdx === 2 && !triedCols.includes(1))
          newNodeColIdx = 1;
        else if (newNodeColIdx === 2 && !triedCols.includes(3))
          newNodeColIdx = 3;
        else if (newNodeColIdx === 2 && !triedCols.includes(0))
          newNodeColIdx = 0;
        else if (newNodeColIdx === 3 && !triedCols.includes(2))
          newNodeColIdx = 2;
        else if (newNodeColIdx === 3 && !triedCols.includes(1))
          newNodeColIdx = 1;
        else if (newNodeColIdx === 3 && !triedCols.includes(0))
          newNodeColIdx = 0;
        else if (newNodeColIdx === 0 && !triedCols.includes(1))
          newNodeColIdx = 1;
        else if (newNodeColIdx === 0 && !triedCols.includes(2))
          newNodeColIdx = 2;
        else if (newNodeColIdx === 0 && !triedCols.includes(3))
          newNodeColIdx = 3;
      } else {
        if (newNodeRowIdx === 0) {
          newNodeRowIdx = 2;
          newLevel = (parseInt(level) + 1).toString().padStart(2, "0");
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

const tryRow = (row: number, triedRows: number[]) => {
  console.log(row);
  console.log(triedRows);
  if (row === 1 && !triedRows.includes(0)) return 0;
  else if (row === 1 && !triedRows.includes(2)) return 2;
  else if (row === 2 && !triedRows.includes(0)) return 0;
  else if (row === 2 && !triedRows.includes(1)) return 1;
  else if (row === 0 && !triedRows.includes(1)) return 1;
  else if (row === 0 && !triedRows.includes(2)) return 2;
};

const findNode = (
  direction: string,
  unlockedNodes: typeof unlocked_nodes,
  level: string,
  nodeMatIdx: number,
  nodeRowIdx: number,
  nodeColIdx: number
) => {
  let newNodeId;
  let newNodeRowIdx = nodeRowIdx;
  let newNodeMatIdx = nodeMatIdx;
  let newNodeColIdx = nodeColIdx;
  if (direction === "left") {
    newNodeColIdx--;

    let triedRows: number[] = [];

    if (newNodeColIdx < 0) {
      newNodeColIdx = 0;
      newNodeMatIdx = nodeMatIdx + 1 > 8 ? 1 : nodeMatIdx + 1;
    }

    let newNodeId = getNodeId(
      level,
      newNodeMatIdx,
      newNodeRowIdx,
      newNodeColIdx
    );

    while (!isNodeVisible(newNodeId, unlockedNodes)) {
      if (triedRows.length < 3) {
        triedRows.push(newNodeRowIdx);
        const newTry = tryRow(newNodeRowIdx, triedRows);
        if (newTry !== undefined) {
          newNodeRowIdx = newTry;
        }
      } else {
        if (newNodeColIdx === 0) {
          newNodeColIdx = 0;
          newNodeMatIdx = nodeMatIdx + 1 > 8 ? 1 : nodeMatIdx + 1;
        } else {
          newNodeColIdx--;
          triedRows = [];
          newNodeRowIdx = 0;
        }
      }
      newNodeId = getNodeId(level, newNodeMatIdx, newNodeRowIdx, newNodeColIdx);
    }
  } else if (direction === "right") {
    newNodeColIdx++;

    let triedRows: number[] = [];

    if (newNodeColIdx > 3) {
      newNodeColIdx = 3;
      newNodeMatIdx = nodeMatIdx - 1 < 1 ? 8 : nodeMatIdx - 1;
    }

    let newNodeId = getNodeId(
      level,
      newNodeMatIdx,
      newNodeRowIdx,
      newNodeColIdx
    );

    while (!isNodeVisible(newNodeId, unlockedNodes)) {
      if (triedRows.length < 3) {
        triedRows.push(newNodeRowIdx);
        const newTry = tryRow(newNodeRowIdx, triedRows);
        if (newTry !== undefined) {
          newNodeRowIdx = newTry;
        }
      } else {
        if (newNodeColIdx === 3) {
          newNodeColIdx = 3;
          newNodeMatIdx = nodeMatIdx - 1 < 1 ? 8 : nodeMatIdx - 1;
        } else {
          newNodeColIdx++;
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
  const move = context.keyPress.toLowerCase();

  switch (context.keyPress) {
    case "LEFT":
    case "RIGHT":
      newNodeData = findNode(
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
          event: didMove ? `move_${move}` : "change_node",
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
    case "DOWN":
    case "UP":
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
          event: didMove ? `move_${move}` : "change_node",
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
  }
};

export default nodeSelector;
