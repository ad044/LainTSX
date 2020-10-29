import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useMediaWordStore } from "../../store";
import game_action_mappings from "../../resources/game_action_mappings.json";
import blue_orb_directions from "../../resources/blue_orb_directions.json";

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
  select_blue_orb: MediaWordDispatcher;
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
        select_blue_orb: {
          action: resetWordPositionDataStructIdx,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [addToWordPositionDataStructIdx, resetWordPositionDataStructIdx]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject: any =
        game_action_mappings[
          props.eventState as keyof typeof blue_orb_directions
        ];

      if (eventObject) {
        const eventAction = eventObject.action;

        const dispatchedObject = dispatchObject(eventAction);

        if (dispatchedObject) {
          dispatchedObject.action(dispatchedObject.value);
        }
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaWordManager;
