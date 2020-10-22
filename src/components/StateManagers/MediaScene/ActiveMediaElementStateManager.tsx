import React, { useCallback, useEffect } from "react";
import { StateManagerProps } from "../EventStateManager";
import { useMediaStore } from "../../../store";

const ActiveMediaElementStateManager = (props: StateManagerProps) => {
  const setActiveMediaElement = useMediaStore(
    (state) => state.setActiveMediaElement
  );

  const setLastActiveLeftSideElement = useMediaStore(
    (state) => state.setLastActiveLeftSideElement
  );
  const lastActiveLeftSideElement = useMediaStore(
    (state) => state.lastActiveLeftSideElement
  );
  const setLastActiveRightSideElement = useMediaStore(
    (state) => state.setLastActiveRightSideElement
  );
  const lastActiveRightSideElement = useMediaStore(
    (state) => state.lastActiveRightSideElement
  );

  const switchToLeftSide = useCallback(
    (from: string) => {
      setActiveMediaElement(lastActiveLeftSideElement);
      // store last active right side elem
      setLastActiveRightSideElement(from);
    },
    [
      lastActiveLeftSideElement,
      setActiveMediaElement,
      setLastActiveRightSideElement,
    ]
  );

  const switchToRightSide = useCallback(
    (from: string) => {
      setActiveMediaElement(lastActiveRightSideElement);
      // store last active left side elem
      setLastActiveLeftSideElement(from);
    },
    [
      lastActiveRightSideElement,
      setActiveMediaElement,
      setLastActiveLeftSideElement,
    ]
  );

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects = {
        play_down: { action: setActiveMediaElement, value: "exit" },
        exit_up: { action: setActiveMediaElement, value: "play" },
        play_right: {
          action: switchToRightSide,
          value: "play",
        },
        exit_right: {
          action: switchToRightSide,
          value: "exit",
        },
        fstWord_left: {
          action: switchToLeftSide,
          value: "fstWord",
        },
        fstWord_up: {
          action: setActiveMediaElement,
          value: "thirdWord"
        },
        fstWord_down: {
          action: setActiveMediaElement,
          value: "sndWord",
        },
        sndWord_up: {
          action: setActiveMediaElement,
          value: "fstWord",
        },
        sndWord_down: {
          action: setActiveMediaElement,
          value: "thirdWord",
        },
        sndWord_left: {
          action: switchToLeftSide,
          value: "sndWord"
        },
        thirdWord_down: {
          action: setActiveMediaElement,
          value: "fstWord",
        },
        thirdWord_up: {
          action: setActiveMediaElement,
          value: "sndWord",
        },
        thirdWord_left: {
          action: switchToLeftSide,
          value: "thirdWord"
        }
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setActiveMediaElement, switchToLeftSide, switchToRightSide]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default ActiveMediaElementStateManager;
