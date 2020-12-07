const handleSSknSceneEvent = (gameContext: any) => {
  const keyPress = gameContext.keyPress;
  const activeSSknComponent = gameContext.activeSSknComponent;
  switch (keyPress) {
    case "UP":
    case "DOWN":
      return {
        event: `${activeSSknComponent}_${keyPress.toLowerCase()}`,
      };
    case "CIRCLE":
      return {
        event: `${activeSSknComponent}_select`,
      };
  }
};

export default handleSSknSceneEvent;
