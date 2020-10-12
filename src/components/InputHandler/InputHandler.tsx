import React, { useCallback, useEffect, useState } from "react";
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
import site_a from "../../resources/site_a.json";
import { lainMovingAtom } from "../Lain/LainAtom";
import BlueOrbStateManager from "./BlueOrbStateManager";
import SiteStateManager from "./SiteStateManager";
import HUDStateManager from "./HUDStateManager";
import HUDTextStateManager from "./HUDTextStateManager";
import LainStateManager from "./LainStateManager";
import MiddleRingStateManager from "./MiddleRingStateManager";

type KeyCodeAssociations = {
  [keyCode: number]: string;
};

type ActionObject = {
  moveDirection: string | undefined;
  targetBlueOrbId: string;
  targetBlueOrbHudId: string;
  targetBlueOrbGreenText: string;
};

export type StateManagerProps = {
  eventState: ActionObject;
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

const InputHandler = () => {
  const [eventState, setEventState] = useState<ActionObject>();
  const currentBlueOrb = useRecoilValue(currentBlueOrbAtom);
  const setCurrentBlueOrbAnimating = useSetRecoilState(
    currentBlueOrbAnimatingAtom
  );

  const setCurrentBlueOrbPosX = useSetRecoilState(currentBlueOrbPosXAtom);
  const setCurrentBlueOrbPosY = useSetRecoilState(currentBlueOrbPosYAtom);
  const setCurrentBlueOrbPosZ = useSetRecoilState(currentBlueOrbPosZAtom);

  const lainMoving = useRecoilValue(lainMovingAtom);

  const [inputCooldown, setInputCooldown] = useState(false);

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyCodeAssoc = getKeyCodeAssociation(keyCode);

      let moveDirection;
      let action;

      if (keyCodeAssoc !== "x") {
        moveDirection = keyCodeAssoc;
      } else {
        action = "throw_blue_orb";
      }

      if (moveDirection && !lainMoving && !inputCooldown) {
        const key = `${currentBlueOrb}_${moveDirection}`;

        const targetBlueOrb =
          blue_orb_directions[key as keyof typeof blue_orb_directions];

        const targetBlueOrbHudId = targetBlueOrb.hud;

        const targetBlueOrbIdUnfiltered = targetBlueOrb.id;

        const targetBlueOrbIdFiltered =
          targetBlueOrbIdUnfiltered[0] === "+"
            ? targetBlueOrbIdUnfiltered.substr(1)
            : targetBlueOrbIdUnfiltered;

        const targetBlueOrbGreenText =
          site_a[targetBlueOrbIdFiltered as keyof typeof site_a].green_text;

        if (targetBlueOrbIdUnfiltered[0] === "+") {
          setEventState({
            moveDirection: moveDirection,
            targetBlueOrbId: targetBlueOrbIdFiltered,
            targetBlueOrbHudId: targetBlueOrbHudId,
            targetBlueOrbGreenText: targetBlueOrbGreenText,
          });
        } else {
          setEventState({
            moveDirection: undefined,
            targetBlueOrbId: targetBlueOrbIdFiltered,
            targetBlueOrbHudId: targetBlueOrbHudId,
            targetBlueOrbGreenText: targetBlueOrbGreenText,
          });
        }
      } else if (action && !lainMoving && !inputCooldown) {
        const currentBlueOrbPosId = currentBlueOrb.substr(2);

        const currentBlueOrbPos =
          blue_orb_positions[
            currentBlueOrbPosId as keyof typeof blue_orb_positions
          ].position;

        setCurrentBlueOrbPosX(currentBlueOrbPos[0]);
        setCurrentBlueOrbPosY(currentBlueOrbPos[1]);
        setCurrentBlueOrbPosZ(currentBlueOrbPos[2]);

        setTimeout(() => {
          setCurrentBlueOrbAnimating(true);
          setCurrentBlueOrbPosX(0.5);
          setCurrentBlueOrbPosY(0);
          setCurrentBlueOrbPosZ(0);
        }, 1500);

        setTimeout(() => {
          setCurrentBlueOrbAnimating(false);
        }, 4200);
      }
    },
    [
      lainMoving,
      inputCooldown,
      currentBlueOrb,
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
      <BlueOrbStateManager eventState={eventState!} />
      <SiteStateManager eventState={eventState!} />
      <HUDStateManager eventState={eventState!} />
      <HUDTextStateManager eventState={eventState!} />
      <LainStateManager eventState={eventState!} />
      <MiddleRingStateManager eventState={eventState!} />
    </>
  );
};

export default InputHandler;
