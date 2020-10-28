import { useCallback, useEffect } from "react";
import { useLainStore } from "../../store";
import game_action_mappings from "../../resources/game_action_mappings.json";
import { StateManagerProps } from "./EventManager";

const LainManager = (props: StateManagerProps) => {
  const setLainMoveState = useLainStore((state) => state.setLainMoveState);

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects = {
        move_up: {
          action: setLainMoveState,
          value: "move_up",
          duration: 3904.704,
        },
        move_down: {
          action: setLainMoveState,
          value: "move_down",
          duration: 3904.704,
        },
        move_left: {
          action: setLainMoveState,
          value: "move_left",
          duration: 3904.704,
        },
        move_right: {
          action: setLainMoveState,
          value: "move_right",
          duration: 3904.704,
        },
        select_blue_orb: {
          action: setLainMoveState,
          value: "throwBlueOrb",
          duration: 3904.704,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setLainMoveState]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject =
        game_action_mappings[
          props.eventState as keyof typeof game_action_mappings
        ];

      if (eventObject) {
        const eventAction = eventObject.action;
        const dispatchedObject = dispatchObject(eventAction);

        if (dispatchedObject) {
          dispatchedObject.action(dispatchedObject.value);

          setTimeout(() => {
            setLainMoveState("standing");
          }, dispatchedObject.duration);
        }
      }
    }
  }, [props.eventState, setLainMoveState, dispatchObject]);

  return null;
};

export default LainManager;
