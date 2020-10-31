import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useLevelStore } from "../../store";

const LevelManager = (props: StateManagerProps) => {
  const setCurrentLevel = useLevelStore((state) => state.setCurrentLevel);

  const dispatchObject = useCallback(
    (event: string, newLevel: string) => {
      const dispatcherObjects = {
        move_up: {
          action: setCurrentLevel,
          value: newLevel,
        },
        move_down: {
          action: setCurrentLevel,
          value: newLevel,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setCurrentLevel]
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
