import {
  GameSite,
  GameProgress,
  LainAnimation,
  NodeID,
  IdleSceneData,
} from "@/types";

import { getNode } from "./node";
import { randomFrom } from "./random";

export const getRandomIdle = (
  site: GameSite,
  gameProgress: GameProgress
): IdleSceneData => {
  const audioNodes: { a: NodeID[]; b: NodeID[] } = {
    a: [
      "0000a",
      "0001a",
      "0002a",
      "0003a",
      "0004a",
      "0005a",
      "0006a",
      "0007a",
      "0008a",
      "0009a",
    ],
    b: ["1015b", "1219b", "0419b", "0500b", "0501b", "0508b", "0510b", "0513b"],
  };

  const videoFiles = {
    a: [
      "INS01.STR[0]",
      "INS02.STR[0]",
      "INS03.STR[0]",
      "INS04.STR[0]",
      "INS05.STR[0]",
      "INS06.STR[0]",
      "INS07.STR[0]",
      "INS08.STR[0]",
      "INS09.STR[0]",
      "INS10.STR[0]",
      "INS11.STR[0]",
      "INS12.STR[0]",
      "INS13.STR[0]",
      "INS14.STR[0]",
      "INS15.STR[0]",
      "INS16.STR[0]",
      "INS17.STR[0]",
      "INS18.STR[0]",
      "INS19.STR[0]",
      "INS20.STR[0]",
      "INS21.STR[0]",
      "INS22.STR[0]",
    ],
    b: [
      "INS16.STR[0]",
      "INS17.STR[0]",
      "INS18.STR[0]",
      "INS19.STR[0]",
      "INS20.STR[0]",
      "INS21.STR[0]",
      "INS22.STR[0]",
    ],
  };

  if (Math.random() < 0.5) {
    // audio
    switch (site) {
      case GameSite.A: {
        const node = getNode(randomFrom(audioNodes.a));
        return {
          nodeName: node.name,
          mediaFile: node.media_file,
          imageTableIndices: node.image_table_indices,
        };
      }
      case GameSite.B: {
        const node = getNode(randomFrom(audioNodes.b));
        return {
          nodeName: node.name,
          mediaFile: node.media_file,
          imageTableIndices: node.image_table_indices,
        };
      }
    }
  } else {
    // video
    const polytanProgress = gameProgress.polytan_unlocked_parts;
    const isPolytanFullyUnlocked = Object.keys(polytanProgress).every(
      (key) => !polytanProgress[key as keyof typeof polytanProgress]
    );
    if (site === GameSite.B && isPolytanFullyUnlocked && Math.random() < 0.3) {
      return {
        nodeName: "",
        mediaFile: randomFrom(["PO1.STR[0]", "PO2.STR[0]"]),
      };
    } else {
      switch (site) {
        case GameSite.A: {
          return { nodeName: "", mediaFile: randomFrom(videoFiles.a) };
        }
        case GameSite.B: {
          return { nodeName: "", mediaFile: randomFrom(videoFiles.b) };
        }
      }
    }
  }
};

export const getRandomIdleLainAnim = (): [LainAnimation, number] => {
  const moves: [LainAnimation, number][] = [
    [LainAnimation.Prayer, 3500],
    [LainAnimation.TouchSleeve, 3000],
    [LainAnimation.Thinking, 3900],
    [LainAnimation.Stretch2, 3900],
    [LainAnimation.Stretch, 3000],
    [LainAnimation.Spin, 3000],
    [LainAnimation.ScratchHead, 3900],
    [LainAnimation.Blush, 3000],
    [LainAnimation.HandsBehindHead, 2300],
    [LainAnimation.HandsOnHips, 3000],
    [LainAnimation.HandsOnHips2, 3900],
    [LainAnimation.HandsTogether, 2500],
    [LainAnimation.LeanForward, 2700],
    [LainAnimation.LeanLeft, 2700],
    [LainAnimation.LeanRight, 3500],
    [LainAnimation.LookAround, 3000],
    [LainAnimation.PlayWithHair, 2900],
  ];

  return randomFrom(moves);
};
