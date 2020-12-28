import { useCallback, useEffect } from "react";
import { StateManagerProps } from "../EventManager";
import { usePauseStore } from "../../../store";

const PauseComponentManager = (props: StateManagerProps) => {
  const setComponentMatrixIdx = usePauseStore(
    (state) => state.setComponentMatrixIdx
  );
  const setExitAnimation = usePauseStore((state) => state.setExitAnimation);

  const dispatchObject = useCallback(
    (eventState: { event: string; pauseMatrixIdx: number }) => {
      switch (eventState.event) {
        case "pause_up":
        case "pause_down":
          return {
            action: setComponentMatrixIdx,
            value: eventState.pauseMatrixIdx,
          };
        case "pause_exit_select":
          return {
            action: setExitAnimation,
            value: true,
          };
        case "pause_game":
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
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value as never);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default PauseComponentManager;
