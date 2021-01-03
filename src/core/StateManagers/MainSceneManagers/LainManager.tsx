import { useCallback, useEffect } from "react";
import { useLainStore } from "../../../store";
import { StateManagerProps } from "../EventManager";

const LainManager = (props: StateManagerProps) => {
  const setLainMoveState = useLainStore((state) => state.setLainMoveState);

  const dispatchObject = useCallback(
    (eventState: { event: string }) => {
      switch (eventState.event) {
        case "site_up":
        case "site_down":
        case "site_left":
        case "site_right":
        case "select_level_up":
        case "select_level_down":
        case "pause_game":
          return {
            action: setLainMoveState,
            value: eventState.event,
            duration: 3900,
          };
        case "throw_node_media":
        case "throw_node_gate":
        case "throw_node_sskn":
        case "throw_node_tak":
          return {
            action: setLainMoveState,
            value: "throw_node",
            duration: 3900,
          };
        case "knock_node":
          return {
            action: setLainMoveState,
            value: "knock_node",
            duration: 3900,
          };
        case "knock_node_and_fall":
          return {
            action: setLainMoveState,
            value: "knock_node_and_fall",
            duration: 6000,
          };
        case "test":
          return {
            action: setLainMoveState,
            value: "test",
            duration: 3900,
          };
      }
    },
    [setLainMoveState]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

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
