import { SiteType } from "../../components/MainScene/SyncedComponents/Site";
import game_progress from "../../resources/initial_progress.json";
import { isNodeVisible } from "../nodeSelector";

const filterInvisibleNodes = (
  siteData: SiteType,
  gameProgress: typeof game_progress
) => {
  const visibleNodes: SiteType = {};
  Object.entries(siteData).forEach((level) => {
    visibleNodes[level[0]] = {};
    Object.entries(level[1]).forEach((node) => {
      if (isNodeVisible(node[1], gameProgress)) {
        visibleNodes[level[0]][node[0]] = node[1];
      }
    });
  });

  return visibleNodes;
};

export default filterInvisibleNodes;
