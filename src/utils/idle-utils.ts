import site_a from "../resources/site_a.json";
import site_b from "../resources/site_b.json";
import { SiteType } from "../components/MainScene/Site";
import { useStore } from "../store";

export const getRandomIdleMedia = (site: string) => {
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

  const siteData = site === "a" ? site_a : site_b;
  const idleNodes = site === "a" ? siteAIdleNodes : siteBIdleNodes;

  if (Math.random() < 0.5) {
    const nodeToPlay =
      idleNodes.audio[Math.floor(Math.random() * idleNodes.audio.length)];

    const level = nodeToPlay.substr(0, 2);

    const images = (siteData as SiteType)[level][nodeToPlay]
      .image_table_indices;
    const media = (siteData as SiteType)[level][nodeToPlay].media_file;

    useStore.setState({
      idleImages: images,
      idleMedia: media,
    });
  } else {
    useStore.setState({
      idleMedia:
        idleNodes.video[Math.floor(Math.random() * idleNodes.video.length)],
    });
  }
};

export const getRandomIdleLainAnim = () => {
  const moves = [
    "prayer",
    "touch_sleeve",
    "thinking",
    "stretch_2",
    "stretch",
    "spin",
    "scratch_head",
    "blush",
    "hands_behind_head",
    "hands_on_hips",
    "hands_on_hips_2",
    "hands_together",
    "lean_forward",
    "lean_left",
    "lean_right",
    "look_around",
    "play_with_hair",
  ];

  return moves[Math.floor(Math.random() * moves.length)];
};
