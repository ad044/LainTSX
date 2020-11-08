import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useMainMenuStore } from "../../store";

const MainMenuManager = (props: StateManagerProps) => {
  const setActiveMainMenuElement = useMainMenuStore(
    (state) => state.setActiveMainMenuElement
  );

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects = {
        switch_to_load_data: {
          action: setActiveMainMenuElement,
          value: "load_data",
        },
        switch_to_authorize_user: {
          action: setActiveMainMenuElement,
          value: "authorize_user",
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setActiveMainMenuElement]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;

      const dispatchedObject = dispatchObject(eventAction);
      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default MainMenuManager;
