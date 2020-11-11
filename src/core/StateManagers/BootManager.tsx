import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useBootStore } from "../../store";

const BootManager = (props: StateManagerProps) => {
  const setActiveBootElement = useBootStore(
    (state) => state.setActiveBootElement
  );

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects = {
        main_menu_down: {
          action: setActiveBootElement,
          value: "load_data",
        },
        main_menu_up: {
          action: setActiveBootElement,
          value: "authorize_user",
        },
        load_data_left: {
          action: setActiveBootElement,
          value: "load_data_yes",
        },
        load_data_right: {
          action: setActiveBootElement,
          value: "load_data_no",
        },
        authorize_user_back: {
          action: setActiveBootElement,
          value: "authorize_user",
        },
        select_authorize_user: {
          action: setActiveBootElement,
          value: "authorize_user",
        },
        select_load_data_no: {
          action: setActiveBootElement,
          value: "load_data",
        },
        select_load_data: {
          action: setActiveBootElement,
          value: "load_data_yes"
        }
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setActiveBootElement]
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
