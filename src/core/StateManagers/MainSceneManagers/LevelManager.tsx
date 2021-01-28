import { useCallback, useEffect } from "react";
import { StateManagerProps } from "../EventManager";
import { useStore } from "../../../store";

const LevelManager = (props: StateManagerProps) => {
  const setActiveLevel = useStore((state) => state.setActiveLevel);

  const dispatchObject = useCallback(
    (eventState: { event: string; level: string }) => {
      switch (eventState.event) {
        case "site_up":
        case "select_level_down":
        case "select_level_up":
        case "site_down":
          return {
            action: setActiveLevel,
            value: eventState.level,
            delay: 0,
          };
      }
    },
    [setActiveLevel]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        setTimeout(() => {
          dispatchedObject.action(dispatchedObject.value as any);
        }, dispatchedObject.delay);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default LevelManager;
