import { useCallback, useEffect } from "react";
import { useHudStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const NodeHUDManager = (props: StateManagerProps) => {
  const setActiveNodeHudId = useHudStore(
    (state) => state.setActiveNodeHudId
  );
  const toggleHud = useHudStore((state) => state.toggleHud);

  const dispatchObject = useCallback(
    (event: string, targetNodeHudId: string) => {
      switch (event) {
        case "move_up":
        case "move_down":
        case "move_left":
        case "move_right":
          return {
            action: setActiveNodeHudId,
            value: targetNodeHudId,
            actionDelay: 3903.704,
          };
        case "change_node":
          return {
            action: setActiveNodeHudId,
            value: targetNodeHudId,
            actionDelay: 500,
          };
      }
    },
    [setActiveNodeHudId]
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
  }, [props.eventState, setActiveNodeHudId, toggleHud, dispatchObject]);
  return null;
};

export default NodeHUDManager;
