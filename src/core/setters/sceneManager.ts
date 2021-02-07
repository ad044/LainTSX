import { useStore } from "../../store";

const sceneManager = (eventState: any) => {
  const dispatchAction = (eventState: { event: string; scene: string }) => {
    switch (eventState.event) {
      case "throw_node_sskn":
      case "rip_node_sskn":
        return {
          action: () =>
            useStore.setState({
              currentScene: eventState.scene,
              intro: false,
              ssknComponentMatrixIdx: 0,
              ssknLoading: false,
            }),
          delay: eventState.event === "throw_node_sskn" ? 3450 : 6000,
        };
      case "throw_node_media":
      case "rip_node_media":
        return {
          action: () =>
            useStore.setState({
              currentScene: eventState.scene,
              intro: false,
              mediaWordPosStateIdx: 1,
              mediaComponentMatrixIndices: {
                sideIdx: 0,
                leftSideIdx: 0,
                rightSideIdx: 0,
              },
            }),
          delay: eventState.event === "throw_node_media" ? 3450 : 6000,
        };
      case "throw_node_gate":
      case "throw_node_tak":
      case "throw_node_polytan":
        return {
          action: () =>
            useStore.setState({ currentScene: eventState.scene, intro: false }),
          delay: 3450,
        };
      case "rip_node_gate":
      case "rip_node_tak":
      case "rip_node_polytan":
        return {
          action: () =>
            useStore.setState({ currentScene: eventState.scene, intro: false }),
          delay: 6000,
        };
      case "media_exit_select":
      case "sskn_cancel_select":
      case "media_fstWord_select":
      case "media_sndWord_select":
      case "media_thirdWord_select":
      case "word_node_not_found":
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
