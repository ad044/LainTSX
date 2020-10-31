import { GameContext } from "../components/StateManagers/EventManager";
import available_blue_orbs_on_projection from "../resources/available_blue_orbs_on_projection.json";

const computeAction = (gameContext: GameContext) => {
  let event;
  let newBlueOrbColIdx;
  let newBlueOrbRowIdx;
  let newLevel;
  let newSiteRotIdx;
  let newActiveBlueOrbId;

  switch (gameContext.keyPress) {
    case "left":
      newBlueOrbColIdx = gameContext.blueOrbColIdx - 1;
      if (newBlueOrbColIdx < 0) {
        event = "move_left";
        newSiteRotIdx = parseInt(gameContext.siteRotIdx) + 1;
        if (newSiteRotIdx > 8) newSiteRotIdx = "1";
        console.log(newSiteRotIdx)
        newBlueOrbColIdx = 0;
        newBlueOrbRowIdx = gameContext.blueOrbRowIdx;
        newLevel = gameContext.currentLevel;
      } else {
        event = "change_blue_orb";
        newBlueOrbRowIdx = gameContext.blueOrbRowIdx;
        newLevel = gameContext.currentLevel;
        newSiteRotIdx = gameContext.siteRotIdx;
      }
      break;
    case "down":
      newBlueOrbRowIdx = gameContext.blueOrbRowIdx + 1;
      if (newBlueOrbRowIdx > 2) {
        event = "move_down";

        newLevel = (parseInt(gameContext.currentLevel) - 1)
          .toString()
          .padStart(2, "0");

        newBlueOrbColIdx = gameContext.blueOrbColIdx;
        newBlueOrbRowIdx = 0;

        newSiteRotIdx = gameContext.siteRotIdx;
      } else {
        event = "change_blue_orb";
        newBlueOrbColIdx = gameContext.blueOrbColIdx;
        newLevel = gameContext.currentLevel;
        newSiteRotIdx = gameContext.siteRotIdx;
      }
      break;
    case "up":
      newBlueOrbRowIdx = gameContext.blueOrbRowIdx - 1;
      if (newBlueOrbRowIdx < 0) {
        event = "move_up";

        newLevel = (parseInt(gameContext.currentLevel) + 1)
          .toString()
          .padStart(2, "0");

        newBlueOrbColIdx = gameContext.blueOrbColIdx;
        newBlueOrbRowIdx = 2;

        newSiteRotIdx = gameContext.siteRotIdx;
      } else {
        event = "change_blue_orb";
        newBlueOrbColIdx = gameContext.blueOrbColIdx;
        newLevel = gameContext.currentLevel;
        newSiteRotIdx = gameContext.siteRotIdx;
      }
      break;
    case "right":
      newBlueOrbColIdx = gameContext.blueOrbColIdx + 1;
      if (newBlueOrbColIdx > 3) {
        event = "move_right";
        newSiteRotIdx = (parseInt(gameContext.siteRotIdx) - 1).toString();
        newBlueOrbColIdx = 0;
        newBlueOrbRowIdx = gameContext.blueOrbRowIdx;
        newLevel = gameContext.currentLevel;
      } else {
        event = "change_blue_orb";
        newBlueOrbRowIdx = gameContext.blueOrbRowIdx;
        newLevel = gameContext.currentLevel;
        newSiteRotIdx = gameContext.siteRotIdx;
      }
  }

  newActiveBlueOrbId =
    newLevel +
    available_blue_orbs_on_projection[
      newSiteRotIdx as keyof typeof available_blue_orbs_on_projection
    ][newBlueOrbRowIdx as number][newBlueOrbColIdx as number];

  return {
    event: event,
    newBlueOrbColIdx: newBlueOrbColIdx,
    newBlueOrbRowIdx: newBlueOrbRowIdx,
    newSiteRotIdx: newSiteRotIdx,
    newLevel: newLevel,
    newActiveBlueOrbId: newActiveBlueOrbId,
  };
};

export default computeAction;
