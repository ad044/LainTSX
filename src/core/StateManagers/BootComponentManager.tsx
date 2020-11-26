import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useBootStore } from "../../store";

const BootComponentManager = (props: StateManagerProps) => {
  const toggleComponentMatrixIdx = useBootStore(
    (state) => state.toggleComponentMatrixIdx
  );
  const setAuthorizeUserMatrixIdx = useBootStore(
    (state) => state.setAuthorizeUserMatrixIdx
  );
  const setBootSubscene = useBootStore((state) => state.setSubscene);

  const dispatchObject = useCallback(
    (
      event: string,
      activeSubscene: string,
      newAuthorizeUserMatrixIdx: number
    ) => {
      switch (event) {
        case "main_menu_down":
        case "main_menu_up":
        case "load_data_left":
        case "load_data_right":
          return {
            action: toggleComponentMatrixIdx,
            value: activeSubscene,
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
        case "authorize_user_up":
        case "authorize_user_left":
        case "authorize_user_down":
          return {
            action: setAuthorizeUserMatrixIdx,
            value: newAuthorizeUserMatrixIdx,
          };
        case "load_data_select":
          return { action: setBootSubscene, value: "load_data" };
      }
    },
    [setAuthorizeUserMatrixIdx, setBootSubscene, toggleComponentMatrixIdx]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newAuthorizeUserMatrixIdx =
        props.eventState.newAuthorizeUserMatrixIdx;
      const activeSubscene = props.eventState.subscene;

      const dispatchedObject = dispatchObject(
        eventAction,
        activeSubscene,
        newAuthorizeUserMatrixIdx
      );

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value as never);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default BootComponentManager;
