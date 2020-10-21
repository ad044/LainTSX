import React, { useCallback, useEffect, useState } from "react";
import SiteStateManager from "./SiteStateManager";
import MiddleRingStateManager from "./MiddleRingStateManager";
import LainStateManager from "./LainStateManager";
import BlueOrbStateManager from "./BlueOrbStateManager";
import BlueOrbHUDStateManager from "./BlueOrbHUDStateManager";
import YellowTextStateManager from "./YellowTextStateManager";
import { useBlueOrbStore, useMediaStore } from "../../store";
import GreenTextStateManager from "./GreenTextStateManager";
import ActiveMediaElementStateManager from "./MediaScene/ActiveMediaElementStateManager";
import MediaWordStateManager from "./MediaScene/MediaWordStateManager";
import MediaYellowTextStateManager from "./MediaScene/MediaYellowTextStateManager";

const getKeyCodeAssociation = (keyCode: number): string => {
  const keyCodeAssocs = {
    40: "down", // down arrow
    37: "left", // left arrow
    38: "up", // up arrow
    39: "right", // right arrow
    88: "pick", // x key
  };
  return keyCodeAssocs[keyCode as keyof typeof keyCodeAssocs];
};

export type StateManagerProps = {
  eventState: string;
};

const EventStateManager = () => {
  const [eventState, setEventState] = useState<string>();
  const activeBlueOrb = useBlueOrbStore((state) => state.blueOrbId);
  const activeMediaElement = useMediaStore((state) => state.activeMediaElement);

  const [inputCooldown, setInputCooldown] = useState(false);

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyPress = getKeyCodeAssociation(keyCode);

      if (keyPress && !inputCooldown) {
        // event id consists of the CURRENT blue orb id (to calculate where we're at currently)
        // and the keypress.
        // this id is later on used to get the needed corresponding data for each component
        // from blue_orb_directions.json file.
        // const eventId = `${activeBlueOrb}_${keyPress}`;
        //
        const eventId = `${activeMediaElement}_${keyPress}`;
        setEventState(eventId);
      }
    },
    [inputCooldown, activeBlueOrb, activeMediaElement]
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
      <YellowTextStateManager eventState={eventState!} />
      <GreenTextStateManager eventState={eventState!} />
      <SiteStateManager eventState={eventState!} />
      <LainStateManager eventState={eventState!} />
      <MiddleRingStateManager eventState={eventState!} />
      <ActiveMediaElementStateManager eventState={eventState!} />
      <MediaWordStateManager eventState={eventState!} />
      <MediaYellowTextStateManager eventState={eventState!} />
    </>
  );
};

export default EventStateManager;
