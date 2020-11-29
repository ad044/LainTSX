import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useLevelSelectionStore } from "../../store";

const LevelSelectionManager = (props: StateManagerProps) => {
  const toggleLevelSelection = useLevelSelectionStore(
    (state) => state.toggleLevelSelection
  );
  const setSelectedLevelIdx = useLevelSelectionStore(
    (state) => state.setSelectedLevelIdx
  );

  const dispatchObject = useCallback(
    (event: string, newSelectedLevelIdx: number) => {
      switch (event) {
        case "toggle_level_selection":
        case "level_selection_back":
          return {
            action: toggleLevelSelection,
          };
        case "level_selection_up":
        case "level_selection_down":
          return {
            action: setSelectedLevelIdx,
            value: newSelectedLevelIdx,
          };
        case "select_level_up":
        case "select_level_down":
          return {
            action: toggleLevelSelection,
          };
      }
    },
    [setSelectedLevelIdx, toggleLevelSelection]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newSelectedLevelIdx = props.eventState.newSelectedLevelIdx;

      const dispatchedObject = dispatchObject(eventAction, newSelectedLevelIdx);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value as any);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default LevelSelectionManager;
