import { useCallback, useEffect } from "react";
import { useHudStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const NodeHUDManager = (props: StateManagerProps) => {
  const setId = useHudStore((state) => state.setId);
  const toggleActive = useHudStore((state) => state.toggleActive);

  const moveAndChangeNode = useCallback(
    (targetNodeHudId: string) => {
      toggleActive();

      setTimeout(() => {
        setId(targetNodeHudId);
        toggleActive();
      }, 3900);
    },
    [setId, toggleActive]
  );

  const changeNode = useCallback(
    (targetNodeHudId: string) => {
      toggleActive();

      setTimeout(() => {
        setId(targetNodeHudId);
        toggleActive();
      }, 500);
    },
    [setId, toggleActive]
  );

  const selectLevelAnimation = useCallback(
    (targetNodeHudId: string) => {
      setTimeout(() => {
        setId(targetNodeHudId);
        toggleActive();
      }, 3900);
    },
    [setId, toggleActive]
  );

  const dispatchObject = useCallback(
    (event: string, targetNodeHudId: string) => {
      switch (event) {
        case "site_up":
        case "site_down":
        case "site_left":
        case "site_right":
          return {
            action: moveAndChangeNode,
            value: [targetNodeHudId],
          };
        case "change_node":
          return {
            action: changeNode,
            value: [targetNodeHudId],
          };
        case "toggle_level_selection":
          return {
            action: toggleActive,
          };
        case "select_level_up":
        case "select_level_down":
          return {
            action: selectLevelAnimation,
            value: [targetNodeHudId],
          };
      }
    },
    [changeNode, moveAndChangeNode, selectLevelAnimation, toggleActive]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newActiveHudId = props.eventState.newActiveHudId;

      const dispatchedObject = dispatchObject(eventAction, newActiveHudId);

      if (dispatchedObject) {
        (dispatchedObject.action as any).apply(null, dispatchedObject.value);
      }
    }
  }, [props.eventState, toggleActive, dispatchObject]);
  return null;
};

export default NodeHUDManager;
