import { useStore } from "../../store";

const handleSsknSceneEvent = (eventState: any) => {
  const setState = useStore.setState;

  const setNodeViewed = useStore.getState().setNodeViewed;
  const incrementSsknLvl = useStore.getState().incrementSsknLvl;

  switch (eventState.event) {
    case "sskn_cancel_up":
      setState({
        activeSsknComponent: "ok",
      });
      break;
    case "sskn_ok_down":
      setState({
        activeSsknComponent: "cancel",
      });
      break;
    case "sskn_ok_select":
      setState({
        ssknLoading: true,
      });
      setNodeViewed(eventState.node.node_name, {
        is_viewed: 1,
        is_visible: 0,
      });
      incrementSsknLvl();

      setTimeout(() => setState({ currentScene: "main" }), 6000);

      break;
    case "sskn_cancel_select":
      setState({
        ssknLoading: false,
        currentScene: "main",
        activeSsknComponent: "ok",
      });
  }
};

export default handleSsknSceneEvent;
