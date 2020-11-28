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
        case "authorize_user_right":
        case "authorize_user_up":
        case "authorize_user_left":
        case "authorize_user_down":
          return {
            action: setAuthorizeUserMatrixIdx,
            value: newAuthorizeUserMatrixIdx,
          };
      }
    },
    [setAuthorizeUserMatrixIdx, toggleComponentMatrixIdx]
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
