import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useBootStore } from "../../store";

const BootManager = (props: StateManagerProps) => {
  const toggleComponentMatrixIdx = useBootStore(
    (state) => state.toggleComponentMatrixIdx
  );
  const setBootSubscene = useBootStore((state) => state.setSubscene);
  const moveAuthorizeUserLetters = useBootStore(
    (state) => state.moveAuthorizeUserLetters
  );

  const dispatchObject = useCallback(
    (event: string) => {
      switch (event) {
        case "main_menu_down":
        case "main_menu_up":
          return {
            action: toggleComponentMatrixIdx,
            value: "main_menu",
          };
        case "load_data_left":
        case "load_data_right":
          return {
            action: toggleComponentMatrixIdx,
            value: "load_data",
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
        case "authorize_user_right":
          return {
            action: moveAuthorizeUserLetters,
            value: "right",
          };
        case "authorize_user_left":
          return {
            action: moveAuthorizeUserLetters,
            value: "left",
          };
        case "authorize_user_up":
          return {
            action: moveAuthorizeUserLetters,
            value: "up",
          };
        case "authorize_user_down":
          return {
            action: moveAuthorizeUserLetters,
            value: "down",
          };
        case "load_data_select":
          return { action: setBootSubscene, value: "load_data" };
      }
    },
    [moveAuthorizeUserLetters, setBootSubscene, toggleComponentMatrixIdx]
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
