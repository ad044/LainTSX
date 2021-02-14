import { useStore } from "../../../store";
import sleep from "../../../utils/sleep";

const mainSubsceneManager = async (eventState: any) => {
  const setMainSubscene = useStore.getState().setMainSubscene;

  const dispatchAction = (eventState: { event: string }) => {
    switch (eventState.event) {
      case "word_node_not_found":
        return {
          action: () => setMainSubscene("not_found"),
        };
      case "level_selection_back":
      case "select_level_up":
      case "select_level_down":
      case "exit_not_found":
        return {
          action: () => setMainSubscene("site"),
        };
      case "toggle_level_selection":
        return {
          action: () => setMainSubscene("level_selection"),
        };
      case "pause_game":
        return {
          action: () => setMainSubscene("pause"),
        };
      case "pause_exit_select":
      case "pause_change_select":
        return {
          action: () => {
            setMainSubscene("site");
          },
          delay: 1800,
        };
    }
  };

  const { action, delay } = { ...dispatchAction(eventState) };

  delay && (await sleep(delay));
  action && action();
};

export default mainSubsceneManager;
