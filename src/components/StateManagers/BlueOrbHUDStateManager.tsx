import React, { useCallback, useEffect } from "react";
import { useBlueOrbStore } from "../../store";
import blue_orb_directions from "../../resources/blue_orb_directions.json";
import { StateManagerProps } from "./EventStateManager";

const BlueOrbHUDStateManager = (props: StateManagerProps) => {
  const setActiveBlueOrbHudId = useBlueOrbStore(
    (state) => state.setActiveBlueOrbHudId
  );
  const toggleHud = useBlueOrbStore((state) => state.toggleHud);

  const dispatchObject = useCallback(
    (event: string, targetBlueOrbHudId: string) => {
      const dispatcherObjects = {
        moveUp: {
          action: setActiveBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 3903.704,
        },
        moveDown: {
          action: setActiveBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 3903.704,
        },
        moveLeft: {
          action: setActiveBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 3903.704,
        },
        moveRight: {
          action: setActiveBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 3903.704,
        },
        changeBlueOrbFocus: {
          action: setActiveBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 500,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setActiveBlueOrbHudId]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject =
        blue_orb_directions[
          props.eventState as keyof typeof blue_orb_directions
        ];

      const eventAction = eventObject.action;
      const targetBlueOrbHudId = eventObject.target_hud_id;

      const dispatchedObject = dispatchObject(eventAction, targetBlueOrbHudId);

      if (dispatchedObject) {
        toggleHud();

        setTimeout(() => {
          dispatchedObject.action(dispatchedObject.value);
          toggleHud();
        }, dispatchedObject.actionDelay);
      }
    }
  }, [props.eventState, setActiveBlueOrbHudId, toggleHud, dispatchObject]);
  return null;
};

export default BlueOrbHUDStateManager;
