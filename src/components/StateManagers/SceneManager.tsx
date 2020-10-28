import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import blue_orb_directions from "../../resources/blue_orb_directions.json";
import { useSceneStore } from "../../store";

const SceneManager = (props: StateManagerProps) => {
  const setScene = useSceneStore((state) => state.setScene);

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects = {
        select_blue_orb: {
          action: setScene,
          value: "media",
          delay: 3904.704,
        },
        exit_select: {
          action: setScene,
          value: "main",
          delay: 0,
        },
      };
      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setScene]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject =
        blue_orb_directions[
          props.eventState as keyof typeof blue_orb_directions
        ];

      let dispatchedObject: {
        action: (to: string) => void;
        value: string;
        delay: number;
      };

      if (eventObject) {
        const eventAction = eventObject.action;
        dispatchedObject = dispatchObject(eventAction);
      } else {
        const eventAction = props.eventState;
        dispatchedObject = dispatchObject(eventAction);
      }

      if (dispatchedObject) {
        setTimeout(() => {
          dispatchedObject.action(dispatchedObject.value);
        }, dispatchedObject.delay);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default SceneManager;
