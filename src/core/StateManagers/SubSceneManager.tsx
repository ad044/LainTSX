import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useSubsceneStore } from "../../store";

const SubSceneManager = (props: StateManagerProps) => {
  const setActiveSubscene = useSubsceneStore(
    (state) => state.setActiveSubScene
  );

  const dispatchObject = useCallback(
    (event: string) => {
      switch (event) {
        case "authorize_user_back":
          return {
            action: setActiveSubscene,
            value: "main_menu",
          };
        case "select_authorize_user":
          return { action: setActiveSubscene, value: "authorize_user" };
        case "select_load_data":
          return {
            action: setActiveSubscene,
            value: "load_data",
          };
        case "select_load_data_no":
          return {
            action: setActiveSubscene,
            value: "main_menu",
          };
      }
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
