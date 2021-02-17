import { SsknSceneContext } from "../../store";

const handleSsknSceneKeyPress = (ssknSceneContext: SsknSceneContext) => {
  const { keyPress, activeSsknComponent, activeNode } = ssknSceneContext;

  switch (keyPress) {
    case "UP":
    case "DOWN":
      return {
        event: `sskn_${activeSsknComponent}_${keyPress.toLowerCase()}`,
      };
    case "CIRCLE":
      if (activeSsknComponent === "ok") {
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

export default handleSsknSceneKeyPress;
