import React, { useCallback, useEffect, useState } from "react";
import { getKeyCodeAssociation } from "../utils/keyPressUtils";
import SceneManager from "./GameManagers/SceneManager";
import handleSSknSceneEvent from "../ssknSceneEventHandler";
import { useStore } from "../../store";
import SSknComponentManager from "./SSknSceneManagers/SSknComponentManager";

const SSknSceneManager = () => {
  // all the possible context needed to calculate new state
  const activeSSknComponent = useStore(
    useCallback(
      (state) => state.ssknComponentMatrix[state.ssknComponentMatrixIdx],
      []
    )
  );

  const [eventState, setEventState] = useState<any>();

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyPress = getKeyCodeAssociation(keyCode);

      if (keyPress) {
        const event = handleSSknSceneEvent({
          keyPress: keyPress,
          activeSSknComponent: activeSSknComponent,
        });

        setEventState(event);
      }
    },
    [activeSSknComponent]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      <SceneManager eventState={eventState!} />
      <SSknComponentManager eventState={eventState!} />
    </>
  );
};

export default SSknSceneManager;
