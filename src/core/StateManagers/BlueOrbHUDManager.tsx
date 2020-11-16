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
      switch (event) {
        case "move_up":
        case "move_down":
        case "move_left":
        case "move_right":
          return {
            action: setActiveBlueOrbHudId,
            value: targetBlueOrbHudId,
            actionDelay: 3903.704,
          };
        case "change_blue_orb":
          return {
            action: setActiveBlueOrbHudId,
            value: targetBlueOrbHudId,
            actionDelay: 500,
          };
      }
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
