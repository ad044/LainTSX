import { SiteType } from "../../components/MainScene/SyncedComponents/Site";
import node_matrices from "../../resources/node_matrices.json";
import { getNode, getNodeById, isNodeVisible } from "../nodeSelector";

export const generateInactiveNodes = (
  visibleNodes: SiteType,
  activeLevel: string
) => {
  const obj = {};
  const activeLevelNr = parseInt(activeLevel);
  const visibleLevels = [
    (activeLevelNr - 2).toString().padStart(2, "0"),
    (activeLevelNr - 1).toString().padStart(2, "0"),
    (activeLevelNr + 1).toString().padStart(2, "0"),
    (activeLevelNr + 2).toString().padStart(2, "0"),
  ];

  visibleLevels.forEach((level) => {
    Object.assign(obj, visibleNodes[level as keyof typeof visibleNodes]);
  });

  return obj;
};

export const getVisibleNodesMatrix = (
  matrixIdx: number,
  activeLevel: number,
  currentSite: string,
  gameProgress: any
) => {
  const formattedLevel = activeLevel.toString().padStart(2, "0");
  const currentMatrix =
    node_matrices[matrixIdx.toString() as keyof typeof node_matrices];

  return currentMatrix.map((row: string[]) =>
    row.map((nodePos: string) => {
      const nodeId = formattedLevel + nodePos;
      if (isNodeVisible(getNodeById(nodeId, currentSite), gameProgress))
        return nodeId;
      else return undefined;
    })
  );
};

const generateRowPrecedence = (rowIdx: number) => {
  switch (rowIdx) {
    case 0:
      return [0, 1, 2];
    case 1:
      return [1, 0, 2];
    case 2:
      return [2, 1, 0];
    default:
      return [0, 1, 2];
  }
};

export const findNodeLeft = (
  nodeMatrixIndices: {
    matrixIdx: number;
    rowIdx: number;
    colIdx: number;
  },
  level: number,
  currentSite: string,
  gameProgress: any
) => {
  const { matrixIdx, rowIdx, colIdx } = nodeMatrixIndices;

  const visibleNodes = getVisibleNodesMatrix(
    matrixIdx,
    level,
    currentSite,
    gameProgress
  );

  const precedence = generateRowPrecedence(rowIdx);

  let chosenNode;
  let matrixIndices;
  loop: for (let col = colIdx - 1; col > -1; col--) {
    for (let i = 0; i < 3; i++) {
      const current = visibleNodes[precedence[i]][col];
      if (current) {
        chosenNode = current;
        matrixIndices = {
          matrixIdx: matrixIdx,
          rowIdx: precedence[i],
          colIdx: col,
        };
        break loop;
      }
    }
  }

  if (chosenNode) {
    return {
      node: chosenNode,
      matrixIndices: matrixIndices,
      didRotate: false,
    };
  } else {
    const newMatrixIdx = matrixIdx + 1 > 8 ? 1 : matrixIdx + 1;
    const visibleNodes = getVisibleNodesMatrix(
      newMatrixIdx,
      level,
      currentSite,
      gameProgress
    );

    loop: for (let col = 0; col < 4; col++) {
      for (let i = 0; i < 3; i++) {
        const current = visibleNodes[precedence[i]][col];
        if (current) {
          chosenNode = current;
          matrixIndices = {
            matrixIdx: newMatrixIdx,
            rowIdx: precedence[i],
            colIdx: col,
          };
          break loop;
        }
      }
    }

    if (chosenNode)
      return {
        node: chosenNode,
        matrixIndices: matrixIndices,
        didRotate: true,
      };
  }
};

export const findNodeRight = (
  nodeMatrixIndices: {
    matrixIdx: number;
    rowIdx: number;
    colIdx: number;
  },
  level: number,
  currentSite: string,
  gameProgress: any
) => {
  const { matrixIdx, rowIdx, colIdx } = nodeMatrixIndices;

  const visibleNodes = getVisibleNodesMatrix(
    matrixIdx,
    level,
    currentSite,
    gameProgress
  );

  const precedence = generateRowPrecedence(rowIdx);

  let chosenNode;
  let matrixIndices;
  loop: for (let col = colIdx + 1; col < 4; col++) {
    for (let i = 0; i < 3; i++) {
      const current = visibleNodes[precedence[i]][col];
      if (current) {
        chosenNode = current;
        matrixIndices = {
          matrixIdx: matrixIdx,
          rowIdx: precedence[i],
          colIdx: col,
        };
        break loop;
      }
    }
  }

  if (chosenNode) {
    return { node: chosenNode, didRotate: false, matrixIndices: matrixIndices };
  } else {
    const newMatrixIdx = matrixIdx - 1 < 1 ? 8 : matrixIdx - 1;
    const visibleNodes = getVisibleNodesMatrix(
      newMatrixIdx,
      level,
      currentSite,
      gameProgress
    );

    loop: for (let col = 3; col > -1; col--) {
      for (let i = 0; i < 3; i++) {
        const current = visibleNodes[precedence[i]][col];
        if (current) {
          chosenNode = current;
          matrixIndices = {
            matrixIdx: newMatrixIdx,
            rowIdx: precedence[i],
            colIdx: col,
          };
          break loop;
        }
      }
    }

    if (chosenNode)
      return {
        node: chosenNode,
        matrixIndices: matrixIndices,
        didRotate: true,
      };
  }
};
