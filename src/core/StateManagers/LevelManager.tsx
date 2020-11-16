import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useLevelStore } from "../../store";

const LevelManager = (props: StateManagerProps) => {
  const setCurrentLevel = useLevelStore((state) => state.setCurrentLevel);
  const setActiveLevels = useLevelStore((state) => state.setActiveLevels);

  const updateLevel = useCallback(
    (newLevel: string) => {
      setTimeout(() => {
        setCurrentLevel(newLevel);
        setActiveLevels([
          (parseInt(newLevel) - 2).toString().padStart(2, "0"),
          (parseInt(newLevel) - 1).toString().padStart(2, "0"),
          (parseInt(newLevel) + 1).toString().padStart(2, "0"),
          (parseInt(newLevel) + 2).toString().padStart(2, "0"),
        ]);
      }, 1500);
    },
    [setActiveLevels, setCurrentLevel]
  );
  const dispatchObject = useCallback(
    (event: string, newLevel: string) => {
      const dispatcherObjects = {
        move_up: {
          action: updateLevel,
          value: newLevel,
        },
        move_down: {
          action: updateLevel,
          value: newLevel,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [updateLevel]
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
