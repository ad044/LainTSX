import { useStore } from "../../../../store";

const levelSelectionManager = (eventState: any) => {
  const setSelectedLevel = useStore.getState().setSelectedLevel;

  const dispatchAction = (eventState: any) => {
    switch (eventState.event) {
      case "toggle_level_selection":
        return {
          action: () => setSelectedLevel(eventState.level),
        };
      case "level_selection_up":
      case "level_selection_down":
        return {
          action: () => setSelectedLevel(eventState.selectedLevelIdx),
        };
    }
  };
  const { action } = { ...dispatchAction(eventState) };

  if (action) action();
};

export default levelSelectionManager;
