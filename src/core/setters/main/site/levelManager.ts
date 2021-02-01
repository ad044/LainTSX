import { useStore } from "../../../../store";

const levelManager = (eventState: any) => {
  const setActiveLevel = useStore.getState().setActiveLevel;

  const dispatchAction = (eventState: any) => {
    switch (eventState.event) {
      case "site_up":
      case "site_down":
      case "select_level_up":
      case "select_level_down":
        return { action: () => setActiveLevel(eventState.level) };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default levelManager;
