const handleBootEvent = (gameContext: any) => {
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
      switch (currentSubscene) {
        case "authorize_user":
      }
      return { event: `${activeBootElement}_${keyPress}` };
  }
};

export default handleBootEvent;
