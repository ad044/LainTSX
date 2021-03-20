import site_a from "../resources/site_a.json";
import site_b from "../resources/site_b.json";
import { isPolytanFullyUnlocked, useStore } from "../store";
import { SiteData } from "../types/types";

export const getRandomIdleMedia = () => {
  const siteAIdleNodes = {
    audio: [
      "0000",
      "0001",
      "0002",
      "0003",
      "0004",
      "0005",
      "0006",
      "0007",
      "0008",
      "0009",
    ],
    video: [
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
  };

  const siteBIdleNodes = {
    audio: ["1015", "1219", "0419", "0500", "0501", "0508", "0510", "0513"],
    video: [
      "INS16.STR[0]",
      "INS17.STR[0]",
      "INS18.STR[0]",
      "INS19.STR[0]",
      "INS20.STR[0]",
      "INS21.STR[0]",
      "INS22.STR[0]",
    ],
  };

  const site = useStore.getState().activeSite;

  const siteData: SiteData = site === "a" ? site_a : site_b;
  const idleNodes = site === "a" ? siteAIdleNodes : siteBIdleNodes;

  if (Math.random() < 0.5) {
    const nodeToPlay =
      idleNodes.audio[Math.floor(Math.random() * idleNodes.audio.length)];

    const level = nodeToPlay.substr(0, 2);

    const images = siteData[level][nodeToPlay].image_table_indices;
    const media = siteData[level][nodeToPlay].media_file;
    const nodeName = siteData[level][nodeToPlay].node_name;

    return {
      type: "audio",
      images: images,
      media: media,
      nodeName: nodeName,
    };
  } else {
    if (site === "b" && isPolytanFullyUnlocked() && Math.random() < 0.3) {
      const polytanMedia = ["PO1.STR[0]", "PO2.STR[0]"];
      return {
        type: "video",
        media: polytanMedia[Math.floor(Math.random() * polytanMedia.length)],
      };
    }
    return {
      type: "video",
      media:
        idleNodes.video[Math.floor(Math.random() * idleNodes.video.length)],
    };
  }
};

export const getRandomIdleLainAnim = (): [string, number] => {
  const moves: [string, number][] = [
    ["prayer", 3500],
    ["touch_sleeve", 3000],
    ["thinking", 3900],
    ["stretch_2", 3900],
    ["stretch", 3000],
    ["spin", 3000],
    ["scratch_head", 3900],
    ["blush", 3000],
    ["hands_behind_head", 2300],
    ["hands_on_hips", 3000],
    ["hands_on_hips_2", 3900],
    ["hands_together", 2500],
    ["lean_forward", 2700],
    ["lean_left", 2700],
    ["lean_right", 3500],
    ["look_around", 3000],
    ["play_with_hair", 2900],
  ];

  return moves[Math.floor(Math.random() * moves.length)];
};
