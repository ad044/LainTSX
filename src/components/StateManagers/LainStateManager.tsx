import React, { useCallback, useEffect, useMemo } from "react";
import { useLainStore } from "../../store";
import blue_orb_directions from "../../resources/blue_orb_directions.json";
import { StateManagerProps } from "./EventStateManager";

const LainStateManager = (props: StateManagerProps) => {
  const setLainMoveState = useLainStore((state) => state.setLainMoveState);

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects = {
        moveUp: {
          action: setLainMoveState,
          value: "moveUp",
          duration: 3903.704,
        },
        moveDown: {
          action: setLainMoveState,
          value: "moveDown",
          duration: 3903.704,
        },
        moveLeft: {
          action: setLainMoveState,
          value: "moveLeft",
          duration: 3903.704,
        },
        moveRight: {
          action: setLainMoveState,
          value: "moveRight",
          duration: 3903.704,
        },
        pickActiveBlueOrb: {
          action: setLainMoveState,
          value: "throwBlueOrb",
          duration: 3903.704,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setLainMoveState]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject =
        blue_orb_directions[
          props.eventState as keyof typeof blue_orb_directions
        ];

      const eventAction = eventObject.action;
      const dispatchedObject = dispatchObject(eventAction);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value);

        setTimeout(() => {
          setLainMoveState("standing");
        }, dispatchedObject.duration);
      }
    }
  }, [props.eventState, setLainMoveState, dispatchObject]);

  return null;
};

export default LainStateManager;
