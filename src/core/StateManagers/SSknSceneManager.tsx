import React, { useCallback, useEffect, useMemo } from "react";
import { getKeyCodeAssociation } from "../../utils/keyPressUtils";
import handleSSknSceneEvent from "../ssknSceneEventHandler";
import { getSSknSceneContext } from "../../store";
import ssknManager from "../setters/sskn/ssknManager";
import sceneManager from "../setters/sceneManager";

const SSknSceneManager = () => {
  const ssknSceneSetters = useMemo(() => [ssknManager, sceneManager], []);

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyPress = getKeyCodeAssociation(keyCode);

      if (keyPress) {
        const ctx = { ...getSSknSceneContext(), keyPress: keyPress };

        const event = handleSSknSceneEvent(ctx);

        ssknSceneSetters.forEach((fn) => fn(event));
      }
    },
    [ssknSceneSetters]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return null;
};

export default SSknSceneManager;
