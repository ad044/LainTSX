import { findNode, unknownNodeTemplate } from "../../helpers/node-helpers";
import site_a from "../../resources/site_a.json";
import gameProgress from "../../resources/initial_progress.json";

/*
  visual representation of the data we're working with
  
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

const middleMatrixIdx = 7;
const leftMatrixIdx = 8;

it("Finds which node to go to", () => {
  // from unknown to left unknown
  expect(
    findNode(
      {
        ...unknownNodeTemplate,
        matrixIndices: { matrixIdx: middleMatrixIdx, rowIdx: 2, colIdx: 3 },
      },
      "left",
      3,
      "a",
      gameProgress,
      true
    )
  ).toEqual({
    node: "unknown",
    matrixIndices: { rowIdx: 2, colIdx: 3, matrixIdx: leftMatrixIdx },
    didMove: true,
  });

  // from 0405 down
  expect(
    findNode(
      {
        ...site_a["04"]["0405"],
        matrixIndices: { matrixIdx: middleMatrixIdx, rowIdx: 2, colIdx: 3 },
      },
      "down",
      4,
      "a",
      gameProgress,
      true
    )
  ).toEqual({
    node: "unknown",
    matrixIndices: { rowIdx: 2, colIdx: 3, matrixIdx: middleMatrixIdx },
    didMove: true,
  });

  // from 0422 (from left matrix) right
  expect(
    findNode(
      {
        ...site_a["04"]["0422"],
        matrixIndices: { matrixIdx: 8, rowIdx: 0, colIdx: 3 },
      },
      "right",
      4,
      "a",
      gameProgress,
      true
    )
  ).toEqual({
    node: "0413",
    matrixIndices: { rowIdx: 1, colIdx: 3, matrixIdx: 7 },
    didMove: true,
  });

  // from 0422 left
  expect(
    findNode(
      {
        ...site_a["04"]["0422"],
        matrixIndices: { matrixIdx: middleMatrixIdx, rowIdx: 0, colIdx: 0 },
      },
      "left",
      4,
      "a",
      gameProgress,
      true
    )
  ).toEqual({
    node: "0422",
    matrixIndices: { rowIdx: 0, colIdx: 3, matrixIdx: 8 },
    didMove: true,
  });

  // from 0422 up
  expect(
    findNode(
      {
        ...site_a["04"]["0422"],
        matrixIndices: { matrixIdx: middleMatrixIdx, rowIdx: 0, colIdx: 0 },
      },
      "up",
      4,
      "a",
      gameProgress,
      true
    )
  ).toEqual({
    node: "0506",
    matrixIndices: { rowIdx: 2, colIdx: 0, matrixIdx: 7 },
    didMove: true,
  });

  // from 0422 right
  expect(
    findNode(
      {
        ...site_a["04"]["0422"],
        matrixIndices: { matrixIdx: middleMatrixIdx, rowIdx: 0, colIdx: 0 },
      },
      "right",
      4,
      "a",
      gameProgress,
      true
    )
  ).toEqual({
    node: "0417",
    matrixIndices: { rowIdx: 0, colIdx: 1, matrixIdx: 7 },
    didMove: false,
  });

  // from 0414 up
  expect(
    findNode(
      {
        ...site_a["04"]["0414"],
        matrixIndices: { matrixIdx: middleMatrixIdx, rowIdx: 1, colIdx: 0 },
      },
      "up",
      4,
      "a",
      gameProgress,
      true
    )
  ).toEqual({
    node: "0422",
    matrixIndices: { rowIdx: 0, colIdx: 0, matrixIdx: 7 },
    didMove: false,
  });
});
