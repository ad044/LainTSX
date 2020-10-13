import React, { useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import { currentBlueOrbAtom } from "../BlueOrb/CurrentBlueOrbAtom";

const BlueOrbStateManager = (props: any) => {
  const setCurrentBlueOrb = useSetRecoilState(currentBlueOrbAtom);

  // this one is repetitive for now but ill leave them separated
  // in case it comes in handy later on
  const dispatcherObjects = useMemo(
    () => ({
      moveUp: { duration: 3903.704 },
      moveDown: { duration: 3903.704 },
      rotateLeft: { duration: 3903.704 },
      rotateRight: { duration: 3903.704 },
      changeBlueOrbUp: { duration: 0 },
      changeBlueOrbDown: { duration: 0 },
      changeBlueOrbLeft: { duration: 0 },
      changeBlueOrbRight: { duration: 0 },
    }),
    []
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedAction =
        dispatcherObjects[props.eventState as keyof typeof dispatcherObjects];

      // disable glow on current blue orb
      setCurrentBlueOrb("");

      // set new one after animation ends
      setTimeout(() => {
        setCurrentBlueOrb(props.targetBlueOrbId);
      }, dispatchedAction.duration);
    }
  }, [
    dispatcherObjects,
    props.eventState,
    props.targetBlueOrbId,
    setCurrentBlueOrb,
  ]);
  return null;
};

export default BlueOrbStateManager;
