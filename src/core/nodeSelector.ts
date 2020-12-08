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

const nodeSelector = (context: NodeSelectorContext) => {
  const unlockedNodes = context.unlockedNodes;

  switch (context.keyPress) {
    case "LEFT":
      let newNodeColIdx = context.nodeColIdx - 1;
      if (newNodeColIdx < 0) {
        const event = "move_left";
        const newNodeMatIdx =
          context.nodeMatIdx + 1 > 8 ? 1 : context.nodeMatIdx + 1;
        const newSiteRotY = context.siteRotY + Math.PI / 4;

        newNodeColIdx = 0;
        let newNodeRowIdx = context.nodeRowIdx;

        let newNodeId = getNodeId(
          context.level,
          newNodeMatIdx,
          newNodeRowIdx,
          newNodeColIdx
        );

        let triedRows: number[] = [];

        while (!isNodeVisible(newNodeId, unlockedNodes)) {
          if (triedRows.length < 3) {
            triedRows.push(newNodeRowIdx);
            if (newNodeRowIdx === 1 && !triedRows.includes(0))
              newNodeRowIdx = 0;
            else if (newNodeRowIdx === 1 && !triedRows.includes(2))
              newNodeRowIdx = 2;
            else if (newNodeRowIdx === 2 && !triedRows.includes(0))
              newNodeRowIdx = 0;
            else if (newNodeRowIdx === 2 && !triedRows.includes(1))
              newNodeRowIdx = 1;
            else if (newNodeRowIdx === 0 && !triedRows.includes(1))
              newNodeRowIdx = 1;
            else if (newNodeRowIdx === 0 && !triedRows.includes(2))
              newNodeRowIdx = 2;
          } else {
            if (newNodeColIdx === 3) {
              newNodeId = getNodeId(
                context.level,
                newNodeMatIdx,
                newNodeRowIdx,
                newNodeColIdx
              );
            } else {
              newNodeColIdx++;
              triedRows = [];
              newNodeRowIdx = 0;
            }
          }
          newNodeId = getNodeId(
            context.level,
            newNodeMatIdx,
            newNodeRowIdx,
            newNodeColIdx
          );
        }

        return {
          event: event,
          newNodeMatIdx: newNodeMatIdx,
          newNodeRowIdx: newNodeRowIdx,
          newNodeColIdx: newNodeColIdx,
          newSiteRotY: newSiteRotY,
          newSitePosY: context.sitePosY,
          newLevel: context.level,
        };
      } else {
        let event = "change_node";

        let newNodeRowIdx = context.nodeRowIdx;

        let newNodeMatIdx = context.nodeMatIdx;
        let newSiteRotY = context.siteRotY;

        let newNodeId = getNodeId(
          context.level,
          newNodeMatIdx,
          newNodeRowIdx,
          newNodeColIdx
        );

        let triedRows: number[] = [];

        while (!isNodeVisible(newNodeId, unlockedNodes)) {
          if (triedRows.length < 3) {
            triedRows.push(newNodeRowIdx);
            if (newNodeRowIdx === 1 && !triedRows.includes(0))
              newNodeRowIdx = 0;
            else if (newNodeRowIdx === 1 && !triedRows.includes(2))
              newNodeRowIdx = 2;
            else if (newNodeRowIdx === 2 && !triedRows.includes(0))
              newNodeRowIdx = 0;
            else if (newNodeRowIdx === 2 && !triedRows.includes(1))
              newNodeRowIdx = 1;
            else if (newNodeRowIdx === 0 && !triedRows.includes(1))
              newNodeRowIdx = 1;
            else if (newNodeRowIdx === 0 && !triedRows.includes(2))
              newNodeRowIdx = 2;
          } else {
            if (newNodeColIdx === 0) {
              newNodeId = getNodeId(
                context.level,
                newNodeMatIdx,
                newNodeRowIdx,
                newNodeColIdx
              );
            } else {
              newNodeColIdx--;
              triedRows = [];
              newNodeRowIdx = 0;
            }
          }
          newNodeId = getNodeId(
            context.level,
            newNodeMatIdx,
            newNodeRowIdx,
            newNodeColIdx
          );
        }

        return {
          event: event,
          newNodeMatIdx: newNodeMatIdx,
          newNodeRowIdx: newNodeRowIdx,
          newNodeColIdx: newNodeColIdx,
          newSiteRotY: newSiteRotY,
          newSitePosY: context.sitePosY,
          newLevel: context.level,
        };
      }
  }
};

export default nodeSelector;
