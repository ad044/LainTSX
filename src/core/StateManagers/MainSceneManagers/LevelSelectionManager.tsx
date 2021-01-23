import { useCallback, useEffect } from "react";
import { StateManagerProps } from "../EventManager";
import { useMainSceneStore } from "../../../store";

const LevelSelectionManager = (props: StateManagerProps) => {
  const setSelectedLevel = useMainSceneStore((state) => state.setSelectedLevel);

  const dispatchObject = useCallback(
    (eventState: { event: string; selectedLevelIdx: number }) => {
      switch (eventState.event) {
        case "level_selection_up":
        case "level_selection_down":
          return {
            action: setSelectedLevel,
            value: eventState.selectedLevelIdx,
          };
      }
    },
    [setSelectedLevel]
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
