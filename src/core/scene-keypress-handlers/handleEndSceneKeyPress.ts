const handleEndSceneKeyPress = (endSceneContext: any) => {
  const { keyPress, selectionVisible, activeEndComponent } = endSceneContext;

  if (selectionVisible) {
    switch (keyPress) {
      case "UP":
      case "DOWN":
        return { event: `end_selection_${keyPress.toLowerCase()}` };
      case "CIRCLE":
        return { event: `end_${activeEndComponent}_select` };
    }
  }
};

export default handleEndSceneKeyPress;
