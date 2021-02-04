const handleSSknSceneEvent = (ssknSceneContext: any) => {
  const { keyPress, activeSSknComponent, activeNode } = ssknSceneContext;

  switch (keyPress) {
    case "UP":
    case "DOWN":
      return {
        event: `${activeSSknComponent}_${keyPress.toLowerCase()}`,
      };
    case "CIRCLE":
      if (activeSSknComponent === "ok") {
        return {
          event: `sskn_${activeSSknComponent}_select`,
          nodeName: activeNode.node_name,
        };
      } else {
        return {
          event: `${activeSSknComponent}_select`,
        };
      }
  }
};

export default handleSSknSceneEvent;
