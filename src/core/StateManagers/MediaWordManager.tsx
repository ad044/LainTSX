import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useMediaWordStore } from "../../store";

const MediaWordManager = (props: StateManagerProps) => {
  const addToWordPositionDataStructIdx = useMediaWordStore(
    (state) => state.addToWordPositionDataStructIdx
  );
  const resetWordPositionDataStructIdx = useMediaWordStore(
    (state) => state.resetWordPositionDataStructIdx
  );

  const dispatchObject = useCallback(
    (event: string) => {
      switch (event) {
        case "fstWord_down":
        case "sndWord_down":
        case "thirdWord_down":
          return {
            action: addToWordPositionDataStructIdx,
            value: 1,
          };
        case "fstWord_up":
        case "sndWord_up":
        case "thirdWord_up":
          return {
            action: addToWordPositionDataStructIdx,
            value: -1,
          };
        case "throw_node_media":
          return {
            action: resetWordPositionDataStructIdx,
          };
      }
    },
    [addToWordPositionDataStructIdx, resetWordPositionDataStructIdx]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;

      const dispatchedObject = dispatchObject(eventAction);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value as any);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaWordManager;
