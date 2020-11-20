import { GameContext } from "./StateManagers/EventManager";

const handleBootEvent = (gameContext: GameContext) => {
  const keyPress = gameContext.keyPress;

  const activeBootElement = gameContext.activeBootElement;
  const currentSubscene = gameContext.bootSubscene;

  switch (keyPress) {
    case "down":
    case "up":
    case "left":
    case "right":
    case "back":
      return { event: `${currentSubscene}_${keyPress}` };
    case "select":
      return { event: `${activeBootElement}_${keyPress}` };
  }
};

export default handleBootEvent;
