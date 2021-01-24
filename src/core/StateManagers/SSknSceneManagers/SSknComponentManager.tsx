import { useCallback, useEffect } from "react";
import { StateManagerProps } from "../EventManager";
import { useStore } from "../../../store";

const SSknComponentManager = (props: StateManagerProps) => {
  const toggleComponentMatrixIdx = useStore(
    (state) => state.toggleSSknComponentMatrixIdx
  );
  const resetComponentMatrixIdx = useStore(
    (state) => state.resetSSknComponentMatrixIdx
  );
  const setSSknLoading = useStore((state) => state.setSSknLoading);

  const dispatchObject = useCallback(
    (eventState: { event: string }) => {
      switch (eventState.event) {
        case "throw_node_sskn":
        case "rip_node_sskn":
          return {
            action: resetComponentMatrixIdx,
          };
        case "sskn_ok_down":
        case "sskn_cancel_up":
          return {
            action: toggleComponentMatrixIdx,
          };
        case "sskn_ok_select":
          return {
            action: setSSknLoading,
            value: true,
          };
        case "sskn_cancel_select":
          return {
            action: setSSknLoading,
            value: false,
          };
      }
    },
    [resetComponentMatrixIdx, setSSknLoading, toggleComponentMatrixIdx]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value as any);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default SSknComponentManager;
