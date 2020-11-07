import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useMediaWordStore } from "../../store";

type MediaWordDispatcher = {
  action: any;
  value?: number;
};

type MediaWordDispatchData = {
  fstWord_down: MediaWordDispatcher;
  fstWord_up: MediaWordDispatcher;
  sndWord_down: MediaWordDispatcher;
  sndWord_up: MediaWordDispatcher;
  thirdWord_down: MediaWordDispatcher;
  thirdWord_up: MediaWordDispatcher;
  throw_blue_orb_media: MediaWordDispatcher;
};

const MediaWordManager = (props: StateManagerProps) => {
  const addToWordPositionDataStructIdx = useMediaWordStore(
    (state) => state.addToWordPositionDataStructIdx
  );
  const resetWordPositionDataStructIdx = useMediaWordStore(
    (state) => state.resetWordPositionDataStructIdx
  );

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects: MediaWordDispatchData = {
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
        throw_blue_orb_media: {
          action: resetWordPositionDataStructIdx,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [addToWordPositionDataStructIdx, resetWordPositionDataStructIdx]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;

      const dispatchedObject = dispatchObject(eventAction);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaWordManager;
