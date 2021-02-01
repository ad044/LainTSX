import { useStore } from "../../../../store";

const mainSubsceneManager = (eventState: any) => {
  const setMainSubscene = useStore.getState().setMainSubscene;

  const dispatchAction = (eventState: { event: string }) => {
    switch (eventState.event) {
      case "level_selection_back":
      case "select_level_up":
      case "select_level_down":
        return {
          action: () => setMainSubscene("site"),
          delay: 0,
        };
      case "toggle_level_selection":
        return {
          action: () => setMainSubscene("level_selection"),
          delay: 0,
        };
      case "pause_game":
        return {
          action: () => setMainSubscene("pause"),
          value: "pause",
          delay: 0,
        };
      case "pause_exit_select":
      case "pause_change_select":
        return {
          action: () => setMainSubscene("site"),
          delay: 1800,
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

export default mainSubsceneManager;
