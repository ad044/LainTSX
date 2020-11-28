import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useLevelStore } from "../../store";

const LevelManager = (props: StateManagerProps) => {
  const setActiveLevel = useLevelStore((state) => state.setActiveLevel);

  const dispatchObject = useCallback(
    (event: string, newLevel: string) => {
      switch (event) {
        case "move_up":
        case "move_down":
        case "select_level":
          return {
            action: setActiveLevel,
            value: newLevel,
          };
      }
    },
    [setActiveLevel]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newLevel = props.eventState.newLevel;
      const dispatchedObject = dispatchObject(eventAction, newLevel);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default LevelManager;
