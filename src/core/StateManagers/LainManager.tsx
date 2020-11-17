import { useCallback, useEffect } from "react";
import { useLainStore } from "../../store";
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
        throw_node_media: {
          action: setLainMoveState,
          value: "throwNode",
          duration: 3904.704,
        },
        throw_node_gate: {
          action: setLainMoveState,
          value: "throwNode",
          duration: 3904.704,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setLainMoveState]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
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

export default LainManager;
