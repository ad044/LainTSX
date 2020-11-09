import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useBootStore } from "../../store";

const SubSceneManager = (props: StateManagerProps) => {
  const setActiveBootSubScene = useBootStore(
    (state) => state.setActiveBootSubScene
  );

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects = {
        select_authorize_user: {
          action: setActiveBootSubScene,
          value: "authorize_user",
          delay: 0,
        },
      };
      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setActiveBootSubScene]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;

      const dispatchedObject = dispatchObject(eventAction);

      if (dispatchedObject) {
        setTimeout(() => {
          dispatchedObject.action(dispatchedObject.value);
        }, dispatchedObject.delay);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default SubSceneManager;
