import site_a from "../resources/site_a.json";
import site_b from "../resources/site_b.json";
import node_matrices from "../resources/node_matrices.json";
import {ActiveSite, SiteData} from "../types/types";

export const findNodeFromWord = (
  wordToFind: string,
  nodeName: string,
  site: ActiveSite
) => {
  const siteData: SiteData = site === "a" ? site_a : site_b;

  const nodesWithSameWords = Object.values(siteData)
    .flatMap((level) =>
      Object.values(level).filter((node) =>
        Object.values(node.words).includes(wordToFind)
      )
    )
    .sort((a, b) => (a.node_name > b.node_name ? 1 : -1));

  const chosenNode =
    nodesWithSameWords[
      nodesWithSameWords.findIndex((node) => node.node_name === nodeName) + 1
    ] ?? nodesWithSameWords[0];

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

export const playMediaElement = () => {
  const mediaElement = document.getElementById("media") as HTMLMediaElement;

  if (mediaElement && mediaElement.paused) mediaElement.play();
};

export const resetMediaElement = () => {
  const mediaElement = document.getElementById("media") as HTMLMediaElement;
  if (mediaElement) {
    mediaElement.pause();

    mediaElement.currentTime = 0;
  }
};
