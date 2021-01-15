import React, { useCallback, useEffect, useState } from "react";
import { useMediaStore, useMediaWordStore } from "../../store";
import { getKeyCodeAssociation } from "../utils/keyPressUtils";
import SceneManager from "./GameManagers/SceneManager";
import handleMediaSceneEvent from "../mediaSceneEventHandler";
import MediaComponentManager from "./MediaSceneManagers/MediaComponentManager";
import MediaYellowTextManager from "./MediaSceneManagers/MediaYellowTextManager";

const MediaSceneEventManager = () => {
  // all the possible context needed to calculate new state
  const mediaComponentMatrixIndices = useMediaStore(
    (state) => state.componentMatrixIndices
  );

  const activeMediaComponent = useMediaStore(
    useCallback(
      (state) =>
        state.componentMatrix[mediaComponentMatrixIndices.sideIdx][
          mediaComponentMatrixIndices.sideIdx === 0
            ? mediaComponentMatrixIndices.leftSideIdx
            : mediaComponentMatrixIndices.rightSideIdx
        ],
      [mediaComponentMatrixIndices]
    )
  );
  const rightSideComponentIdx = useMediaStore(
    (state) => state.componentMatrixIndices.rightSideIdx
  );

  const wordPosStateIdx = useMediaWordStore((state) => state.posStateIdx);

  const [eventState, setEventState] = useState<any>();

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyPress = getKeyCodeAssociation(keyCode);

      if (keyPress) {
        const event = handleMediaSceneEvent({
          keyPress: keyPress,
          activeMediaComponent: activeMediaComponent,
          wordPosStateIdx: wordPosStateIdx,
          rightSideComponentIdx: rightSideComponentIdx,
        });

        setEventState(event);
      }
    },
    [activeMediaComponent, rightSideComponentIdx, wordPosStateIdx]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      <MediaComponentManager eventState={eventState!} />
      <SceneManager eventState={eventState!} />
      <MediaYellowTextManager eventState={eventState!} />
    </>
  );
};

export default MediaSceneEventManager;
