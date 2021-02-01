import React, { useCallback, useEffect, useMemo } from "react";
import { getMediaSceneContext } from "../../store";
import { getKeyCodeAssociation } from "../../utils/keyPressUtils";
import mediaManager from "../setters/media/mediaManager";
import handleMediaSceneEvent from "../mediaSceneEventHandler";
import sceneManager from "../setters/sceneManager";

const MediaSceneEventManager = () => {
  const mediaSceneSetters = useMemo(() => [mediaManager, sceneManager], []);

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyPress = getKeyCodeAssociation(keyCode);

      if (keyPress) {
        const ctx = { ...getMediaSceneContext(), keyPress: keyPress };

        const event = handleMediaSceneEvent(ctx);

        mediaSceneSetters.forEach((fn) => fn(event));
      }
    },
    [mediaSceneSetters]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return null;
};

export default MediaSceneEventManager;
