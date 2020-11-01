import { GameContext } from "../components/StateManagers/EventManager";
import available_blue_orbs_on_projection from "../resources/available_blue_orbs_on_projection.json";

const hudAssocs = {
  "00": "fg_hud_1",
  "10": "fg_hud_2",
  "20": "fg_hud_3",
  "01": "bg_hud_1",
  "11": "bg_hud_2",
  "21": "bg_hud_3",
  "02": "bg_hud_4",
  "12": "bg_hud_5",
  "22": "bg_hud_6",
  "03": "fg_hud_4",
  "13": "fg_hud_5",
  "23": "fg_hud_6",
};

const handleMainSceneEvent = (gameContext: GameContext) => {
  let event;

  const keyPress = gameContext.keyPress;

  let newBlueOrbColIdx = gameContext.blueOrbColIdx;
  let newBlueOrbRowIdx = gameContext.blueOrbRowIdx;
  let newLevel = gameContext.currentLevel;
  let newSiteRotIdx: string | number = gameContext.siteRotIdx;
  let newScene = gameContext.scene;

  switch (keyPress) {
    case "left":
      newBlueOrbColIdx = gameContext.blueOrbColIdx - 1;
      if (newBlueOrbColIdx < 0) {
        event = "move_left";
        newSiteRotIdx = parseInt(gameContext.siteRotIdx) + 1;
        if (newSiteRotIdx > 8) newSiteRotIdx = "1";
        newBlueOrbColIdx = 0;
      } else {
        event = "change_blue_orb";
      }
      break;
    case "down":
      newBlueOrbRowIdx = gameContext.blueOrbRowIdx + 1;
      if (newBlueOrbRowIdx > 2) {
        event = "move_down";

        newLevel = (parseInt(gameContext.currentLevel) - 1)
          .toString()
          .padStart(2, "0");
        newBlueOrbRowIdx = 0;
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

        newBlueOrbRowIdx = 2;
      } else {
        event = "change_blue_orb";
      }
      break;
    case "right":
      newBlueOrbColIdx = gameContext.blueOrbColIdx + 1;
      if (newBlueOrbColIdx > 3) {
        event = "move_right";
        newSiteRotIdx = (parseInt(gameContext.siteRotIdx) - 1).toString();
        newBlueOrbColIdx = 0;
      } else {
        event = "change_blue_orb";
      }
      break;
    case "select":
      event = "throw_blue_orb";
      newScene = "media";
  }

  const newActiveBlueOrbId =
    newLevel +
    available_blue_orbs_on_projection[
      newSiteRotIdx as keyof typeof available_blue_orbs_on_projection
    ][newBlueOrbRowIdx as number][newBlueOrbColIdx as number];

  const newActiveHudId =
    hudAssocs[
      `${newBlueOrbRowIdx}${newBlueOrbColIdx}` as keyof typeof hudAssocs
    ];
  return {
    event: event,
    newBlueOrbColIdx: newBlueOrbColIdx,
    newBlueOrbRowIdx: newBlueOrbRowIdx,
    newSiteRotIdx: newSiteRotIdx,
    newLevel: newLevel,
    newScene: newScene,
    newActiveBlueOrbId: newActiveBlueOrbId,
    newActiveHudId: newActiveHudId,
  };
};

export default handleMainSceneEvent;
