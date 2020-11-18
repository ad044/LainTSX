import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useMediaStore, useSSknStore } from "../../store";

const SSknComponentManager = (props: StateManagerProps) => {
  const toggleComponentMatrixIdx = useSSknStore(
    (state) => state.toggleComponentMatrixIdx
  );
  const resetComponentMatrixIdx = useSSknStore(
    (state) => state.resetComponentMatrixIdx
  );
  const toggleLoading = useSSknStore((state) => state.toggleLoading);

  const dispatchObject = useCallback(
    (event: string) => {
      switch (event) {
        case "sskn_ok_down":
        case "sskn_cancel_up":
          return {
            action: toggleComponentMatrixIdx,
          };
        case "sskn_ok_select":
          return {
            action: toggleLoading,
          };
      }
    },
    [toggleComponentMatrixIdx, toggleLoading]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;

      const dispatchedObject = dispatchObject(eventAction);

      if (dispatchedObject) {
        dispatchedObject.action();
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default SSknComponentManager;
