import nodesJson from "@/json/nodes.json";
import {
  NodeData,
  MatrixIndex2D,
  Direction,
  NavigationResult,
  NodeMatrix,
  HUDData,
  SiteLayout,
  GameProgress,
  NodeRow,
  NodeID,
  Position,
  Rotation,
} from "@/types";
import { State } from "@/types";
import { getLayout, getLevelLimit } from "./site";
import nodeHudsJson from "@/json/node_huds.json";
import nodePositionsJson from "@/json/node_positions.json";

export const getNode = (id: NodeID): NodeData => {
  return nodesJson[id] as NodeData;
};

export const isNodeViewed = (
  id: NodeID,
  gameProgress: GameProgress
): boolean => {
  return gameProgress.nodes[id].is_viewed;
};

export const getNodeHud = (nodeMatrixIndex: MatrixIndex2D): HUDData => {
  const { row, col } = nodeMatrixIndex;
  return nodeHudsJson[row][col] as HUDData;
};

export const isNodeVisible = (
  node: NodeData,
  gameProgress: GameProgress
): boolean => {
  switch (node.type) {
    case 7:
    case 8:
    case 9:
      // polytan, sskn, gate nodes
      return !isNodeViewed(node.id, gameProgress);
    default:
      const unlocked =
        node.unlocked_by === null ||
        (node.unlocked_by !== null &&
          isNodeViewed(node.unlocked_by, gameProgress));

      // every other node
      return (
        unlocked &&
        (node.required_final_video_viewcount > 0
          ? gameProgress.final_video_viewcount > 0
            ? node.required_final_video_viewcount <=
              gameProgress.final_video_viewcount + 1
            : false
          : true)
      );
  }
};

const filterNodeRow = (row: NodeRow, gameProgress: GameProgress) =>
  row.map((entry: NodeID | null) =>
    entry && isNodeVisible(getNode(entry), gameProgress) ? entry : null
  );

export const filterInvisibleNodes = (
  siteLayout: SiteLayout,
  gameProgress: GameProgress
): SiteLayout => {
  return siteLayout.map((rows) =>
    rows.map((row) => row && filterNodeRow(row, gameProgress))
  );
};

const getMatrixRow = (layoutRow: NodeRow, segment: number): NodeRow => {
  return [
    layoutRow[segment],
    layoutRow[(segment + 3) % 8],
    layoutRow[(segment + 4) % 8],
    layoutRow[(segment + 7) % 8],
  ];
};

export const getSegmentMatrix = (
  segment: number,
  level: number,
  layout: SiteLayout
): NodeMatrix => {
  const rows = layout[level];
  return [
    getMatrixRow(rows[0], segment),
    getMatrixRow(rows[1], segment),
    getMatrixRow(rows[2], segment),
  ];
};

const RowPrecedence = (row: number): number[] => {
  switch (row) {
    default:
    case 0:
      return [0, 1, 2];
    case 1:
      return [1, 0, 2];
    case 2:
      return [2, 1, 0];
  }
};

