import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useSceneStore } from "../../store";

const SceneManager = (props: StateManagerProps) => {
  const setScene = useSceneStore((state) => state.setScene);

  const dispatchObject = useCallback(
    (event: string, newScene: string) => {
      const dispatcherObjects = {
        throw_blue_orb_media: {
          action: setScene,
          value: newScene,
          delay: 3904.704,
        },
        throw_blue_orb_gate: {
          action: setScene,
          value: newScene,
          delay: 3904.704,
        },
        exit_select: {
          action: setScene,
          value: newScene,
          delay: 0,
        },
      };
      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setScene]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newScene = props.eventState.newScene;

      const dispatchedObject = dispatchObject(eventAction, newScene);

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
