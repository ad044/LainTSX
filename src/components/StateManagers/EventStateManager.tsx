import React, { useCallback, useEffect, useState } from "react";
import blue_orb_directions from "../../resources/blue_orb_directions.json";
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

  const [blueOrbState, setBlueOrbState] = useState<BlueOrbStateData>();

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
        const targetBlueOrbDirectionId = `${currentBlueOrb}_${keyPress}`;

        const targetBlueOrbDirectionData =
          blue_orb_directions[
            targetBlueOrbDirectionId as keyof typeof blue_orb_directions
          ];

        const targetBlueOrbId = targetBlueOrbDirectionData.id;

        const targetBlueOrbHudId = targetBlueOrbDirectionData.hud;

        const action = targetBlueOrbDirectionData.action;

        setBlueOrbState({
          targetBlueOrbId: targetBlueOrbId,
          targetBlueOrbHudId: targetBlueOrbHudId,
        });

        setEventState(action);
      } else if (blueOrbPressKeys.includes(keyPress) && !inputCooldown) {
        const action = "pickCurrentBlueOrb";

        setEventState(action);
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
      <BlueOrbStateManager
        eventState={eventState!}
        targetBlueOrbId={blueOrbState?.targetBlueOrbId}
      />
      <BlueOrbHUDStateManager
        eventState={eventState!}
        targetBlueOrbHudId={blueOrbState?.targetBlueOrbHudId}
      />
      <BlueOrbHUDTextStateManager
        eventState={eventState!}
        targetBlueOrbId={blueOrbState?.targetBlueOrbId}
        targetBlueOrbHudId={blueOrbState?.targetBlueOrbHudId}
      />
      <SiteStateManager eventState={eventState!} />
      <LainStateManager eventState={eventState!} />
      <MiddleRingStateManager eventState={eventState!} />
    </>
  );
};

export default EventStateManager;
