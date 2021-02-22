import { findNodeFromWord } from "../../helpers/media-helpers";

it("Finds the next node with the same word", () => {
  expect(findNodeFromWord("father", "Cou041", "b").node.node_name).toEqual(
    "Lda151"
  );
  expect(findNodeFromWord("father", "Lda151", "b").node.node_name).toEqual(
    "Lda155"
  );
  expect(findNodeFromWord("father", "Lda155", "b").node.node_name).toEqual(
    "Lda164"
  );
  expect(findNodeFromWord("father", "Lda182", "b").node.node_name).toEqual(
    "Lda200"
  );
  expect(findNodeFromWord("father", "Lda229", "b").node.node_name).toEqual(
    "Cou041"
  );
  expect(findNodeFromWord("father", "Cou041", "b").node.node_name).toEqual(
    "Lda151"
  );
  expect(findNodeFromWord("chaos", "Lda154", "b").node.node_name).toEqual(
    "Tda056"
  );
  expect(findNodeFromWord("chaos", "Tda056", "b").node.node_name).toEqual(
    "Tda059"
  );
  expect(findNodeFromWord("prompt", "Lda154", "b").node.node_name).toEqual(
    "Tda072"
  );
  expect(findNodeFromWord("abuse", "Dc1012", "a").node.node_name).toEqual(
    "Lda005"
  );
  expect(findNodeFromWord("abuse", "Lda005", "a").node.node_name).toEqual(
    "Dc1012"
  );
});
