import React, { useCallback, useEffect, useState } from "react";
import { getKeyCodeAssociation } from "../../utils/keyPressUtils";

const GateSceneManager = () => {
  const [eventState, setEventState] = useState<any>();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);

      return () => {
        setLoaded(false);
      };
    }, 3500);
  }, []);

  const handleKeyPress = useCallback((event) => {
    const { keyCode } = event;

    const keyPress = getKeyCodeAssociation(keyCode);

    if (keyPress && loaded) {
      const event = { event: "exit_gate" };
      setEventState(event);
    }
  }, [loaded]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return <SceneManager eventState={eventState!} />;
};

export default GateSceneManager;
