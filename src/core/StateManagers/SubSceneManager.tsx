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
        authorize_user_back: {
          action: setActiveSubscene,
          value: "main_menu",
        },
        select_authorize_user: {
          action: setActiveSubscene,
          value: "authorize_user",
        },
        select_load_data: {
          action: setActiveSubscene,
          value: "load_data",
        },
        select_load_data_no: {
          action: setActiveSubscene,
          value: "main_menu",
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
        dispatchedObject.action(dispatchedObject.value);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default SubSceneManager;
