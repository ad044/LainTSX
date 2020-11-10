import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useBootStore } from "../../store";

const BootManager = (props: StateManagerProps) => {
  const setActiveMainMenuElement = useBootStore(
    (state) => state.setActiveMainMenuElement
  );
  const setActiveLoadDataElement = useBootStore(
    (state) => state.setActiveLoadDataElement
  );
  const setAuthorizeUserPos = useBootStore(
    (state) => state.setAuthorizeUserPos
  );
  const setLoadDataPos = useBootStore((state) => state.setLoadDataPos);

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects = {
        main_menu_down: {
          action: setActiveMainMenuElement,
          value: "load_data",
        },
        main_menu_up: {
          action: setActiveMainMenuElement,
          value: "authorize_user",
        },
        load_data_left: {
          action: setActiveLoadDataElement,
          value: "yes",
        },
        load_data_right: {
          action: setActiveLoadDataElement,
          value: "no",
        },
        select_authorize_user: {
          action: setAuthorizeUserPos,
          value: { x: 1.13, y: 1.2 },
        },
        select_load_data: {
          action: setLoadDataPos,
          value: { x: -1.13, y: -1 },
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [
      setActiveLoadDataElement,
      setActiveMainMenuElement,
      setAuthorizeUserPos,
      setLoadDataPos,
    ]
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

export default BootManager;
