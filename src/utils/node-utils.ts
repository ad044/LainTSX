import { NodeDataType, SiteType } from "../components/MainScene/Site";
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

//visible = (global_final_viewcount > 0) && (req_final_viewcount <= global_final_viewcount + 1)
export const isNodeVisible = (
  node: NodeDataType,
  gameProgress: typeof unlocked_nodes
) => {
  return node
    ? (node.unlocked_by === "" ||
        gameProgress[node.unlocked_by as keyof typeof gameProgress]
          .is_viewed) &&
        gameProgress[node.node_name as keyof typeof gameProgress].is_visible &&
        node.required_final_video_viewcount < 1
    : false;
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

function move(direction: string, [matrix, level]: [number, number]) {
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
}

export function findNode(
  direction: string,

  {
    matrixIdx,
    rowIdx,
    colIdx,
  }: { matrixIdx: number; rowIdx: number; colIdx: number },

  level: number,
  currentSite: string,
  gameProgress: any
): any | undefined {
  const funcs: any = {
    left: [nextPos_left, ([r]: [number, number]) => nextPos_right([r, -1])],
    right: [nextPos_right, ([r]: [number, number]) => nextPos_left([r, 4])],
    up: [nextPos_up, ([, c]: [number, number]) => nextPos_up([3, c])],
    down: [nextPos_down, ([, c]: [number, number]) => nextPos_down([-1, c])],
  };

  const nextPos = funcs[direction];

  for (let i = 0; i < 2; i++) {
    const nodes = getVisibleNodesMatrix(
      matrixIdx,
      level,
      currentSite,
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
        visibleNodes[level[0]][node[0]] = {
          ...node[1],
          is_viewed:
            gameProgress[node[1].node_name as keyof typeof gameProgress]
              .is_viewed,
        };
      }
    });
  });

  return visibleNodes;
};
