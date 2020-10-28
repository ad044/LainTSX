import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useMediaStore } from "../../store";
import game_action_mappings from "../../resources/game_action_mappings.json";
import blue_orb_directions from "../../resources/blue_orb_directions.json";

const MediaComponentManager = (props: StateManagerProps) => {
  const setActiveMediaComponent = useMediaStore(
    (state) => state.setActiveMediaComponent
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
      setActiveMediaComponent(lastActiveLeftSideElement);
      // store last active right side elem
      setLastActiveRightSideElement(from);
    },
    [
      lastActiveLeftSideElement,
      setActiveMediaComponent,
      setLastActiveRightSideElement,
    ]
  );

  const switchToRightSide = useCallback(
    (from: string) => {
      setActiveMediaComponent(lastActiveRightSideElement);
      // store last active left side elem
      setLastActiveLeftSideElement(from);
    },
    [
      lastActiveRightSideElement,
      setActiveMediaComponent,
      setLastActiveLeftSideElement,
    ]
  );

  const dispatchObject = useCallback(
    (event: string, targetMediaComponent: string) => {
      const dispatcherObjects = {
        fstWord_up: {
          action: setActiveMediaComponent,
          value: targetMediaComponent,
        },
        fstWord_down: {
          action: setActiveMediaComponent,
          value: targetMediaComponent,
        },
        sndWord_up: {
          action: setActiveMediaComponent,
          value: targetMediaComponent,
        },
        sndWord_down: {
          action: setActiveMediaComponent,
          value: targetMediaComponent,
        },
        thirdWord_down: {
          action: setActiveMediaComponent,
          value: targetMediaComponent,
        },
        thirdWord_up: {
          action: setActiveMediaComponent,
          value: targetMediaComponent,
        },
        play_down: {
          action: setActiveMediaComponent,
          value: targetMediaComponent,
        },
        exit_up: {
          action: setActiveMediaComponent,
          value: targetMediaComponent,
        },
        switch_to_right_side_from_play: {
          action: switchToRightSide,
          value: "play",
        },
        switch_to_right_side_from_exit: {
          action: switchToRightSide,
          value: "exit",
        },
        switch_to_left_side_from_fstWord: {
          action: switchToLeftSide,
          value: "fstWord",
        },
        switch_to_left_side_from_sndWord: {
          action: switchToLeftSide,
          value: "sndWord",
        },
        switch_to_left_side_from_thirdWord: {
          action: switchToLeftSide,
          value: "thirdWord",
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setActiveMediaComponent, switchToLeftSide, switchToRightSide]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject: any =
        game_action_mappings[
          props.eventState as keyof typeof blue_orb_directions
        ];

      if (eventObject) {
        const eventAction = eventObject.action;
        const targetMediaComponent = eventObject.target_media_component;

        const dispatchedObject = dispatchObject(
          eventAction,
          targetMediaComponent
        );

        if (dispatchedObject) {
          dispatchedObject.action(dispatchedObject.value);
        }
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaComponentManager;
