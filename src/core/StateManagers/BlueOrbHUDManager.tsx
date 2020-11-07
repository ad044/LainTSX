import { useCallback, useEffect } from "react";
import { useHudStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const BlueOrbHUDManager = (props: StateManagerProps) => {
  const setActiveBlueOrbHudId = useHudStore(
    (state) => state.setActiveBlueOrbHudId
  );
  const toggleHud = useHudStore((state) => state.toggleHud);

  const dispatchObject = useCallback(
    (event: string, targetBlueOrbHudId: string) => {
      const dispatcherObjects = {
        move_up: {
          action: setActiveBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 3903.704,
        },
        move_down: {
          action: setActiveBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 3903.704,
        },
        move_left: {
          action: setActiveBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 3903.704,
        },
        move_right: {
          action: setActiveBlueOrbHudId,
          value: targetBlueOrbHudId,
          actionDelay: 3903.704,
        },
        change_blue_orb: {
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
      const eventAction = props.eventState.event;
      const newActiveHudId = props.eventState.newActiveHudId;

      const dispatchedObject = dispatchObject(eventAction, newActiveHudId);

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

export default BlueOrbHUDManager;
