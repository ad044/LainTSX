import React, { useCallback, useEffect, useState } from "react";
import { useStore } from "../../store";
import { getKeyCodeAssociation } from "../utils/keyPressUtils";
import SceneManager from "./GameManagers/SceneManager";
import handleMediaSceneEvent from "../mediaSceneEventHandler";
import MediaComponentManager from "./MediaSceneManagers/MediaComponentManager";

const MediaSceneEventManager = () => {
  // all the possible context needed to calculate new state
  const activeMediaComponent = useStore(
    useCallback(
      (state) =>
        state.mediaComponentMatrix[state.mediaComponentMatrixIndices.sideIdx][
          state.mediaComponentMatrixIndices.sideIdx === 0
            ? state.mediaComponentMatrixIndices.leftSideIdx
            : state.mediaComponentMatrixIndices.rightSideIdx
        ],
      []
    )
  );

  const rightSideComponentIdx = useStore(
    (state) => state.mediaComponentMatrixIndices.rightSideIdx
  );

  const wordPosStateIdx = useStore(
    (state) => state.mediaWordPosStateIdx
  );

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
    </>
  );
};

export default MediaSceneEventManager;
