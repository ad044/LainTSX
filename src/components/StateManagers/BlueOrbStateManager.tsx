import React, { useCallback, useEffect } from "react";
import { useBlueOrbStore } from "../../store";
import blue_orb_directions from "../../resources/blue_orb_directions.json";

type SetCurrentBlueOrb = (value: string) => void;
type SetIsCurrentBlueOrbInteractedWith = (value: boolean) => void;

type BlueOrbDispatchData = {
  action: SetCurrentBlueOrb | SetIsCurrentBlueOrbInteractedWith;
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
  const setCurrentBlueOrb: SetCurrentBlueOrb = useBlueOrbStore(
    (state) => state.setCurrentBlueOrbId
  );
  const setIsCurrentBlueOrbInteractedWith: SetIsCurrentBlueOrbInteractedWith = useBlueOrbStore(
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
      const eventObject =
        blue_orb_directions[
          props.eventState as keyof typeof blue_orb_directions
        ];

      const eventAction = eventObject.action;
      const targetBlueOrbId = eventObject.target_blue_orb_id;

      const dispatchedObject = dispatchObject(eventAction, targetBlueOrbId);

      if (dispatchedObject) {
        // set current to dummy blue orb for disabling the glowing effect for the current sprite.
        setCurrentBlueOrb("dummy");

        setTimeout(() => {
          dispatchedObject.action(dispatchedObject.value as never);
        }, dispatchedObject.actionDelay);
      }
    }
  }, [props.eventState, props.targetBlueOrbId, setCurrentBlueOrb]);
  return null;
};

export default BlueOrbStateManager;
