import { useStore } from "../../store";

const handleEndSceneEvent = (eventState: any) => {
  const setState = useStore.setState;
  switch (eventState.event) {
    case "end_selection_up":
      setState({ activeEndComponent: "end" });
      break;
    case "end_selection_down":
      setState({ activeEndComponent: "continue" });
      break;
    case "end_continue_select":
      setState({ currentScene: "change_disc", intro: true });
      break;
    case "end_end_select":
      setState({ currentScene: "boot" });
  }
};

export default handleEndSceneEvent;
