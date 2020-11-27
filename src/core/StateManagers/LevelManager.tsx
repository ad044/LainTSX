import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useLevelSelectionStore, useLevelStore } from "../../store";

const LevelManager = (props: StateManagerProps) => {
  const setActiveLevel = useLevelStore((state) => state.setActiveLevel);
  const toggleLevelSelection = useLevelSelectionStore(
    (state) => state.toggleLevelSelection
  );

  const dispatchObject = useCallback(
    (event: string, newLevel: string) => {
      switch (event) {
        case "move_up":
        case "move_down":
          return {
            action: setActiveLevel,
            value: newLevel,
          };
        case "toggle_level_selection":
          return {
            action: toggleLevelSelection,
          };
      }
    },
    [setActiveLevel, toggleLevelSelection]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newLevel = props.eventState.newLevel;
      const dispatchedObject = dispatchObject(eventAction, newLevel);

      if (dispatchedObject) {
        (dispatchedObject.action as any).apply(
          null,
          dispatchedObject.value as any
        );
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default LevelManager;
