const handleSSknSceneEvent = (ssknSceneContext: any) => {
  const { keyPress, activeSSknComponent } = ssknSceneContext;
  
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
