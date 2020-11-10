import { GameContext } from "./StateManagers/EventManager";

const handleBootEvent = (gameContext: GameContext) => {
  const keyPress = gameContext.keyPress;

  const activeMainMenuElement = gameContext.activeMainMenuElement;
  const currentSubscene = gameContext.subscene;

  switch (keyPress) {
    case "down":
    case "up":
    case "left":
    case "right":
      return { event: `${currentSubscene}_${keyPress}` };
    case "select":
      return { event: `select_${activeMainMenuElement}` };
  }
};

export default handleBootEvent;
