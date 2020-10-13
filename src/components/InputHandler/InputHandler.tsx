import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentBlueOrbAnimatingAtom,
  currentBlueOrbAtom,
  currentBlueOrbPosXAtom,
  currentBlueOrbPosYAtom,
  currentBlueOrbPosZAtom,
} from "../BlueOrb/CurrentBlueOrbAtom";
import blue_orb_directions from "../../resources/blue_orb_directions.json";
import blue_orb_positions from "../../resources/blue_orb_positions.json";
import level_y_values from "../../resources/level_y_values.json";
import site_a from "../../resources/site_a.json";
import { lainMovingAtom } from "../Lain/LainAtom";
import SiteStateManager from "./SiteStateManager";
import MiddleRingStateManager from "./MiddleRingStateManager";
import LainStateManager from "./LainStateManager";
import BlueOrbStateManager from "./BlueOrbStateManager";
import BlueOrbHUDStateManager from "./BlueOrbHUDStateManager";
import BlueOrbHUDTextStateManager from "./BlueOrbHUDTextStateManager";

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
  const currentBlueOrb = useRecoilValue(currentBlueOrbAtom);
  const setCurrentBlueOrbAnimating = useSetRecoilState(
    currentBlueOrbAnimatingAtom
  );

  const [blueOrbStateData, setBlueOrbStateData] = useState<BlueOrbStateData>();

  const setCurrentBlueOrbPosX = useSetRecoilState(currentBlueOrbPosXAtom);
  const setCurrentBlueOrbPosY = useSetRecoilState(currentBlueOrbPosYAtom);
  const setCurrentBlueOrbPosZ = useSetRecoilState(currentBlueOrbPosZAtom);

  const [inputCooldown, setInputCooldown] = useState(false);

  const moveAndRotationEvents = useMemo(
    () => ({
      up: "moveUp",
      down: "moveDown",
      left: "rotateLeft",
      right: "rotateRight",
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
          const event =
            moveAndRotationEvents[
              keyPress as keyof typeof moveAndRotationEvents
            ];

          setEventState(event);
        } else {
          const event =
            blueOrbChangeEvents[keyPress as keyof typeof blueOrbChangeEvents];

          setEventState(event);
        }
      } else if (blueOrbPressKeys.includes(keyPress) && !inputCooldown) {
        const currentBlueOrbLevel = currentBlueOrb.substr(0, 2);
        const currentBlueOrbPosId = currentBlueOrb.substr(2);

        const levelYVal =
          level_y_values[currentBlueOrbLevel as keyof typeof level_y_values];

        const currentBlueOrbPos =
          blue_orb_positions[
            currentBlueOrbPosId as keyof typeof blue_orb_positions
          ].position;

        setCurrentBlueOrbPosX(currentBlueOrbPos[0]);
        setCurrentBlueOrbPosY(currentBlueOrbPos[1] + levelYVal);
        setCurrentBlueOrbPosZ(currentBlueOrbPos[2]);

        setTimeout(() => {
          setCurrentBlueOrbAnimating(true);
          setCurrentBlueOrbPosX(0.5);
          setCurrentBlueOrbPosY(levelYVal);
          setCurrentBlueOrbPosZ(0);
        }, 1500);

        setTimeout(() => {
          setCurrentBlueOrbAnimating(false);
        }, 4200);
      }
    },
    [
      inputCooldown,
      currentBlueOrb,
      moveAndRotationEvents,
      blueOrbChangeEvents,
      setCurrentBlueOrbPosX,
      setCurrentBlueOrbPosY,
      setCurrentBlueOrbPosZ,
      setCurrentBlueOrbAnimating,
    ]
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
