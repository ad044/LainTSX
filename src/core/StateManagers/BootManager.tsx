import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useBootStore } from "../../store";

const BootManager = (props: StateManagerProps) => {
  const setActiveBootElement = useBootStore(
    (state) => state.setActiveBootElement
  );

  const dispatchObject = useCallback(
    (event: string) => {
      switch (event) {
        case "main_menu_down":
          return {
            action: setActiveBootElement,
            value: "load_data",
          };
        case "main_menu_up":
          return {
            action: setActiveBootElement,
            value: "authorize_user",
          };
        case "load_data_left":
          return {
            action: setActiveBootElement,
            value: "load_data_yes",
          };
        case "load_data_right":
          return {
            action: setActiveBootElement,
            value: "load_data_no",
          };
        case "authorize_user_back":
        case "select_authorize_user":
          return {
            action: setActiveBootElement,
            value: "authorize_user",
          };
        case "load_data_no":
          return {
            action: setActiveBootElement,
            value: "load_data",
          };
        case "select_load_data":
          return { action: setActiveBootElement, value: "load_data_yes" };
      }
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
