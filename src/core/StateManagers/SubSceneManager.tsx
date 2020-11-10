import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useSubsceneStore } from "../../store";

const SubSceneManager = (props: StateManagerProps) => {
  const setActiveSubscene = useSubsceneStore(
    (state) => state.setActiveSubScene
  );

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects = {
        select_authorize_user: {
          action: setActiveSubscene,
          value: "authorize_user",
          delay: 0,
        },
        select_load_data: {
          action: setActiveSubscene,
          value: "load_data",
          delay: 0,
        },
      };
      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setActiveSubscene]
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
