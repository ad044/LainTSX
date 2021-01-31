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

function reorder<T>(array: T[], order: number[]): T[]
{
    return order.map(i => array[i]);
}

function RowPrecedence(rowIdx: number): number[]
{
    switch (rowIdx) {
        default: case 0: return [0, 1, 2];
                 case 1: return [1, 0, 2];
                 case 2: return [2, 1, 0];
    }
};

function ColPrecedence(colIdx: number): number[]
{
    switch (colIdx) {
        default: case 0: return [0, 1, 2, 3];
                 case 1: return [1, 0, 2, 3];
                 case 2: return [2, 1, 3, 0];
                 case 3: return [3, 2, 1, 0];
    }
}

function getNodesMatrixWithIndices
(
  matrixIdx: number,
  activeLevel: number,
  currentSite: string,
  gameProgress: any
)
: any[][]
{
  return getVisibleNodesMatrix(
    matrixIdx,
    activeLevel,
    currentSite,
    gameProgress
  )
  .map(
    (r, i) => r.map(
      (n, j) => n ? {
        node: n,
        matrixIndices: {
          matrixIdx,
          rowIdx: i,
          colIdx: j
        }
      } : null
    )
  );
}

interface NodeMatrixIndices {
    matrixIdx: number;
    rowIdx: number;
    colIdx: number;
}

function findNode_current
(
  direction: string,
  {matrixIdx, rowIdx, colIdx}: NodeMatrixIndices,
  level: number,
  currentSite: string,
  gameProgress: any
)
: any | undefined
{
  const nodes = getNodesMatrixWithIndices(
    matrixIdx,
    level,
    currentSite,
    gameProgress
  );

  const filters: any = {
    left: () => reorder(nodes, RowPrecedence(rowIdx))
      .flatMap(r => r.slice(0, colIdx).reverse()),

    right: () => reorder(nodes, RowPrecedence(rowIdx))
      .flatMap(r => r.slice(colIdx + 1)),

    up: () => nodes.slice(0, rowIdx).reverse()
      .flatMap(r => reorder(r, ColPrecedence(colIdx))),

    down: () => nodes.slice(rowIdx + 1)
      .flatMap(r => reorder(r, ColPrecedence(colIdx)))
  };

  const chosen = filters[direction]().find((e: any) => e);
  if (chosen) return {...chosen, didMove: false};
}

function findNode_next
(
  direction: string,
  {matrixIdx, rowIdx, colIdx}: NodeMatrixIndices,
  level: number,
  currentSite: string,
  gameProgress: any
)
: any | undefined
{
  const funcs: any = {
    left: {
      getMatrix: () => getNodesMatrixWithIndices(
        matrixIdx + 1 > 8 ? 1 : matrixIdx + 1,
        level,
        currentSite,
        gameProgress
      ),

      filter: (ns: any[]) =>
        reorder(ns, RowPrecedence(rowIdx)).flat()
    },

    right: {
      getMatrix: () => getNodesMatrixWithIndices(
        matrixIdx - 1 < 1 ? 8 : matrixIdx - 1,
        level,
        currentSite,
        gameProgress
      ),

      filter: (ns: any[]) => reorder(ns, RowPrecedence(rowIdx))
        .flatMap(r => [...r].reverse())
    },

    up: {
      getMatrix: () => getNodesMatrixWithIndices(
        matrixIdx,
        level + 1,
        currentSite,
        gameProgress
      ),

      filter: (ns: any[]) => ns
        .reverse()
        .flatMap(r => reorder(r, ColPrecedence(colIdx)))
    },

    down: {
      getMatrix: () => getNodesMatrixWithIndices(
        matrixIdx,
        level - 1,
        currentSite,
        gameProgress
      ),

      filter: (ns: any[]) => ns
        .flatMap(r => reorder(r, ColPrecedence(colIdx)))
    }
  };

  const {getMatrix, filter} = funcs[direction];

  const chosen = filter(getMatrix()).find((e: any) => e);
  if (chosen) return {...chosen, didMove: true};
}

export function findNode(...args: [
  string,
  NodeMatrixIndices,
  number,
  string,
  any
])
: any | undefined
{
  return (
    findNode_current(...args) ??
    findNode_next(...args)
  );
}
