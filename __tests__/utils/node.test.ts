import { Direction, GameSite } from "@/types";
import {
  findNode,
  findNodeFromWord,
  getNode,
  isNodeVisible,
} from "@/utils/node";
import gameProgressJson from "@/json/initial_progress.json";
import { useStore } from "@/store";

it("Finds nodes from words properly", () => {
  expect(findNodeFromWord("father", getNode("0606b")).name).toEqual("Lda151");
  expect(findNodeFromWord("father", getNode("0105b")).name).toEqual("Lda155");
  expect(findNodeFromWord("father", getNode("0123b")).name).toEqual("Lda164");
  expect(findNodeFromWord("father", getNode("0502b")).name).toEqual("Lda200");
  expect(findNodeFromWord("father", getNode("1118b")).name).toEqual("Cou041");
  expect(findNodeFromWord("father", getNode("0606b")).name).toEqual("Lda151");
  expect(findNodeFromWord("chaos", getNode("0115b")).name).toEqual("Tda056");
  expect(findNodeFromWord("chaos", getNode("0311b")).name).toEqual("Tda059");
  expect(findNodeFromWord("prompt", getNode("0115b")).name).toEqual("Tda072");
  expect(findNodeFromWord("abuse", getNode("1622a")).name).toEqual("Lda005");
  expect(findNodeFromWord("abuse", getNode("0718a")).name).toEqual("Dc1012");
});

it("Finds node by it's id", () => {
  expect(getNode("0422a").name).toEqual("Tda028");
  expect(getNode("0000a").name).toEqual("Env001");
  expect(getNode("0616a").name).toEqual("Cou015");
  expect(getNode("0100b").name).toEqual("SSkn04#");
  expect(getNode("0101b").name).toEqual("Dc1025");
});

it("Checks if the node is visible", () => {
  const oneViewCount = { ...gameProgressJson, final_video_viewcount: 1 };
  const twoViewCount = { ...gameProgressJson, final_video_viewcount: 2 };
  const threeViewCount = { ...gameProgressJson, final_video_viewcount: 3 };
  const fourViewCount = { ...gameProgressJson, final_video_viewcount: 4 };

  expect(isNodeVisible(getNode("0422a"), gameProgressJson)).toEqual(true);
  expect(isNodeVisible(getNode("0413a"), gameProgressJson)).toEqual(true);
  expect(isNodeVisible(getNode("0406a"), gameProgressJson)).toEqual(false);
  expect(isNodeVisible(getNode("0410a"), gameProgressJson)).toEqual(false);
  expect(isNodeVisible(getNode("0406a"), oneViewCount)).toEqual(true);
  expect(isNodeVisible(getNode("0612a"), gameProgressJson)).toEqual(false);
  expect(isNodeVisible(getNode("0612a"), oneViewCount)).toEqual(true);
  expect(isNodeVisible(getNode("0612a"), twoViewCount)).toEqual(true);
  expect(isNodeVisible(getNode("0801a"), fourViewCount)).toEqual(true);
  expect(isNodeVisible(getNode("0801a"), threeViewCount)).toEqual(false);
});

/*
  visual representation of the state we're working with
                              [null, "0517", null, null],
                              [null, null, "0510", "0513"],
                              ["0506", null, null, null],
                                           |
[null, null, null, "0422"],   ["0422", "0417", null, null],   [null, "0416", "0417", "0420"],
[null, null, null, "0414"], - ["0414", null, null, "0413"], - ["0413", null, null, null],
[null, null, null, null],     [null, null, null, "0405"],     ["0405", null, null, null],
                                           |
[null, null, null, null]      [null, null, null, null],       [null, null, null, null],
[null, null, null, null],     [null, null, null, null],       [null, null, null, null],
[null, null, null, null],     [null, null, null, null],       [null, null, null, null],
*/

it("Finds which node to go to", () => {
  const state0414 = useStore.getState();

  // from 0414 left
  expect(findNode(state0414, Direction.Left, true)).toEqual({
    node: getNode("0414a"),
    nodeMatrixIndex: { row: 1, col: 3 },
    siteSegment: 7,
    level: 4,
    didMove: true,
  });

  // from 0414 down
  expect(findNode(state0414, Direction.Down, true)).toEqual({
    node: getNode("0405a"),
    nodeMatrixIndex: { row: 2, col: 3 },
    siteSegment: 6,
    level: 4,
    didMove: false,
  });

  const state0405 = {
    ...state0414,
    node: getNode("0405a"),
    nodeMatrixIndex: { row: 2, col: 3 },
  };
  // from 0405 down
  expect(findNode(state0405, Direction.Down, true)).toEqual({
    node: null,
    nodeMatrixIndex: { row: 2, col: 3 },
    siteSegment: 6,
    level: 3,
    didMove: true,
  });

  // from 0405 left
  expect(findNode(state0405, Direction.Left, true)).toEqual({
    node: getNode("0417a"),
    nodeMatrixIndex: { row: 0, col: 1 },
    siteSegment: 6,
    level: 4,
    didMove: false,
  });

  const state0506 = {
    ...state0414,
    node: getNode("0506a"),
    nodeMatrixIndex: { row: 3, col: 0 },
    level: 5,
  };

  // from 0506 down
  expect(findNode(state0506, Direction.Down, true)).toEqual({
    node: getNode("0422a"),
    nodeMatrixIndex: { row: 0, col: 0 },
    siteSegment: 6,
    level: 4,
    didMove: true,
  });
});
