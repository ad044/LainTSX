import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { currentBlueOrbAtom } from "../BlueOrb/CurrentBlueOrbAtom";
import lain_animations from "../../resources/lain_animations.json";
import { StateManagerProps } from "./InputHandler";

const BlueOrbStateManager = (props: StateManagerProps) => {
  const setCurrentBlueOrb = useSetRecoilState(currentBlueOrbAtom);

  useEffect(() => {
    if (props.eventState) {
      const targetBlueOrbId = props.eventState.targetBlueOrbId;
      const moveDirection = props.eventState.moveDirection;

      if (moveDirection) {
        // disable glow on current blue orb
        setCurrentBlueOrb("");

        // set new one after animation ends
        setTimeout(() => {
          setCurrentBlueOrb(targetBlueOrbId);
        }, lain_animations[moveDirection as keyof typeof lain_animations].duration);
      } else {
        setCurrentBlueOrb(targetBlueOrbId);
      }
    }
  }, [props.eventState, setCurrentBlueOrb]);
  return null;
};

export default BlueOrbStateManager;
