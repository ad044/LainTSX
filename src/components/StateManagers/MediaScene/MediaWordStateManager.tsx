import React, { useCallback, useEffect } from "react";
import { StateManagerProps } from "../EventStateManager";
import { useMediaWordStore } from "../../../store";

const MediaWordStateManager = (props: StateManagerProps) => {
  const addToWordPositionDataStructIdx = useMediaWordStore(
    (state) => state.addToWordPositionDataStructIdx
  );
  const dispatchObject = useCallback((event: string) => {
    const dispatcherObjects = {
      fstWord_down: {
        action: addToWordPositionDataStructIdx,
        value: 1,
      },
      sndWord_up: {
        action: addToWordPositionDataStructIdx,
        value: -1,
      },
      sndWord_down: {
        action: addToWordPositionDataStructIdx,
        value: 1,

      }
    };

    return dispatcherObjects[event as keyof typeof dispatcherObjects];
  }, []);

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value as never);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaWordStateManager;
