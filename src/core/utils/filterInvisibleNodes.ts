import {
  NodeDataType,
  SiteType,
} from "../../components/MainScene/SyncedComponents/Site";
import game_progress from "../../resources/initial_progress.json";
import { isNodeVisible } from "../nodeSelector";

const filterInvisibleNodes = (
  siteData: SiteType,
  gameProgress: typeof game_progress
) => {
  const visibleNodes: NodeDataType[] = [];
  Object.values(siteData).forEach((level) => {
    Object.values(level).forEach((node) => {
      if (isNodeVisible(node, gameProgress)) visibleNodes.push(node);
    });
  });

  return visibleNodes;
};

export default filterInvisibleNodes;
