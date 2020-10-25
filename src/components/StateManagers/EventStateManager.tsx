import React, { useCallback, useEffect, useState } from "react";
import SiteManager from "./MainScene/SiteManager";
import MiddleRingManager from "./MainScene/MiddleRingManager";
import LainManager from "./MainScene/LainManager";
import BlueOrbManager from "./MainScene/BlueOrbManager";
import BlueOrbHUDManager from "./MainScene/BlueOrbHUDManager";
import MainYellowTextManager from "./MainScene/MainYellowTextManager";
import { useBlueOrbStore, useMediaStore } from "../../store";
import GreenTextManager from "./MainScene/GreenTextManager";
import ActiveMediaElementManager from "./MediaScene/ActiveMediaElementManager";
import WordManager from "./MediaScene/WordManager";
import MediaYellowTextManager from "./MediaScene/MediaYellowTextManager";

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
        const eventId = `${activeBlueOrb}_${keyPress}`;
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
      <BlueOrbManager eventState={eventState!} />
      <BlueOrbHUDManager eventState={eventState!} />
      <MainYellowTextManager eventState={eventState!} />
      <GreenTextManager eventState={eventState!} />
      <SiteManager eventState={eventState!} />
      <LainManager eventState={eventState!} />
      <MiddleRingManager eventState={eventState!} />
      <ActiveMediaElementManager eventState={eventState!} />
      <WordManager eventState={eventState!} />
      <MediaYellowTextManager eventState={eventState!} />
    </>
  );
};

export default EventStateManager;
