import React, { useCallback, useEffect, useState } from "react";
import SiteStateManager from "./SiteStateManager";
import MiddleRingStateManager from "./MiddleRingStateManager";
import LainStateManager from "./LainStateManager";
import BlueOrbStateManager from "./BlueOrbStateManager";
import BlueOrbHUDStateManager from "./BlueOrbHUDStateManager";
import BlueOrbHUDTextStateManager from "./BlueOrbHUDTextStateManager";
import { useBlueOrbStore } from "../../store";

type KeyCodeAssociations = {
  [keyCode: number]: string;
};

const getKeyCodeAssociation = (keyCode: number): string => {
  return ({
    40: "down",
    37: "left",
    38: "up",
    39: "right",
    88: "x",
  } as KeyCodeAssociations)[keyCode];
};

type BlueOrbStateData = {
  targetBlueOrbId: string;
  targetBlueOrbHudId: string;
};

const EventStateManager = () => {
  const [eventState, setEventState] = useState<string>();
  const currentBlueOrb = useBlueOrbStore((state) => state.blueOrbId);

  const [inputCooldown, setInputCooldown] = useState(false);

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyPress = getKeyCodeAssociation(keyCode);

      // changing blue orb focus/moving around the map
      const arrowKeys = ["up", "down", "left", "right"];

      // interacting with blue orbs
      const blueOrbPressKeys = ["x"];

      if (arrowKeys.includes(keyPress) && !inputCooldown) {
        // event id consists of the CURRENT blue orb id (to calculate where we're at currently)
        // and the keypress.
        // this id is later on used to get the needed corresponding data for each component
        // from blue_orb_directions.json file.
        const eventId = `${currentBlueOrb}_${keyPress}`;

        setEventState(eventId);
      }
    },
    [inputCooldown, currentBlueOrb]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      <BlueOrbStateManager eventState={eventState!} />
      <BlueOrbHUDStateManager eventState={eventState!} />
      <BlueOrbHUDTextStateManager eventState={eventState!} />
      <SiteStateManager eventState={eventState!} />
      <LainStateManager eventState={eventState!} />
      <MiddleRingStateManager eventState={eventState!} />
    </>
  );
};

export default EventStateManager;
