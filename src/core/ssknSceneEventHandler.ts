const handleSSknSceneEvent = (gameContext: any) => {
  const keyPress = gameContext.keyPress;
  const activeSSknComponent = gameContext.activeSSknComponent;
  return { event: `${activeSSknComponent}_${keyPress}` };
};

export default handleSSknSceneEvent;
