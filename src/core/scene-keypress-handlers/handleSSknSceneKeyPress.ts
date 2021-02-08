const handleSSknSceneKeyPress = (ssknSceneContext: any) => {
  const { keyPress, activeSSknComponent, activeNode } = ssknSceneContext;

  switch (keyPress) {
    case "UP":
    case "DOWN":
      return {
        event: `sskn_${activeSSknComponent}_${keyPress.toLowerCase()}`,
      };
    case "CIRCLE":
      if (activeSSknComponent === "ok") {
        return {
          event: `sskn_ok_select`,
          node: activeNode,
        };
      } else {
        return {
          event: `sskn_cancel_select`,
        };
      }
  }
};

export default handleSSknSceneKeyPress;
