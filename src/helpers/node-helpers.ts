import site_a from "../resources/site_a.json";
import site_b from "../resources/site_b.json";
import node_huds from "../resources/node_huds.json";
import unlocked_nodes from "../resources/initial_progress.json";
import node_matrices from "../resources/node_matrices.json";
import {
  ActiveSite,
  GameProgress,
  NodeData,
  NodeMatrixIndices,
  SiteData,
} from "../types/types";

export const generateInactiveNodes = (
  visibleNodes: SiteData,
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

export const getNodeById = (id: string, activeSite: string) => {
  const siteData = activeSite === "a" ? site_a : site_b;
  const level = id.substr(0, 2);
  return (siteData as SiteData)[level][id];
};
export const getNodeHud = (nodeMatrixIndices: NodeMatrixIndices) => {
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
  node: NodeData,
  gameProgress: typeof unlocked_nodes
) => {
  return (() => {
    switch (node.type) {
      // polytan, sskn, gate nodes
      case 7:
      case 8:
      case 9:
        return !gameProgress.nodes[
          node.node_name as keyof typeof gameProgress.nodes
        ].is_viewed;
      // every other node
      default:
        return Boolean(
          (node.unlocked_by === "" ||
            gameProgress.nodes[
              node.unlocked_by as keyof typeof gameProgress.nodes
            ].is_viewed) &&
            (node.required_final_video_viewcount > 0
              ? gameProgress.final_video_viewcount > 0
                ? node.required_final_video_viewcount <=
                  gameProgress.final_video_viewcount + 1
                : false
              : true)
        );
    }
  })();
};

export const getVisibleNodesMatrix = (
  matrixIdx: number,
  activeLevel: number,
  activeSite: ActiveSite,
  gameProgress: GameProgress
) => {
  const formattedLevel = activeLevel.toString().padStart(2, "0");
  const currentMatrix =
    node_matrices[matrixIdx.toString() as keyof typeof node_matrices];

  return currentMatrix.map((row: string[]) =>
    row.map((nodePos: string) => {
      const nodeId = formattedLevel + nodePos;

      const node = getNodeById(nodeId, activeSite);

      if (node && isNodeVisible(node, gameProgress)) return nodeId;
      else return undefined;
    })
  );
};

const RowPrecedence = (rowIdx: number): number[] => {
  switch (rowIdx) {
    default:
    case 0:
      return [0, 1, 2];
    case 1:
      return [1, 0, 2];
    case 2:
      return [2, 1, 0];
  }
};

const ColPrecedence = (colIdx: number): number[] => {
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
};

function* nextPos_left([row, col]: [number, number]) {
  const p = RowPrecedence(row);

  for (let c = col - 1; c > -1; c--)
    for (let r = 0; r < 3; r++) yield [p[r], c];
}

function* nextPos_right([row, col]: [number, number]) {
  const p = RowPrecedence(row);

  for (let c = col + 1; c < 4; c++) for (let r = 0; r < 3; r++) yield [p[r], c];
}

function* nextPos_up([row, col]: [number, number]) {
  const p = ColPrecedence(col);

  for (let r = row - 1; r > -1; r--)
    for (let c = 0; c < 4; c++) yield [r, p[c]];
}

function* nextPos_down([row, col]: [number, number]) {
  const p = ColPrecedence(col);

  for (let r = row + 1; r < 3; r++) for (let c = 0; c < 4; c++) yield [r, p[c]];
}

const move = (direction: string, [matrix, level]: [number, number]) => {
  switch (direction) {
    case "left":
      matrix = matrix + 1 > 8 ? 1 : matrix + 1;
      break;
    case "right":
      matrix = matrix - 1 < 1 ? 8 : matrix - 1;
      break;
    case "up":
      level++;
      break;
    case "down":
      level--;
      break;
  }

  return [matrix, level];
};

export const moveHorizontalAndFindNode = (
  startingPoint: NodeData,
  direction: string,
  level: number,
  activeSite: ActiveSite,
  gameProgress: GameProgress
) => {
  const funcs: {
    [key: string]: ([row, col]: [number, number]) => Generator<number[], void>;
  } = {
    left: ([r]: [number, number]) => nextPos_right([r, -1]),
    right: ([r]: [number, number]) => nextPos_left([r, 4]),
  };

  if (startingPoint.matrixIndices) {
    const nextPos = funcs[direction];

    let { matrixIdx, colIdx, rowIdx } = { ...startingPoint.matrixIndices };

    [matrixIdx] = move(direction, [matrixIdx, level]);

    const nodes = getVisibleNodesMatrix(
      matrixIdx,
      level,
      activeSite,
      gameProgress
    );

    for (const [r, c] of nextPos([rowIdx, colIdx])) {
      const node = nodes[r][c];

      if (node)
        return {
          node,

          matrixIndices: {
            matrixIdx,
            rowIdx: r,
            colIdx: c,
          },

          didMove: true,
        };
    }

    const nodeId = startingPoint.id;
    if (nodeId === "") {
      return {
        node: "unknown",
        matrixIndices: {
          matrixIdx,
          rowIdx: rowIdx,
          colIdx: colIdx,
        },
        didMove: true,
      };
    }
  }
};

export const findNode = (
  startingPoint: NodeData,
  direction: string,
  level: number,
  activeSite: ActiveSite,
  gameProgress: GameProgress,
  shouldSearchNext: boolean
) => {
  const funcs: {
    [key: string]: (([row, col]: [number, number]) => Generator<
      number[],
      void
    >)[];
  } = {
    left: [nextPos_left, ([r]: [number, number]) => nextPos_right([r, -1])],
    right: [nextPos_right, ([r]: [number, number]) => nextPos_left([r, 4])],
    up: [nextPos_up, ([, c]: [number, number]) => nextPos_up([3, c])],
    down: [nextPos_down, ([, c]: [number, number]) => nextPos_down([-1, c])],
  };

  const upperLevelLimit = activeSite === "a" ? 22 : 13;

  if (startingPoint.matrixIndices) {
    const nextPos = funcs[direction];

    let { matrixIdx, colIdx, rowIdx } = { ...startingPoint.matrixIndices };

    const initialMatrixIdx = matrixIdx;

    for (let i = 0; i < (shouldSearchNext ? 2 : 1); i++) {
      if (level === upperLevelLimit + 1 || level === 0) return;

      const nodes = getVisibleNodesMatrix(
        matrixIdx,
        level,
        activeSite,
        gameProgress
      );

      for (const [r, c] of nextPos[i]([rowIdx, colIdx])) {
        const node = nodes[r][c];

        if (node)
          return {
            node,

            matrixIndices: {
              matrixIdx,
              rowIdx: r,
              colIdx: c,
            },

            didMove: Boolean(i),
          };
      }

      [matrixIdx, level] = move(direction, [matrixIdx, level]);
    }

    const nodeId = startingPoint.id;
    if (nodeId === "") [matrixIdx] = move(direction, [initialMatrixIdx, level]);

    if (direction === "up" || direction === "down" || nodeId === "") {
      return {
        node: "unknown",
        matrixIndices: {
          matrixIdx,
          rowIdx: rowIdx,
          colIdx: colIdx,
        },
        didMove: true,
      };
    }
  }
};
export const filterInvisibleNodes = (
  siteData: SiteData,
  gameProgress: GameProgress
) => {
  const visibleNodes: SiteData = {};
  Object.entries(siteData).forEach((level) => {
    visibleNodes[level[0]] = {};
    Object.entries(level[1]).forEach((node) => {
      if (isNodeVisible(node[1], gameProgress)) {
        visibleNodes[level[0]][node[0]] = {
          ...node[1],
          is_viewed:
            gameProgress.nodes[
              node[1].node_name as keyof typeof gameProgress.nodes
            ].is_viewed,
        };
      }
    });
  });

  return visibleNodes;
};

export const unknownNodeTemplate = {
  id: "",
  image_table_indices: {
    "1": "",
    "2": "",
    "3": "",
  },
  media_file: "",
  node_name: "Unknown",
  required_final_video_viewcount: 0,
  site: "",
  title: "",
  triggers_final_video: 0,
  type: 0,
  unlocked_by: "",
  upgrade_requirement: 0,
  words: {
    "1": "",
    "2": "",
    "3": "",
  },
  protocol_lines: {
    "1": "",
    "2": "",
    "3": "",
  },
};

export const nodeToScene = (node: NodeData) => {
  switch (node.type) {
    case 0:
    case 2:
    case 4:
    case 3:
    case 5:
      return "media";
    case 6:
      if (node.node_name.substr(0, 3) === "TaK") {
        return "tak";
      } else {
        return "media";
      }
    case 7:
      return "sskn";
    case 8:
      return "gate";
    case 9:
      return "polytan";
  }
};
