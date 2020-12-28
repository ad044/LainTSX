import { useCallback, useEffect } from "react";
import { useHudStore } from "../../../store";
import { StateManagerProps } from "../EventManager";

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
    (eventState: { event: string; activeHudId: string }) => {
      switch (eventState.event) {
        case "site_up":
        case "site_down":
        case "site_left":
        case "site_right":
          return {
            action: moveAndChangeNode,
            value: [eventState.activeHudId],
          };
        case "change_node":
          return {
            action: changeNode,
            value: [eventState.activeHudId],
          };
        case "toggle_level_selection":
        case "level_selection_back":
          return {
            action: toggleActive,
          };
        case "select_level_up":
        case "select_level_down":
          return {
            action: selectLevelAnimation,
            value: [eventState.activeHudId],
          };
      }
    },
    [changeNode, moveAndChangeNode, selectLevelAnimation, toggleActive]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        (dispatchedObject.action as any).apply(null, dispatchedObject.value);
      }
    }
  }, [props.eventState, toggleActive, dispatchObject]);
  return null;
};

export default NodeHUDManager;
