import React, { useCallback, useEffect, useMemo } from "react";
import { useBlueOrbStore } from "../../store";

// fix the typing on this
type BlueOrbDispatchData = {
  action: (value: any) => void;
  value: string | boolean;
  actionDelay: number;
};

type BlueOrbDispatcher = {
  moveUp: BlueOrbDispatchData;
  moveDown: BlueOrbDispatchData;
  moveLeft: BlueOrbDispatchData;
  moveRight: BlueOrbDispatchData;
  changeBlueOrbFocus: BlueOrbDispatchData;
  pickCurrentBlueOrb: BlueOrbDispatchData;
};

const BlueOrbStateManager = (props: any) => {
  const setCurrentBlueOrb = useBlueOrbStore(
    (state) => state.setCurrentBlueOrbId
  );
  const setIsCurrentBlueOrbInteractedWith = useBlueOrbStore(
    (state) => state.setIsCurrentBlueOrbInteractedWith
  );

  const dispatchObject = useCallback(
    (event: string, targetBlueOrbId: string) => {
      const dispatcherObjects: BlueOrbDispatcher = {
        moveUp: {
          action: setCurrentBlueOrb,
          value: targetBlueOrbId,
          actionDelay: 3903.704,
        },
        moveDown: {
          action: setCurrentBlueOrb,
          value: targetBlueOrbId,
          actionDelay: 3903.704,
        },
        moveLeft: {
          action: setCurrentBlueOrb,
          value: targetBlueOrbId,
          actionDelay: 3903.704,
        },
        moveRight: {
          action: setCurrentBlueOrb,
          value: targetBlueOrbId,
          actionDelay: 3903.704,
        },
        changeBlueOrbFocus: {
          action: setCurrentBlueOrb,
          value: targetBlueOrbId,
          actionDelay: 0,
        },
        pickCurrentBlueOrb: {
          action: setIsCurrentBlueOrbInteractedWith,
          value: true,
          actionDelay: 0,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    []
  );
  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(
        props.eventState,
        props.targetBlueOrbId
      );

      setTimeout(() => {
        dispatchedObject.action(dispatchedObject.value);
      }, dispatchedObject.actionDelay);
    }
  }, [props.eventState, props.targetBlueOrbId, setCurrentBlueOrb]);
  return null;
};

export default BlueOrbStateManager;
