import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import lain_animations from "../../resources/lain_animations.json";
import {
  currentHUDAtom,
  hudActiveAtom,
  mediumHudTextAtom,
} from "../HUD/HUDElementAtom";
import blue_orb_huds from "../../resources/blue_orb_huds.json";
import {StateManagerProps} from "./InputHandler";

const HUDStateManager = (props: StateManagerProps) => {
  const setHudActive = useSetRecoilState(hudActiveAtom);
  const setCurrentHUDElement = useSetRecoilState(currentHUDAtom);
  const setMediumHudText = useSetRecoilState(mediumHudTextAtom);

  useEffect(() => {
    if (props.eventState) {
      const targetBlueOrbHudId = props.eventState.targetBlueOrbHudId;
      const moveDirection = props.eventState.moveDirection;
      const targetBlueOrbGreenText = props.eventState.targetBlueOrbGreenText;

      const targetBlueOrbHudData =
        blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds];

      if (moveDirection) {
        // setHudActive((prev: boolean) => !prev);
        setHudActive((prev: number) => Number(!prev));

        setTimeout(() => {
          setCurrentHUDElement(targetBlueOrbHudData);
          setMediumHudText(targetBlueOrbGreenText);
          setHudActive((prev: number) => Number(!prev));
        }, lain_animations[moveDirection as keyof typeof lain_animations].duration);
      } else {
        setHudActive((prev: number) => Number(!prev));

        setTimeout(() => {
          setCurrentHUDElement(targetBlueOrbHudData);
          setMediumHudText(targetBlueOrbGreenText);
          setHudActive((prev: number) => Number(!prev));
        }, 500);
      }
    }
  }, [props.eventState, setCurrentHUDElement, setHudActive, setMediumHudText]);
  return null;
};

export default HUDStateManager;
