import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useBootStore, useMainSceneStore } from "../../store";

const SubsceneManager = (props: StateManagerProps) => {
  const setMainSubscene = useMainSceneStore((state) => state.setSubscene);
  const setBootSubscene = useBootStore((state) => state.setSubscene);

  const dispatchObject = useCallback(
    (event: string) => {
      switch (event) {
        case "level_selection_back":
        case "select_level_up":
        case "select_level_down":
          return {
            action: setMainSubscene,
            value: "site",
          };
        case "toggle_level_selection":
          return {
            action: setMainSubscene,
            value: "level_selection",
          };
        case "toggle_pause":
          return {
            action: setMainSubscene,
            value: "pause",
          };
        case "authorize_user_back":
        case "load_data_no_select":
          return {
            action: setBootSubscene,
            value: "main_menu",
          };
        case "authorize_user_select":
          return {
            action: setBootSubscene,
            value: "authorize_user",
          };
        case "load_data_select":
          return { action: setBootSubscene, value: "load_data" };
      }
    },
    [setBootSubscene, setMainSubscene]
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

export default SubsceneManager;
