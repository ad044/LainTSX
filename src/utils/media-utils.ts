import site_a from "../resources/site_a.json";
import site_b from "../resources/site_b.json";
import node_matrices from "../resources/node_matrices.json";
import { NodeDataType, SiteType } from "../components/MainScene/Site";
import { isNodeVisible } from "./node-utils";

export const findNodeFromWord = (
  wordLabel: string,
  activeNode: NodeDataType,
  site: "a" | "b",
  gameProgress: any
) => {
  const labelToIdx = (() => {
    switch (wordLabel) {
      case "fstWord":
        return 1;
      case "sndWord":
        return 2;
      case "thirdWord":
        return 3;
    }
  })();

  const wordToFind = activeNode.words[labelToIdx!];

  const siteData: SiteType = site === "a" ? site_a : site_b;

  const nodesWithSameWords = Object.values(siteData)
    .flatMap((level) =>
      Object.values(level).filter((node) =>
        Object.values(node.words).includes(wordToFind)
      )
    )
    .sort((a, b) => (a.node_name > b.node_name ? 1 : -1));

  const chosenNode =
    nodesWithSameWords[
      nodesWithSameWords.findIndex(
        (node) => node.node_name === activeNode.node_name
      ) + 1
    ] ?? nodesWithSameWords[0];

  if (!isNodeVisible(chosenNode, gameProgress)) return;

  const pos = chosenNode.id.substr(2);

  const matrixIndices = Object.entries(node_matrices).flatMap((matrixData) =>
    matrixData[1].flatMap((row, idx) =>
      row[0] === pos
        ? { matrixIdx: parseInt(matrixData[0]), rowIdx: idx, colIdx: 0 }
        : []
    )
  )[0];

  const rotValues = {
    "1": 2 * (Math.PI / 4),
    "2": 3 * (Math.PI / 4),
    "3": 4 * (Math.PI / 4),
    "4": 5 * (Math.PI / 4),
    "5": 6 * (Math.PI / 4),
    "6": 7 * (Math.PI / 4),
    "7": 0,
    "8": Math.PI / 4,
  };

  return {
    node: {
      ...chosenNode,
      matrixIndices: matrixIndices,
    },
    siteRotY:
      rotValues[matrixIndices.matrixIdx.toString() as keyof typeof rotValues],
    level: chosenNode.id.substr(0, 2),
  };
};
