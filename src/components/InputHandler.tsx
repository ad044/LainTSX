import React, { useCallback, useEffect, useMemo, useState } from "react";
import blue_orb_directions from "../resources/blue_orb_directions.json";
import site_a from "../resources/site_a.json";
import SiteStateManager from "./StateManagers/SiteStateManager";
import MiddleRingStateManager from "./StateManagers/MiddleRingStateManager";
import LainStateManager from "./StateManagers/LainStateManager";
import BlueOrbStateManager from "./StateManagers/BlueOrbStateManager";
import BlueOrbHUDStateManager from "./StateManagers/BlueOrbHUDStateManager";
import BlueOrbHUDTextStateManager from "./StateManagers/BlueOrbHUDTextStateManager";
import { useBlueOrbStore } from "../store";

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
  targetBlueOrbGreenText: string;
};

const InputHandler = () => {
  const [eventState, setEventState] = useState<string>();
  const currentBlueOrb = useBlueOrbStore((state) => state.blueOrbId);

  const [blueOrbStateData, setBlueOrbStateData] = useState<BlueOrbStateData>();

  const [inputCooldown, setInputCooldown] = useState(false);

  const moveEvents = useMemo(
    () => ({
      up: "moveUp",
      down: "moveDown",
      left: "moveLeft",
      right: "moveRight",
    }),
    []
  );

  const blueOrbChangeEvents = useMemo(
    () => ({
      up: "changeBlueOrbUp",
      down: "changeBlueOrbDown",
      left: "changeBlueOrbLeft",
      right: "changeBlueOrbRight",
    }),
    []
  );

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

        const targetBlueOrb =
          blue_orb_directions[
            targetBlueOrbDirectionId as keyof typeof blue_orb_directions
          ];

        const targetBlueOrbIdUnfiltered = targetBlueOrb.id;

        // + in the json denotes that the target blue orb is not currently visible
        // on screen (lain needs to move up/down/left/right), and then choose it.
        const moveOrRotate = targetBlueOrbIdUnfiltered[0] === "+";

        const targetBlueOrbId =
          targetBlueOrbIdUnfiltered[0] === "+"
            ? targetBlueOrbIdUnfiltered.substr(1)
            : targetBlueOrbIdUnfiltered;

        const targetBlueOrbHudId = targetBlueOrb.hud;

        const targetBlueOrbGreenText =
          site_a[targetBlueOrbId as keyof typeof site_a].green_text;

        setBlueOrbStateData({
          targetBlueOrbId: targetBlueOrbId,
          targetBlueOrbHudId: targetBlueOrbHudId,
          targetBlueOrbGreenText: targetBlueOrbGreenText,
        });

        if (moveOrRotate) {
          const event = moveEvents[keyPress as keyof typeof moveEvents];

          setEventState(event);
        } else {
          const event =
            blueOrbChangeEvents[keyPress as keyof typeof blueOrbChangeEvents];

          setEventState(event);
        }
      } else if (blueOrbPressKeys.includes(keyPress) && !inputCooldown) {
      }
    },
    [inputCooldown, currentBlueOrb, moveEvents, blueOrbChangeEvents]
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
        targetBlueOrbId={blueOrbStateData?.targetBlueOrbId}
      />
      <BlueOrbHUDStateManager
        eventState={eventState!}
        targetBlueOrbHudId={blueOrbStateData?.targetBlueOrbHudId}
        targetBlueOrbGreenText={blueOrbStateData?.targetBlueOrbGreenText}
      />
      <BlueOrbHUDTextStateManager
        eventState={eventState!}
        targetBlueOrbId={blueOrbStateData?.targetBlueOrbId}
        targetBlueOrbHudId={blueOrbStateData?.targetBlueOrbHudId}
      />
      <SiteStateManager eventState={eventState!} />
      <LainStateManager eventState={eventState!} />
      <MiddleRingStateManager eventState={eventState!} />
    </>
  );
};

export default InputHandler;