const ColPrecedence = (col: number): number[] => {
  switch (col) {
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

const move = (direction: Direction, [siteSegment, level]: [number, number]) => {
  switch (direction) {
    case Direction.Left:
      siteSegment = siteSegment + 1 > 7 ? 0 : siteSegment + 1;
      break;
    case Direction.Right:
      siteSegment = siteSegment - 1 < 0 ? 7 : siteSegment - 1;
      break;
    case Direction.Up:
      level++;
      break;
    case Direction.Down:
      level--;
      break;
  }

  return [siteSegment, level];
};

export const moveHorizontalAndFindNode = (
  state: State,
  direction: Direction.Left | Direction.Right
): NavigationResult | null => {
  let nextPos: ([row, col]: [number, number]) => Generator<number[], void>;

  switch (direction) {
    case Direction.Left:
      nextPos = ([r]: [number, number]) => nextPos_right([r, -1]);
      break;
    case Direction.Right:
      nextPos = ([r]: [number, number]) => nextPos_left([r, 4]);
      break;
  }

  let { col, row } = state.nodeMatrixIndex;
  let segment = state.siteSegment;

  [segment] = move(direction, [segment, state.level]);

  const nodes = getSegmentMatrix(
    segment,
    state.level,
    state.siteLayouts[state.site]
  );

  for (const [r, c] of nextPos([row, col])) {
    const node = nodes[r][c];

    if (node)
      return {
        node: getNode(node),
        nodeMatrixIndex: { row: r, col: c },
        level: state.level,
        siteSegment: segment,
        didMove: true,
      };
  }

  // if we were on an unknown node currently and next node is not found
  // we move, setting new node to unknown again
  if (state.node === null) {
    return {
      node: null,
      nodeMatrixIndex: { row, col },
      level: state.level,
      siteSegment: segment,
      didMove: true,
    };
  }

  return null;
};

export const findNodeAtLevel = (state: State, targetLevel: number) => {
  const nextPos = ([, c]: [number, number]) => nextPos_up([3, c]);

  let { col, row } = state.nodeMatrixIndex;

  const nodes = getSegmentMatrix(
    state.siteSegment,
    targetLevel,
    state.siteLayouts[state.site]
  );

  for (const [r, c] of nextPos([row, col])) {
    const node = nodes[r][c];

    if (node)
      return {
        node: getNode(node),
        nodeMatrixIndex: { row: r, col: c },
        level: targetLevel,
        siteSegment: state.siteSegment,
        didMove: true,
      };
  }

  return {
    node: null,
    nodeMatrixIndex: { row, col },
    level: targetLevel,
    siteSegment: state.siteSegment,
    didMove: true,
  };
};

export const findNode = (
  state: State,
  direction: Direction,
  shouldSearchNext: boolean
): NavigationResult | null => {
  let nextPos: (([row, col]: [number, number]) => Generator<number[], void>)[];
  switch (direction) {
    case Direction.Left:
      nextPos = [
        nextPos_left,
        ([r]: [number, number]) => nextPos_right([r, -1]),
      ];
      break;
    case Direction.Right:
      nextPos = [
        nextPos_right,
        ([r]: [number, number]) => nextPos_left([r, 4]),
      ];
      break;
    case Direction.Up:
      nextPos = [nextPos_up, ([, c]: [number, number]) => nextPos_up([3, c])];
      break;
    case Direction.Down:
      nextPos = [
        nextPos_down,
        ([, c]: [number, number]) => nextPos_down([-1, c]),
      ];
  }

  let { level, siteSegment } = state;
  let { col, row } = state.nodeMatrixIndex;
  let didMove = false;
  const upperLevelLimit = getLevelLimit(state.site);

  for (let i = 0; i < (shouldSearchNext ? 2 : 1); i++) {
    if (level === upperLevelLimit + 1 || level === 0) {
      return null;
    }

    const nodes = getSegmentMatrix(
      siteSegment,
      level,
      state.siteLayouts[state.site]
    );

    for (const [r, c] of nextPos[i]([row, col])) {
      const node = nodes[r][c];
      if (node) {
        return {
          node: getNode(node),
          nodeMatrixIndex: { row: r, col: c },
          siteSegment: siteSegment,
          level: level,
          didMove: didMove,
        };
      }
    }

    if (!didMove) {
      [siteSegment, level] = move(direction, [siteSegment, level]);
      didMove = true;
    }
  }

  if (
    direction === Direction.Up ||
    direction === Direction.Down ||
    state.node === null
  ) {
    return {
      node: null,
      nodeMatrixIndex: { row, col },
      siteSegment: siteSegment,
      level: level,
      didMove: true,
    };
  }

  return null;
};

// used to find segment in which the passed node's position is
// located in the specified column
export const findSegmentForNodeAtCol = (node: NodeData, col: number) => {
  for (let segment = 0; segment < 8; segment++) {
    const nodeMat = getSegmentMatrix(segment, node.level, getLayout(node.site));

    if (nodeMat.find((row) => row[col] === node.id)) {
      return segment;
    }
  }
};

export const findNodeFromWord = (
  wordToFind: string,
  fromNode: NodeData
): NodeData => {
  const nodesWithSameWords = Object.values(nodesJson)
    .filter(
      (node) =>
        node.site === fromNode.site &&
        Object.values(node.words).includes(wordToFind)
    )
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  const index =
    nodesWithSameWords.findIndex((node) => node.name === fromNode.name) + 1;

  return (nodesWithSameWords[index] as NodeData) ?? nodesWithSameWords[0];
};

export const getPolytanPart = (node: NodeData) => {
  switch (node.name.slice(-1)) {
    case "6":
      return "head";
    case "5":
      return "right_arm";
    case "4":
      return "left_arm";
    case "3":
      return "right_leg";
    case "2":
      return "left_leg";
    case "1":
      return "body";
  }
};

export const getRowForPosition = (position: number) => {
  if (position >= 0 && position <= 7) {
    return 2;
  }

  if (position >= 8 && position <= 15) {
    return 1;
  }

  return 0;
};

export const translatePositionByAngle = (
  position: Position,
  angle: number
): Position => {
  const [x, y, z] = position;

  return [
    x * Math.cos(angle) - z * Math.sin(angle),
    y,
    x * Math.sin(angle) + z * Math.cos(angle),
  ];
};

export const isAudioOnly = (media: string) => {
  return media.includes("XA");
};

export const getNodeWorldPosition = (position: number) => {
  return nodePositionsJson[position].position as Position;
};

export const getNodeWorldRotation = (position: number) => {
  return nodePositionsJson[position].rotation as Rotation;
};
