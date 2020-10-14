import React, { useEffect, useMemo } from "react";
import { useBlueOrbStore } from "../../store";

const BlueOrbStateManager = (props: any) => {
  const setCurrentBlueOrb = useBlueOrbStore(
    (state) => state.setCurrentBlueOrbId
  );

  // this one is repetitive for now but ill leave them separated
  // in case it comes in handy later on
  const dispatcherObjects = useMemo(
    () => ({
      moveUp: { duration: 3903.704 },
      moveDown: { duration: 3903.704 },
      moveLeft: { duration: 3903.704 },
      moveRight: { duration: 3903.704 },
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

      // set new one after action ends
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
