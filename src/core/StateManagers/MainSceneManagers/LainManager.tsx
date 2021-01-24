import { useCallback, useEffect } from "react";
import { useStore } from "../../../store";
import { StateManagerProps } from "../EventManager";

const LainManager = (props: StateManagerProps) => {
  const setLainMoveState = useStore((state) => state.setLainMoveState);

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
        case "knock_node":
        case "prayer":
        case "touch_sleeve":
        case "thinking":
        case "stretch_2":
        case "stretch":
        case "spin":
        case "scratch_head":
        case "blush":
        case "hands_behind_head":
        case "hands_on_hips":
        case "hands_on_hips_2":
        case "hands_together":
        case "lean_forward":
        case "lean_left":
        case "lean_right":
        case "look_around":
        case "play_with_hair":
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
        case "rip_node_media":
        case "rip_node_gate":
        case "rip_node_sskn":
        case "rip_node_tak":
          return {
            action: setLainMoveState,
            value: "rip_node",
            duration: 6000,
          };
        case "knock_node_and_fall":
          return {
            action: setLainMoveState,
            value: "knock_node_and_fall",
            duration: 6000,
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
