import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { usePauseStore } from "../../store";

const PauseComponentManager = (props: StateManagerProps) => {
  const setComponentMatrixIdx = usePauseStore(
    (state) => state.setComponentMatrixIdx
  );
  const setExitAnimation = usePauseStore((state) => state.setExitAnimation);

  const dispatchObject = useCallback(
    (event: string, newComponentMatrixIdx: number) => {
      switch (event) {
        case "pause_up":
        case "pause_down":
          return {
            action: setComponentMatrixIdx,
            value: newComponentMatrixIdx,
          };
        case "pause_exit_select":
          return {
            action: setExitAnimation,
            value: true,
          };
        case "toggle_pause":
          return {
            action: setExitAnimation,
            value: false,
          };
      }
    },
    [setComponentMatrixIdx, setExitAnimation]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newComponentMatrixIdx = props.eventState.newPauseMatrixIdx;

      const dispatchedObject = dispatchObject(
        eventAction,
        newComponentMatrixIdx
      );

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value as never);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default PauseComponentManager;
