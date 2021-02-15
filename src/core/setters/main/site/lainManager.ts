import { useStore } from "../../../../store";

const lainManager = (eventState: any) => {
  const setLainMoveState = useStore.getState().setLainMoveState;

  const dispatchAction = (eventState: any) => {
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
          action: () => setLainMoveState(eventState.event),
          duration: 3900,
        };
      case "throw_node_media":
      case "throw_node_gate":
      case "throw_node_sskn":
      case "throw_node_tak":
      case "throw_node_polytan":
        return { action: () => setLainMoveState("throw_node"), duration: 3900 };
      case "rip_node_media":
      case "rip_node_gate":
      case "rip_node_sskn":
      case "rip_node_tak":
      case "rip_node_polytan":
        return { action: () => setLainMoveState("rip_node"), duration: 6000 };
      case "knock_and_fall":
      case "knock":
      case "touch_and_scare":
        return {
          action: () => setLainMoveState(eventState.event),
          duration: 6000,
        };
    }
  };

  const { action, duration } = { ...dispatchAction(eventState) };

  if (action) {
    action();
    setTimeout(() => setLainMoveState("standing"), duration);
  }
};

export default lainManager;
