import {
  NodeDataType,
  SiteType,
} from "../components/MainScene/SyncedComponents/Site";
import node_matrices from "../resources/node_matrices.json";
import game_progress from "../resources/initial_progress.json";
import unlocked_nodes from "../resources/initial_progress.json";
import node_huds from "../resources/node_huds.json";
import site_a from "../resources/site_a.json";
import site_b from "../resources/site_b.json";

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

export const getNodeById = (id: string, currentSite: string) => {
  const siteData = currentSite === "a" ? site_a : site_b;
  const level = id.substr(0, 2);
  return (siteData as SiteType)[level][id];
};
export const getNodeHud = (nodeMatrixIndices: {
  matrixIdx: number;
  rowIdx: number;
  colIdx: number;
}) => {
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

  return node_huds[
    hudAssocs[
      `${nodeMatrixIndices.rowIdx}${nodeMatrixIndices.colIdx}` as keyof typeof hudAssocs
    ] as keyof typeof node_huds
  ];
};
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

function reorder<T>(array: T[], order: number[]): T[] {
  return order.map((i) => array[i]);
}

function transpose<T>(matrix: T[][]): T[][] {
  return Object.keys(matrix[0])
    .map(Number)
    .map((c: number) => matrix.map((r: T[]) => r[c]));
}

function RowPrecedence(rowIdx: number): number[] {
  switch (rowIdx) {
    default:
    case 0:
      return [0, 1, 2];
    case 1:
      return [1, 0, 2];
    case 2:
      return [2, 1, 0];
  }
}

function ColPrecedence(colIdx: number): number[] {
  switch (colIdx) {
    default:
    case 0:
      return [0, 1, 2, 3];
    case 1:
      return [1, 0, 2, 3];
    case 2:
      return [2, 1, 3, 0];
    case 3:
      return [3, 2, 1, 0];
  }
}

function getNodesMatrixWithIndices(
  matrixIdx: number,
  activeLevel: number,
  currentSite: string,
  gameProgress: any
): any[][] {
  return getVisibleNodesMatrix(
    matrixIdx,
    activeLevel,
    currentSite,
    gameProgress
  ).map((r, i) =>
    r.map((n, j) =>
      n
        ? {
            node: n,
            matrixIndices: {
              matrixIdx,
              rowIdx: i,
              colIdx: j,
            },
          }
        : null
    )
  );
}

interface NodeMatrixIndices {
  matrixIdx: number;
  rowIdx: number;
  colIdx: number;
}

function findNode_current(
  direction: string,
  { matrixIdx, rowIdx, colIdx }: NodeMatrixIndices,
  level: number,
  currentSite: string,
  gameProgress: any
): any | undefined {
  const nodes = getNodesMatrixWithIndices(
    matrixIdx,
    level,
    currentSite,
    gameProgress
  );

  const filters: any = {
    left: () =>
      transpose(
        reorder(nodes, RowPrecedence(rowIdx)).map((r) =>
          r.slice(0, colIdx).reverse()
        )
      ).flat(),

    right: () =>
      transpose(
        reorder(nodes, RowPrecedence(rowIdx)).map((r) => r.slice(colIdx + 1))
      ).flat(),

    up: () =>
      nodes
        .slice(0, rowIdx)
        .reverse()
        .flatMap((r) => reorder(r, ColPrecedence(colIdx))),

    down: () =>
      nodes.slice(rowIdx + 1).flatMap((r) => reorder(r, ColPrecedence(colIdx))),
  };

  const chosen = filters[direction]().find((e: any) => e);
  if (chosen) return { ...chosen, didMove: false };
}

function findNode_next(
  direction: string,
  { matrixIdx, rowIdx, colIdx }: NodeMatrixIndices,
  level: number,
  currentSite: string,
  gameProgress: any
): any | undefined {
  const funcs: any = {
    left: {
      getMatrix: () =>
        getNodesMatrixWithIndices(
          matrixIdx + 1 > 8 ? 1 : matrixIdx + 1,
          level,
          currentSite,
          gameProgress
        ),

      filter: (ns: any[]) =>
        transpose(reorder(ns, RowPrecedence(rowIdx))).flat(),
    },

    right: {
      getMatrix: () =>
        getNodesMatrixWithIndices(
          matrixIdx - 1 < 1 ? 8 : matrixIdx - 1,
          level,
          currentSite,
          gameProgress
        ),

      filter: (ns: any[]) =>
        transpose(
          reorder(ns, RowPrecedence(rowIdx)).map((r) => [...r].reverse())
        ).flat(),
    },

    up: {
      getMatrix: () =>
        getNodesMatrixWithIndices(
          matrixIdx,
          level + 1,
          currentSite,
          gameProgress
        ),

      filter: (ns: any[]) =>
        ns.reverse().flatMap((r) => reorder(r, ColPrecedence(colIdx))),
    },

    down: {
      getMatrix: () =>
        getNodesMatrixWithIndices(
          matrixIdx,
          level - 1,
          currentSite,
          gameProgress
        ),

      filter: (ns: any[]) =>
        ns.flatMap((r) => reorder(r, ColPrecedence(colIdx))),
    },
  };

  const { getMatrix, filter } = funcs[direction];

  const chosen = filter(getMatrix()).find((e: any) => e);
  if (chosen) return { ...chosen, didMove: true };
}

export function findNode(
  ...args: [string, NodeMatrixIndices, number, string, any]
): any | undefined {
  return findNode_current(...args) ?? findNode_next(...args);
}

export const filterInvisibleNodes = (
  siteData: SiteType,
  gameProgress: typeof game_progress
) => {
  const visibleNodes: SiteType = {};
  Object.entries(siteData).forEach((level) => {
    visibleNodes[level[0]] = {};
    Object.entries(level[1]).forEach((node) => {
      if (isNodeVisible(node[1], gameProgress)) {
        visibleNodes[level[0]][node[0]] = node[1];
      }
    });
  });

  return visibleNodes;
};
