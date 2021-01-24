import { useCallback, useEffect } from "react";
import { useStore } from "../../../store";
import { StateManagerProps } from "../EventManager";
import {HUDType} from "../../../components/MainScene/SyncedComponents/HUD";

const NodeHUDManager = (props: StateManagerProps) => {
  const set = useStore((state) => state.setHud);
  const toggleActive = useStore((state) => state.toggleHudActive);

  const moveAndChangeNode = useCallback(
    (hud: HUDType) => {
      toggleActive();

      setTimeout(() => {
        set(hud);
        toggleActive();
      }, 3900);
    },
    [set, toggleActive]
  );

  const changeNode = useCallback(
    (hud: HUDType) => {
      toggleActive();

      setTimeout(() => {
        set(hud);
        toggleActive();
      }, 500);
    },
    [set, toggleActive]
  );

  const selectLevelAnimation = useCallback(
    (hud: HUDType) => {
      setTimeout(() => {
        set(hud);
        toggleActive();
      }, 3900);
    },
    [set, toggleActive]
  );

  const dispatchObject = useCallback(
    (eventState: { event: string; hud: HUDType }) => {
      switch (eventState.event) {
        case "site_up":
        case "site_down":
        case "site_left":
        case "site_right":
          return {
            action: moveAndChangeNode,
            value: [eventState.hud],
          };
        case "change_node":
          return {
            action: changeNode,
            value: [eventState.hud],
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
            value: [eventState.hud],
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
