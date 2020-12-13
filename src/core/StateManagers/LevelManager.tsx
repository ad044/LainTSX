import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useLevelStore } from "../../store";

const LevelManager = (props: StateManagerProps) => {
  const setActiveLevel = useLevelStore((state) => state.setActiveLevel);

  const dispatchObject = useCallback(
    (event: string, newLevel: string) => {
      switch (event) {
        case "site_up":
        case "site_down":
          return {
            action: setActiveLevel,
            value: newLevel,
            delay: 0,
          };
        case "select_level_down":
        case "select_level_up":
          return {
            action: setActiveLevel,
            value: newLevel,
            delay: 1500,
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
        setTimeout(() => {
          dispatchedObject.action(dispatchedObject.value);
        }, dispatchedObject.delay);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default LevelManager;
