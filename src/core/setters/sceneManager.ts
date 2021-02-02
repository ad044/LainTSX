import { useStore } from "../../store";

const sceneManager = (eventState: any) => {
  const dispatchAction = (eventState: { event: string; scene: string }) => {
    switch (eventState.event) {
      case "throw_node_media":
      case "throw_node_gate":
      case "throw_node_sskn":
      case "throw_node_tak":
        return {
          action: () =>
            useStore.setState({ currentScene: eventState.scene, intro: false }),
          delay: 3450,
        };
      case "rip_node_media":
      case "rip_node_gate":
      case "rip_node_sskn":
      case "rip_node_tak":
        return {
          action: () =>
            useStore.setState({ currentScene: eventState.scene, intro: false }),
          delay: 6000,
        };
      case "media_exit_select":
      case "exit_gate":
      case "sskn_cancel_select":
        return {
          action: () =>
            useStore.setState({ currentScene: "main", intro: false }),
          delay: 0,
        };
      case "sskn_ok_select":
        return {
          action: () =>
            useStore.setState({ currentScene: "main", intro: false }),
          delay: 6000,
        };
      case "pause_change_select":
        return {
          action: () =>
            useStore.setState({ currentScene: "change_disc", intro: true }),
          delay: 0,
        };
      case "play_idle_media":
        return {
          action: () =>
            useStore.setState({ currentScene: "idle_media", intro: false }),
          delay: 0,
        };
    }
  };

  const { action, delay } = { ...dispatchAction(eventState) };

  if (action) {
    setTimeout(() => {
      action();
    }, delay);
  }
};

export default sceneManager;
