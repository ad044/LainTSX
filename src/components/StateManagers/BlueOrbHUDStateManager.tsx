import React, { useCallback, useEffect, useMemo } from "react";
import { useBlueOrbStore } from "../../store";
import blue_orb_directions from "../../resources/blue_orb_directions.json";

const BlueOrbHUDStateManager = (props: any) => {
  const setCurrentBlueOrbHudId = useBlueOrbStore(
    (state) => state.setCurrentBlueOrbHudId
  );
  const toggleHud = useBlueOrbStore((state) => state.toggleHud);

  const dispatchObject = useCallback(
    (event: string, targetBlueOrbHudId: string) => {
      const dispatcherObjects = {
        moveUp: {
          action: setCurrentBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 3903.704,
        },
        moveDown: {
          action: setCurrentBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 3903.704,
        },
        moveLeft: {
          action: setCurrentBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 3903.704,
        },
        moveRight: {
          action: setCurrentBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 3903.704,
        },
        changeBlueOrbFocus: {
          action: setCurrentBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 500,
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
  }, [
    props.eventState,
    props.targetBlueOrbGreenText,
    props.targetBlueOrbHudId,
    setCurrentBlueOrbHudId,
    toggleHud,
  ]);
  return null;
};

export default BlueOrbHUDStateManager;
