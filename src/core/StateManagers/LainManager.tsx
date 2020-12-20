import { useCallback, useEffect } from "react";
import { useLainStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const LainManager = (props: StateManagerProps) => {
  const setLainMoveState = useLainStore((state) => state.setLainMoveState);

  const dispatchObject = useCallback(
    (event: string) => {
      switch (event) {
        case "site_up":
        case "site_down":
        case "site_left":
        case "site_right":
        case "select_level_up":
        case "select_level_down":
          return {
            action: setLainMoveState,
            value: event,
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
      }
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
