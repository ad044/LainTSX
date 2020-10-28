import React, { useCallback, useEffect, useMemo, useState } from "react";
import SiteManager from "./SiteManager";
import MiddleRingManager from "./MiddleRingManager";
import LainManager from "./LainManager";
import BlueOrbManager from "./BlueOrbManager";
import BlueOrbHUDManager from "./BlueOrbHUDManager";
import { useBlueOrbStore, useMediaStore, useSceneStore } from "../../store";
import GreenTextManager from "./GreenTextManager";
import MediaComponentManager from "./MediaComponentManager";
import MediaWordManager from "./MediaWordManager";
import MediaElementManager from "./MediaElementManager";
import SceneManager from "./SceneManager";
import YellowTextManager from "./YellowTextManager";
import MediaImageManager from "./MediaImageManager";

const getKeyCodeAssociation = (keyCode: number): string => {
  const keyCodeAssocs = {
    40: "down", // down arrow
    37: "left", // left arrow
    38: "up", // up arrow
    39: "right", // right arrow
    88: "select", // x key
  };
  return keyCodeAssocs[keyCode as keyof typeof keyCodeAssocs];
};

export type StateManagerProps = {
  eventState: string;
};

const EventManager = () => {
  const [eventState, setEventState] = useState<string>();
  const activeBlueOrb = useBlueOrbStore((state) => state.activeBlueOrbId);
  const activeMediaComponent = useMediaStore(
    (state) => state.activeMediaComponent
  );
  const currentScene = useSceneStore((state) => state.currentScene);

  const [inputCooldown, setInputCooldown] = useState(false);

  const sceneEventKey = useMemo(() => {
    const keys = {
      main: activeBlueOrb,
      media: activeMediaComponent,
    };
    return keys[currentScene as keyof typeof keys];
  }, [activeBlueOrb, activeMediaComponent, currentScene]);

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
        const eventId = `${sceneEventKey}_${keyPress}`;
        setEventState(eventId);
      }
    },
    [inputCooldown, sceneEventKey]
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
      <GreenTextManager eventState={eventState!} />
      <SiteManager eventState={eventState!} />
      <LainManager eventState={eventState!} />
      <MiddleRingManager eventState={eventState!} />
      <MediaComponentManager eventState={eventState!} />
      <MediaWordManager eventState={eventState!} />
      <MediaElementManager eventState={eventState!} />
      <SceneManager eventState={eventState!} />
      <YellowTextManager eventState={eventState!} />
      <MediaImageManager eventState={eventState!} />
    </>
  );
};

export default EventManager;
