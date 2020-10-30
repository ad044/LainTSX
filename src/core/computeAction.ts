import { GameContext } from "../components/StateManagers/EventManager";

const computeAction = (gameContext: GameContext) => {
  let event;
  let newBlueOrbColIdx;
  let newBlueOrbRowIdx;
  let newLevel;
  let newSiteRotIdx;

  switch (gameContext.keyPress) {
    case "left":
      newBlueOrbRowIdx = gameContext.blueOrbRowIdx - 1;
      if (newBlueOrbRowIdx < 0) {
        return { event: "move_left" };
      } else {
        return { event: "change_blue_orb_left" };
      }
    case "down":
      newBlueOrbColIdx = gameContext.blueOrbColIdx + 1;
      if (newBlueOrbColIdx > 2) {
        event = "move_down";

        newLevel = (parseInt(gameContext.currentLevel) - 1)
          .toString()
          .padStart(2, "0");
      } else {
        event = "change_blue_orb";
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
      }
  }

  return {
    event: event,
    newBlueOrbColIdx: newBlueOrbColIdx,
    newBlueOrbRowIdx: newBlueOrbRowIdx,
    newSiteRotIdx: newSiteRotIdx,
    newLevel: newLevel,
  };
};

export default computeAction;
