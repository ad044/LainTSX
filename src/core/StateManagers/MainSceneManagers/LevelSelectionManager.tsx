import { useCallback, useEffect } from "react";
import { StateManagerProps } from "../EventManager";
import { useLevelSelectionStore } from "../../../store";

const LevelSelectionManager = (props: StateManagerProps) => {
  const toggleLevelSelection = useLevelSelectionStore(
    (state) => state.toggleLevelSelection
  );
  const setSelectedLevel = useLevelSelectionStore(
    (state) => state.setSelectedLevel
  );

  const dispatchObject = useCallback(
    (eventState: { event: string; selectedLevelIdx: number }) => {
      switch (eventState.event) {
        case "toggle_level_selection":
        case "level_selection_back":
          return {
            action: toggleLevelSelection,
          };
        case "level_selection_up":
        case "level_selection_down":
          return {
            action: setSelectedLevel,
            value: eventState.selectedLevelIdx,
          };
        case "select_level_up":
        case "select_level_down":
          return {
            action: toggleLevelSelection,
          };
      }
    },
    [setSelectedLevel, toggleLevelSelection]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value as any);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default LevelSelectionManager;
