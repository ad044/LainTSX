import { useCallback, useEffect } from "react";
import { useHudStore } from "../../store";
import game_action_mappings from "../../resources/game_action_mappings.json";
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
      const eventObject: any =
        game_action_mappings[
          props.eventState as keyof typeof game_action_mappings
        ];

      if (eventObject) {
        const eventAction = eventObject.action;
        const targetBlueOrbHudId = eventObject.target_hud_id;

        const dispatchedObject = dispatchObject(
          eventAction,
          targetBlueOrbHudId
        );

        if (dispatchedObject) {
          toggleHud();

          setTimeout(() => {
            dispatchedObject.action(dispatchedObject.value);
            toggleHud();
          }, dispatchedObject.actionDelay);
        }
      }
    }
  }, [props.eventState, setActiveBlueOrbHudId, toggleHud, dispatchObject]);
  return null;
};

export default BlueOrbHUDManager;
