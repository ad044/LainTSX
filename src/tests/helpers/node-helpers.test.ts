import { getNodeById, isNodeVisible } from "../../helpers/node-helpers";
import site_a from "../../resources/site_a.json";
import gameProgress from "../../resources/initial_progress.json";

it("Finds the node by it's id", () => {
  expect(getNodeById("0422", "a").node_name).toEqual("Tda028");
  expect(getNodeById("0000", "a").node_name).toEqual("Env001");
  expect(getNodeById("0616", "a").node_name).toEqual("Cou015");
  expect(getNodeById("0100", "b").node_name).toEqual("Sskn04#");
  expect(getNodeById("0101", "b").node_name).toEqual("Dc1025");
});

const oneViewCount = { ...gameProgress, final_video_viewcount: 1 };
const twoViewCount = { ...gameProgress, final_video_viewcount: 2 };
const threeViewCount = { ...gameProgress, final_video_viewcount: 3 };
const fourViewCount = { ...gameProgress, final_video_viewcount: 4 };

it("Checks if the node is visible", () => {
  expect(isNodeVisible(site_a["04"]["0422"], gameProgress)).toEqual(true);
  expect(isNodeVisible(site_a["04"]["0413"], gameProgress)).toEqual(true);
  expect(isNodeVisible(site_a["04"]["0406"], gameProgress)).toEqual(false);
  expect(isNodeVisible(site_a["04"]["0410"], gameProgress)).toEqual(false);
  expect(isNodeVisible(site_a["04"]["0406"], oneViewCount)).toEqual(true);
  expect(isNodeVisible(site_a["06"]["0612"], gameProgress)).toEqual(false);
  expect(isNodeVisible(site_a["06"]["0612"], oneViewCount)).toEqual(true);
  expect(isNodeVisible(site_a["06"]["0612"], twoViewCount)).toEqual(true);
  expect(isNodeVisible(site_a["08"]["0801"], fourViewCount)).toEqual(true);
  expect(isNodeVisible(site_a["08"]["0801"], threeViewCount)).toEqual(false);
});
