import React, { useCallback, useEffect } from "react";
import { StateManagerProps } from "../EventManager";
import { useMediaWordStore } from "../../../store";

const WordManager = (props: StateManagerProps) => {
  const addToWordPositionDataStructIdx = useMediaWordStore(
    (state) => state.addToWordPositionDataStructIdx
  );
  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects = {
        fstWord_down: {
          action: addToWordPositionDataStructIdx,
          value: 1,
        },
        fstWord_up: {
          action: addToWordPositionDataStructIdx,
          value: -1,
        },
        sndWord_down: {
          action: addToWordPositionDataStructIdx,
          value: 1,
        },
        sndWord_up: {
          action: addToWordPositionDataStructIdx,
          value: -1,
        },
        thirdWord_down: {
          action: addToWordPositionDataStructIdx,
          value: 1,
        },
        thirdWord_up: {
          action: addToWordPositionDataStructIdx,
          value: -1,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [addToWordPositionDataStructIdx]
  );

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

export default WordManager;
