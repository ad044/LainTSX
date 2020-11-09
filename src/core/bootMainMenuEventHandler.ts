import { GameContext } from "./StateManagers/EventManager";

const handleBootMainMenuEvent = (gameContext: GameContext) => {
  const keyPress = gameContext.keyPress;

  const activeMainMenuElement = gameContext.activeMainMenuElement;

  switch (keyPress) {
    case "down":
      return { event: "switch_to_load_data" };
    case "up":
      return { event: "switch_to_authorize_user" };
    case "select":
      return { event: `select_${activeMainMenuElement}` };
  }
};

export default handleBootMainMenuEvent;
