import { useCallback, useEffect } from "react";
import { useHudStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const NodeHUDManager = (props: StateManagerProps) => {
  const setId = useHudStore((state) => state.setId);
  const toggleActive = useHudStore((state) => state.toggleActive);

  const dispatchObject = useCallback(
    (event: string, targetNodeHudId: string) => {
      switch (event) {
        case "move_up":
        case "move_down":
        case "move_left":
        case "move_right":
          return {
            action: setId,
            value: targetNodeHudId,
            actionDelay: 3903.704,
          };
        case "change_node":
          return {
            action: setId,
            value: targetNodeHudId,
            actionDelay: 500,
          };
      }
    },
    [setId]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newActiveHudId = props.eventState.newActiveHudId;

      const dispatchedObject = dispatchObject(eventAction, newActiveHudId);

      if (dispatchedObject) {
        toggleActive();

        setTimeout(() => {
          dispatchedObject.action(dispatchedObject.value);
          toggleActive();
        }, dispatchedObject.actionDelay);
      }
    }
  }, [props.eventState, toggleActive, dispatchObject]);
  return null;
};

export default NodeHUDManager;
