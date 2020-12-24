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
            delay: 0,
          };
        case "toggle_level_selection":
          return {
            action: setMainSubscene,
            value: "level_selection",
            delay: 0,
          };
        case "pause_game":
          return {
            action: setMainSubscene,
            value: "pause",
            delay: 0,
          };
        case "pause_exit_select":
        case "pause_change_select":
          return {
            action: setMainSubscene,
            value: "site",
            delay: 1800,
          };
        case "authorize_user_back":
        case "load_data_no_select":
          return {
            action: setBootSubscene,
            value: "main_menu",
            delay: 0,
          };
        case "authorize_user_select":
          return {
            action: setBootSubscene,
            value: "authorize_user",
            delay: 0,
          };
        case "load_data_select":
          return { action: setBootSubscene, value: "load_data", delay: 0 };
      }
    },
    [setBootSubscene, setMainSubscene]
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

export default SubsceneManager;
