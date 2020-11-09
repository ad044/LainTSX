import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useBootMainMenuStore } from "../../store";

const MainMenuManager = (props: StateManagerProps) => {
  const setActiveMainMenuElement = useBootMainMenuStore(
    (state) => state.setActiveMainMenuElement
  );
  const setAuthorizeUserPos = useBootMainMenuStore(
    (state) => state.setAuthorizeUserPos
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
        select_authorize_user: {
          action: setAuthorizeUserPos,
          value: { x: 1.13, y: 1.2 },
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setActiveMainMenuElement, setAuthorizeUserPos]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;

      const dispatchedObject = dispatchObject(eventAction);
      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value as any);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default MainMenuManager;
