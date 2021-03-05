import site_a from "../resources/site_a.json";
import site_b from "../resources/site_b.json";
import { useStore } from "../store";
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
      "INS01.STR",
      "INS02.STR",
      "INS03.STR",
      "INS04.STR",
      "INS05.STR",
      "INS06.STR",
      "INS07.STR",
      "INS08.STR",
      "INS09.STR",
      "INS10.STR",
      "INS11.STR",
      "INS12.STR",
      "INS13.STR",
      "INS14.STR",
      "INS15.STR",
      "INS16.STR",
      "INS17.STR",
      "INS18.STR",
      "INS19.STR",
      "INS20.STR",
      "INS21.STR",
      "INS22.STR",
    ],
  };

  const siteBIdleNodes = {
    audio: ["1015", "1219", "0419", "0500", "0501", "0508", "0510", "0513"],
    video: [
      "INS16.STR",
      "INS17.STR",
      "INS18.STR",
      "INS19.STR",
      "INS20.STR",
      "INS21.STR",
      "INS22.STR",
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
